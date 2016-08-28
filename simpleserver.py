#!/usr/bin/python

import socket
import SimpleHTTPServer
import SocketServer
import webbrowser

PORT = 8000
serve = False

try:
    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

    httpd = SocketServer.TCPServer(("", PORT), Handler)

    print("program now running on http://127.0.0.1:{port}".format(port=PORT))
    serve = True
except socket.error:
    print("program already running on http://127.0.0.1:{port}".format(port=PORT))


print("Launching Browser")
webbrowser.open("http://127.0.0.1:{port}".format(port=PORT), new=1, autoraise=True)

if serve:
    httpd.serve_forever()
