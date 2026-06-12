#!/bin/bash
# OBELISK v5 Batch 1 Deploy Script
# Run this in Git Bash at the repo root

set -e

echo "[OBELISK] Starting Batch 1 deployment..."

# Copy files
cp index.html reverse.html darknav.html inspo.html motion.html profile.html firestore.rules ./

# Git operations
git add -A
git commit -m "OBELISK v5 Batch 1: Auth persistence fix, ADMIN privilege, Arsenal redirect, Firestore rules v2"
git push origin main

echo "[OBELISK] Code pushed to GitHub."
echo "[OBELISK] Now deploying to Vercel..."
vercel --prod

echo "[OBELISK] Deployment complete."
echo "[OBELISK] Next: Go to Firebase Console -> Firestore Database -> Rules -> Paste firestore.rules -> Publish"
