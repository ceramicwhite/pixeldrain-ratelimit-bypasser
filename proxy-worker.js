// =======================================================
// PIXELDRAIN PROXY WORKER
// =======================================================
// Deploy this code to: pd1.<cloudflare_domain>.workers.dev, pd2.<cloudflare_domain>.workers.dev, etc.
// This worker acts as a proxy to PixelDrain's API to help bypass rate limits

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCORS();
  }
  
  // Extract the path after the domain
  const path = url.pathname;
  
  // Only handle /api/file/ requests
  if (!path.startsWith('/api/file/')) {
    return new Response('This is a PixelDrain proxy worker. Use /api/file/{fileId}?download', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // Extract file ID from the path
  const fileId = path.split('/api/file/')[1]?.split('?')[0];
  if (!fileId) {
    return new Response('Invalid file ID', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // Construct the PixelDrain URL
  const pixeldrainUrl = `https://pixeldrain.com/api/file/${fileId}?download`;
  
  try {
    // Fetch from PixelDrain with proper headers to mimic a browser request
    const response = await fetch(pixeldrainUrl, {
      method: request.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://pixeldrain.com/',
        'Origin': 'https://pixeldrain.com',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    // If it's a redirect, follow it or return the redirect
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      if (location) {
        // For direct file downloads, we might want to redirect the client
        return Response.redirect(location, response.status);
      }
    }
    
    // If successful, proxy the response
    if (response.ok) {
      // Clone headers and add CORS
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
      newHeaders.set('Access-Control-Allow-Headers', '*');
      
      // If it's a file download, preserve the original headers
      const contentType = response.headers.get('Content-Type');
      const contentDisposition = response.headers.get('Content-Disposition');
      
      if (contentDisposition) {
        newHeaders.set('Content-Disposition', contentDisposition);
      }
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }
    
    // Handle errors
    return new Response(`PixelDrain Error: ${response.status} ${response.statusText}`, {
      status: response.status,
      headers: { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(`Proxy Error: ${error.message}`, {
      status: 500,
      headers: { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

function handleCORS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    }
  });
}