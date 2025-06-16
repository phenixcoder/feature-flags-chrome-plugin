#!/usr/bin/env python3
"""
Simple HTTP server for testing the Feature Flags Chrome Extension
Usage: python3 server.py [port]
Default port: 8000
"""

import http.server
import socketserver
import sys
import os

# Default port
PORT = 8000

# Get port from command line argument if provided
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print("Invalid port number. Using default port 8000.")

# Change to the directory containing this script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create server
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"🚀 Feature Flags Test Server")
print(f"📡 Serving at http://localhost:{PORT}")
print(f"📁 Serving files from: {os.getcwd()}")
print(f"🔗 Open http://localhost:{PORT} in your browser")
print(f"⏹️  Press Ctrl+C to stop the server")
print()

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 Server stopped")
    httpd.shutdown()
