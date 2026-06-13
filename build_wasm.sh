#!/bin/bash
# Build APK Analyzer WASM module
# Requires Emscripten SDK: https://emscripten.org/docs/getting_started/downloads.html

echo "[OBELISK] Building WASM module..."

if [ ! -d "emsdk" ]; then
    echo "Installing Emscripten..."
    git clone https://github.com/emscripten-core/emsdk.git
    cd emsdk
    ./emsdk install latest
    ./emsdk activate latest
    source ./emsdk_env.sh
    cd ..
fi

mkdir -p build
cd build
emcmake cmake ../src/wasm
emmake make

echo "[OBELISK] WASM build complete. Output: build/apk_analyzer.js + build/apk_analyzer.wasm"
echo "Copy these to public/ directory"
