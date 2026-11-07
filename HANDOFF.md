# HANDOFF: Fast Find Label website (read this first)

Paste this whole file into a new chat and attach: the project zip (fast-find-label-astro.zip), Bob's photos (Samsung back and case), and his sample spreadsheet (address_list.xlsx). Ask the new chat to work through the milestones below in order, one at a time, and to say plainly what it could not test.

## 1. Who and what
- I am Eric (CleanAce, web design studio). Client: Bob R. He sells **Fast Find Label**: tiny thermal-printed stickers with a trusted person's phone number, so a finder of a lost phone knows who to call. US customers only for now.
- Bob has paid the full $250 website fee. Live preview (Vercel): https://fastfindlabels.vercel.app/ . Domain to use: **fastfindlabel.com** (Bob registers it in his own name). Hosting: Vercel, paid plan if required for commercial use (check current terms).
- Bob's workflow: he prints labels on a **Nelko** label printer using the Nelko app (types each trusted number in by hand), and prints mailing addresses with an Android address-label app (30 labels per sheet). He packs 2+ labels in a coin envelope with one stamp. Goal: 30+ orders a day, so every step must be fast for him.

## 2. Stack and files (Astro 5, static, no database yet)
- `src/data/content.js` holds ALL text and the price list. Anything in [brackets] is a fact still to be supplied.
- `src/pages/`: index (hero with draggable-label toy, label showcase, pack picker with live label preview, scroll-driven "Atlas" day-map, features, reviews, CTA), guide, order, faq, contact.
- `src/scripts/client.js`: effects (word reveals, magnetic buttons, drag-the-label, atlas map scroll, quick pack picker, order form, PayPal buttons if `paypalClientId` is set).
- `src/styles/global.css`: design system. Look: light paper-green background, mint/sky/yellow, teal route, pink pins, navy text. Fonts: Fraunces (headings), Figtree (body). Respects reduced motion. No brown or black as main colors.
- `src/layouts/Base.astro`: header, intro animation, footer, mobile sticky "Get my labels" bar.
- Not yet verified: the Astro code was written without a local install. First action in the new chat: try `npm install && npm run build` (if there is no network, say so and write code carefully, flagging it as untested).

## 3. Label design (must match exactly)
Horizontal label, three centered lines, straight (no tilt), same orientation as the phone:
```
If found, call (555) 555-5555
fastfindlabel@gmail.com
©2026 RFR FastFindLabel
```
Only the phone number changes per customer. Customer emails are NEVER printed. Bob's contact email is **fastfindlabel@gmail.com** (changed from cellfindnow@gmail.com; his printed labels must use the new one too).

## 4. Pricing (confirm open items with Bob)
- 2 labels = **$10 + $3 flat shipping** (shipping is a flat $3 per order). Bob said pack prices are OK, but the 4-label and 6-label prices are not settled. Keep prices exclusive of shipping in `content.js`, and add $3 on top at checkout. Ask Bob to confirm 4 and 6 pack prices.
- Ships within 5 business days. No city, no business name, no address anywhere on the site.

## 5. Content changes to make (Milestone 1)
1. Replace [contact email] everywhere with fastfindlabel@gmail.com (site, label preview, footer, contact page).
2. Remove any mention of lanyards, key tags or keys. Do not mention them.
3. Remove business name and address; shipping text = "Ships within 5 business days"; no city.
4. Hero "drag the label onto the phone" toy: label must land straight (no rotation), matching the phone's horizontal/vertical orientation. The stuck state must look exactly like the label image shown under "Get my labels".
5. In the blurb about not using the phone's own number, write **NOT** in bold capitals.
6. Use Bob's real photos (phone back and phone case, with the 555 number) in the label showcase. **Crop the case photo**: a business card in the top pocket shows a partial street address, a web address and a zip code. Do not publish that.
7. Add an **Apt/Suite (optional)** field to checkout; it appears on the same line as the street ("123 Main St Apt 4B").
8. Shipping line item $3 flat, shown at checkout and in the pack cards ("+ $3 shipping").
9. Reviews section: keep placeholders; never invent reviews.
10. Remove or fill remaining [brackets]: ship time, guarantee (ask Bob), domain.

## 6. Payment and order structure (Milestones 2 and 3)
Use PayPal Checkout with server-side order creation and capture. Never trust prices from the browser.
Flow:
1. Customer picks a pack, enters the trusted number (US, 10 digits) and shipping details, taps Pay.
2. Browser calls `POST /api/orders/create` with pack id, number, name, email, address. The server validates everything, computes total = pack price + $3 shipping from its own price list, creates a PayPal order (intent CAPTURE, `custom_id` = our order id, description includes pack and trusted number), saves the order as `pending`, and returns the PayPal order id.
3. PayPal buttons let the customer approve. Browser calls `POST /api/orders/capture`. The server captures, checks status COMPLETED and the amount, marks the order `paid`, sends emails, and returns an order number.
4. Backup: `POST /api/paypal/webhook` (event PAYMENT.CAPTURE.COMPLETED, signature verified) marks the order paid if the customer closed the tab.
5. Emails: customer confirmation, and an alert to Bob. Use a transactional email service (for example Resend or Postmark) with a verified domain, because mail sent "as" a Gmail address often goes to spam. Ask Bob whether he wants a business email on the domain.
6. Secrets (PayPal Client ID and Secret, admin password, email key) live in Vercel environment variables. Nothing secret in client code. Support `PAYPAL_ENV=sandbox|live` and a hidden $1 test pack enabled only by an env flag for Bob's live test (he refunds it).
Storage: a small database via Vercel's marketplace (for example Upstash Redis or a Postgres such as Neon). Fields per order: id, createdAt, status (pending, paid, printed, shipped, refunded), pack, quantity, trustedNumber, name, email, street (with Apt), city, state, zip, total, paypalOrderId. No card data is ever stored (PayPal handles it). Add rate limiting, input validation and a privacy policy; consider deleting old orders after a set time.

## 7. Owner page for Bob (Milestone 2)
Private page at `/admin/` (password login, secure cookie, `noindex`, not linked anywhere). Works on his phone. Features:
- List of paid orders, newest first, with status. Filter "not yet printed".
- **Download Excel** of all or selected orders, **no limit on quantity**, laid out exactly like his sample: no header row, no blank rows. Columns: A name, B street (with Apt on the same line), C "City State" (for example "Tiffin OH"), D ZIP stored as text (keep leading zeros).
- **Copy next 30 addresses**: copies the next 30 un-printed addresses to the clipboard, formatted for his address-label app's "Paste list" (name, street, city state ZIP). Bob tested his app: **no blank line is needed**, so default to none (keep an optional toggle). After copying, offer "mark these 30 as printed".
- For each order: the trusted phone number in large clear text (he types it into the Nelko app), pack size, a "mark shipped" button.
- A "pause orders" switch that shows a banner and disables checkout, and an optional daily order cap.
Hosting note: static pages stay prerendered; API routes need the Vercel adapter (`@astrojs/vercel`) and `export const prerender = false` on endpoints.

## 8. Milestones (do in order, confirm after each)
1. Content changes (section 5), plus the home-page conversion work already in the code.
2. Backend and owner page (sections 6 and 7) using PayPal sandbox.
3. Go live with PayPal: Bob needs a PayPal **Business** account; he creates a Live app at developer.paypal.com and sends only the Client ID and Secret into Vercel settings (never his password). $1 live test and refund.
4. Required pages: Privacy, Shipping and returns, Terms. Check sales tax rules with a professional.
5. Domain: Bob registers fastfindlabel.com himself; connect it in Vercel; update site URL in `astro.config.mjs`; add sitemap.
6. Final test on desktop and phone, a full order end to end, Excel export opened, 30-address copy pasted into the address app, label printed from the Nelko app. Then launch quietly with a few real orders.

## 9. Rules for the assistant
- Do not invent facts, reviews or guarantees. Use [brackets] and ask me.
- Keep everything in `content.js` where possible. Keep the visual design and the reduced-motion support.
- Never put customer data, secrets or Bob's personal details in code or examples.
- Say plainly what could not be tested.

## 10. Status update and open items
- Milestone 1 content changes are DONE in the code: new email, brackets removed, ship time, no business name or address, NOT in bold capitals, Apt/Suite field, $3 flat shipping, straight label and straight phone in the drag toy, Bob's two photos (cropped, metadata removed), reviews section removed until real reviews exist.
- Pack prices are PROPOSALS ($10 for 2, $18 for 4, $25 for 6, plus $3 shipping) until Bob confirms.
- Bob asked for a second domain (probably cellfindnow.com), with the same layout and the same PayPal buttons. Ask him whether he wants a true second site or forwarding to the main site. Two identical sites compete in Google. One shared order backend should record which site each order came from.
- Check before launch: the Pew 98% figure and the guide page facts against their sources.
- Bob's two photos still show the OLD email (cellfindnow@gmail.com) on the label. Ask him to retake them with a label printed with fastfindlabel@gmail.com, then replace `public/images/phone-back.jpg` and `phone-case.jpg` (crop out the business card in the case pocket, strip metadata).
