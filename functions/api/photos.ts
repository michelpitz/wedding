export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const country = url.searchParams.get('country');

  if (!country) {
    return new Response('Country is required', { status: 400 });
  }

  // Aceita tanto com VITE_ quanto sem, para facilitar a transição
  const cloudName = env.CLOUDINARY_CLOUD_NAME || env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY || env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET || env.VITE_CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return new Response(JSON.stringify({ error: 'Chaves do Cloudinary ausentes no Cloudflare' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Remove acentos e converte para minúsculo (ex: "Japão" -> "japao", "Suíça" -> "suica")
  const normalizedCountry = country.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;
  const auth = btoa(`${apiKey}:${apiSecret}`);

  try {
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        expression: `folder:"${normalizedCountry}"`, 
        max_results: 30
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: 'Erro na API do Cloudinary', details: err }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    
    if (data.resources) {
      const imageUrls = data.resources.map((res: any) => res.secure_url);
      return new Response(JSON.stringify(imageUrls), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
