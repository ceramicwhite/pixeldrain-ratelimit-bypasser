const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the cloudflare domain from environment variable
const CLOUDFLARE_DOMAIN = process.env.CLOUDFLARE_DOMAIN || 'your-domain.workers.dev';

// Serve static files
app.use(express.static('public'));

// Main route that serves the HTML with dynamic domain configuration
app.get('/', (req, res) => {
  const html = getHtmlPage(CLOUDFLARE_DOMAIN);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(html);
});

// File download redirect route
app.get('/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  
  if (!fileId) {
    return res.status(400).send('Invalid request');
  }

  // Array of proxy servers with dynamic domain
  const PROXY_SERVERS = [
    `pd1.${CLOUDFLARE_DOMAIN}`,
    `pd2.${CLOUDFLARE_DOMAIN}`,
    `pd3.${CLOUDFLARE_DOMAIN}`,
    `pd4.${CLOUDFLARE_DOMAIN}`,
    `pd5.${CLOUDFLARE_DOMAIN}`,
    `pd6.${CLOUDFLARE_DOMAIN}`,
    `pd7.${CLOUDFLARE_DOMAIN}`,
    `pd8.${CLOUDFLARE_DOMAIN}`,
    `pd9.${CLOUDFLARE_DOMAIN}`,
    `pd10.${CLOUDFLARE_DOMAIN}`
  ];

  // Pick a random proxy server for load balancing
  const randomServer = PROXY_SERVERS[Math.floor(Math.random() * PROXY_SERVERS.length)];
  
  // Construct redirect URL
  const redirectUrl = `https://${randomServer}/api/file/${fileId}?download`;

  // Return a 302 redirect response
  res.redirect(302, redirectUrl);
});

// CORS handler
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.send();
});

function getHtmlPage(cloudfareDomain) {
  const workerDomain = `pixel.${cloudfareDomain}`;
  
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
                <div class="text-center text-sm text-indigo-200">
                    Self-hosted on: ${req.get('host') || 'localhost'}
                </div>
            </div>

            <div class="p-6">
                <div class="mb-4">
                    <label for="inputUrls" class="block text-sm font-medium text-gray-200 mb-2">
                        Enter PixelDrain URLs (one per line)
                    </label>
                    <textarea
                        id="inputUrls"
                        placeholder="https://pixeldrain.com/u/e75isJ7y&#10;https://pixeldrain.com/u/abc123def&#10;https://pixeldrain.com/u/xyz789ghi"
                        class="w-full p-3 border border-gray-700 rounded-md bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        rows="5"
                    ></textarea>
                    <button 
                        onclick="convertUrls()"
                        class="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-bold"
                    >
                        Convert All URLs
                    </button>
                </div>

                <div class="mb-4" id="resultsContainer" style="display: none;">
                    <label class="block text-sm font-medium text-gray-200 mb-2">
                        Bypassed URLs
                    </label>
                    <div id="urlResults" class="space-y-2">
                        <!-- Results will be populated here -->
                    </div>
                    <button 
                        onclick="copyAllUrls()"
                        class="mt-3 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-bold"
                    >
                        Copy All URLs
                    </button>
                </div>
            </div>
        </div>

        <div class="max-w-2xl mx-auto mt-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6">
            <h2 class="text-2xl font-bold mb-4 text-center">
                🚀 Self-Hosted PixelDrain Bypasser
            </h2>
            <div class="grid md:grid-cols-2 gap-4 feature-grid">
                <div class="bg-indigo-600/20 p-4 rounded-lg">
                    <h3 class="font-bold mb-2">🏠 Self-Hosted</h3>
                    <p class="text-sm">Running on your own server with your Cloudflare workers</p>
                </div>
                <div class="bg-indigo-600/20 p-4 rounded-lg">
                    <h3 class="font-bold mb-2">⚡ Multiple Proxy Servers</h3>
                    <p class="text-sm">Load-balanced across your Cloudflare proxy workers</p>
                </div>
                <div class="bg-indigo-600/20 p-4 rounded-lg">
                    <h3 class="font-bold mb-2">🔒 Full Control</h3>
                    <p class="text-sm">Your domain, your rules, complete privacy</p>
                </div>
                <div class="bg-indigo-600/20 p-4 rounded-lg">
                    <h3 class="font-bold mb-2">🔗 Custom URLs</h3>
                    <p class="text-sm">Uses your own domain for download links</p>
                </div>
            </div>
        </div>

        <div class="text-center mt-8">
            <a 
                href="https://github.com/ceramicwhite/pixeldrain-ratelimit-bypasser" 
                target="_blank" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-colors inline-flex items-center"
            >
                ⭐ Star on GitHub
            </a>
        </div>
    </div>

    <footer class="bg-black/30 p-4 text-center sm:text-left">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center max-w-2xl mx-auto">
          <div class="text-sm mb-2 sm:mb-0">Self-Hosted PixelDrain RateLimit Bypasser</div>
          <a href="https://github.com/ceramicwhite/pixeldrain-ratelimit-bypasser" target="_blank" class="inline-flex items-center gap-2 text-sm">
              <i class="fab fa-github"></i>
              GitHub
          </a>
      </div>
    </footer>

    <script data-cfasync="false">
    const WORKER_DOMAIN = window.location.host;
    let convertedUrls = [];
    
    function convertUrls() {
        const inputUrls = document.getElementById('inputUrls').value;
        const urls = inputUrls.split('\\n').filter(url => url.trim());
        
        if (urls.length === 0) {
            alert('Please enter at least one PixelDrain URL!');
            return;
        }
        
        convertedUrls = [];
        const resultsContainer = document.getElementById('resultsContainer');
        const urlResults = document.getElementById('urlResults');
        urlResults.innerHTML = '';
        
        let hasValidUrl = false;
        
        urls.forEach((url, index) => {
            const match = url.trim().match(/pixeldrain\\.com\\/u\\/(\\w+)/);
            
            if (match) {
                hasValidUrl = true;
                const fileId = match[1];
                const proxyUrl = \`\${window.location.origin}/\${fileId}\`;
                convertedUrls.push({
                    original: url.trim(),
                    converted: proxyUrl,
                    fileId: fileId
                });
                
                // Create result item
                const resultItem = document.createElement('div');
                resultItem.className = 'bg-slate-800 border border-gray-700 rounded-md p-3';
                resultItem.innerHTML = \`
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div class="flex-grow">
                            <div class="text-xs text-gray-400 mb-1">Original: \${url.trim()}</div>
                            <input 
                                type="text" 
                                value="\${proxyUrl}"
                                readonly
                                class="w-full p-2 bg-slate-900 text-white border border-gray-700 rounded text-sm font-mono"
                                id="url-\${index}"
                            >
                        </div>
                        <div class="flex gap-2 mt-2 sm:mt-0">
                            <button 
                                onclick="copyIndividualUrl('\${proxyUrl}', \${index})"
                                class="bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors text-sm flex items-center gap-1"
                            >
                                <i class="material-icons" style="font-size: 16px;">content_copy</i>
                                Copy
                            </button>
                            <button 
                                onclick="downloadIndividualFile('\${proxyUrl}')"
                                class="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                            >
                                <i class="material-icons" style="font-size: 16px;">download</i>
                                Download
                            </button>
                        </div>
                    </div>
                \`;
                
                urlResults.appendChild(resultItem);
            }
        });
        
        if (hasValidUrl) {
            resultsContainer.style.display = 'block';
        } else {
            alert('No valid PixelDrain URLs found!');
        }
    }
    
    function copyIndividualUrl(url, index) {
        const input = document.getElementById(\`url-\${index}\`);
        input.select();
        document.execCommand('copy');
        
        // Show temporary success message
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="material-icons" style="font-size: 16px;">check</i> Copied!';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-indigo-600');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('bg-green-600');
            button.classList.add('bg-indigo-600');
        }, 2000);
    }
    
    function downloadIndividualFile(url) {
        // Open in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    
    function copyAllUrls() {
        const allUrls = convertedUrls.map(item => item.converted).join('\\n');
        
        const textarea = document.createElement('textarea');
        textarea.value = allUrls;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show temporary success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'All URLs Copied!';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-indigo-600');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600');
            button.classList.add('bg-indigo-600');
        }, 2000);
    }
    </script>
</body>
</html>
  `;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PixelDrain Bypasser running on port ${PORT}`);
  console.log(`Cloudflare domain: ${CLOUDFLARE_DOMAIN}`);
  console.log(`Visit: http://localhost:${PORT}`);
});