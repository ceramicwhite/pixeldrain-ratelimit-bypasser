# PixelDrain RateLimit Bypasser - Cloudflare Workers Edition

A complete guide to deploying your own private PixelDrain bypass service using Cloudflare Workers. This setup distributes requests across multiple worker endpoints to help manage rate limits.

![Project Preview](/screenshot.png)

## 🚀 Features

- **Multi-URL Support**: Process multiple PixelDrain URLs at once
- **Load Balancing**: Distributes requests across 10 proxy workers
- **Clean Interface**: Modern UI with individual copy/download buttons
- **No Ads/Tracking**: Completely clean and private
- **100% Free**: Uses Cloudflare's free tier (100k requests/day)

## 📋 Prerequisites

- A Cloudflare account (free)
- A domain added to Cloudflare (optional, can use workers.dev subdomain)
- Basic knowledge of copy/paste 😄

## 🛠️ Complete Setup Guide

### Step 1: Create Your Cloudflare Account

1. Go to [Cloudflare Workers](https://workers.cloudflare.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Deploy the Proxy Workers

You'll need to create **10 proxy workers** that handle the actual PixelDrain requests.

For each proxy worker (pd1 through pd10):

1. **Go to Workers Dashboard**
   - Navigate to Workers & Pages → Create Application
   - Select "Create Worker"
   - Name it: `pd1`, `pd2`, `pd3`... up to `pd10`

2. **Deploy the Code**
   - Click "Quick Edit"
   - Delete all existing code
   - Copy the entire contents of `proxy-worker.js`
   - Paste it into the editor
   - Click "Save and Deploy"

3. **Note Your Domain**
   - Your worker URL will be: `pd1.<your-subdomain>.workers.dev`
   - Save this subdomain for the next step

Repeat this process 10 times for pd1 through pd10.

### Step 3: Deploy the Main Worker

1. **Create the Main Worker**
   - Go to Workers & Pages → Create Application
   - Select "Create Worker"
   - Name it: `pixel` (or any name you prefer)

2. **Configure the Code**
   - Open `worker.js` in a text editor
   - Find these lines at the top:
   ```javascript
   const WORKER_DOMAIN = 'pixel.<cloudflare_domain>.workers.dev';
   
   const PROXY_SERVERS = [
     'pd1.<cloudflare_domain>.workers.dev',
     'pd2.<cloudflare_domain>.workers.dev',
     // ... etc
   ];
   ```
   - Replace `<cloudflare_domain>` with your actual subdomain
   - Example: If your subdomain is `myname`, it becomes:
   ```javascript
   const WORKER_DOMAIN = 'pixel.myname.workers.dev';
   
   const PROXY_SERVERS = [
     'pd1.myname.workers.dev',
     'pd2.myname.workers.dev',
     // ... etc
   ];
   ```

3. **Deploy the Main Worker**
   - Click "Quick Edit" on your main worker
   - Delete all existing code
   - Paste your modified `worker.js` code
   - Click "Save and Deploy"

### Step 4: Test Your Setup

1. **Test a Proxy Worker**
   - Visit: `https://pd1.your-subdomain.workers.dev/api/file/test`
   - You should see an error message (this is expected)

2. **Test the Main Interface**
   - Visit: `https://pixel.your-subdomain.workers.dev`
   - You should see the PixelDrain bypasser interface

3. **Test with a Real URL**
   - Enter a PixelDrain URL like: `https://pixeldrain.com/u/abc123`
   - Click "Convert All URLs"
   - Click "Download" on the generated link

## 🌐 Optional: Custom Domain Setup

Instead of using `.workers.dev`, you can use your own domain:

1. **Add Custom Domain**
   - Go to your worker settings
   - Click "Triggers" → "Add Custom Domain"
   - Enter your domain (e.g., `pixel.yourdomain.com`)

2. **Update Configuration**
   - Update the `WORKER_DOMAIN` and `PROXY_SERVERS` in your code
   - Redeploy the worker

## 🔧 How It Works

```
User → Main Worker (pixel) → Random Proxy Worker (pd1-10) → PixelDrain API
```

1. **Main Worker**: Serves the UI and generates bypass URLs
2. **Proxy Workers**: Fetch files from PixelDrain with different IPs
3. **Load Balancing**: Randomly distributes requests across workers

## 💡 Tips & Tricks

### Scaling Up
- Add more proxy workers (pd11, pd12, etc.)
- Update the `PROXY_SERVERS` array in the main worker
- More workers = better distribution

### Monitoring
- Check Cloudflare Analytics for usage stats
- Workers Dashboard shows request counts
- Free tier: 100,000 requests per day

### Troubleshooting

**"Invalid request" error**
- Make sure you're using a valid PixelDrain URL
- Format: `https://pixeldrain.com/u/FILE_ID`

**Downloads not starting**
- Check if all proxy workers are deployed
- Verify domain names match exactly
- Try a different proxy worker directly

**Rate limits still occurring**
- Deploy more proxy workers
- Wait between large downloads
- Consider upgrading Cloudflare plan

## 🔒 Security & Privacy

- **No Logging**: Workers don't store any data
- **No Tracking**: No analytics or user tracking
- **Open Source**: Full code transparency
- **Your Control**: Runs on your Cloudflare account

## 📊 Cloudflare Free Tier Limits

- 100,000 requests per day
- 10 milliseconds CPU time per request
- Unlimited bandwidth (within reason)
- Perfect for personal use

## 🤝 Contributing

Found a bug or have an improvement? Pull requests are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This tool is for educational purposes and personal use. Users are responsible for complying with PixelDrain's terms of service and applicable laws. The authors are not responsible for any misuse of this software.

---

**Need Help?** Open an issue on GitHub and we'll help you get set up!

⭐ If this helped you, consider starring the repository!
