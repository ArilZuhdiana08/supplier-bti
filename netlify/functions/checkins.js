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

      // Get supplier reference time
      const { data: refData, error: refError } = await supabase
        .from('supplier_references')
        .select('reference_time')
        .eq('supplier_name', body.supplier_name)
        .single()

      let status = 'Tepat waktu' // default status

      if (!refError && refData?.reference_time) {
        const referenceTime = refData.reference_time
        const arrivalTime = new Date()
        const [refHours, refMinutes] = referenceTime.split(':').map(Number)
        const refDateTime = new Date()
        refDateTime.setHours(refHours, refMinutes, 0, 0)

        const timeDiff = (arrivalTime - refDateTime) / (1000 * 60) // difference in minutes

        if (timeDiff < 0) {
          status = 'Advance' // arrived before reference time
        } else if (timeDiff <= 10) {
          status = 'Tepat waktu' // within 10 minutes tolerance
        } else {
          status = 'Delay' // more than 10 minutes late
        }
      }

      const { data, error } = await supabase
        .from('checkins')
        .insert([{
          supplier_name: body.supplier_name,
          vehicle_no: body.vehicle_no,
          location: body.location,
          status: status,
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

    if (event.httpMethod === 'DELETE') {
      const body = JSON.parse(event.body)
      const { id } = body

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID is required for deletion' })
        }
      }

      const { error } = await supabase
        .from('checkins')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Record deleted successfully' })
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
