import type { ExecutableCommand, V1Commands, V1Devices } from "./data";

export let API_BASE = "";

export function setApiBase(base: string) {
    API_BASE = base;
}

//------------------------------
// Generic GET helper
//------------------------------
export async function getJson(endpoint: string): Promise<any> {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return await res.json();
    } catch (err) {
        console.error(`GET ${endpoint} failed:`, err);
        throw err;
    }
}

//------------------------------
// GET /v1/devices
//------------------------------
export async function fetchDevices(): Promise<V1Devices> {
    return await getJson(`/devices`);
}

//------------------------------
// GET /v1/commands
//------------------------------
export async function fetchCommands(): Promise<V1Commands> {
    return await getJson(`/commands`);
}

//------------------------------
// Binary packet builder
// header = [u8, u8, u8]
// rows   = [[u8, u16], ...]
//------------------------------
export function buildPacket(header: [number, number, number], rows: ExecutableCommand[]) {
    const totalSize = 3 + rows.length * 3;
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);

    let offset = 0;

    // Header: <u8><u8><u8>
    for (let i = 0; i < 3; i++) {
        view.setUint8(offset++, header[i]);
    }

    // Rows: <u8><u16> little-endian
    for (const [byteVal, uint16Val] of rows) {
        view.setUint8(offset++, byteVal);
        view.setUint16(offset, uint16Val, true); // little-endian
        offset += 2;
    }

    return buffer;
}

//------------------------------
// POST /v1/execute  (async, no callbacks)
//------------------------------
export async function sendExecutePacket(header: [number, number, number], rows: ExecutableCommand[]) {
    const packet = buildPacket(header, rows);

    try {
        const res = await fetch(`${API_BASE}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: packet
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        return await res.text(); // fallback
    } catch (err) {
        console.error("POST /execute failed:", err);
        throw err;
    }
}