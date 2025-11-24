import time
from commands import Command
from device import Device
from irda_driver_sony import IRDADriverSony
from utils import enum


class DeviceSonyDVDPlayer(Device):
    AVMode = enum(AV1=((26, 73)))

    def __init__(
        self, sony_irda_driver: IRDADriverSony, avmode: AVMode, description: str
    ):
        self.address = avmode
        self.name = "Sony DVD Player"
        self.description = description
        self.driver = sony_irda_driver

        b20 = IRDADriverSony.SonyBitsSize.SONY_20

        # Main DVD Device Code is 26.73 (Device 26, Extended 73)
        dvd_dev = self.address[0][0]
        dvd_ext = self.address[0][1]

        self.commands = {
            # (command, extended, protocol, address)
            # --- Power & Eject ---
            Command.POWER[0]: (21, dvd_ext, b20, dvd_dev),
            Command.POWER_ON[0]: (46, dvd_ext, b20, dvd_dev),  # Discrete
            Command.POWER_OFF[0]: (47, dvd_ext, b20, dvd_dev),  # Discrete
            Command.OPEN_CLOSE[0]: (22, dvd_ext, b20, dvd_dev),
            # --- Playback Controls ---
            Command.PLAY[0]: (50, dvd_ext, b20, dvd_dev),
            Command.PAUSE[0]: (57, dvd_ext, b20, dvd_dev),  # Standard Pause
            Command.STOP[0]: (56, dvd_ext, b20, dvd_dev),
            Command.REWIND[0]: (51, dvd_ext, b20, dvd_dev),  # Scan Rev
            Command.FAST_FORWARD[0]: (52, dvd_ext, b20, dvd_dev),  # Scan Fwd
            Command.PREV_TRACK[0]: (48, dvd_ext, b20, dvd_dev),  # Previous
            Command.NEXT_TRACK[0]: (49, dvd_ext, b20, dvd_dev),  # Next
            Command.SLOW_REV[0]: (96, dvd_ext, b20, dvd_dev),
            Command.SLOW_FWD[0]: (97, dvd_ext, b20, dvd_dev),
            # --- Advanced Playback ---
            Command.REPLAY[0]: (92, dvd_ext, b20, dvd_dev),  # "Instant Replay"
            Command.STEP_FWD[0]: (
                33,
                dvd_ext,
                b20,
                dvd_dev,
            ),  # "Search/Step Fwd" (Often used for Instant Search/Advance)
            Command.STEP_REV[0]: (32, dvd_ext, b20, dvd_dev),
            Command.REPEAT[0]: (44, dvd_ext, b20, dvd_dev),
            # --- Navigation ---
            Command.TITLE_MENU[0]: (26, dvd_ext, b20, dvd_dev),  # "Title, Top Menu"
            Command.DVD_MENU[0]: (27, dvd_ext, b20, dvd_dev),  # "DVD Menu"
            Command.MENU[0]: (83, dvd_ext, b20, dvd_dev),  # "Menu, Setup, System Menu"
            Command.RETURN[0]: (14, dvd_ext, b20, dvd_dev),
            Command.ENTER[0]: (11, dvd_ext, b20, dvd_dev),  # "Enter (menu select key)"
            Command.UP[0]: (121, dvd_ext, b20, dvd_dev),
            Command.DOWN[0]: (122, dvd_ext, b20, dvd_dev),
            Command.LEFT[0]: (123, dvd_ext, b20, dvd_dev),
            Command.RIGHT[0]: (124, dvd_ext, b20, dvd_dev),
            # --- Digits (Standard Sony: 0->1, 9->0) ---
            Command.DIGIT_1[0]: (0, dvd_ext, b20, dvd_dev),
            Command.DIGIT_2[0]: (1, dvd_ext, b20, dvd_dev),
            Command.DIGIT_3[0]: (2, dvd_ext, b20, dvd_dev),
            Command.DIGIT_4[0]: (3, dvd_ext, b20, dvd_dev),
            Command.DIGIT_5[0]: (4, dvd_ext, b20, dvd_dev),
            Command.DIGIT_6[0]: (5, dvd_ext, b20, dvd_dev),
            Command.DIGIT_7[0]: (6, dvd_ext, b20, dvd_dev),
            Command.DIGIT_8[0]: (7, dvd_ext, b20, dvd_dev),
            Command.DIGIT_9[0]: (8, dvd_ext, b20, dvd_dev),
            Command.DIGIT_0[0]: (9, dvd_ext, b20, dvd_dev),
            Command.CLEAR[0]: (15, dvd_ext, b20, dvd_dev),  # "Clear, -/-, +10"
            # --- Display / OSD / Features ---
            Command.DISPLAY[0]: (84, dvd_ext, b20, dvd_dev),  # "Display, Info"
            Command.TIME_TEXT[0]: (40, dvd_ext, b20, dvd_dev),  # "Time/Text"
            Command.SUBTITLE[0]: (99, dvd_ext, b20, dvd_dev),
            Command.AUDIO_CHANGE[0]: (100, dvd_ext, b20, dvd_dev),  # "Audio"
            Command.ANGLE[0]: (101, dvd_ext, b20, dvd_dev),
            Command.SEARCH_MODE[0]: (75, dvd_ext, b20, dvd_dev),
            Command.INPUT_TV_VIDEO[0]: (
                81,
                dvd_ext,
                b20,
                dvd_dev,
            ),  # "TV/DVD" (Switch output)
            # --- Picture / Sound Hardware Buttons ---
            Command.PICTURE_MODE[0]: (91, dvd_ext, b20, dvd_dev),
            Command.SURROUND_MODE[0]: (90, dvd_ext, b20, dvd_dev),  # "Surround"
        }

        self.commands_annotations = {
            Command.STEP_FWD[0]: "Search / Step Fwd / Instant Search",
            Command.INPUT_TV_VIDEO[0]: "TV / DVD Switch",
            Command.CLEAR[0]: "Clear / -/- / +10",
            Command.MENU[0]: "System Menu / Setup",
            Command.TITLE_MENU[0]: "Top Menu",
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
