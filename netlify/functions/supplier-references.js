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
    return { statusCode: 200, headers, body: '' }
  }

  try {
    // GET
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('supplier_references')
        .select('*')
        .order('supplier_name')

      if (error) throw error

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      }
    }

    // POST
    if (event.httpMethod === 'POST') {
      const { supplier_name, reference_time } = JSON.parse(event.body)

      const { error } = await supabase
        .from('supplier_references')
        .upsert({
          supplier_name,
          reference_time,
          updated_at: new Date()
        })

      if (error) throw error

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ supplier_name, reference_time })
      }
    }

    return { statusCode: 405, headers }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    }
  }
}
