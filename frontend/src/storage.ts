import type { Preset, V1Commands, V1Devices } from "./data";

export function getApiBaseFromStorage(): string | null {
    try {
        return localStorage.getItem('com.firstbober.pico-remote.api-base')
    } catch (error) { }

    return null;
}

export function saveApiBaseToStorage(base: string) {
    try {
        localStorage.setItem('com.firstbober.pico-remote.api-base', base);
    } catch (error) {

    }
}

export function getPresetsFromStorage(): Preset[] {
    try {
        const data = localStorage.getItem('com.firstbober.pico-remote.presets');
        if (data == null) return []

        const presets: Preset[] = []
        for (const name of JSON.parse(data)) {
            const json = localStorage.getItem(`com.firstbober.pico-remote.presets.${name}`);
            if (json == null) continue

            presets.push(JSON.parse(json))
        }

        return presets
    } catch (error) {

    }

    return []
}

export function savePresetToStorage(preset: Preset) {
    const json_presets_names = localStorage.getItem('com.firstbober.pico-remote.presets');

    let presets_names: string[] = []

    if (json_presets_names != null) {
        presets_names = JSON.parse(json_presets_names);
    }

    if (!presets_names.includes(preset.name)) {
        presets_names.push(preset.name);
        localStorage.setItem('com.firstbober.pico-remote.presets', JSON.stringify(presets_names));
    }

    localStorage.setItem(`com.firstbober.pico-remote.presets.${preset.name}`, JSON.stringify(preset));
}

export function removePresetFromStorage(name: string) {
    const presets_names: string[] = JSON.parse(localStorage.getItem('com.firstbober.pico-remote.presets')!)
    presets_names.splice(presets_names.indexOf(name), 1);

    localStorage.setItem('com.firstbober.pico-remote.presets', JSON.stringify(presets_names));
    localStorage.removeItem(`com.firstbober.pico-remote.presets.${name}`);
}

export function getCommandsFromStorage(): V1Commands | null {
    try {
        const data = localStorage.getItem('com.firstbober.pico-remote.v1.commands');
        if (data == null) return null
        return JSON.parse(data);
    } catch (error) { }

    return null;
}

export function saveCommandsToStorage(commands: V1Commands) {
    try {
        localStorage.setItem('com.firstbober.pico-remote.v1.commands', JSON.stringify(commands));
    } catch (error) {

    }
}

export function getDevicesFromStorage(): V1Devices | null {
    try {
        const data = localStorage.getItem('com.firstbober.pico-remote.v1.devices')
        if (data == null) return null
        return JSON.parse(data)
    } catch (error) { }

    return null;
}

export function saveDevicesToStorage(devices: V1Devices) {
    try {
        localStorage.setItem('com.firstbober.pico-remote.v1.devices', JSON.stringify(devices));
    } catch (error) {

    }
}