import asyncio
import gc
import network
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
            # if method == 'b\'OPTIONS':
            #     cl.send('HTTP/1.0 200 OK\r\nAccess-Control-Allow-Headers: *\r\nAccess-Control-Allow-Origin: *\r\n\r\n')
            #     cl.close()
            #     continue

            if method == 'b\'GET' and not endpoint.get:
                continue
            if method == 'b\'POST' and not endpoint.post:
                continue

            endpoint.handler(url, lambda code, response: (
                cl.send('HTTP/1.0 ' + code + '\r\nContent-type: application/json\r\nAccess-Control-Allow-Headers: *\r\nAccess-Control-Allow-Origin: *\r\n\r\n'),
                cl.send(response),
                cl.close()
            ), raw)
            return

    cl.send('HTTP/1.0 404 Not Found\r\nContent-type: application/json\r\nAccess-Control-Allow-Headers: *\r\nAccess-Control-Allow-Origin: *\r\n\r\n')
    cl.close()

# Tune these for your use case
MAX_CONCURRENT = 5  # Limit concurrent connections
GC_THRESHOLD = 10   # Run GC every N requests

class AsyncSocketWrapper:
    """Wrapper to make async writer look like a socket"""
    __slots__ = ('writer', '_closed')
    
    def __init__(self, writer):
        self.writer = writer
        self._closed = False
    
    def send(self, data):
        if not self._closed:
            self.writer.write(data)
    
    def close(self):
        self._closed = True

request_counter = 0

async def handle_client(reader, writer, cors, buffer_size):
    """Handle a single client connection asynchronously"""
    global request_counter
    
    try:
        addr = writer.get_extra_info('peername')
        print('Client connected from', addr)
        
        # Read request with timeout
        raw_request = await asyncio.wait_for(reader.read(buffer_size), timeout=2.0)
        
        if not raw_request:
            return
        
        first_line_end = raw_request.find(b'\r\n')
        if first_line_end == -1:
            writer.write(b'HTTP/1.0 400 Bad Request\r\n\r\n')
            await writer.drain()
            return
        
        request_line = raw_request[:first_line_end]
        parts = request_line.split(b' ', 2)
        
        if len(parts) < 2:
            writer.write(b'HTTP/1.0 400 Bad Request\r\n\r\n')
            await writer.drain()
            return
        
        method = parts[0]
        url = parts[1]
        
        # Wrap writer
        sock_wrapper = AsyncSocketWrapper(writer)
        
        # Handle the request
        handle_endpoints(url, method, sock_wrapper, cors, raw_request)
        
        # Drain
        await writer.drain()
        
        # Periodic garbage collection
        request_counter += 1
        if request_counter % GC_THRESHOLD == 0:
            gc.collect()
        
    except asyncio.TimeoutError:
        print('Client timeout')
    except Exception as e:
        print('Handler error:', e)
        try:
            writer.write(b'HTTP/1.0 500 Internal Server Error\r\n\r\n')
            await writer.drain()
        except:
            pass
    finally:
        try:
            writer.close()
            await writer.wait_closed()
        except:
            pass

async def start_server_async(port, buffer_size, cors):
    """Async server that handles multiple connections concurrently"""
    print(f'Starting server on 0.0.0.0:{port}')
    
    server = await asyncio.start_server(
        lambda r, w: handle_client(r, w, cors, buffer_size),
        '0.0.0.0',
        port,
        backlog=10
    )
    
    print('Server started, waiting for connections...')
    
    # Keep the server running
    while True:
        await asyncio.sleep(3600)

def start_server(port, buffer_size, cors):
    """Entry point for the server"""
    try:
        asyncio.run(start_server_async(port, buffer_size, cors))
    except KeyboardInterrupt:
        print('Server stopped')