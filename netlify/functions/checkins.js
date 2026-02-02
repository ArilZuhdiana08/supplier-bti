const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers }
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) throw error

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      }
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body)

      const { data, error } = await supabase
        .from('checkins')
        .insert([{
          supplier_name: body.supplier_name,
          location: body.location,
          notes: body.notes,
          timestamp: new Date()
        }])
        .select()

      if (error) throw error

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(data[0])
      }
    }

    return {
      statusCode: 405,
      headers,
      body: 'Method Not Allowed'
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}
