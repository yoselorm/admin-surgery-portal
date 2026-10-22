import jsPDF from 'jspdf';
import logoUrl from '../assets/isplogonormal.svg';

// Brand palette (taken from the ISLP logo) plus status colours used in the app
const C = {
  navy: '#1F2857',
  navySoft: '#5A6391',
  gold: '#B58D49',
  goldSoft: '#F7F1E6',
  ink: '#1E2233',
  body: '#4A5068',
  muted: '#8A8FA3',
  line: '#E3E5EE',
  zebra: '#F6F7FB',
  white: '#FFFFFF',
  complete: '#1E9E6A',
  followUps: '#5A6391',
  draft: '#D9A441',
  up: '#1E9E6A',
  down: '#C2413A',
};

const STATUS = {
  complete: { label: 'Complete', color: C.complete, bg: '#E3F5EC' },
  'follow-ups': { label: 'Follow-up', color: C.followUps, bg: '#E8EAF4' },
  draft: { label: 'Draft', color: '#A87719', bg: '#FBF0D9' },
};

const PERIOD = {
  week: { title: 'This Week', noun: 'this week', previous: 'the same point last week' },
  month: { title: 'This Month', noun: 'this month', previous: 'the same point last month' },
  year: { title: 'This Year', noun: 'this year', previous: 'the same point last year' },
  all: { title: 'All Time', noun: 'to date', previous: null },
};

const LOGO_RATIO = 1058.41 / 1158.95;

// jsPDF can't embed SVG, so rasterise the logo through a canvas first. It only
// ever sits on white, so a JPEG keeps the file small.
const loadLogo = () =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = Math.round(480 * LOGO_RATIO);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(null);
    img.src = logoUrl;
  });

const fmtDate = (value, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(value).toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });

const fmtDateTime = (value) =>
  `${fmtDate(value)}, ${new Date(value).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}`;

const fmtNum = (n) => Number(n || 0).toLocaleString('en-US');

// null when there's nothing to compare against
const pctChange = (current, previous) => {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
};

const plural = (n, word) => `${fmtNum(n)} ${word}${n === 1 ? '' : 's'}`;

const describeRange = (data) => {
  const { range, timeRange } = data;
  if (!range.start) return 'No records yet';
  if (timeRange === 'all') return `${fmtDate(range.start)} – ${fmtDate(range.end)}`;
  const label = (value, withYear) => {
    const weekday = timeRange === 'week' ? `${fmtDate(value, { weekday: 'short' })} ` : '';
    return `${weekday}${fmtDate(value, withYear ? undefined : { day: 'numeric', month: 'short' })}`;
  };
  const sameYear = new Date(range.start).getUTCFullYear() === new Date(range.end).getUTCFullYear();
  return `${label(range.start, !sameYear)} – ${label(range.end, true)}`;
};

const buildHighlights = (data) => {
  const { summary: s, previous: p, contributors, countries, procedures } = data;
  const period = PERIOD[data.timeRange] || PERIOD.all;
  const items = [];

  if (s.totalSurgeries === 0) {
    items.push({ label: 'Activity', text: `No surgeries were logged ${period.noun}.` });
  } else {
    let text = `${plural(s.totalSurgeries, 'surgery record')} logged ${period.noun} by ${plural(s.contributingDoctors, 'doctor')}`;
    if (p) {
      const change = pctChange(s.totalSurgeries, p.totalSurgeries);
      text += change === null
        ? `, up from none at ${period.previous}.`
        : change === 0
          ? `, level with ${period.previous} (${fmtNum(p.totalSurgeries)}).`
          : `, ${change > 0 ? 'up' : 'down'} ${Math.abs(change)}% on ${period.previous} (${fmtNum(p.totalSurgeries)}).`;
    } else {
      text += '.';
    }
    items.push({ label: 'Activity', text });
  }

  if (s.totalSurgeries > 0) {
    const pending = s.draftSurgeries + s.followUpSurgeries;
    items.push({
      label: 'Completion',
      text: `${s.completionRate}% complete (${fmtNum(s.completedSurgeries)} of ${fmtNum(s.totalSurgeries)}). ${pending > 0 ? `${plural(s.draftSurgeries, 'draft')} and ${plural(s.followUpSurgeries, 'follow-up')} still open.` : 'Every record is complete.'}`,
    });
  }

  if (contributors.length > 0) {
    const top = contributors[0];
    const where = countries[0];
    items.push({
      label: 'Top activity',
      text: `${top.doctorId} (${top.specialty}) leads with ${plural(top.total, 'record')}. ${where.country} is the most active country${procedures[0] ? `, and ${procedures[0].name} the most logged procedure` : ''}.`,
    });
  }

  items.push({
    label: 'Doctors',
    text: `${plural(s.newDoctors, 'new sign-up')} ${period.noun === 'to date' ? 'in total' : period.noun}; ${fmtNum(s.activeDoctors)} of ${fmtNum(s.totalDoctors)} registered doctors are active.`,
  });

  if (s.totalSurgeries > 0 && s.draftSurgeries / s.totalSurgeries >= 0.5) {
    items.push({
      label: 'Attention',
      text: 'Half or more of these records are still drafts. It may be worth reminding doctors to complete them.',
      alert: true,
    });
  }

  return items;
};

export const generateAdminReportPDF = async (data, { generatedBy } = {}) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const logo = await loadLogo();
  const period = PERIOD[data.timeRange] || PERIOD.all;
  const { summary: s, previous: p } = data;

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;
  const CW = W - M * 2;
  let y = 0;

  const fill = (hex) => doc.setFillColor(hex);
  const stroke = (hex) => doc.setDrawColor(hex);
  const ink = (hex) => doc.setTextColor(hex);
  const font = (size, style = 'normal') => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  };
  const fit = (text, width) => {
    let t = String(text ?? '');
    if (doc.getTextWidth(t) <= width) return t;
    while (t.length > 1 && doc.getTextWidth(`${t}…`) > width) t = t.slice(0, -1);
    return `${t}…`;
  };

  const runningHeader = () => {
    if (logo) doc.addImage(logo, 'JPEG', M, 9, 9, 9 * LOGO_RATIO, 'logo');
    font(9, 'bold');
    ink(C.navy);
    doc.text('SurgiDesk Activity Report', M + 12, 13.2);
    font(8);
    ink(C.muted);
    doc.text(`${period.title}  ·  ${describeRange(data)}`, M + 12, 17.2);
    stroke(C.line);
    doc.setLineWidth(0.3);
    doc.line(M, 22, W - M, 22);
    y = 30;
  };

  const ensureSpace = (needed) => {
    if (y + needed > H - 20) {
      doc.addPage();
      runningHeader();
      return true;
    }
    return false;
  };

  // keepWith: height of the content that must stay on the same page as the title
  const sectionTitle = (title, subtitle, keepWith = 10) => {
    ensureSpace((subtitle ? 12 : 7) + keepWith);
    fill(C.gold);
    doc.rect(M, y - 3.6, 1.2, 5, 'F');
    font(12.5, 'bold');
    ink(C.navy);
    doc.text(title, M + 4, y);
    if (subtitle) {
      font(8.5);
      ink(C.muted);
      doc.text(subtitle, M + 4, y + 5);
      y += 5;
    }
    y += 6;
  };

  const emptyState = (message, height = 16) => {
    fill(C.zebra);
    stroke(C.line);
    doc.roundedRect(M, y, CW, height, 2, 2, 'FD');
    font(9);
    ink(C.muted);
    doc.text(message, W / 2, y + height / 2 + 1.2, { align: 'center' });
    y += height + 8;
  };

  const progressBar = (x, by, w, value, color) => {
    fill(C.line);
    doc.roundedRect(x, by, w, 2.2, 1.1, 1.1, 'F');
    if (value > 0) {
      fill(color);
      doc.roundedRect(x, by, Math.max(2.2, (w * Math.min(value, 100)) / 100), 2.2, 1.1, 1.1, 'F');
    }
  };

  const statusPill = (status, x, cy) => {
    const st = STATUS[status] || { label: status || '—', color: C.body, bg: C.zebra };
    font(7.5, 'bold');
    const w = doc.getTextWidth(st.label) + 6;
    fill(st.bg);
    doc.roundedRect(x, cy - 2.5, w, 5, 2.5, 2.5, 'F');
    ink(st.color);
    doc.text(st.label, x + 3, cy + 0.95);
  };

  // columns: { header, width (fraction of CW), align, value(row) | draw(row, x, cy, w) }
  const table = (columns, rows) => {
    const rowH = 8;
    const widths = columns.map((c) => c.width * CW);
    const header = () => {
      fill(C.navy);
      doc.roundedRect(M, y, CW, rowH, 1.5, 1.5, 'F');
      doc.rect(M, y + rowH - 2, CW, 2, 'F');
      font(8, 'bold');
      ink(C.white);
      let x = M;
      columns.forEach((c, i) => {
        const tx = c.align === 'right' ? x + widths[i] - 3 : x + 3;
        doc.text(c.header, tx, y + 5.3, { align: c.align === 'right' ? 'right' : 'left' });
        x += widths[i];
      });
      y += rowH;
    };

    header();
    rows.forEach((row, r) => {
      if (ensureSpace(rowH)) header();
      if (r % 2 === 1) {
        fill(C.zebra);
        doc.rect(M, y, CW, rowH, 'F');
      }
      const cy = y + rowH / 2;
      let x = M;
      columns.forEach((c, i) => {
        if (c.draw) {
          c.draw(row, x + 3, cy, widths[i] - 6);
        } else {
          font(8.5, c.bold ? 'bold' : 'normal');
          ink(c.bold ? C.ink : C.body);
          const text = fit(c.value(row), widths[i] - 6);
          const tx = c.align === 'right' ? x + widths[i] - 3 : x + 3;
          doc.text(text, tx, cy + 1.2, { align: c.align === 'right' ? 'right' : 'left' });
        }
        x += widths[i];
      });
      y += rowH;
    });
    stroke(C.line);
    doc.setLineWidth(0.3);
    doc.line(M, y, M + CW, y);
    y += 9;
  };

  // ---------- Cover header ----------
  fill(C.navy);
  doc.rect(0, 0, W, 4, 'F');
  fill(C.gold);
  doc.rect(0, 4, W, 0.9, 'F');

  const logoW = 26;
  if (logo) doc.addImage(logo, 'JPEG', M, 12, logoW, logoW * LOGO_RATIO, 'logo');
  const tx = M + (logo ? logoW + 6 : 0);
  font(8, 'bold');
  ink(C.gold);
  doc.setCharSpace(0.6);
  doc.text('SURGIDESK  ·  ADMIN REPORT', tx, 19);
  doc.setCharSpace(0);
  font(21, 'bold');
  ink(C.navy);
  doc.text('Activity & Usage Report', tx, 28);
  font(9.5);
  ink(C.body);
  doc.text('International Society of Laser Proctology', tx, 34);

  // Period badge, top right
  font(8, 'bold');
  const badge = period.title.toUpperCase();
  doc.setCharSpace(0.5);
  // getTextWidth ignores char spacing, so add it back for each letter
  const badgeW = doc.getTextWidth(badge) + 0.5 * badge.length + 10;
  fill(C.navy);
  doc.roundedRect(W - M - badgeW, 13, badgeW, 7, 3.5, 3.5, 'F');
  ink(C.white);
  doc.text(badge, W - M - badgeW + 5, 17.6);
  doc.setCharSpace(0);
  font(9, 'bold');
  ink(C.ink);
  doc.text(describeRange(data), W - M, 27, { align: 'right' });
  font(8);
  ink(C.muted);
  doc.text(`Generated ${fmtDateTime(data.generatedAt)} UTC`, W - M, 32, { align: 'right' });
  if (generatedBy) doc.text(`By ${generatedBy}`, W - M, 36.5, { align: 'right' });

  y = 12 + logoW * LOGO_RATIO + 7;
  stroke(C.line);
  doc.setLineWidth(0.3);
  doc.line(M, y, W - M, y);
  y += 10;

  // ---------- Executive summary ----------
  const highlights = buildHighlights(data);
  font(9);
  const lines = highlights.map((h) => doc.splitTextToSize(h.text, CW - 44));
  const boxH = lines.reduce((sum, l) => sum + l.length * 4.2 + 2.4, 0) + 6;
  sectionTitle('Executive Summary', null, boxH);
  fill(C.goldSoft);
  doc.roundedRect(M, y, CW, boxH, 2, 2, 'F');
  fill(C.gold);
  doc.rect(M, y, 1.2, boxH, 'F');
  let hy = y + 7;
  highlights.forEach((h, i) => {
    font(8, 'bold');
    ink(h.alert ? C.down : C.gold);
    doc.text(h.label.toUpperCase(), M + 6, hy);
    font(9);
    ink(C.ink);
    doc.text(lines[i], M + 38, hy);
    hy += lines[i].length * 4.2 + 2.4;
  });
  y += boxH + 9;

  // ---------- KPI tiles ----------
  const gap = 4;
  const tileH = 22;
  sectionTitle('Key Metrics', p ? `Changes are compared with ${period.previous}.` : 'Lifetime totals across the platform.', tileH * 2 + gap);
  const tiles = [
    { label: 'Surgeries Logged', value: fmtNum(s.totalSurgeries), accent: C.navy, delta: p && pctChange(s.totalSurgeries, p.totalSurgeries), note: p ? `${fmtNum(p.totalSurgeries)} previously` : 'All records' },
    { label: 'Completed', value: fmtNum(s.completedSurgeries), accent: C.complete, note: `${s.completionRate}% completion rate` },
    { label: 'Drafts', value: fmtNum(s.draftSurgeries), accent: C.draft, note: 'Awaiting completion' },
    { label: 'Follow-ups', value: fmtNum(s.followUpSurgeries), accent: C.followUps, note: 'Pending follow-up' },
    { label: 'Completion Rate', value: `${s.completionRate}%`, accent: C.complete, delta: p && p.totalSurgeries > 0 && s.totalSurgeries > 0 ? Math.round(s.completionRate - p.completionRate) : null, deltaUnit: ' pts', note: p ? `${p.completionRate}% previously` : 'Completed ÷ logged' },
    { label: 'Contributing Doctors', value: fmtNum(s.contributingDoctors), accent: C.gold, note: 'Logged at least one record' },
    { label: 'New Doctors', value: fmtNum(s.newDoctors), accent: C.gold, delta: p && pctChange(s.newDoctors, p.newDoctors), note: p ? `${fmtNum(p.newDoctors)} previously` : 'Registered accounts' },
    { label: 'Active Doctors', value: fmtNum(s.activeDoctors), accent: C.navy, note: `of ${fmtNum(s.totalDoctors)} registered` },
  ];
  const tileW = (CW - gap * 3) / 4;
  tiles.forEach((t, i) => {
    const tx0 = M + (i % 4) * (tileW + gap);
    const ty0 = y + Math.floor(i / 4) * (tileH + gap);
    fill(C.white);
    stroke(C.line);
    doc.setLineWidth(0.3);
    doc.roundedRect(tx0, ty0, tileW, tileH, 2, 2, 'FD');
    fill(t.accent);
    doc.roundedRect(tx0, ty0, tileW, 1.6, 0.8, 0.8, 'F');
    font(7.5, 'bold');
    ink(C.muted);
    doc.text(t.label.toUpperCase(), tx0 + 4, ty0 + 7);
    font(16, 'bold');
    ink(C.ink);
    doc.text(t.value, tx0 + 4, ty0 + 14.5);
    if (t.delta !== undefined && t.delta !== null && t.delta !== false) {
      const up = t.delta > 0;
      const flat = t.delta === 0;
      const color = flat ? C.muted : up ? C.up : C.down;
      const label = `${flat ? '' : up ? '+' : '−'}${Math.abs(t.delta)}${t.deltaUnit || '%'}`;
      font(7.5, 'bold');
      const lw = doc.getTextWidth(label);
      const bx = tx0 + tileW - 4 - lw;
      ink(color);
      doc.text(label, bx, ty0 + 14);
      if (!flat) {
        fill(color);
        const ax = bx - 3;
        if (up) doc.triangle(ax - 1.3, ty0 + 13.9, ax + 1.3, ty0 + 13.9, ax, ty0 + 11.7, 'F');
        else doc.triangle(ax - 1.3, ty0 + 11.7, ax + 1.3, ty0 + 11.7, ax, ty0 + 13.9, 'F');
      }
    }
    font(7.5);
    ink(C.muted);
    doc.text(fit(t.note, tileW - 8), tx0 + 4, ty0 + 19);
  });
  y += tileH * 2 + gap + 9;

  // ---------- Activity chart ----------
  const chartTitles = { week: 'Daily Activity', month: 'Daily Activity', year: 'Monthly Activity', all: 'Activity Over Time' };
  const chartH = 62;
  sectionTitle(chartTitles[data.timeRange] || 'Activity', 'Surgery records created per period, by current status.', chartH);
  fill(C.white);
  stroke(C.line);
  doc.roundedRect(M, y, CW, chartH, 2, 2, 'FD');

  const trend = data.trend || [];
  const legend = [
    { label: 'Complete', color: C.complete },
    { label: 'Follow-up', color: C.followUps },
    { label: 'Draft', color: C.draft },
  ];
  let lx = W - M - 5;
  font(7.5);
  [...legend].reverse().forEach((l) => {
    const lw = doc.getTextWidth(l.label);
    ink(C.body);
    doc.text(l.label, lx - lw, y + 7);
    fill(l.color);
    doc.roundedRect(lx - lw - 4.2, y + 4.6, 2.8, 2.8, 0.6, 0.6, 'F');
    lx -= lw + 9;
  });

  const maxTotal = Math.max(0, ...trend.map((t) => t.total));
  const step = maxTotal <= 4 ? 1 : Math.ceil(maxTotal / 4 / (maxTotal > 20 ? 5 : 1)) * (maxTotal > 20 ? 5 : 1);
  const yMax = Math.max(step * 4, 4);
  const plot = { x: M + 13, y: y + 13, w: CW - 19, h: chartH - 25 };

  font(7);
  for (let i = 0; i <= 4; i++) {
    const gy = plot.y + plot.h - (plot.h * i) / 4;
    stroke(i === 0 ? '#C9CCDA' : C.line);
    doc.setLineWidth(i === 0 ? 0.35 : 0.2);
    if (i > 0) doc.setLineDashPattern([0.8, 0.8], 0);
    doc.line(plot.x, gy, plot.x + plot.w, gy);
    doc.setLineDashPattern([], 0);
    ink(C.muted);
    doc.text(String((yMax / 4) * i), plot.x - 2.5, gy + 1, { align: 'right' });
  }

  if (trend.length > 0) {
    const slot = plot.w / trend.length;
    const barW = Math.min(slot * 0.62, 14);
    const labelEvery = trend.length > 16 ? Math.ceil(trend.length / 11) : 1;
    trend.forEach((t, i) => {
      const bx = plot.x + slot * i + (slot - barW) / 2;
      let top = plot.y + plot.h;
      [
        [t.complete, C.complete],
        [t.followUps, C.followUps],
        [t.draft, C.draft],
      ].forEach(([v, color]) => {
        if (!v) return;
        const h = (plot.h * v) / yMax;
        fill(color);
        doc.rect(bx, top - h, barW, h, 'F');
        top -= h;
      });
      if (t.total > 0 && trend.length <= 16) {
        font(7, 'bold');
        ink(C.ink);
        doc.text(String(t.total), bx + barW / 2, top - 1.5, { align: 'center' });
      }
      if (i % labelEvery === 0 || i === trend.length - 1) {
        font(6.8);
        ink(C.muted);
        doc.text(t.label, bx + barW / 2, plot.y + plot.h + 5, { align: 'center' });
      }
    });
  }
  if (maxTotal === 0) {
    font(9);
    ink(C.muted);
    doc.text(`No surgeries recorded ${period.noun}`, plot.x + plot.w / 2, plot.y + plot.h / 2, { align: 'center' });
  }
  y += chartH + 10;

  // ---------- Status breakdown ----------
  sectionTitle('Status Breakdown', null, 22);
  const segments = [
    { label: 'Complete', value: s.completedSurgeries, color: C.complete },
    { label: 'Follow-up', value: s.followUpSurgeries, color: C.followUps },
    { label: 'Draft', value: s.draftSurgeries, color: C.draft },
  ];
  if (s.totalSurgeries > 0) {
    let sx = M;
    segments.forEach((seg) => {
      if (!seg.value) return;
      const sw = (CW * seg.value) / s.totalSurgeries;
      fill(seg.color);
      doc.rect(sx, y, sw, 6, 'F');
      sx += sw;
    });
  } else {
    fill(C.line);
    doc.rect(M, y, CW, 6, 'F');
  }
  y += 12;
  const segW = CW / 3;
  segments.forEach((seg, i) => {
    const sx = M + segW * i;
    fill(seg.color);
    doc.roundedRect(sx, y - 3, 3, 3, 0.6, 0.6, 'F');
    font(9, 'bold');
    ink(C.ink);
    doc.text(`${seg.label}  ${fmtNum(seg.value)}`, sx + 5, y - 0.4);
    font(8);
    ink(C.muted);
    const share = s.totalSurgeries ? ((seg.value / s.totalSurgeries) * 100).toFixed(1) : '0.0';
    doc.text(`${share}% of records`, sx + 5, y + 4);
  });
  y += 14;

  // ---------- Top procedures ----------
  sectionTitle('Top Procedures', 'Most frequently logged procedures in this period.', 24);
  if (data.procedures.length === 0) {
    emptyState('No procedures logged in this period');
  } else {
    const maxProc = data.procedures[0].total;
    table(
      [
        { header: 'Procedure', width: 0.42, bold: true, value: (r) => r.name },
        {
          header: 'Share of records',
          width: 0.28,
          draw: (r, x, cy, w) => {
            progressBar(x, cy - 1.1, w - 12, (r.total / maxProc) * 100, C.navy);
            font(7.5);
            ink(C.muted);
            doc.text(`${Math.round((r.total / s.totalSurgeries) * 100)}%`, x + w, cy + 1, { align: 'right' });
          },
        },
        { header: 'Records', width: 0.1, align: 'right', value: (r) => fmtNum(r.total) },
        { header: 'Completed', width: 0.1, align: 'right', value: (r) => fmtNum(r.completed) },
        { header: 'Rate', width: 0.1, align: 'right', value: (r) => `${r.completionRate}%` },
      ],
      data.procedures
    );
  }

  // ---------- Contributors ----------
  sectionTitle('Top Contributors', 'Doctors ranked by number of surgery records logged in this period.', 24);
  if (data.contributors.length === 0) {
    emptyState('No doctors logged surgeries in this period');
  } else {
    table(
      [
        { header: '#', width: 0.06, value: (r) => String(data.contributors.indexOf(r) + 1) },
        { header: 'Doctor ID', width: 0.15, bold: true, value: (r) => r.doctorId },
        { header: 'Specialty', width: 0.3, value: (r) => r.specialty },
        { header: 'Country', width: 0.15, value: (r) => r.country },
        { header: 'Records', width: 0.1, align: 'right', value: (r) => fmtNum(r.total) },
        {
          header: 'Completion',
          width: 0.24,
          draw: (r, x, cy, w) => {
            progressBar(x, cy - 1.1, w - 14, r.completionRate, C.complete);
            font(8, 'bold');
            ink(C.ink);
            doc.text(`${r.completionRate}%`, x + w, cy + 1.1, { align: 'right' });
          },
        },
      ],
      data.contributors
    );
  }

  // ---------- Countries ----------
  sectionTitle('Surgeries by Country', "Based on each contributing doctor's registered country.", 24);
  if (data.countries.length === 0) {
    emptyState('No country data for this period');
  } else {
    const maxCountry = data.countries[0].total;
    table(
      [
        { header: 'Country', width: 0.24, bold: true, value: (r) => r.country },
        {
          header: 'Volume',
          width: 0.36,
          draw: (r, x, cy, w) => progressBar(x, cy - 1.1, w, (r.total / maxCountry) * 100, C.gold),
        },
        { header: 'Records', width: 0.13, align: 'right', value: (r) => fmtNum(r.total) },
        { header: 'Completed', width: 0.13, align: 'right', value: (r) => fmtNum(r.completed) },
        { header: 'Rate', width: 0.14, align: 'right', value: (r) => `${r.completionRate}%` },
      ],
      data.countries
    );
  }

  // ---------- Recent records ----------
  sectionTitle(
    'Most Recent Records',
    data.recentSurgeries.length ? `Latest ${data.recentSurgeries.length} surgery records created in this period.` : 'Latest surgery records created in this period.',
    24
  );
  if (data.recentSurgeries.length === 0) {
    emptyState('No surgery records were created in this period');
  } else {
    table(
      [
        { header: 'Record ID', width: 0.24, bold: true, value: (r) => r.surgeryId || '—' },
        { header: 'Doctor', width: 0.14, value: (r) => r.doctorId },
        { header: 'Procedure', width: 0.28, value: (r) => r.procedure },
        { header: 'Status', width: 0.13, draw: (r, x, cy) => statusPill(r.status, x, cy) },
        { header: 'Logged (UTC)', width: 0.21, value: (r) => fmtDateTime(r.createdAt) },
      ],
      data.recentSurgeries
    );
  }

  // ---------- Notes ----------
  ensureSpace(20);
  font(7.5);
  ink(C.muted);
  const notes = doc.splitTextToSize(
    `Notes: Figures cover surgery records created ${data.timeRange === 'all' ? 'since the first record' : `from the start of ${period.noun} to the time of generation`}. ` +
      'Week periods start on Monday. All dates and times are in UTC. Doctor counts (registered and active) reflect the platform as of generation time.',
    CW
  );
  doc.text(notes, M, y);

  // ---------- Footer on every page ----------
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    stroke(C.line);
    doc.setLineWidth(0.3);
    doc.line(M, H - 13, W - M, H - 13);
    font(7.5);
    ink(C.muted);
    doc.text('SurgiDesk  ·  Confidential, for internal use only', M, H - 8);
    doc.text(`Page ${i} of ${pages}`, W - M, H - 8, { align: 'right' });
  }

  const stamp = new Date(data.generatedAt).toISOString().slice(0, 10);
  doc.save(`SurgiDesk-Report-${period.title.replace(/\s+/g, '-')}-${stamp}.pdf`);
};
