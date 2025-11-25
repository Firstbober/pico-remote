# MicroPython Backend Setup Guide

This guide will walk you through setting up the Raspberry Pi Pico as an IR remote control server.

## Table of Contents

- [MicroPython Backend Setup Guide](#micropython-backend-setup-guide)
  - [Table of Contents](#table-of-contents)
  - [Hardware Requirements](#hardware-requirements)
    - [Essential Components](#essential-components)
  - [Circuit Assembly](#circuit-assembly)
  - [MicroPython Installation](#micropython-installation)
  - [Server Configuration](#server-configuration)
    - [Configuration File: `config.py`](#configuration-file-configpy)
  - [Uploading Code to Pico](#uploading-code-to-pico)
  - [API Reference](#api-reference)
    - [Get all commands](#get-all-commands)
    - [Get all devices with their supported commands](#get-all-devices-with-their-supported-commands)
    - [Execute list of commands](#execute-list-of-commands)

## Hardware Requirements

### Essential Components
- **Raspberry Pi Pico W** (recommended) or Raspberry Pi Pico with WiFi module
- **IR LED or smth** (optional if you want to use GPIO) - 940nm wavelength. I am using Iduino ST1087 as it has everything to make a powerful beam 
- **Breadboard** (for prototyping) or PCB (for permanent installation)
- **Jumper wires**
- **Micro USB cable** (for programming and power)
- **5V power supply** (USB adapter or power bank)

## Circuit Assembly

Just connect everything together if you are using Iduino or something similar. Otherwise google how to properly connect IR diode with transistor to get best possible output.

## MicroPython Installation

Follow official instruction on [official MicroPython downloads page](https://micropython.org/download/rp2-pico-w/) for RPi Pico W. If you don't have a built-in WIFI module, use standard firmware.

## Server Configuration

### Configuration File: `config.py`

Create a `config.py` based on `config.example.py` and fill out all settings (SSID, PASSWORD).
At this point you can also change the array of devices to fit your needs.

## Uploading Code to Pico

Run following commands to upload and install everything:

- `pipx run mpremote mip install "github:peterhinch/micropython_ir/ir_tx"`
- `pipx run mpremote cp main.py utils.py irda_driver_sony.py http.py device.py device_sony_av_receiver.py device_sony_dvd_player.py config.py commands.py :.`

Unplug and plug your RPi again, it should now be trying to connect to the network. Check your router for rpi address. Configuring your networking hardware to assign static IP for rpi won't be covered here.

## API Reference

The server exposes a simple REST API:

### Get all commands

```
GET /v1/commands
Content-Type: application/json
```

**Response**: `200 OK` with JSON object with keys as command names, and values as IDs

### Get all devices with their supported commands

```
GET /v1/devices
Content-Type: application/json
```

**Response**: `200 OK` with JSON array similar to this one: 
```
[
    {
        "name": string,
        "description": string,
        "commands": [0, 1, ...],
        "annotations": {
            0: "Power Down only FM",
            ...
        },
    }
]
```

### Execute list of commands

```
POST /v1/execute
Content-Type: application/octet-stream

<binary data>
```

Binary data should be in format:
```
u8, u8, u8 (header, [69, 42, 213])
u8, u16 (command, [device, command id])
u8, u16
u8, u16
...
```

One execute endpoint can evaluate multiple commands with different devices to reduce HTTP overhead and allow for macros such as powering on multiple devices at the same time.

**Response**: `200 OK`