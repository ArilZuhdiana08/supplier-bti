const fs = require('fs').promises
const path = require('path')

const DATA_FILE = '/tmp/supplier_references.json'

// Default supplier references
const DEFAULT_REFERENCES = {
  'PT. TENMA INDONESIA': '08:00',
  'PT. INOAC POLYTHECNO INDONESIA': '08:30',
  'PT. SIGMA INTI PRESISI': '09:00',
  'PT. ATEJA KAWASHIMA': '09:30',
  'PT. YKK ZIPPER INDONESIA': '10:00',
  'PT. SEIREN INDONESIA': '10:30',
  'PT. SINAR SUMINOE': '11:00',
  'PT. NISSHO INDUSTRI INDONESIA': '13:00',
  'PT. ENDOTA SINAR INDONESIA': '13:30',
  'PT. PRIMARAYA GRAHA NUSANTARA': '14:00',
  'PT. TOYO QUALITY ONE': '14:30',
  'PT. ARMSTRONG INDONESIA': '15:00',
  'PT. MEIWA': '15:30',
  'PT. RAJAWALI MITRA PRATAMA': '08:00',
  'PT. MEIHOKU': '08:30',
  'PT. SERVVO INDONESIA': '09:00',
  'PT. INDAH VARIA EKA SELARAS': '09:30',
  'PT. BONECOM TRICOM (TEGAL)': '10:00'
}

async function readReferences() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    return DEFAULT_REFERENCES
  }
}

async function writeReferences(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    if (event.httpMethod === 'GET') {
      // Get all supplier references
      const references = await readReferences()

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(references)
      }
    }

    if (event.httpMethod === 'POST') {
      // Set supplier reference
      const { supplier_name, reference_time } = JSON.parse(event.body)

      const references = await readReferences()
      references[supplier_name] = reference_time
      await writeReferences(references)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          supplier_name,
          reference_time
        })
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}