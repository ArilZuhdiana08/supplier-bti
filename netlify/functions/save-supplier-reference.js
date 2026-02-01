const { createClient } = require('@supabase/supabase-client');

// Inisialisasi Supabase menggunakan Environment Variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { supplier_name, reference_time } = JSON.parse(event.body);

    if (!supplier_name || !reference_time) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Data tidak lengkap' }) 
      };
    }

    // Gunakan UPSERT: Update jika nama supplier sudah ada, Insert jika belum ada
    const { data, error } = await supabase
      .from('supplier_references')
      .upsert(
        { supplier_name, reference_time, updated_at: new Date() },
        { onConflict: 'supplier_name' } // Pastikan kolom ini punya constraint UNIQUE di Supabase
      );

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Data berhasil disimpan', data })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};