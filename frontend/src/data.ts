import type { GridStack } from "gridstack";
import { getPresetsFromStorage, removePresetFromStorage, savePresetToStorage } from "./storage";

export interface V1Device {
    annotations: { [command: number]: string },
    commands: number[],
    name: string,
    description: string
}

export type V1Devices = V1Device[];
export type V1Commands = { [id: string]: number };

export type ExecutableCommand = [device: number, commandId: number];

export interface Macro {
    name?: string,
    commands: ExecutableCommand[]
}

export enum ButtonColor {
    White,
    Red,
    Yellow,
    Blue,
    Green,
    Orange,
}

export interface Button {
    icon: string;
    tooltip: string;
    bind: number;
    spacer: boolean;
    color: ButtonColor;
}

export interface GridItem {
    content: Button,
    w?: number,
    h?: number,
    x?: number,
    y?: number,
    minW?: number,
    minH?: number,
    noResize?: boolean
}
export type Binds = { [id: number]: Macro };

export interface Preset {
    name: string,
    gridItems: GridItem[],
    binds: Binds,
    bindCounter: number
}

let currentPreset: Preset = {} as Preset;
let presets: Preset[] = []

export function loadPresets() {
    presets = getPresetsFromStorage()
    if(presets.length == 0) {
        presets.push({
            name: 'Default',
            bindCounter: 0,
            binds: {},
            gridItems: []
        })
    }
    currentPreset = presets[0]
}

export function getKeyByValue(object: any, value: any): any {
    return Object.keys(object).find(key => object[key] === value);
}

export function addButton(button: Button, grid: GridStack) {
    grid.addWidget({
        content: JSON.stringify(button),
    })
    savePresetToStorage(currentPreset);
}

export function getCommandBind(device: number, command: number): number {
    for (const [key, bind] of Object.entries(currentPreset.binds)) {
        if (bind.commands.length == 1 && bind.commands[0][0] == device && bind.commands[0][1] == command) {
            return Number(key);
        }
    }

    let id = Number(currentPreset.bindCounter)
    currentPreset.binds[id] = {
        commands: [[device, command]]
    };


    currentPreset.bindCounter++;
    savePresetToStorage(currentPreset)

    return id;
}

export function createMacro(name: string): number {
    const bind = getCommandBind(0, 0)
    currentPreset.binds[bind].name = name;
    currentPreset.binds[bind].commands = [];

    savePresetToStorage(currentPreset)
    return bind;
}

export function getMacroByName(name: string): Macro {
    return Object.values(currentPreset.binds).filter((v) => v.name == name)[0];
}

export function getMacros(): Binds {
    const b: Binds = {};
    for(const bind of Object.entries(currentPreset.binds)) {
        if(!bind[1].name) continue;
        b[Number(bind[0])] = bind[1];
    }
    return b;
}

export function removeMacro(id: number) {
    delete currentPreset.binds[id];
    savePresetToStorage(currentPreset)
}

export function setPreset(name: string) {
    currentPreset = getPresetByName(name)!;
}

export function setCurrentPreset(name: string) {
    currentPreset = getPresetByName(name)!;
}

export function getCurrentPreset(): Preset {
    return currentPreset;
}

export function updatePreset(grid: GridStack) {
    currentPreset.gridItems = grid.getGridItems().map(item => {
        const node = item.gridstackNode!;
        return {
            content: JSON.parse(node.content!),
            w: node.w,
            h: node.h,
            x: node.x,
            y: node.y,
            minW: node.minW,
            minH: node.minH,
            noResize: node.noResize
        }
    });
    savePresetToStorage(currentPreset)
}

export function getPresetNames(): string[] {
    return presets.map(p => p.name);
}

export function getPresetByName(name: string): Preset | undefined {
    for (const preset of presets) {
        if (preset.name != name) continue
        return preset;
    }

    return undefined;
}

export function addPreset(name: string): boolean {
    if (getPresetByName(name) != undefined) return false;
    presets.push({
        name,
        bindCounter: 0,
        binds: {},
        gridItems: []
    });
    savePresetToStorage(getPresetByName(name)!);
    return true;
}

export function removePreset(name: string) {
    var index = presets.indexOf(getPresetByName(name)!);
    if (index !== -1) {
        presets.splice(index, 1);
    }

    if (currentPreset.name == name) {
        currentPreset = presets[0];
    }
    removePresetFromStorage(name);
}

export function importPresetIntoGrid(grid: GridStack, preset: Preset, useOffset: boolean = false) {
    grid.load(preset.gridItems.map((item) => {
        const content: Button = JSON.parse(JSON.stringify(item.content));

        return {
            content: JSON.stringify(content),
            w: item.w,
            h: item.h,
            x: item.x,
            y: useOffset ? item.y! + grid.getRow() : item.y,
            minW: item.minW,
            minH: item.minH,
            noResize: item.noResize
        }
    }))
}

export function commandToPretty(device: V1Device, command: number, commands: V1Commands) {
    return device.annotations[command] != undefined ?
        device.annotations[command] :
        getKeyByValue(commands, command).split("_").map((v: string) => {
            return v[0] + v.slice(1).toLocaleLowerCase();
        }).join(" ");
}

export function searchForBlacklistedCharacters(name: string) {
    const blacklist = ['\'', ';', '{', '}', '"', '`', ',', '<', '>', '\\', '\n', '\t', '\r'];
    let errorMessage = ``;

    for (const blocked of blacklist) {
        if (name.includes(blocked)) {
            errorMessage += `Found '${blocked}' in '${name}', which is not allowed.\n`;
        }
    }
    return errorMessage;
}