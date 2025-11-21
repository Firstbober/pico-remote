import re
import sys

def reverse_bits(n, bits):
    """Reverses the bits of an integer of size 'bits'"""
    result = 0
    for i in range(bits):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result

def parse_lirc_file(filename):
    remotes = []
    current_remote = None
    
    with open(filename, 'r') as f:
        lines = f.readlines()

    for line in lines:
        line = line.strip()
        # Skip comments
        if line.startswith("#"):
            continue
            
        parts = line.split()
        if not parts:
            continue

        if parts[0] == "begin" and len(parts) > 1 and parts[1] == "remote":
            current_remote = {
                "name": "Unknown",
                "bits": 0,
                "post_data": 0,
                "post_data_bits": 0,
                "pre_data": 0, 
                "pre_data_bits": 0,
                "codes": []
            }
        elif parts[0] == "end" and len(parts) > 1 and parts[1] == "remote":
            if current_remote:
                remotes.append(current_remote)
            current_remote = None
        elif current_remote is not None:
            if parts[0] == "name":
                current_remote["name"] = parts[1]
            elif parts[0] == "bits":
                current_remote["bits"] = int(parts[1])
            elif parts[0] == "post_data":
                current_remote["post_data"] = int(parts[1], 16)
            elif parts[0] == "post_data_bits":
                current_remote["post_data_bits"] = int(parts[1])
            elif parts[0] == "pre_data":
                current_remote["pre_data"] = int(parts[1], 16)
            elif parts[0] == "pre_data_bits":
                current_remote["pre_data_bits"] = int(parts[1])
            elif parts[0] == "begin" and parts[1] == "codes":
                current_remote["in_codes"] = True
            elif parts[0] == "end" and parts[1] == "codes":
                current_remote["in_codes"] = False
            elif current_remote.get("in_codes"):
                # Parse Code Line
                code_name = parts[0]
                code_hex = parts[1]
                try:
                    val = int(code_hex, 16)
                    current_remote["codes"].append((code_name, val))
                except ValueError:
                    pass

    return remotes

def decode_sirc(val, bits, pre_data, pre_bits, post_data, post_bits):
    # 1. Reconstruct the full bitstream from LIRC parts
    full_val = 0
    total_bits = bits + pre_bits + post_bits
    
    # LIRC Construction: Pre(High) + Code(Mid) + Post(Low)
    if pre_bits > 0:
        full_val = (pre_data << (bits + post_bits))
    
    if post_bits > 0:
        full_val |= (val << post_bits)
    else:
        full_val |= val
        
    if post_bits > 0:
        full_val |= post_data
        
    # 2. Check for "Raw Capture" format (Bit-Reversal)
    # LIRC hex often represents the stream time-order (First bit = MSB).
    # Sony SIRC transmits LSB first.
    # If we decode standard 12/15/20 bit codes without "post_data" tricks,
    # we usually need to reverse the bits to get Cmd|Addr|Ext.
    
    # If the file used "post_data" (like the Receiver one), it was likely manually aligned.
    # If it's a raw dump (like the DVD one with 20 bits), it needs reversal.
    
    if post_bits == 0 and pre_bits == 0:
        full_val = reverse_bits(full_val, total_bits)

    # 3. Extract SIRC Fields
    # Format: [Ext (8)] [Addr (5 or 8 or 13)] [Cmd (7)]
    
    cmd = full_val & 0x7F
    addr = (full_val >> 7) & 0x1F # Standard 5-bit address extraction
    
    # Extended bits (only for SIRC-20)
    ext = 0
    if total_bits >= 20:
        ext = (full_val >> 12) & 0xFF
        
    # Protocol Detection
    if total_bits <= 12:
        proto = 12
    elif total_bits <= 15:
        proto = 15
    else:
        proto = 20
        
    return proto, addr, cmd, ext

def main():
    filename = sys.argv[1] 
    
    try:
        remotes = parse_lirc_file(filename)
    except FileNotFoundError:
        print(f"File {filename} not found. Please upload or change path.")
        return

    print("Remote_Name,Button_Name,Protocol,Address,Command,Extended,Hex_Code")
    
    for r in remotes:
        for name, code in r["codes"]:
            proto, addr, cmd, ext = decode_sirc(
                code, r["bits"], 
                r["pre_data"], r["pre_data_bits"], 
                r["post_data"], r["post_data_bits"]
            )
            print(f"{r['name']},{name},SIRC-{proto},{addr},{cmd},{ext},0x{cmd:02X}")

if __name__ == "__main__":
    main()