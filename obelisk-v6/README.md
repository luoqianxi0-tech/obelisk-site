# OBELISK v6 - Prism Core

## Architecture
- **Frontend**: React 19 + Vite + React Router + Tailwind CSS + Framer Motion
- **State**: Zustand (persistent)
- **Auth**: Firebase Authentication (Google Sign-In)
- **Database**: Firestore
- **Agent**: WebSocket localhost:8765 for real-time data
- **WASM**: C++ APK Analyzer compiled to WebAssembly

## Features
- SPA (Single Page Application) - no page reloads, auth state never lost
- Animated page transitions via Framer Motion
- Real-time dashboard with Agent WebSocket data
- Terminal with interactive commands
- ADMIN privilege system with green scan line + ROOT ACCESS GRANTED
- C++ WASM APK static analysis engine

## Install
```bash
cd obelisk-v6
npm install
npm run dev
```

## Deploy
```bash
bash deploy.sh
```

## Firebase Rules
Copy `firestore.rules` to Firebase Console → Firestore Database → Rules → Publish

## Build WASM (optional)
```bash
bash build_wasm.sh
# Copy build/apk_analyzer.js and build/apk_analyzer.wasm to public/
```

## Admin Setup
In Firestore, create document: `system/admins` with field `uids` (array) = `["nCZLU2r9YfXVTrQ79EJqWJxPPT03"]`
