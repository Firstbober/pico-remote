from commands import Command
from device import Device
from machine import Pin


class DeviceSwitch(Device):
    def __init__(
        self, pin: int, description: str
    ):
        self.pin = Pin(pin, Pin.OUT, value=0)
        self.name = "Switch"
        self.description = description

        self.commands = {
            Command.POWER[0]: 0,
            Command.POWER_ON[0]: 1,
            Command.POWER_OFF[0]: 2
        }

        self.commands_annotations = {
        }

    def get_commands(self):
        return self.commands.keys()

    def get_commands_annotations(self):
        return self.commands_annotations

    def execute(self, command: Command):
        if command[0] == Command.POWER[0]:
            self.pin.toggle()
        elif command[0] == Command.POWER_ON[0]:
            self.pin.high()
        elif command[0] == Command.POWER_OFF[0]:
            self.pin.low()

    def get_name(self):
        return self.name

    def get_description(self):
        return self.description
