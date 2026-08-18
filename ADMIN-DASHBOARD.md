# Admin Dashboard Setup — S.N. Medicare

Satvik (founder) dashboard: **`/admin`**  
Login: email **or** phone → OTP

## What you get

1. Every successful Razorpay payment is saved (customer, address, items, total).
2. Satvik logs in at `/admin/login` with allowlisted email/phone + OTP.
3. Dashboard shows revenue, orders, search/filter, status updates (paid → shipped → delivered).

## One-time setup

### 1. Create free Supabase project

1. Go to https://supabase.com → New project  
2. Open **SQL Editor** → paste & run `supabase/schema.sql`  
3. **Project Settings → API** se copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (secret — sirf server pe)

### 2. Env vars (local + Vercel)

Copy `.env.example` → `.env.local` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_SESSION_SECRET=long-random-string
ADMIN_EMAILS=info@snmedicare.in
ADMIN_PHONES=917014949153
```

Vercel pe bhi yahi variables add karo (Production).

### 3. OTP delivery (optional for first test)

**Easiest login:** email/phone + `ADMIN_PASSWORD` (password field on `/admin/login`).

**OTP:** local pe SMS ke bina screen par Dev OTP dikhega. Live SMS/email ke liye Resend + MSG91.

**Dev / pehle test:** Resend/MSG91 ke bina bhi chalega — OTP terminal + login screen pe `Dev OTP` dikhega.


**Email production:** [Resend](https://resend.com) → `RESEND_API_KEY`  
**SMS production (India):** [MSG91](https://msg91.com) DLT template → `MSG91_AUTH_KEY` + `MSG91_TEMPLATE_ID`

### 4. Run

```bash
npm install
npm run dev
```

Open: http://localhost:3000/admin/login

Use Satvik email (`info@snmedicare.in`) or phone (`7014949153`).

## URLs

| URL | Purpose |
|-----|---------|
| `/admin/login` | OTP login |
| `/admin` | Orders dashboard |
| `/admin/orders/[id]` | Order detail + status |

Public store navbar mein admin link nahi hai — URL seedha use karo.

## Allowlist

Sirf `ADMIN_EMAILS` / `ADMIN_PHONES` (plus defaults from `src/data/team.ts`) login kar sakte hain. Dusra number OTP request kare to **403**.
