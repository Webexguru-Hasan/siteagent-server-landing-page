# SiteAgent MCP — User Guide

## What is SiteAgent?

SiteAgent adds an AI-powered chatbot to any website in under 5 minutes.
It automatically reads your website content and answers visitor questions
in real time — no manual training, no coding skills needed.

Works on every platform: WordPress, Shopify, Webflow, Wix, Squarespace,
React, Next.js, and plain HTML.

🌐 **Landing Page:** https://siteagent-server-landing-page.vercel.app/

> **NOTE:** Before adding the chat widget, make sure your website has enough content for the AI to read.

---

## How It Works

```
Your Website  →  loads widget from CDN (jsDelivr)
Widget        →  sends visitor questions to SiteAgent API
API           →  crawls your site content → AI generates answer
Visitor       →  receives accurate answer in seconds
```

---

## Quick Start

### Step 1 — Subscribe on MCPize

1. Go to: https://mcpize.com/mcp/siteagent-server
2. Choose your plan — Free, Pro, or Agency
3. Click **Start Free** or **Subscribe**
4. After signup, your **MCPize API Key** appears on screen — starts with `sk_`

   Save this key — you need it in Step 2.

---

### Step 2 — Generate Your Widget Token

Your token links the chatbot to your specific website.

#### Option A — Using the Landing Page (Easiest, no terminal needed) ✅

1. Go to: https://siteagent-server-landing-page.vercel.app/
2. Scroll to the **"Generate Your Widget Token Instantly"** section
3. Enter your MCPize API Key (`sk_...`) and your website URL
4. Click **"Generate My Token →"**
5. Copy the ready-made snippet — it has your token already filled in

#### Option B — Using Terminal

Replace the values with your actual API key and website URL.

**Windows PowerShell:**
```powershell
$response = Invoke-RestMethod -Uri "https://wazidhasan-siteagent-mcp.hf.space/api/token" -Method POST -Headers @{"Content-Type"="application/json"; "x-api-key"="YOUR_MCPIZE_API_KEY"} -Body '{"website_url":"https://yourwebsite.com"}'; $response.token
```

**Mac / Linux Terminal:**
```bash
curl -s -X POST https://wazidhasan-siteagent-mcp.hf.space/api/token -H "Content-Type: application/json" -H "x-api-key: YOUR_MCPIZE_API_KEY" -d '{"website_url":"https://yourwebsite.com"}' | python3 -m json.tool
```

**Expected Response:**
```json
{
  "success": true,
  "token": "sa_pub_v1.eyJ...",
  "siteUrl": "https://yourwebsite.com"
}
```

Copy the full `token` value — it is long, copy all of it.

---

### Step 3 — Add Snippet to Your Website

Paste this into your website's `<head>` tag.
Replace `YOUR_FULL_TOKEN` with the token from Step 2.

```html
<!-- SiteAgent AI Chatbot -->
<script>
  window.SiteAgent = {
    token: "sa_pub_v1_YOUR_FULL_TOKEN_HERE",
    position: "bottom-right",
    theme: "auto"
  };
</script>
<script
  src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js"
  async>
</script>
<!-- End SiteAgent -->
```

> **NOTE:** If the snippet is not working, try removing `async` from the script tag.

---

### Step 4 — Done!

Refresh your website. The chat bubble appears in the bottom-right corner.

- **First visit:** The chatbot crawls your site (30–60 seconds)
- **After that:** All responses are instant from cache

---

## Platform-Specific Instructions

### WordPress

**Option A — No coding (recommended):**
1. Install the free plugin **"Insert Headers and Footers"**
   → Plugins → Add New → search for it
2. Settings → Insert Headers and Footers
3. Paste the snippet in the **Footer** section
4. Save

**Option B — Manual:**
1. Appearance → Theme Editor → open `header.php`
2. Paste snippet just before the `</head>` line
3. Click Update File

---

### Shopify

1. Online Store → Themes → click **...** → **Edit Code**
2. Open `layout/theme.liquid`
3. Find `</head>` and paste snippet just before it
4. Save

---

### Webflow

1. Project Settings → **Custom Code** tab
2. Paste snippet in the **Head Code** section
3. Save → Publish your site

---

### Wix

1. Settings → **Custom Code**
2. Click **+ Add Custom Code**
3. Paste snippet
4. Set **Place Code in** to **Head**
5. Set **Add to Pages** to **All Pages**
6. Click Apply

---

### Squarespace

1. Settings → Advanced → **Code Injection**
2. Paste snippet in the **Header** field
3. Save

---

### React / Next.js

Add this to `app/layout.js` or `pages/_app.js`:

```jsx
import Script from "next/script"

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <Script id="siteagent-config" strategy="beforeInteractive">
          {`window.SiteAgent = {
            token: "YOUR_FULL_TOKEN",
            position: "bottom-right",
            theme: "auto"
          }`}
        </Script>
        <Script
          src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js"
          strategy="lazyOnload"
        />
        {children}
      </body>
    </html>
  )
}
```

---

### Plain HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>

  <script>
    window.SiteAgent = {
      token: "YOUR_FULL_TOKEN",
      position: "bottom-right",
      theme: "auto"
    };
  </script>
  <script
    src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js"
    async>
  </script>

</head>
<body>
  <!-- your page content -->
</body>
</html>
```

---

## Step 5 — Customize Your Chatbot (Optional)

The chatbot works out of the box with just a token.
Use these options to match your brand.

### All Options Explained

```html
<script>
  window.SiteAgent = {

    token: "YOUR_FULL_TOKEN",
    // Required. Copy from Step 2. Do not share publicly.

    primaryColor: "#2563EB",
    // Color of the chat bubble, header, and buttons.
    // Use any hex color to match your brand.
    //
    // Examples:
    //   Blue       "#2563EB"  (default)
    //   Green      "#38A169"
    //   Red        "#E53E3E"
    //   Purple     "#805AD5"
    //   Orange     "#DD6B20"
    //   Black      "#1A202C"
    //   Pink       "#D53F8C"
    //
    // Find your brand color at: https://colorpicker.me

    position: "bottom-right",
    // Where the bubble appears on screen.
    //
    // "bottom-right"  →  bottom right corner (default)
    // "bottom-left"   →  bottom left corner
    // "top-right"     →  top right corner
    // "top-left"      →  top left corner

    theme: "auto",
    // Chat window background style.
    //
    // "auto"   →  follows the visitor's device setting
    // "light"  →  always white background
    // "dark"   →  always dark background

    greeting: "Hi! How can I help you today?",
    // First message visitors see when chat opens.
    // Write in your language and brand voice.

    placeholder: "Ask me anything...",
    // Hint text in the message input box.

    leadCapture: true
    // Show an email collection form after 2 messages.
    // true = show, false = hide

  };
</script>
<script
  src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js"
  async>
</script>
```

---

### Quick Reference

| Option | Default | Required |
|---|---|---|
| `token` | — | ✅ Yes |
| `primaryColor` | `"#1F4E79"` | ❌ No |
| `position` | `"bottom-right"` | ❌ No |
| `theme` | `"auto"` | ❌ No |
| `greeting` | auto by site type | ❌ No |
| `placeholder` | `"Ask me anything..."` | ❌ No |
| `leadCapture` | `true` | ❌ No |

---

### Minimal — Token Only

```html
<script>
  window.SiteAgent = { token: "YOUR_FULL_TOKEN" };
</script>
<script
  src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js"
  async>
</script>
```

---

### Example — Online Shop

```html
<script>
  window.SiteAgent = {
    token: "YOUR_FULL_TOKEN",
    primaryColor: "#E53E3E",
    position: "bottom-right",
    theme: "light",
    greeting: "Welcome! 🛒 How can I help you today?",
    placeholder: "Ask about products, shipping, returns...",
    leadCapture: true
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js" async></script>
```

---

### Example — Developer or Docs Site

```html
<script>
  window.SiteAgent = {
    token: "YOUR_FULL_TOKEN",
    primaryColor: "#805AD5",
    position: "bottom-right",
    theme: "dark",
    greeting: "Hey dev! 👨‍💻 Ask me anything about the docs.",
    placeholder: "Search the documentation...",
    leadCapture: false
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js" async></script>
```

---

### Example — Agency or Portfolio

```html
<script>
  window.SiteAgent = {
    token: "YOUR_FULL_TOKEN",
    primaryColor: "#1A202C",
    position: "bottom-left",
    theme: "auto",
    greeting: "Hi! Interested in working together?",
    placeholder: "Tell me about your project...",
    leadCapture: true
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js" async></script>
```

---

## Plans and Features

| Feature | Free | Pro — $19/mo | Agency — $49/mo |
|---|---|---|---|
| Requests per month | 200 | 10,000 | 50,000 |
| Pages crawled per site | 10 | 50 | 200 |
| AI question answering | ✅ | ✅ | ✅ |
| Page summaries | ✅ | ✅ | ✅ |
| Email lead capture | ✅ | ✅ | ✅ |
| Site-wide search | ❌ | ✅ | ✅ |
| Browser DOM actions | ❌ | ✅ | ✅ |
| AI content generation | ❌ | ✅ | ✅ |
| Auto re-crawl | Weekly | Daily | Hourly |
| Number of websites | 1 | 1 | 5 |

---

## Troubleshooting

### Chat bubble is not appearing

1. Press **F12** → click the **Console** tab
2. Look for red error messages
3. Confirm the snippet is inside the `<head>` tag
4. Check the token has no extra spaces or line breaks
5. Hard refresh: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)

---

### "Could not extract content" error

The chatbot could not read your website. Check:

- Your page has at least 30 words of visible text
- Your website is publicly accessible (not behind a login)
- Your site does not require JavaScript to show content

---

### Chatbot is giving wrong or outdated answers

Your site content may have changed since the last crawl.
Trigger a manual re-crawl:

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://wazidhasan-siteagent-mcp.hf.space/api/crawl" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"token":"YOUR_FULL_TOKEN","force":true}'
```

**curl:**
```bash
curl -X POST https://wazidhasan-siteagent-mcp.hf.space/api/crawl -H "Content-Type: application/json" -d '{"token":"YOUR_FULL_TOKEN","force":true}'
```

---

### "Sorry, something went wrong"

Your token may have expired (tokens are valid for 1 year).
Generate a new token by repeating Step 2.

---

### Rate limit reached

You have used all requests for this month.
Upgrade at: https://mcpize.com/mcp/siteagent-server

Or wait for the monthly reset on the 1st of next month.

---

## Server Status

Check if the server is running:

https://wazidhasan-siteagent-mcp.hf.space/api/health

Expected response:
```json
{
  "status": "ok",
  "service": "siteagent-mcp"
}
```

---

## Support

- 🌐 Landing Page: https://siteagent-server-landing-page.vercel.app/
- 📧 Email: webexguruhasan95@gmail.com