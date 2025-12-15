import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to PDF format
 * @param {Object} options - Export options
 * @param {Array} options.data - Data to export
 * @param {Array} options.columns - Column configuration
 * @param {string} options.title - PDF title
 * @param {string} options.filename - Output filename
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 */
export const exportToPDF = ({
  data,
  columns,
  title,
  filename,
  onSuccess,
  onError
}) => {
  try {
    // Validate inputs
    if (!data || !Array.isArray(data) || data.length === 0) {
      const error = 'No data to export';
      if (onError) onError(error);
      return { success: false, error };
    }

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      const error = 'No columns specified for export';
      if (onError) onError(error);
      return { success: false, error };
    }

    // Check if jsPDF is available
    if (typeof jsPDF === 'undefined') {
      const error = 'PDF library not available';
      if (onError) onError(error);
      return { success: false, error };
    }

    // Create PDF document
    let pdf;
    try {
      pdf = new jsPDF();
    } catch (pdfError) {
      const error = 'Failed to create PDF document';
      if (onError) onError(error);
      return { success: false, error };
    }

    // Add title and date
    pdf.setFontSize(18);
    pdf.text(title || 'Report', 14, 22);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    // Prepare table data
    const tableColumns = columns.map(col => col.header || col.key);
    const tableRows = data.map((item, index) => {
      return columns.map(col => {
        if (col.render) {
          return col.render(item[col.key], item, index);
        }
        // Handle currency values properly
        let value = item[col.key] || '';
        
        // Ensure proper string conversion
        if (typeof value !== 'string') {
          value = String(value);
        }
        
        return value;
      });
    });

    // Check if autoTable is available
    if (typeof pdf.autoTable !== 'function') {
      const error = 'PDF table library not available';
      if (onError) onError(error);
      return { success: false, error };
    }

          // Add table
      try {
        pdf.autoTable({
          head: [tableColumns],
          body: tableRows,
          startY: 40,
          styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak',
            halign: 'left',
            valign: 'middle',
            cellWidth: 'wrap'
          },
          headStyles: {
            fillColor: [66, 139, 202],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9,
            halign: 'center'
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250]
          },
          columnStyles: {
            // Auto-adjust column widths with better handling for currency columns
            0: { cellWidth: 'auto', halign: 'center' }, // Sr No
            1: { cellWidth: 'auto' }, // Asset Number
            2: { cellWidth: 'auto' }, // Model
            3: { cellWidth: 'auto' }, // Type
            4: { cellWidth: 'auto' }, // Manufacturer
            5: { cellWidth: 'auto' }, // Serial No
            6: { cellWidth: 'auto', halign: 'right' }, // Cost - right align for currency
            7: { cellWidth: 'auto' }, // Assigned To
            8: { cellWidth: 'auto', halign: 'center' }, // Status
            9: { cellWidth: 'auto', halign: 'center' }  // Purchase Date
          },
          margin: { left: 10, right: 10 },
          tableWidth: 'wrap'
        });
      } catch (tableError) {
        const error = 'Failed to add table to PDF';
        if (onError) onError(error);
        return { success: false, error };
      }

          // Save PDF
      try {
        const outputFilename = filename || `report_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(outputFilename);
        
        if (onSuccess) onSuccess(outputFilename);
        return { success: true, filename: outputFilename };
      } catch (saveError) {
        const error = 'Failed to save PDF file';
        if (onError) onError(error);
        return { success: false, error };
      }
  } catch (error) {
    if (onError) onError(error.message || 'Unknown error occurred');
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};

/**
 * Export manufacturers data to PDF
 * @param {Array} manufacturers - Manufacturers data
 * @param {Array} selectedColumns - Selected columns for export
 * @param {Object} pagination - Pagination info
 * @param {Function} formatDate - Date formatting function
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const exportManufacturersToPDF = ({
  manufacturers,
  selectedColumns,
  pagination,
  formatDate,
  onSuccess,
  onError
}) => {
  const columns = selectedColumns
    .filter(col => col !== 'actions')
    .map(col => {
      const columnMap = {
        srno: { key: 'srno', header: 'Sr No' },
        name: { key: 'name', header: 'Name' },
        description: { key: 'description', header: 'Description' },
        addeddate: { key: 'addeddate', header: 'Added Date' }
      };
      
      if (col === 'srno') {
        return {
          ...columnMap[col],
          render: (value, item, index) => ((pagination.currentPage - 1) * pagination.pageSize) + index + 1
        };
      }
      
      if (col === 'name') {
        return {
          ...columnMap[col],
          render: (value, item) => item.manufacturername || ''
        };
      }
      
      if (col === 'description') {
        return {
          ...columnMap[col],
          render: (value, item) => item.description || 'No description'
        };
      }
      
      if (col === 'addeddate') {
        return {
          ...columnMap[col],
          render: (value, item) => item.addeddate ? formatDate(item.addeddate) : 'N/A'
        };
      }
      
      return columnMap[col] || { key: col, header: col };
    });

  return exportToPDF({
    data: manufacturers,
    columns,
    title: 'Asset Manufacturers Report',
    filename: `manufacturers_report_${new Date().toISOString().split('T')[0]}.pdf`,
    onSuccess,
    onError
  });
};

/**
 * Export asset types data to PDF
 * @param {Array} assetTypes - Asset types data
 * @param {Array} selectedColumns - Selected columns for export
 * @param {Object} pagination - Pagination info
 * @param {Function} formatDate - Date formatting function
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const exportAssetTypesToPDF = ({
  assetTypes,
  selectedColumns,
  pagination,
  formatDate,
  onSuccess,
  onError
}) => {
  const columns = selectedColumns
    .filter(col => col !== 'actions')
    .map(col => {
      const columnMap = {
        srno: { key: 'srno', header: 'Sr No' },
        assettypename: { key: 'assettypename', header: 'Asset Type Name' },
        description: { key: 'description', header: 'Description' },
        assettypeprefix: { key: 'assettypeprefix', header: 'Prefix' },
        assetdepreciationrate: { key: 'assetdepreciationrate', header: 'Depreciation Rate' },
        status: { key: 'status', header: 'Status' },
        addeddate: { key: 'addeddate', header: 'Added Date' }
      };
      
      if (col === 'srno') {
        return {
          ...columnMap[col],
          render: (value, item, index) => ((pagination.currentPage - 1) * pagination.pageSize) + index + 1
        };
      }
      
      if (col === 'assettypename') {
        return {
          ...columnMap[col],
          render: (value, item) => item.assettypename || ''
        };
      }
      
      if (col === 'description') {
        return {
          ...columnMap[col],
          render: (value, item) => item.description || 'No description'
        };
      }
      
      if (col === 'assettypeprefix') {
        return {
          ...columnMap[col],
          render: (value, item) => item.assettypeprefix || 'N/A'
        };
      }
      
      if (col === 'assetdepreciationrate') {
        return {
          ...columnMap[col],
          render: (value, item) => item.assetdepreciationrate ? `${item.assetdepreciationrate}%` : 'N/A'
        };
      }
      
      if (col === 'status') {
        return {
          ...columnMap[col],
          render: (value, item) => item.isactive === 1 ? 'Active' : 'Inactive'
        };
      }
      
      if (col === 'addeddate') {
        return {
          ...columnMap[col],
          render: (value, item) => item.addeddate ? formatDate(item.addeddate) : 'N/A'
        };
      }
      
      return columnMap[col] || { key: col, header: col };
    });

  return exportToPDF({
    data: assetTypes,
    columns,
    title: 'Asset Types Report',
    filename: `asset_types_report_${new Date().toISOString().split('T')[0]}.pdf`,
    onSuccess,
    onError
  });
};

/**
 * Export business units data to PDF
 * @param {Array} businessUnits - Business units data
 * @param {Array} selectedColumns - Selected columns for export
 * @param {Object} pagination - Pagination info
 * @param {Function} formatDate - Date formatting function
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const exportBusinessUnitsToPDF = ({
  businessUnits,
  selectedColumns,
  pagination,
  formatDate,
  onSuccess,
  onError
}) => {
  const columns = selectedColumns
    .filter(col => col !== 'actions')
    .map(col => {
      const columnMap = {
        buname: { key: 'buname', header: 'BU Name' },
        bucode: { key: 'bucode', header: 'BU Code' },
        description: { key: 'description', header: 'Description' },
        deliveryhead: { key: 'deliveryhead', header: 'Delivery Head' },
        saleshead: { key: 'saleshead', header: 'Sales Head' },
        services: { key: 'services', header: 'Services/Products' },
        activestatus: { key: 'activestatus', header: 'Active Status' },
        region: { key: 'region', header: 'BU Region' },
        statusreason: { key: 'statusreason', header: 'Status Reason' },
        addeddate: { key: 'addeddate', header: 'Added Date' }
      };
      
      if (col === 'buname') {
        return {
          ...columnMap[col],
          render: (value, item) => item.buname || ''
        };
      }
      
      if (col === 'bucode') {
        return {
          ...columnMap[col],
          render: (value, item) => item.bucode || 'N/A'
        };
      }
      
      if (col === 'description') {
        return {
          ...columnMap[col],
          render: (value, item) => item.description || 'No description'
        };
      }
      
      if (col === 'deliveryhead') {
        return {
          ...columnMap[col],
          render: (value, item) => item.deliveryheadname || 'N/A'
        };
      }
      
      if (col === 'saleshead') {
        return {
          ...columnMap[col],
          render: (value, item) => item.salesheadname || 'N/A'
        };
      }
      
      if (col === 'services') {
        return {
          ...columnMap[col],
          render: (value, item) => item.services || 'N/A'
        };
      }
      
      if (col === 'activestatus') {
        return {
          ...columnMap[col],
          render: (value, item) => item.isactive === 1 ? 'Active' : 'Inactive'
        };
      }
      
      if (col === 'region') {
        return {
          ...columnMap[col],
          render: (value, item) => item.regionname || 'N/A'
        };
      }
      
      if (col === 'statusreason') {
        return {
          ...columnMap[col],
          render: (value, item) => item.statusreason || 'N/A'
        };
      }
      
      if (col === 'addeddate') {
        return {
          ...columnMap[col],
          render: (value, item) => item.addeddate ? formatDate(item.addeddate) : 'N/A'
        };
      }
      
      return columnMap[col] || { key: col, header: col };
    });

  return exportToPDF({
    data: businessUnits,
    columns,
    title: 'Business Units Report',
    filename: `business_units_report_${new Date().toISOString().split('T')[0]}.pdf`,
    onSuccess,
    onError
  });
};
