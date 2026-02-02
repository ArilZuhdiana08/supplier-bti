// Load jsPDF and autoTable plugin
importScripts('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
importScripts('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.plugin.autotable.min.js');

self.onmessage = function(e) {
  const { data } = e.data;

  try {
    const doc = new jsPDF();

    const tableData = data.map(d => [
      new Date(d.timestamp).toLocaleString(),
      d.supplier_name,
      d.vehicle_no || '-',
      d.status || 'Tepat waktu',
      d.location?.lat && d.location?.lng
        ? `${d.location.lat},${d.location.lng}`
        : 'PT. Bonecom Tricom Plant KIMU'
    ]);

    doc.autoTable({
      head: [['Waktu', 'Supplier', 'Kendaraan', 'Status', 'Lokasi']],
      body: tableData,
    });

    // Generate PDF as blob
    const pdfBlob = doc.output('blob');

    self.postMessage({ success: true, blob: pdfBlob });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
