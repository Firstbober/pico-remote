# Web App Guide

This guide covers most of the you need to know about using and customizing the Pico Remote web interface.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installing as PWA](#installing-as-pwa)
3. [Interface Overview](#interface-overview)
4. [Customizing Your Remote](#customizing-your-remote)
5. [Advanced Features](#advanced-features)

## Getting Started

### Accessing & Setting Up the Web App

Once your Pico is connected to your WiFi network, you can access the web interface:

1. Find your Pico's IP address from the serial console or your router's admin panel
2. Open a web browser on any device connected to the same network
3. Navigate to `https://firstbober.github.io/pico-remote`
   
The web interface will load and you'll be prompted for IP address of your pico.

After entering the address, you are ready to go. Scroll to the bottom and use `Edit` button to add controls.

## Installing as PWA

Progressive Web App installation allows you to use Pico Remote like a native app, with offline support and quick access.

### On Mobile (iOS)

**Safari**:
1. Tap the **Share** button (square with arrow pointing up)
2. Scroll down and tap **Add to Home Screen**
3. Name it "Pico Remote" (or your preference)
4. Tap **Add**

The app icon will appear on your home screen.

### On Mobile (Android)

**Chrome**:
1. Tap the **three-dot menu** in the top right
2. Select **Add to Home Screen** or **Install app**
3. Confirm the installation

Alternatively, a banner may appear automatically prompting you to install.

## Interface Overview

The web interface is extremely simple composing of:
- Grid area (which will be empty at the start)
- Edit button (on the bottom of the page)
- Edit drawer (which will show itself after clicking edit button)

## Customizing Your Remote

When in edit mode, a bottom sheet appears with tabs:

#### Elements Tab
- **Commands**: Add individual command buttons
  - Device selector (e.g., "Sony DVD Player | Salon"; Here you can also find "Macros" device which is used to select previously defined macros)
  - Command selector (e.g., "Pause", "Play", "Stop")
  - Color picker for tile background
  - Icon selector for visual identification
- **Spacers**: Add empty tiles for layout organization
- **Presets**: Quick add predefined layouts

### Adding Tiles

1. In edit mode, select "Elements" tab and subsequently "Commands" tab.
2. Select your device.
3. Select your command.
4. Set color.
5. Optionally, change the icon from the default one
6. Click "Add" button. It might be hidden, so scroll to the bottom of the page, and it should show itself.
7. The button will show itself as a tile on the grid on the top of the page. You can drag and resize it.

### Removing Tiles

1. Enter edit mode
2. Tap the trash icon
3. Click tiles you want to remove
4. Tap on the trash icon again to exit

### Rearranging Tiles

1. Enter edit mode
2. Press and hold a tile
3. Drag it to the desired position
4. Release to place

The grid will automatically reflow other tiles.

## Advanced features

### Macros

You can chain multiple commands across different devices using Macros.

### Adding a Macro

1. Enter edit mode
2. Go to "Macros" tab
3. Click "+" on the top near dropdown and enter name for your macro

### Editing a Macro

1. Select macro from the dropdown
2. On the bottom you'll see device select, and command select
3. Select the device and command
4. Click "+" on the bottom of the editor, near command name

You can add multiple commands, and drag them around

### Removing a Macro

1. Select macro from the dropdown
2. Click "trash" icon

### Using Macro as a Tile

1. Enter edit mode
2. Go to "Elements" tab
3. Go to "Commands" tab
4. Select "Macros" as a device
5. Select macro from the commands
6. ...
7. Profit

### Backup and Restore

**Export Configuration**:
1. Click on the edit button
2. In "Elements" tab, click "Advanced" tab
3. Click export data
4. Download your JSON config file

**Import Configuration**:
1. Click on the edit button
2. In "Elements" tab, click "Advanced" tab
3. Tap import data
4. Select JSON file with desired configuration

This preserves your entire layout, macros and settings.

### Clearing data

**Clear all data**
1. Click on the edit button
2. In "Elements" tab, click "Advanced" tab
3. Click "Clear all data". This action is irreversible
4. The page will refresh and prompt you for the IP


**Clear API data**
1. Click on the edit button
2. In "Elements" tab, click "Advanced" tab
3. Click "Change API IP/domain".
4. The page will refresh and prompt you for the IP
5. Your layour, macros etc. will be there working under new IP.