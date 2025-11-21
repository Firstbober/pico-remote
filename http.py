import network
import socket
import time


def connect_to_wifi(ssid, password):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

    max_wait = 10
    while max_wait > 0:
        if wlan.status() < 0 or wlan.status() >= 3:
            break
        max_wait -= 1
        print("Waiting for connection...")
        time.sleep(1)

    if wlan.status() != 3:
        raise RuntimeError("Network connection failed")
    else:
        print("Connected")
        status = wlan.ifconfig()
        print("ip = " + status[0])

class Endpoint:
    def __init__(self, handler, get = False, post = False):
        self.handler = handler
        self.get = get
        self.post = post

ENDPOINTS = {}

def add_endpoint(path, handler, get = False, post = False):
    ENDPOINTS[path] = Endpoint(handler, get, post)

def handle_endpoints(url, method, cl, cors, raw):
    for key, endpoint in ENDPOINTS.items():
        print(url)
        if url.startswith(key):
            if method == 'b\'OPTIONS':
                cl.send('HTTP/1.0 200 OK\r\nAccess-Control-Allow-Headers: *\r\nAccess-Control-Allow-Origin: *\r\n\r\n')
                cl.close()
                continue

            if method == 'b\'GET' and not endpoint.get:
                continue
            if method == 'b\'POST' and not endpoint.post:
                continue

            endpoint.handler(url, lambda code, response: (
                cl.send('HTTP/1.0 ' + code + '\r\nContent-type: application/json\r\nAccess-Control-Allow-Origin: '+cors+'\r\n\r\n'),
                cl.send(response),
                cl.close()
            ), raw)
            return

    cl.send('HTTP/1.0 404 Not Found\r\nContent-type: application/json\r\n\r\n')
    cl.close()

def start_server(port, buffer_size, cors):
    addr = socket.getaddrinfo('0.0.0.0', port)[0][-1]

    s = socket.socket()
    s.bind(addr)
    s.listen(1)

    print('Listening on', addr)

    # Listen for connections
    while True:
        try:
            cl, addr = s.accept()
            print('Client connected from', addr)
            raw_request = cl.recv(buffer_size)
            request = str(raw_request)

            split = request.partition('\\r\\n')[0].split(' ')
            method = split[0]
            url = split[1]

            handle_endpoints(url, method, cl, cors, raw_request)            

        except OSError as e:
            cl.close()
            print('Connection closed')
