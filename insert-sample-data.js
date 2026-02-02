// Script to insert sample arrival data into the checkins system
// Run this in the browser console on the admin-monitor.html page

const sampleData = [
  {
    supplier_name: 'PT. INOAC POLYTHECNO INDONESIA',
    notes: 'B 9318 TXR',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T08:23:20.000Z' // 08.23.20
  },
  {
    supplier_name: 'PT. SINAR SUMINOE',
    notes: '-',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T08:25:30.000Z' // 08.25.30
  },
  {
    supplier_name: 'PT. SIGMA INTI PRESISI',
    notes: '-',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T09:26:10.000Z' // 09.26.10
  },
  {
    supplier_name: 'PT. ATEJA KAWASHIMA',
    notes: '-',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T09:57:49.000Z' // 09.57.49
  },
  {
    supplier_name: 'PT. SEIREN INDONESIA',
    notes: '-',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T10:47:23.000Z' // 10.47.23
  },
  {
    supplier_name: 'PT. PRIMARAYA GRAHA NUSANTARA',
    notes: '-',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T10:51:40.000Z' // 10.51.40
  },
  {
    supplier_name: 'PT. NISSHO INDUSTRY INDONESIA',
    notes: '-',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T11:05:40.000Z' // 11.05.40
  },
  {
    supplier_name: 'PT. RAJAWALI MITRA PRATAMA',
    notes: '-',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T12:02:23.000Z' // 12.02.23
  },
  {
    supplier_name: 'PT. ARMSTRONG',
    notes: '-',
    location: 'PT. Bonecom Tricom Plant KIMU',
    timestamp: '2026-02-02T13:59:30.000Z' // 13.59.30
  }
];

async function insertSampleData() {
  for (const data of sampleData) {
    try {
      const response = await fetch('/.netlify/functions/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log(`Inserted data for ${data.supplier_name}`);
      } else {
        console.error(`Failed to insert data for ${data.supplier_name}:`, await response.text());
      }
    } catch (error) {
      console.error(`Error inserting data for ${data.supplier_name}:`, error);
    }
  }

  console.log('Sample data insertion completed. Refresh the page to see the data.');
}

// Run the function
insertSampleData();
