from device_sony_dvd_player import DeviceSonyDVDPlayer
from irda_driver_sony import IRDADriverSony
from device_sony_av_receiver import DeviceSonyAVReceiver

# --- CONFIG ---
SSID = ""
PASSWORD = ""
PORT = 80
HTTP_BUFFER_SIZE = 4096
CORS = "*"  # Change or leave it depending on your security model
# --- CONFIG ---

# --- DEVICES ---
"""
Perform necessary initialization and device setup here.
You might have multiple devices, create them here.
In case of issues, go to README.md
"""

sony_irda_driver = IRDADriverSony(17, False)

DEVICES = [
    DeviceSonyAVReceiver(sony_irda_driver, DeviceSonyAVReceiver.AVMode.AV2, "Salon"),
    DeviceSonyDVDPlayer(sony_irda_driver, DeviceSonyDVDPlayer.AVMode.AV1, "Salon"),
]
# --- DEVICES ---
