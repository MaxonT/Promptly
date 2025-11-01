# LBPO-Studio v0.5

**Mode:** Keep v0.4 features, add multi-language, theme, auth, subscription, legal, cookie consent, brand params.

## Params (replace in files)
- `{{PRODUCT_NAME}}` (default: LBPO-Studio)
- `{{OUTPUT_MODE}}` : static-ui-only | runnable-demo
- `{{BRAND_PRIMARY}}` / `{{BRAND_SECONDARY}}` (colors)
- `{{LANG_SET}}`: "en,zh,es,fr,hi,ar,pt,ja,ko"
- `{{SUBSCRIPTION_PRICE}}`: e.g., 5
- `{{IDENTITY_FIELDS}}`: "email,password,name"
- `{{PERSISTENCE_POLICY}}`: local-storage-only | mock-api | real-backend
- `{{PAGES}}`: index/login/signup/subscription/terms/privacy/cookies
- `{{LEGAL_SCOPE}}`: basic | extended
- `{{THEME_MODES}}`: system, light, dark
- `{{ICON_PACK}}`: Lucide | Material

## Demo (static-ui-only)
Open `index.html` directly. Cookie banner controls persistence. No tracking.

## Cloud (runnable-demo)
- `backend/` — Node/Express APIs (`/api/register`, `/api/login`, `/api/upgrade`, `/api/cancel`, `/api/optimize`), serves `frontend/`.
- `frontend/` — same UI; connect backend automatically (same origin).
- `.env.sample` — configure `PORT`, `SUBSCRIPTION_PRICE`, `FRONTEND_DIR`.

### Local Run
```bash
cd backend
cp .env.sample .env
npm install
npm start
# open http://localhost:10000
```

### Deploy
- **Render**: use `render.yaml`.
- **Vercel**: (optional) host `frontend/` as static and point to backend domain.
