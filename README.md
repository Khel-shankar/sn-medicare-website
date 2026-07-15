# S.N. Medicare — Kivo Pro & Kivo Plus Website

Official e-commerce website for **S.N. Medicare** — sweatproof kinesiology tape built for Indian athletes.

## Features

- Responsive, mobile-first design with dark athletic theme
- Product catalog (Kivo Pro & Kivo Plus) — easily add more products
- Shopping cart with persistent local storage
- Razorpay payment gateway integration
- Product detail pages with features, composition, instructions
- About & Contact pages
- SEO optimized with Open Graph metadata

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **Razorpay** (payments)
- **Lucide React** (icons)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Razorpay

1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from Dashboard → Settings → API Keys
3. Copy `.env.example` to `.env.local` and add your keys:

```bash
cp .env.example .env.local
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Adding New Products

Edit `src/data/products.ts` — add a new product object following the existing structure. The website will automatically show it on the products page.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
4. Deploy

### Other hosts

```bash
npm run build
npm start
```

## Customization Checklist

- [ ] Update phone number in Footer & Contact page
- [ ] Update email address (currently `info@snmedicare.in`)
- [ ] Set actual product prices in `src/data/products.ts`
- [ ] Add Razorpay live keys for production
- [ ] Add Kivo Plus specific product images when available
- [ ] Connect contact form to email service (e.g., Resend, EmailJS)
- [ ] Add order database (e.g., Supabase, MongoDB) for order management

## Project Structure

```
src/
├── app/                  # Pages & API routes
│   ├── api/              # Razorpay payment APIs
│   ├── products/         # Product listing & detail
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout with Razorpay
│   ├── about/
│   └── contact/
├── components/           # Reusable UI components
├── context/              # Cart state management
└── data/                 # Product catalog
public/
└── images/               # Brand assets
```

## License

Private — S.N. Medicare
