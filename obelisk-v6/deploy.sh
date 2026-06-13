#!/bin/bash
set -e

echo "[OBELISK v6] Deploying..."

npm install
npm run build

# If vercel CLI is installed
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "[WARN] vercel CLI not found. Install with: npm i -g vercel"
    echo "[INFO] Build output in dist/ directory"
fi

echo "[OBELISK] Done."
