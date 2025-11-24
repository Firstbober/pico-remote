import type { Preset, V1Commands, V1Devices } from "./data";

const LS_API_BASE = 'com.firstbober.pico-remote.api-base';
const LS_PRESETS = 'com.firstbober.pico-remote.presets';
const LS_V1_COMMANDS = 'com.firstbober.pico-remote.v1.commands';
const LS_V1_DEVICES = 'com.firstbober.pico-remote.v1.devices';

export function getApiBaseFromStorage(): string | null {
    try {
        return localStorage.getItem(LS_API_BASE)
    } catch (error) { }

    return null;
}

export function saveApiBaseToStorage(base: string) {
    try {
        localStorage.setItem(LS_API_BASE, base);
    } catch (error) {

    }
}

export function getPresetsFromStorage(): Preset[] {
    try {
        const data = localStorage.getItem(LS_PRESETS);
        if (data == null) return []

        const presets: Preset[] = []
        for (const name of JSON.parse(data)) {
            const json = localStorage.getItem(`${LS_PRESETS}.${name}`);
            if (json == null) continue

            presets.push(JSON.parse(json))
        }

        return presets
    } catch (error) {

    }

    return []
}

export function savePresetToStorage(preset: Preset) {
    const json_presets_names = localStorage.getItem(LS_PRESETS);

    let presets_names: string[] = []

    if (json_presets_names != null) {
        presets_names = JSON.parse(json_presets_names);
    }

    if (!presets_names.includes(preset.name)) {
        presets_names.push(preset.name);
        localStorage.setItem(LS_PRESETS, JSON.stringify(presets_names));
    }

    localStorage.setItem(`${LS_PRESETS}.${preset.name}`, JSON.stringify(preset));
}

export function removePresetFromStorage(name: string) {
    const presets_names: string[] = JSON.parse(localStorage.getItem(LS_PRESETS)!)
    presets_names.splice(presets_names.indexOf(name), 1);

    localStorage.setItem(LS_PRESETS, JSON.stringify(presets_names));
    localStorage.removeItem(`${LS_PRESETS}.${name}`);
}

export function getCommandsFromStorage(): V1Commands | null {
    try {
        const data = localStorage.getItem(LS_V1_COMMANDS);
        if (data == null) return null
        return JSON.parse(data);
    } catch (error) { }

    return null;
}

export function saveCommandsToStorage(commands: V1Commands) {
    try {
        localStorage.setItem(LS_V1_COMMANDS, JSON.stringify(commands));
    } catch (error) {

    }
}

export function getDevicesFromStorage(): V1Devices | null {
    try {
        const data = localStorage.getItem(LS_V1_DEVICES)
        if (data == null) return null
        return JSON.parse(data)
    } catch (error) { }

    return null;
}

export function saveDevicesToStorage(devices: V1Devices) {
    try {
        localStorage.setItem(LS_V1_DEVICES, JSON.stringify(devices));
    } catch (error) {

    }
}

export function clearAllData() {
    localStorage.removeItem(LS_API_BASE);
    localStorage.removeItem(LS_PRESETS);
    localStorage.removeItem(LS_V1_COMMANDS);
    localStorage.removeItem(LS_V1_DEVICES);
}

export function clearApiBase() {
    localStorage.removeItem(LS_API_BASE);
    localStorage.removeItem(LS_V1_COMMANDS);
    localStorage.removeItem(LS_V1_DEVICES);
}

export function importStorageFromString() { }

export function exportStorageToStorage() { }