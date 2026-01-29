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
    // ===== GET =====
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('supplier_references')
        .select('supplier_name, reference_time')

      if (error) throw error

      // 🔥 UBAH ARRAY → OBJECT
      const result = {}
      data.forEach(row => {
        result[row.supplier_name] = row.reference_time
      })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      }
    }

    // ===== POST =====
    if (event.httpMethod === 'POST') {
      const { supplier_name, reference_time } = JSON.parse(event.body)

      const { error } = await supabase
        .from('supplier_references')
        .upsert(
          { supplier_name, reference_time },
          { onConflict: 'supplier_name' } // 🔥 WAJIB
        )

      if (error) throw error

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
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
