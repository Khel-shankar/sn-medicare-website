# Deploy S.N. Medicare Website — GoDaddy Domain + Hosting

**Domain:** snmedicare.in (GoDaddy)  
**Project:** Next.js app in this repo

---

## Important: GoDaddy + Next.js

This website uses **Next.js with API routes** (Razorpay payments). That means:

| Hosting type | Works? |
|--------------|--------|
| GoDaddy **shared/cPanel** hosting (basic) | Usually **NO** — no Node.js server |
| GoDaddy **VPS** with Node.js | Yes — manual setup |
| **Vercel** (free) + GoDaddy domain | **Best & easiest** — recommended |

**Recommended:** Host on **Vercel** (free), connect your **GoDaddy domain** to Vercel.

---

# Part 1 — Push to GitHub

## Step 1: Security first

Your GitHub password was visible in a screenshot. **Change it now:**

1. Go to https://github.com/settings/security
2. Change password
3. Create a **Personal Access Token** (PAT) for git:
   - https://github.com/settings/tokens
   - **Generate new token (classic)**
   - Scopes: check `repo`
   - Copy token — use this instead of password when git asks

> GitHub no longer accepts account password for `git push`.

## Step 2: Login to GitHub CLI (easiest)

Open terminal in project folder:

```powershell
cd "C:\Users\khels\Documents\S.N. Medicare (Kivo Pro And Kivo Plus)\sn-medicare-website"
gh auth login
```

Choose:
- GitHub.com
- HTTPS
- Login with browser (recommended)

## Step 3: Create repo & push

```powershell
gh repo create sn-medicare-website --public --source=. --remote=origin --push
```

**OR** if repo already exists on GitHub:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/sn-medicare-website.git
git branch -M main
git push -u origin main
```

When prompted for password → paste your **PAT token**, not GitHub password.

---

# Part 2 — Deploy (Recommended: Vercel + GoDaddy Domain)

## Step 1: Deploy on Vercel

1. Go to https://vercel.com → Sign up with **GitHub**
2. **Add New Project** → Import `sn-medicare-website` repo
3. Framework: **Next.js** (auto-detected)
4. Add **Environment Variables**:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
5. Click **Deploy**
6. You get a URL like `sn-medicare-website.vercel.app`

## Step 2: Connect GoDaddy domain to Vercel

### In Vercel:
1. Project → **Settings** → **Domains**
2. Add: `snmedicare.in` and `www.snmedicare.in`

Vercel shows DNS records to add.

### In GoDaddy:
1. Login → **My Products** → Domain `snmedicare.in` → **DNS**
2. Edit / add records Vercel gave you:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` (Vercel IP — confirm in Vercel dashboard) |
| CNAME | www | `cname.vercel-dns.com` |

3. Delete conflicting old A/CNAME records if any
4. Wait **15 min – 48 hours** for DNS propagation
5. Vercel auto-enables **HTTPS (SSL)**

Site live at: **https://snmedicare.in**

---

# Part 3 — Alternative: GoDaddy VPS (Advanced)

Only if you bought **GoDaddy VPS**, not shared hosting:

```bash
# On VPS (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
git clone https://github.com/YOUR_USERNAME/sn-medicare-website.git
cd sn-medicare-website
npm install
npm run build

# Create .env.local with Razorpay keys
echo "RAZORPAY_KEY_ID=..." > .env.local
echo "RAZORPAY_KEY_SECRET=..." >> .env.local

# Run with PM2
sudo npm install -g pm2
pm2 start npm --name "sn-medicare" -- start
pm2 save
pm2 startup
```

Point domain A record to VPS IP. Configure Nginx reverse proxy to port 3000.

---

# Part 4 — GoDaddy Email (info@snmedicare.in)

If you bought **GoDaddy Professional Email** or **Microsoft 365**:

1. GoDaddy → Email & Office → Set up `info@snmedicare.in`
2. DNS MX records are auto-added by GoDaddy
3. Login at https://email.godaddy.com

If using **Google Workspace** instead — see `GOOGLE-SETUP-GUIDE.md`.

---

# Quick Checklist

| # | Task | Done |
|---|------|------|
| 1 | Change GitHub password (was exposed) | ☐ |
| 2 | Create GitHub PAT token | ☐ |
| 3 | `gh auth login` + push repo | ☐ |
| 4 | Deploy on Vercel from GitHub | ☐ |
| 5 | Add Razorpay env vars on Vercel | ☐ |
| 6 | Add `snmedicare.in` in Vercel Domains | ☐ |
| 7 | Update GoDaddy DNS → point to Vercel | ☐ |
| 8 | Test site + checkout | ☐ |
| 9 | Set up info@snmedicare.in email | ☐ |

---

# Commands Cheat Sheet

```powershell
# Go to project
cd "C:\Users\khels\Documents\S.N. Medicare (Kivo Pro And Kivo Plus)\sn-medicare-website"

# Push updates after changes
git add .
git commit -m "Update website"
git push
```

Vercel auto-redeploys on every `git push` to main.

---

**Need help?** Share your GitHub username after push — domain DNS screenshot bhejo agar records mein confusion ho.
