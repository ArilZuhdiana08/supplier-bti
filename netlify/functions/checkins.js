const fs = require('fs').promises
const path = require('path')

const DATA_FILE = '/tmp/checkins.json'

async function readCheckins() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    return []
  }
}

async function writeCheckins(data) {
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
      // Get all check-ins
      const checkins = await readCheckins()

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(checkins.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
      }
    }

    if (event.httpMethod === 'POST') {
      // Add new check-in
      const checkinData = JSON.parse(event.body)
      checkinData.id = Date.now().toString()

      const checkins = await readCheckins()
      checkins.push(checkinData)
      await writeCheckins(checkins)

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(checkinData)
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