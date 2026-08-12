# OBELISK v11

## What is New
- **File Storage**: Upload/download software, video, images via Firebase Storage
- **Background Audio**: Admin-managed background music playlist
- **Login History**: Full login tracking with IP, location, device, browser
- **Admin Panel**: System stats, resource import, audio management
- **PWA Support**: Install to desktop, offline cache
- **Electron Desktop**: Windows/Mac/Linux desktop app support
- **Real Data**: All sections now use real Firestore data (no mocks)
- **White Minimalist Theme**: Clean white background, black text, glassmorphism cards
- **Obelisk Icon**: White background + black isosceles triangle

## Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set Framework Preset to **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variables (if not hardcoded):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## Firebase Setup
1. Update `firestore.rules` in Firebase Console
2. Enable Firebase Storage (set rules to allow authenticated uploads)
3. Set your UID as admin in Firestore: `/users/{your_uid}` -> `isAdmin: true`

## Desktop Build
```bash
npm install
npm run electron:build
```

## PWA Install
- Chrome/Edge: Click "Install OBELISK" in address bar
- Safari iOS: Share -> Add to Home Screen