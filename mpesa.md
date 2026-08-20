# M-Pesa payments — setup notes (v2, post-debugging)

Confirmed working end-to-end: real STK push, real PIN entry, real callback
delivery, real Order status flip, real Enrollment/download outcomes.

## 1. Merge the schema
Add the fields in `schema-additions-payments.prisma` to your `Order` model.
```bash
pnpm dlx prisma db push
pnpm dlx prisma generate
```

## 2. Install axios
```bash
pnpm add axios
```

## 3. Environment variables — `ilab-growth-api/.env`
```
MPESA_CONSUMER_KEY=your-daraja-consumer-key
MPESA_CONSUMER_SECRET=your-daraja-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_ENV=sandbox
MPESA_CALLBACK_URL=https://YOUR-CURRENT-NGROK-URL/payments/mpesa/callback
```
Shortcode/Passkey above are Safaricom's shared sandbox values (confirm
against your Daraja app's M-Pesa Express -> Simulate page if unsure --
these occasionally rotate).

## 4. ngrok -- the part most likely to break between sessions

**Install:** the `npm install -g ngrok` wrapper is broken on Windows
("Exec format error"). Use a real binary instead: download from
ngrok.com/download, or `winget install ngrok.ngrok`, or
`choco install ngrok`. If PATH doesn't pick it up in Git Bash after
install, either call it with a full path (`/c/ngrok/ngrok.exe http 3001`)
or add its folder to your Windows PATH and restart the terminal.

**Every time you start a new work session:**
1. `ngrok http 3001`
2. Copy the new `https://xxxx.ngrok-free.app` (or `.dev`) URL -- it
   changes every restart on the free tier
3. Update `MPESA_CALLBACK_URL` in `.env` with that URL +
   `/payments/mpesa/callback`
4. Restart `pnpm start:dev` (env vars only load on startup)

Forgetting step 3-4 after ngrok restarts is the single most common way
this silently stops working -- the STK push still succeeds (that part
doesn't depend on the callback URL being current), but the callback goes
nowhere and the frontend spins forever.

## 5. Register the module
```ts
// app.module.ts
import { PaymentsModule } from './payments/payments.module';
// add PaymentsModule to imports: [...]
```

## 6. Dev server hygiene
Running two `next dev` / `pnpm dev` processes at once against the same
`.next` folder produces `Compaction failed: Another write batch or
compaction is already active` spam and can mask real errors. Before
debugging anything else, confirm only one dev server is running per repo:
```bash
rm -rf .next   # ilab-growth-web
pnpm dev
```

## 7. Known fixes baked in from live testing
- **`TransactionDesc` too short -> "Bad Request - Invalid Remarks"**:
  Daraja rejected a 1-character product/course title truncated into
  `TransactionDesc`. `mpesa.service.ts` now falls back to `"Order
  Payment"` if the trimmed title is under 4 characters. (This 4-char
  threshold is a conservative guess, not a documented Daraja minimum --
  revisit if a legitimately short title still gets rejected.)
- **Proxy route swallowing real errors as generic "Network error"**:
  `api/checkout/mpesa/initiate/route.ts` now wraps the call to NestJS in
  try/catch and always returns real JSON, instead of letting an unhandled
  exception produce an HTML 500 page that broke the client's `res.json()`
  parsing and hid the actual cause.

## 8. Testing checklist (repeat this whenever something seems broken)
1. `curl http://localhost:3001/courses` -- confirms NestJS is up
2. Confirm you're actually logged in on the frontend
3. Browser DevTools -> Network tab -> check the `mpesa/initiate` request's
   real status code and JSON body
4. `http://127.0.0.1:4040` (ngrok inspector) -- did
   `POST /payments/mpesa/callback` actually arrive after PIN entry?
5. `ilab-growth-api` terminal -- any `handleCallback`-related log lines?
6. `pnpm dlx prisma studio` -> `Order` table -> check `status`,
   `resultDesc`, `mpesaReceiptNumber` on the newest row directly -- this
   is the source of truth, independent of whatever the frontend is
   showing

## 9. Confirmed-working outcomes (sanity-checked post-fix)
- Product purchase with a real `fileUrl` -> real "Download Now" link on
  the success screen
- Product purchase without a `fileUrl` -> honest "no file attached yet"
  message, not a broken link
- Course purchase -> real row created in `Enrollment`, "View Course" link
  works

## 10. Still-open gaps (unchanged from before, still not built)
- No order confirmation/receipt page or "My Orders" history -- the
  success screen only exists inside the dialog; closing it loses that
  view even though the order still exists in the database
- No post-purchase UI state on the Course/Product detail pages -- someone
  who just bought/enrolled and reloads the page still sees "Buy
  Now"/"Enroll Now," not "Go to Course"/"Download"
- Admin activity feed doesn't recognize `order_completed` yet -- no
  notification bell entry for a completed sale
- Card payment method not built (M-Pesa only, per the original scoping
  decision)
- No refund flow (matters for Sales Reports' "Refund Rate" card later)