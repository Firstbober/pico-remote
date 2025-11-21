import json
import struct

from commands import Command
from http import connect_to_wifi, start_server, add_endpoint

from config import CORS, DEVICES, HTTP_BUFFER_SIZE, PASSWORD, PORT, SSID

devices_info = []
for device in DEVICES:
    devices_info.append(
        {
            "name": device.get_name(),
            "description": device.get_description(),
            "commands": list(device.get_commands()),
            "annotations": device.get_commands_annotations(),
        }
    )

connect_to_wifi(SSID, PASSWORD)


def v1_commands(url, res, _):
    res("200 OK", json.dumps(Command.items))


add_endpoint("/v1/commands", handler=v1_commands, get=True)


def v1_devices(url, res, _):
    res("200 OK", json.dumps(devices_info))


add_endpoint("/v1/devices", handler=v1_devices, get=True)


def v1_execute(url, res, raw_request):
    chunk = raw_request.rpartition(b"\r\n")[-1]
    data = chunk

    # parse header
    header_fmt = "<BBB"
    pos = 0
    h1, h2, h3 = struct.unpack_from(header_fmt, data, pos)
    pos += struct.calcsize(header_fmt)

    if h1 != 69 and h2 != 42 and h3 != 213:
        res("400 Bad Request", "")
        return

    # parse rows
    row_fmt = "<BH"
    row_size = struct.calcsize(row_fmt)
    rows = []

    while pos + row_size <= len(data):
        b, val = struct.unpack_from(row_fmt, data, pos)
        rows.append((b, val))
        pos += row_size

    for row in rows:
        if len(DEVICES) < row[0]:
            res("400 Bad Request", "")
            return
        DEVICES[row[0]].execute((row[1], ""))

    res("200 OK", "")


add_endpoint("/v1/execute", handler=v1_execute, post=True)

start_server(port=PORT, buffer_size=HTTP_BUFFER_SIZE, cors=CORS)
