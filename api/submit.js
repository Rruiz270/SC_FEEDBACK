export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/a/macros/betteredu.com.br/s/AKfycbxIj0D3MX4EMQ9-DLsTVRiicSeuaJtgi9Lnk31QKriTioS7bo-3yGZZ4q0_OhtnvudDOw/exec';

  try {
    let data = req.body;

    // Se veio como string, parsear
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // Tentar como urlencoded
        const params = new URLSearchParams(data);
        if (params.has('data')) {
          data = JSON.parse(params.get('data'));
        }
      }
    }

    // Se tem campo 'data', extrair
    if (data && data.data) {
      if (typeof data.data === 'string') {
        data = JSON.parse(data.data);
      } else {
        data = data.data;
      }
    }

    console.log('Recebido:', data?.nome, data?.email);

    // Enviar para Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'data=' + encodeURIComponent(JSON.stringify(data)),
      redirect: 'follow'
    });

    // Google Apps Script retorna redirect, então pegamos o texto final
    const text = await response.text();

    console.log('Google respondeu:', text.substring(0, 100));

    return res.status(200).json({ success: true, response: text });

  } catch (error) {
    console.error('Erro no proxy:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
