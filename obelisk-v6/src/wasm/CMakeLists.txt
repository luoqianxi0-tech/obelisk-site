cmake_minimum_required(VERSION 3.13)
project(apk_analyzer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Emscripten specific
set(CMAKE_EXECUTABLE_SUFFIX ".js")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -s WASM=1 -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME='APKAnalyzerModule' -s ALLOW_MEMORY_GROWTH=1 -s NO_EXIT_RUNTIME=1")

add_executable(apk_analyzer apk-analyzer.cpp)

# Link embind
target_link_options(apk_analyzer PRIVATE "-sEMBIND_STD_STRING_IS_UTF8=1")
