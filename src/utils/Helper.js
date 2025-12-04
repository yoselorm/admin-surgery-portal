export const exportToCSV = (data, filename = "surgery_records.csv") => {
    if (!data || data.length === 0) {
      console.error("No data provided for CSV export.");
      return;
    }
  
    // Convert nested objects into flat CSV-safe format
    const flattenObject = (obj, parentKey = "", result = {}) => {
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
  
        const newKey = parentKey ? `${parentKey}.${key}` : key;
  
        if (Array.isArray(obj[key])) {
          // Convert arrays to JSON string
          result[newKey] = JSON.stringify(obj[key]);
        } else if (obj[key] !== null && typeof obj[key] === "object") {
          flattenObject(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
      return result;
    };
  
    // Flatten all records first
    const flatData = data.map((item) => flattenObject(item));
  
    // Get all unique keys across all rows
    const headers = Array.from(
      flatData.reduce((set, item) => {
        Object.keys(item).forEach((key) => set.add(key));
        return set;
      }, new Set())
    );
  
    // Create CSV string
    const csvRows = [];
  
    // Header row
    csvRows.push(headers.join(","));
  
    // Data rows
    flatData.forEach((item) => {
      const row = headers.map((header) => {
        let cell = item[header] ?? "";
  
        // Escape quotes
        if (typeof cell === "string") {
          cell = cell.replace(/"/g, '""');
        }
  
        // Wrap in quotes if contains comma
        if (typeof cell === "string" && cell.includes(",")) {
          cell = `"${cell}"`;
        }
  
        return cell;
      });
  
      csvRows.push(row.join(","));
    });
  
    // Create Blob and trigger download
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  