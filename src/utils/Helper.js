export const exportToCSV = (data, filename = "surgery_records.csv") => {
  if (!data || data.length === 0) {
    console.error("No data provided for CSV export.");
    return;
  }

  // Keys to strip out of the path entirely when building header names
  const SKIP_SEGMENTS = new Set(["formData"]);

  // Convert nested objects into flat CSV-safe format
  const flattenObject = (obj, pathParts = [], result = {}) => {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const newPathParts = SKIP_SEGMENTS.has(key)
        ? pathParts
        : [...pathParts, key];

      if (Array.isArray(obj[key])) {
        // Convert arrays to JSON string
        result[newPathParts.join(".")] = JSON.stringify(obj[key]);
      } else if (obj[key] !== null && typeof obj[key] === "object") {
        flattenObject(obj[key], newPathParts, result);
      } else {
        result[newPathParts.join(".")] = obj[key];
      }
    }
    return result;
  };

  // Flatten all records first
  const flatData = data.map((item) => flattenObject(item));

  // Get all unique keys across all rows, in first-seen order
  const headers = Array.from(
    flatData.reduce((set, item) => {
      Object.keys(item).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  // Properly escape a single CSV cell
  const escapeCell = (value) => {
    if (value === null || value === undefined) return "";

    let cell = String(value);

    // Replace embedded newlines so a cell can never split a row.
    // Swap for "; " (or "\\n" if you'd rather preserve line breaks visually
    // inside a quoted cell — Excel supports that too, it just makes taller rows).
    cell = cell.replace(/\r\n|\r|\n/g, "; ");

    // Escape quotes
    cell = cell.replace(/"/g, '""');

    // Quote the cell if it contains a comma, quote, or (just in case) newline
    if (/[",\n]/.test(cell) || /,/.test(value)) {
      cell = `"${cell}"`;
    }

    return cell;
  };

  const csvRows = [];
  csvRows.push(headers.map(escapeCell).join(","));

  flatData.forEach((item) => {
    const row = headers.map((header) => escapeCell(item[header] ?? ""));
    csvRows.push(row.join(","));
  });

  // Create Blob and trigger download
  const csvContent = csvRows.join("\r\n"); // CRLF is the CSV-spec-correct line ending
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};