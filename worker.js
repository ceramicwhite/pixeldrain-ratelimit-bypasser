addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    // Parse the URL
    const url = new URL(request.url);
    
    // Serve HTML for root path
    if (url.pathname === '/') {
      return new Response(getHtmlPage(), {
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Extract file ID, removing leading slash
    const fileId = url.pathname.slice(1);
  
    // Validate file ID
    if (!fileId) {
      return new Response('Invalid request', { 
        status: 400,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  
    // List of available workers
    const workers = [
      "pd1.sriflix.my",
      "pd2.sriflix.my", 
      "pd3.sriflix.my",
      "pd4.sriflix.my",
      "pd5.sriflix.my",
      "pd6.sriflix.my",
      "pd7.sriflix.my",
      "pd8.sriflix.my",
      "pd9.sriflix.my",
      "pd10.sriflix.my"
    ];
  
    // Pick a random worker
    const randomWorker = workers[Math.floor(Math.random() * workers.length)];
    
    // Construct redirect URL
    const redirectUrl = `https://${randomWorker}/api/file/${fileId}?download`;
  
    // Return a 302 redirect response
    return Response.redirect(redirectUrl, 302);
  }
  
  // HTML Page Generation Function
  function getHtmlPage() {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PixelDrain RateLimit Bypasser</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='32' height='32' viewBox='0 0 32 32'%3E%3Cimage xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABV1JREFUWEfF1H1MlVUcB/Dvc5/n3st9AS5cEMw3riwFEfOttqYBhobTVivT2cjQlTqynEzLSuYLW+os10pSpkWz8iVJUVQSyUjIoeAMxORNUZGLwH3lcu/z3Of1NGr+4zLggna289855/s5v/3OofA/D2ow+ZWV1tlOu3vUtKfNR6Kjo32BnBUQgBBCl5xu33OisG6529OBKVPMDW+tTJ1jNuvbBooICHCx0vXFj9/Xr+7sssHPu6AobsxOG9e0JGPGs6Ghoc6BIAYMsN3ikq+c4n9ztylwOUX0cAI8vAcsHEhdFLVv3sLxKx4ZgBCi6SpDXVc9xjk6AKcT8LAEPTwHn9wDc4xC5i2LfG5EnPpCfxEDqoC7hqzsbkSeCKC9CbB3/APw8n74JB9EikNCkq7ilVWRSY8EYC0kV2k9ElkWaLsOdLX3AmSwvABW8kNQWBgiFUydFT4peZGxrj+IflfAeoSMl2Q06IYDHgfB2Uu3cfluDTjRi2ASjpHURNDQAGoBkWPpnBWfjNo0pIAb+WSl2og8bQRQ3dyJimtFWJ7OIVwv4mSJGqUXzIijUwBaRvAwlK/JHZM8pID6PJKrN2MVHQLsPluGt5e0wBKjAjgO6PEge1ckuLuJCGOGQxcuu9fttYQNKeDPXeSULgLzpSAZnxUdR95OLygVAF4Euu3YfyIC1eVjEa0dB02ICN1oOXT15ic9fSH63QO1n5PftWGYgSDgy5IzyMxoxMQEAyAokJ02bPp6FPx34mFihoMxijBFU5bM7ZbbQwa48in5g9ZhMtEC5681o6G7HOkv9sBsJDhbGYyqGi3imVSAUkAbRIRGIe6dHWMbhwxwcbtylQKVKNOA205wyVqLm/46iAoHgxKOMcx0qIkOMiWBMQhQR3jj1+2c1DAkgOz3z6+arI7LjWKGQSSA1wv4/ACvFsCDBeeiwPMSZFmGTAlQG0VU2QrKaD07t6Bgi/BfiD57YMuG6pdvtrQcTYqeRlu0sRAkgOUAVgBqhIu45WzGdGMKaEkPWZEgUyKYED8qrD8AoA8Wl2x8AwB5GKJPQMbrxyp4vmfm1KhETDJMAc8DbO8UFVwn1WjrbkU8MxkaEgpCFCgqEZLehuqOkyAKBUpNxxQXZ98JGJC+sKBMkn0pTxij8XxEGjgW4HjAJ/Jo0VyB3W/FCC4BOpXp74sSRoSLrkeDowqKQkEfrIo5dmwwgNcKykTZm0KrgJdGL4bkDQLnl+AVObQGXQbHdCKsayL0jAmgCFRBEpq5Uth8nVAUQKcwEYXnPnYEXIHFCw6fFCXffL/f/tHCCZlRslefxbI8fLwPVl0t/EwXTPYEGBkTKAbQmqSmc035a2itei9R6JFBRiXs+PHN7oABi149WOj336sqKl677bt1HQbBH1zX4xIsXs6He7o68IwdJscEBGvDoNETojPhhaxdsb+kzVr/FEXry81RZNSBA5sf+iP22YQL5u9JO3o6s+T+Db5Z65zZZu04z3NEZdPdgMi4EeyIgT7IAG2I8lXO/mfevb927pyNqWdKc34d1Ct4sHRZWUd0rk7K5fV1azUaBjSjoLW1ERqtGsOijEsOHPqw9/31e/RZgX87KSP9UJnb5U0B1fvH8GBZD3R6hoyOCh2Zm/9ee7/TAQQEWLr02zhacC6NNd39QCYy5eJ0pe0+c+7hgvVFAwnvXRsQoHcjse5eprBsvmBzgPcJJaY5O+cONHxwgM59b4J175ftbrCs/HNI8vZ5jxdwe58FfttN3u6mBIneEJKybetjBfSGKbU5xZy7JwWUOtaQtPXeYwdwl7ItPCtMM83a8VMg4YPqgUADH9z3FysKcj+VHozmAAAAAElFTkSuQmCC' x='0' y='0' width='32' height='32'/%3E%3C/svg%3E">
      <!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-HSF7HFM245"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-HSF7HFM245');
      </script>
      
        <!-- Open Link In New Tab -->
        <script>
          window.onload = function () {
            function redirect() {
              window.open("https://www.profitableratecpm.com/gi69qn9h63?key=c0c07a810115598cc4d7921cbb3d6f2e", "_blank"); // Change to your URL
              document.body.removeEventListener("click", redirect); // Ensures it runs only once
            }

            document.body.addEventListener("click", redirect);
          };
        </script>
        <!-- Open Link In New Tab -->

      <style>
          body {
              font-family: 'JetBrains Mono', monospace;
          }
          @media (max-width: 640px) {
              .feature-grid {
                  grid-template-columns: 1fr;
              }
              .input-group {
                  flex-direction: column;
              }
              .input-group input, 
              .input-group button {
                  width: 100%;
                  border-radius: 0.5rem;
                  margin-bottom: 0.5rem;
              }
          }
      </style>
  </head>
  <body class="bg-gradient-to-br from-slate-900 to-indigo-900 text-white min-h-screen flex flex-col font-mono">
      <div class="container mx-auto px-4 py-8 flex-grow">
          <div class="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
              <div class="p-6 bg-indigo-600/50">
                  <h1 class="text-3xl font-bold text-center mb-4 flex items-center justify-center">
                    
                      PixelDrain RateLimit Bypasser
                  </h1>
              </div>
  
              <div class="p-6">
                  <div class="mb-4">
                      <label for="inputUrl" class="block text-sm font-medium text-gray-200 mb-2">
                          Enter PixelDrain URL
                      </label>
                      <div class="flex input-group">
                          <input 
                              type="text" 
                              id="inputUrl" 
                              placeholder="https://pixeldrain.com/u/e75isJ7y"
                              class="flex-grow p-2 border border-gray-700 rounded-l-md bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500"
                          >
                          <button 
                              onclick="convertUrl()"
                              class="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 transition-colors"
                          >
                              Convert
                          </button>
                      </div>
                  </div>
  
                  <div class="mb-4">
                      <label for="outputUrl" class="block text-sm font-medium text-gray-200 mb-2">
                          Bypassed URL
                      </label>
                      <div class="flex input-group">
                          <input 
                              type="text" 
                              id="outputUrl" 
                              readonly
                              placeholder="Bypassed URL will appear here"
                              class="flex-grow p-2 border border-gray-700 rounded-l-md bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500"
                          >
                          <button 
                              onclick="copyUrl()"
                              class="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 transition-colors"
                          >
                              Copy
                          </button>
                      </div>
                      <button 
                          onclick="downloadFile()"
                          class="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-bold"
                          style="font-family: 'JetBrains Mono', monospace;"
                      >
                          Download
                      </button>
                  </div>
              </div>
          </div>
  
          <div class="max-w-2xl mx-auto mt-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6">
              <h2 class="text-2xl font-bold mb-4 text-center">
                  🚀 Why Use PixelDrain RateLimit Bypasser?
              </h2>
              <div class="grid md:grid-cols-2 gap-4 feature-grid">
                  <div class="bg-indigo-600/20 p-4 rounded-lg">
                      <h3 class="font-bold mb-2">🔓 Bypass Speed Limits</h3>
                      <p class="text-sm">Easily bypass PixelDrain's 6GB/day speed restriction</p>
                  </div>
                  <div class="bg-indigo-600/20 p-4 rounded-lg">
                      <h3 class="font-bold mb-2">⚡ Multiple Proxy Servers</h3>
                      <p class="text-sm">Load-balanced across multiple high-speed workers</p>
                  </div>
                  <div class="bg-indigo-600/20 p-4 rounded-lg">
                      <h3 class="font-bold mb-2">⏱️ Time Saver Extraordinaire</h3>
                      <p class="text-sm">Waiting for downloads is for people who enjoy watching paint dry!</p>
                  </div>
                  <div class="bg-indigo-600/20 p-4 rounded-lg">
                      <h3 class="font-bold mb-2">🔗 Simple URLs</h3>
                      <p class="text-sm">Easy-to-remember download links</p>
                  </div>
              </div>
          </div>
  
          <div class="text-center mt-8">
              <a 
                  href="https://www.sriflix.my" 
                  target="_blank" 
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-colors inline-flex items-center"
              >
                  
                  Visit SriFlix - Watch & Download Movies
              </a>
          </div>
      </div>
  
      <footer class="bg-black/30 p-4 text-center sm:text-left">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center max-w-2xl mx-auto">
            <div class="text-sm mb-2 sm:mb-0">Made in Ceylon with ❤️ by sh13y</div>
            <a href="http://paypal.me/shieyz" target="_blank" class="inline-flex items-center gap-2 text-sm">
                <i class="fab fa-paypal"></i>
                Back Pain Relief Fund 🪑🤕
            </a>
        </div>
      </footer>
  
      <script data-cfasync="false">
      function convertUrl() {
          const inputUrl = document.getElementById('inputUrl').value;
          const match = inputUrl.match(/pixeldrain\\.com\\/u\\/(\\w+)/);
          
          if (!match) {
              alert('Invalid PixelDrain URL!');
              return;
          }
          
          const fileId = match[1];
          const proxyUrl = \`https://pixeldrain.sriflix.my/\${fileId}\`;
          
          document.getElementById('outputUrl').value = proxyUrl;
      }
  
      function copyUrl() {
          const outputUrl = document.getElementById('outputUrl');
          outputUrl.select();
          document.execCommand('copy');
          alert('Bypassed URL Copied to Clipboard!');
      }

      function downloadFile() {
          const outputUrl = document.getElementById('outputUrl').value;
          if (!outputUrl) {
              alert('No Bypassed URL to download!');
              return;
          }
          // Create a temporary link and trigger download
          const a = document.createElement('a');
          a.href = outputUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.download = '';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }
      </script>
  </body>
  </html>
    `;
  }
  
  // Optional: Add CORS headers for more flexibility
  function handleCors(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
      'Access-Control-Max-Age': '86400',
    };
    
    // Handle OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }
    
    return null;
  }