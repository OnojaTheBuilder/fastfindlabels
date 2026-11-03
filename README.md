# Fast Find Label (Astro)

Static Astro site. Pages: `/`, `/guide/`, `/order/`, `/faq/`, `/contact/`.

## Run
    npm install
    npm run dev      # http://localhost:4321
    npm run build    # outputs dist/

## Deploy (GitHub + Vercel)
Push this folder to GitHub, then in Vercel choose "Add New Project" and import the repo.
Vercel detects Astro automatically (build: `npm run build`, output: `dist`).

## Edit
- All text: `src/data/content.js`. Replace every [bracketed] item before launch.
- Prices: `price` list in the same file.
- Styles: `src/styles/global.css`. Browser effects: `src/scripts/client.js`.
- Checkout is a demo. Connect PayPal in the `order()` function in `src/scripts/client.js` (marked comment).
- Once you have a domain, add `site: 'https://your-domain.com'` to `astro.config.mjs`.

PayPal: set `paypalClientId` in `src/data/content.js` to your live client ID (from developer.paypal.com). Each order then shows PayPal buttons; the trusted number is saved in the PayPal transaction description and custom ID, and the shipping address goes with it. Test in sandbox first.

Note: written without being installed or built. Run `npm run build` once and fix anything it reports.
