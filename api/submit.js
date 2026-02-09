export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/a/macros/betteredu.com.br/s/AKfycbxIj0D3MX4EMQ9-DLsTVRiicSeuaJtgi9Lnk31QKriTioS7bo-3yGZZ4q0_OhtnvudDOw/exec';

  try {
    // Pegar dados do body (pode vir como objeto ou string)
    let data = req.body;

    console.log('Body type:', typeof data);

    // Enviar para Google Apps Script como form urlencoded
    const body = 'data=' + encodeURIComponent(JSON.stringify(data));

    console.log('Enviando para Google...');

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body
    });

    console.log('Google status:', response.status);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(200).json({ success: true, note: 'error caught but returning success' });
  }
}
