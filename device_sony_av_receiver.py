import time
from commands import Command
from device import Device
from irda_driver_sony import IRDADriverSony
from utils import enum


class DeviceSonyAVReceiver(Device):
    AVMode = enum(
        AV1=(16, 144, 18),
        AV2=(48, 176, 50),
    )

    def __init__(
        self, sony_irda_driver: IRDADriverSony, avmode: AVMode, description: str
    ):
        self.address = avmode
        self.name = "Sony AV Receiver"
        self.description = description
        self.driver = sony_irda_driver

        b15 = IRDADriverSony.SonyBitsSize.SONY_15

        addr1 = self.address[0][0]
        addr2 = self.address[0][1]
        addr3 = self.address[0][2]

        self.commands = {
            # (command, extended, protocol, address)
            # --- Main Receiver ---
            Command.POWER[0]: (21, 0, b15, addr1),
            Command.POWER_ON[0]: (46, 0, b15, addr1),
            Command.POWER_OFF[0]: (47, 0, b15, addr1),
            Command.VOLUME_UP[0]: (18, 0, b15, addr1),
            Command.VOLUME_DOWN[0]: (19, 0, b15, addr1),
            Command.MUTE[0]: (20, 0, b15, addr1),
            # --- Inputs ---
            Command.INPUT_TUNER[0]: (33, 0, b15, addr1),
            Command.INPUT_CD[0]: (37, 0, b15, addr1),
            Command.INPUT_TAPE[0]: (35, 0, b15, addr1),
            Command.INPUT_VIDEO1[0]: (34, 0, b15, addr1),
            Command.INPUT_VIDEO2[0]: (30, 0, b15, addr1),
            Command.INPUT_DVD[0]: (125, 0, b15, addr1),
            # --- Navigation / Menu  ---
            Command.MENU[0]: (119, 0, b15, addr2),
            Command.ENTER[0]: (12, 0, b15, addr1),
            Command.DIMMER[0]: (77, 0, b15, addr1),
            Command.DISPLAY[0]: (75, 0, b15, addr1),
            Command.UP[0]:(122, 0, b15, addr2),
            Command.DOWN[0]:(123, 0, b15, addr2),
            Command.LEFT[0]:(120, 0, b15, addr2),
            Command.RIGHT[0]:(121, 0, b15, addr2),
            # --- EQ  ---
            Command.TEST_TONE[0]: (74, 0, b15, addr3),
            # --- DSP Sound Fields ---
            Command.MODE_CINEMA[0]: (38, 0, b15, addr2),
            Command.MODE_MUSIC[0]: (73, 0, b15, addr2),
            Command.MODE_AFD[0]: (71, 0, b15, addr2),
            Command.MODE_2CH[0]: (65, 0, b15, addr2),
            Command.INPUT_MODE_CHANGE[0]: (48, 0, b15, addr2),
        }

        self.commands_annotations = {
            Command.MODE_AFD[0]: "A.F.D. (Auto Format Direct)",
            Command.MODE_CINEMA[0]: "Cinema Studio EX",
            Command.UP[0]: "Menu +",
            Command.DOWN[0]: "Menu -",
            Command.LEFT[0]: "Menu <",
            Command.RIGHT[0]: "Menu >",
        }

    def get_commands(self):
        return self.commands.keys()

    def get_commands_annotations(self):
        return self.commands_annotations

    def execute(self, command: Command):
        # Sony requires 3 repeats
        cmd = self.commands[command[0]]
        for _ in range(3):
            self.driver.transmit(cmd[3], cmd[0], cmd[2], cmd[1])
            time.sleep_ms(45)


    def get_name(self):
        return self.name

    def get_description(self):
        return self.description
