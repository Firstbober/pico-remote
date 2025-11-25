# Pico Remote

Customizable infrared (and more) remote control system built on the Raspberry Pi Pico running MicroPython. Control your devices from anywhere on your local network using a web interface or REST API.

Warning: Support for other devices than Sony one's (and even that is basic) is to be implemented. This projects was made
because I didn't had physical remotes for my AV receiver and DVD player, so they are first class devices in this project.
Other devices might be supported if you contribute.

## Overview

Pico Remote turns your Raspberry Pi Pico into a remote control hub. It runs a simple HTTP 1.1 web server on the Pico that receives commands and executes them via IR or different interface on selected device. The web app provides a customizable tiling interface that you can access from any device on your network.

## Features

### Pico Remote Server
- **IRDA support** - Control IR devices from Sony, NEC etc. (currently only some Sony devices)
- **Multiple devices** - The server is made in a way that allows for multiple different devices to be controlled from one pico

### Web Interface
- **Progressive Web App** - Install on any device, works like a native app (works offline)
- **Customizable tiling layout** - Arrange controls exactly how you want them

## Quick Start

1. **Set up the hardware**: Connect an IR LED to your Raspberry Pi Pico and flash MicroPython
2. **Deploy the server**: Upload the configured server code to your Pico 
3. **Access the web app**: Open the web interface in your browser and start controlling your devices

## Documentation

### [RPi Pico Backend Setup](MICROPYTHON_SETUP.md)
Complete guide to setting up the Pico Remote backend on Raspberry Pi Pico.

### [Web App Guide](WEB_APP_GUIDE.md)
Pretty much everything you need to know about the web interface.

## Requirements

- Raspberry Pi Pico with WIFI
- IR LED (940nm recommended, optional if you want to use GPIO)
- WiFi network
- Modern web browser

## TODO 

- [ ] **Web UI fixes** - The add button overflows on some screen which is annoying
- [ ] **Handle different devices when chaning API** - Right now after changing the API, the device order will be the same which might cause issues. We should prompt user to select the devices again.
- [ ] **Power management** -  I am using my pico from wall, but it would be useful to reduce energy usage on battery
- [ ] **Better device support** - Currently classes `DeviceSonyAVReceiver` and `DeviceSonyDVDPlayer` are basically equivalent to what my hardware supports (STR-DE495 and DVP-NS330), for larger and better support a better way needs to be found
- [ ] **Async HTTP server** - Current web server is fully synchronous, and the requests may not go through sometimes, not a large issue but definitely good QOL one

## Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements, feel free to open an issue or submit a pull request.

## License

This project is open source and available under the AGPLv3 License.