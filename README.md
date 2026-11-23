# Soko: React + Firebase + M-Pesa E-Commerce

## Requirements covered
| # | Requirement | Where |
|---|-------------|-------|
| 1 | Register | `pages/Register.jsx` (Firebase Auth + `users` doc) |
| 2 | Login | `pages/Login.jsx`, `ProtectedRoute.jsx` |
| 3 | Browse catalogue | `pages/Catalogue.jsx` (Firestore `products`, search/filter/sort) |
| 4 | Cart | `context/CartContext.jsx`, `pages/Cart.jsx` |
| 5 | Simulate payment | `pages/Checkout.jsx` + `api/stkpush.js` (Daraja sandbox or simulation) |
| 6 | Multiple devices | Cart is stored in Firestore `carts/{uid}` with a live `onSnapshot` listener |

## 1. Run in VS Code
```bash
npm install
cp .env.example .env     # fill in the VITE_FIREBASE_* values
npm run dev
```

## 2. Firebase setup
1. console.firebase.google.com > Add project.
2. Build > Authentication > Get started > enable **Email/Password**.
3. Build > Firestore Database > Create (test mode is fine to begin with).
4. Project settings > Your apps > Web (`</>`) > copy the config into `.env`.
5. Firestore > Rules: paste `firestore.rules` and Publish.
6. Run the app, log in, click **Add sample products** on the home page.

## 3. M-Pesa (Daraja sandbox)
1. developer.safaricom.co.ke > create an app > enable **Lipa na M-Pesa Sandbox**.
2. Copy the Consumer Key/Secret. Test shortcode `174379` and the passkey are in `.env.example`.
3. Add them as Vercel environment variables (never as `VITE_` variables, or they leak to the browser).
4. No keys? It still works: the API returns a simulated receipt (the "simulate payment" requirement).
5. Note: the Daraja sandbox needs a public `MPESA_CALLBACK_URL`, so push-testing works on the deployed Vercel URL.

## 4. Deploy on Vercel
```bash
git init && git add . && git commit -m "Soko"
# push to GitHub, then on vercel.com: Add New > Project > import the repo
```
Framework preset: **Vite**. Add all env variables from `.env.example`, then Deploy.
Afterwards in Firebase > Authentication > Settings > Authorized domains, add your `*.vercel.app` domain.

## 5. Test the multi-device requirement
Log in with the same account on your laptop and phone, add an item on one, and watch it appear on the other.
