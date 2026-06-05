# Nash Referral Program

A small web app for the Nash customer referral program. Existing customers introduce a
peer from another company; when that referral qualifies, the referrer gets a **$500 gift
card**. Every submission emails you the details so you can round-robin it to a rep.

- **Landing page** (`/`) — Nash-branded, explains the offer and how it works.
- **Referral form** (`/refer`) — a short multi-step form that collects:
  - the referrer's work email (who gets the gift card)
  - the referral's full name
  - the referral's email
  - the referral's phone number
- **On submit** — the app emails all four details to whatever address you choose.

Built with Next.js. Designed to deploy to Railway from a GitHub repo.

---

## How the pieces fit together (plain English)

There are three accounts/services involved:

1. **GitHub** — stores the code. Railway watches it and redeploys when you push changes.
2. **Railway** — runs the website on the internet, 24/7.
3. **Resend** — actually sends the notification email when someone submits a referral.

You set this up once, and after that every form submission lands in your inbox automatically.

---

## Step 1 — Get a Resend account (for the emails)

1. Go to [resend.com](https://resend.com) and sign up (free tier is plenty to start).
2. In the dashboard, open **API Keys** and create one. Copy it. It starts with `re_`.
3. Until you verify a domain (optional, see bottom), Resend can only send emails **to the
   address you signed up with**. So sign up with the inbox where you want referrals to land
   (or one you can read).

That's all you need from Resend for now: the **API key**.

---

## Step 2 — Put the code on GitHub

From this folder (`nash-referrals`) in a terminal:

```bash
git add .
git commit -m "Nash referral program"
```

Then create an empty repo on GitHub (github.com → New repository, name it `nash-referrals`,
don't add a README), and copy the two commands GitHub shows you under
"…or push an existing repository". They look like this:

```bash
git remote add origin https://github.com/<your-username>/nash-referrals.git
git branch -M main
git push -u origin main
```

Your code is now on GitHub.

---

## Step 3 — Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project → Deploy from GitHub repo →** pick `nash-referrals`.
3. Railway auto-detects Next.js and starts building. Let it finish.
4. Open the **Variables** tab and add these three:

   | Variable | Value |
   |---|---|
   | `RESEND_API_KEY` | the `re_...` key from Resend |
   | `REFERRAL_NOTIFY_EMAIL` | the inbox that should receive referrals (e.g. `you@usenash.com`). You can list several, comma-separated. |
   | `REFERRAL_FROM_EMAIL` | leave as `Nash Referrals <onboarding@resend.dev>` for now |

5. Railway redeploys automatically after you save variables.
6. In **Settings → Networking**, click **Generate Domain** to get a public URL like
   `nash-referrals-production.up.railway.app`. That's your live site.

Submit a test referral on the live URL. The email should arrive at `REFERRAL_NOTIFY_EMAIL`.

---

## The email you'll receive

Each submission sends you an email with the subject:

> New Nash referral: Jamie Rivera (via kelsey@usenash.com)

…and a clean summary of the referrer, the referral's name/email/phone, and the timestamp.
The **reply-to** is set to the referrer, so you can reply to them directly. From there you
round-robin the lead to the right rep however you like.

---

## Optional: send from your own domain

Resend's default sender (`onboarding@resend.dev`) only delivers to your own Resend inbox,
which is fine for "notify me." If you later want emails to come from `referrals@usenash.com`
(and to deliver anywhere), verify the domain in Resend (**Domains → Add Domain**, then add
the DNS records it gives you). Once verified, change `REFERRAL_FROM_EMAIL` in Railway to
`Nash Referrals <referrals@usenash.com>`.

---

## Running it locally (optional)

```bash
npm install
cp .env.example .env.local   # then fill in your Resend key + notify email
npm run dev
```

Open http://localhost:3000. Without the env vars the form works but the final submit will
say email isn't configured yet, which is expected.

---

## Where to change things

- **Copy / wording on the landing page:** `app/page.js`
- **Form questions and validation:** `app/refer/page.js`
- **The notification email + recipient logic:** `app/api/refer/route.js`
- **Colors and styling:** `app/globals.css` (Nash palette is defined at the top)
