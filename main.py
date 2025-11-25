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


add_endpoint(b"/v1/commands", handler=v1_commands, get=True)


def v1_devices(url, res, _):
    res("200 OK", json.dumps(devices_info))


add_endpoint(b"/v1/devices", handler=v1_devices, get=True)


def v1_execute(url, res, raw_request):
    try:
        body_start = raw_request.find(b"\r\n\r\n")
        if body_start == -1:
            res("400 Bad Request", "")
            return

        data = raw_request[body_start + 4 :]

        if len(data) < 3:
            res("400 Bad Request", "")
            return

        if data[0] != 69 or data[1] != 42 or data[2] != 213:
            res("400 Bad Request", "")
            return

        pos = 3
        row_size = 3
        data_len = len(data)
        device_count = len(DEVICES)

        # Batch commands for same device
        commands = {}

        while pos + row_size <= data_len:
            device_id = data[pos]
            value = data[pos + 1] | (data[pos + 2] << 8)

            if device_id >= device_count:
                res("400 Bad Request", "")
                return

            if device_id not in commands:
                commands[device_id] = []
            commands[device_id].append(value)

            pos += row_size

        # Execute in batches (if your device supports it)
        for device_id, values in commands.items():
            for value in values:
                DEVICES[device_id].execute((value, ""))

    except Exception as e:
        print("Execute error:", e)
        res("500 Internal Server Error", "")
        return

    res("200 OK", "")


add_endpoint(b"/v1/execute", handler=v1_execute, post=True)

start_server(port=PORT, buffer_size=HTTP_BUFFER_SIZE, cors=CORS)
