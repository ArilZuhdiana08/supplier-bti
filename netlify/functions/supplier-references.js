const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

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
      const { data, error } = await supabase
        .from('supplier_references')
        .select('*')

      if (error) throw error

      // Convert to object format for frontend compatibility
      const references = {}
      data.forEach(ref => {
        references[ref.supplier_name] = ref.reference_time
      })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(references)
      }
    }

    if (event.httpMethod === 'POST') {
      // Set supplier reference
      const { supplier_name, reference_time } = JSON.parse(event.body)

      // Upsert the reference
      const { data, error } = await supabase
        .from('supplier_references')
        .upsert(
          { supplier_name, reference_time },
          { onConflict: 'supplier_name' }
        )
        .select()

      if (error) throw error

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data[0])
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