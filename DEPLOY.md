# Quick Start - Netlify Deployment

## ✅ Project Ready for Netlify!

Your project has been successfully converted from Cloudflare to Netlify deployment.

## 🚀 Three Ways to Deploy

### 1️⃣ **GitHub + Netlify Dashboard** (Recommended for continuous deployment)

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify:**

   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure:
     - **Build command:** `bun run build`
     - **Publish directory:** `dist`
     - **Node version:** 20 (set in Environment Variables: `NODE_VERSION=20`)
   - Click "Deploy site"

3. **Auto-deploys:** Every push to main will automatically deploy! 🎉

---

### 2️⃣ **Netlify CLI** (For quick deploys from terminal)

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   # or with bun
   bun install -g netlify-cli
   ```

2. **Login:**

   ```bash
   netlify login
   ```

3. **Initialize site:**

   ```bash
   netlify init
   ```

   Follow the prompts to create a new site or link to existing one.

4. **Deploy:**

   ```bash
   # Preview deploy
   bun run deploy:preview

   # Production deploy
   bun run deploy
   ```

---

### 3️⃣ **Drag & Drop** (Simplest for one-time deploys)

1. **Build locally:**

   ```bash
   bun run build
   ```

2. **Deploy:**
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder into the browser
   - Done! ✨

---

## 🛠️ Local Development

```bash
# Install dependencies
bun install

# Run dev server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

---

## 📝 What Changed from Cloudflare

✅ Removed Cloudflare Workers plugin from Vite config  
✅ Added `netlify.toml` configuration  
✅ Added `public/_redirects` for SPA routing  
✅ Updated deployment scripts in package.json  
✅ Created Netlify deployment documentation

⚠️ **Note:** The `worker/` folder (Cloudflare Workers code) is not used in this Netlify deployment. The app works entirely client-side with localStorage.

---

## 🌐 After Deployment

### Add Custom Domain

1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Follow DNS setup instructions

### Environment Variables (if needed)

1. Go to Site Settings → Environment Variables
2. Add any `VITE_*` variables you need

### Enable HTTPS

- Automatically enabled by Netlify! 🔒

---

## 🐛 Troubleshooting

**Build fails?**

- Check Node version is set to 20 in Environment Variables
- Ensure build command is `bun run build`
- Check build logs for specific errors

**Routes don't work?**

- Verify `public/_redirects` file exists with: `/* /index.html 200`

**Assets not loading?**

- Check browser console for errors
- Verify all assets are in the `dist` folder after build

---

## 📚 Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Vite Documentation](https://vitejs.dev)
- [Project README](./README.md)
- [Netlify-specific README](./README.netlify.md)

---

**Ready to deploy? Pick a method above and go! 🚀**
