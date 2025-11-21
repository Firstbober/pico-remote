from array import array
from machine import Pin

from ir_tx import IR, RP2
from utils import enum

"""
We can't use SONY_ABC or any bits variant, because it is apprently impossible
to run mulitple protocols on one pin. Here is a version which patches upstream
`transmit` method to include protocol bits size.
"""


class IRDADriverSony(IR):
    SonyBitsSize = enum(
        SONY_12=(12, (0x1F, 0x7F, 0)),
        SONY_15=(15, (0xFF, 0x7F, 0)),
        SONY_20=(20, (0x1F, 0x7F, 0xFF)),
    )

    def __init__(self, pin: int, verbose: bool):
        # Sony specifies 40KHz, we are using SONY_12 here for the base buffer.
        self.current_bits_size = self.SonyBitsSize.SONY_12
        super().__init__(
            Pin(pin, Pin.OUT, value=0),
            40000,
            3 + self.current_bits_size[0][0] * 2,
            30,
            verbose,
        )
        valid = self.current_bits_size[0][1]

        # We want to store data arrays ahead of time for faster sending, although
        # we will use slightly more memory.
        self.data_stores = {}
        for key, val in self.SonyBitsSize.items.items():
            asize = 3 + val[0] * 2
            if RP2:  # PIO-based RMT-like device
                asize += 1  # Allow for possible extra space pulse

            _arr = array("H", (0 for _ in range(asize)))  # on/off times (μs)
            self.data_stores[key] = _arr

    def tx(self, addr, data, ext):
        self.append(2400, 600)
        bits = self.current_bits_size[0][0]
        v = data & 0x7F
        if bits == 12:
            v |= (addr & 0x1F) << 7
        elif bits == 15:
            v |= (addr & 0xFF) << 7
        else:
            v |= (addr & 0x1F) << 7
            v |= (ext & 0xFF) << 12
        for _ in range(bits):
            self.append(1200 if v & 1 else 600, 600)
            v >>= 1

    def transmit(self, addr, data, bits: SonyBitsSize, toggle=0, validate=False):
        # In case we change bits, we need to update our data array
        if bits != self.current_bits_size:
            self.current_bits_size = bits
            valid = self.current_bits_size[0][1]

            self._arr = self.data_stores[self.current_bits_size[1]]
            self._mva = memoryview(self._arr)

        return super().transmit(addr, data, toggle, validate)
