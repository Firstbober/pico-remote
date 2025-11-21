import type { GridStack } from "gridstack";

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
const presets: Preset[] = []

export function loadPresets() {
    const preset: Preset = {
        name: 'default',
        gridItems: [],
        binds: {
            0: {
                name: 'my_macro',
                commands: []
            }
        },
        bindCounter: 0
    };

    currentPreset = preset;
    presets.push(preset);
}

export function getKeyByValue(object: any, value: any): any {
    return Object.keys(object).find(key => object[key] === value);
}

export const SupportedIcons = [
    'material-symbols-light:power-settings-new',
    'material-symbols-light:volume-up-outline',
    'material-symbols-light:volume-down-outline',
    'material-symbols-light:arrow-left-alt',
    'material-symbols-light:arrow-right-alt',
    'material-symbols-light:menu',
    'cbi:dvd',
];

export function addButton(button: Button, grid: GridStack) {
    grid.addWidget({
        content: JSON.stringify(button)
    })
}

// export function addMacroBind()

export function getCommandBind(device: number, command: number): number {
    for (const [key, bind] of Object.entries(currentPreset.binds)) {
        if (bind.commands.length == 1 && bind.commands[0][0] == device && bind.commands[0][1] == command) {
            return Number(key);
        }
    }

    currentPreset.binds[currentPreset.bindCounter] = {
        commands: [[device, command]]
    };
    return currentPreset.bindCounter++;
}

export function getMacros(): Binds {
    return Object.values(currentPreset.binds).filter((v) => v.name);
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
}

export function importPresetIntoGrid(grid: GridStack, preset: Preset) {
    grid.load(preset.gridItems.map((item) => {
        const content: Button = JSON.parse(JSON.stringify(item.content));
        if (getCurrentPreset().binds[content.bind] != undefined) {
            content.bind = getCurrentPreset().bindCounter++;
        }
        getCurrentPreset().binds[content.bind] = getCurrentPreset().binds[content.bind]

        return {
            content: JSON.stringify(content),
            w: item.w,
            h: item.h,
            x: item.x,
            y: item.y ? item.y + grid.getRow() : item.y,
            minW: item.minW,
            minH: item.minH,
            noResize: item.noResize
        }
    }))
}

export const v1_devices_json: V1Devices = JSON.parse(`[{"annotations": {"64": "Menu >", "61": "Menu +", "62": "Menu -", "219": "Cinema Studio EX", "63": "Menu <", "221": "A.F.D. (Auto Format Direct)"}, "commands": [224, 1, 2, 3, 30, 31, 32, 6, 60, 5, 61, 62, 63, 65, 64, 33, 120, 121, 219, 123, 124, 220, 126, 127, 221, 211], "name": "Sony AV Receiver", "description": "Salon"}, {"annotations": {"324": "Clear / -/- / +10", "321": "Search / Step Fwd / Instant Search", "60": "System Menu / Setup", "68": "Top Menu", "129": "TV / DVD Switch"}, "commands": [92, 1, 2, 3, 94, 95, 96, 7, 97, 98, 99, 322, 321, 320, 323, 60, 61, 62, 63, 65, 66, 64, 68, 69, 151, 152, 153, 154, 155, 156, 157, 158, 159, 150, 324, 5, 352, 350, 290, 351, 353, 129, 354, 355, 90, 91], "name": "Sony DVD Player", "description": "Salon"}]`);
export const v1_commands_json: V1Commands = JSON.parse(`{"NEXT_TRACK": 97, "INPUT_TV_VIDEO": 129, "MODE_2CH": 211, "MUTE": 32, "LEVEL_UP": 253, "SUBTITLE": 350, "SEARCH_MODE": 353, "PICTURE_MODE": 354, "SLOW_FWD": 99, "STEP_REV": 320, "POWER_OFF": 3, "SLEEP": 4, "TEST_TONE": 33, "SLOW_REV": 98, "TUNING_MODE": 184, "RETURN": 66, "PLAY": 90, "INPUT_DVD": 123, "MODE_CHURCH": 216, "SHIFT": 187, "MODE_CINEMA": 219, "EQ_ON_OFF": 250, "DVD_MENU": 69, "FREQ_DOWN": 256, "FAST_FORWARD": 95, "MODE_MUSIC": 220, "MODE_AFD": 221, "PRESET_DOWN": 181, "CENTER_LEVEL_UP": 259, "SPEAKER_B_ON": 38, "ANGLE": 351, "DIMMER": 6, "TIME_TEXT": 352, "SURROUND_MODE": 355, "INPUT_TUNER": 120, "DIGIT_8": 158, "PREV_TRACK": 96, "PAUSE": 91, "DIGIT_5": 155, "BALANCE_LEFT": 35, "POWER": 1, "RECORD": 93, "DIGIT_1": 151, "DIGIT_0": 150, "INPUT_VIDEO1": 126, "DISPLAY": 5, "INPUT_VIDEO3": 128, "OPEN_CLOSE": 7, "INPUT_VIDEO2": 127, "DIGIT_2": 152, "DIGIT_3": 153, "BASS_BOOST": 34, "BALANCE_RIGHT": 36, "SPEAKERS_OFF": 39, "MENU": 60, "VOLUME_UP": 30, "UP": 61, "DOWN": 62, "LEFT": 63, "INPUT_PHONO": 122, "DIGIT_4": 154, "REWIND": 94, "SPEAKER_A_ON": 37, "DIGIT_6": 156, "DIGIT_7": 157, "DIGIT_9": 159, "PRESET_UP": 180, "INPUT_TAPE": 124, "SCAN_UP": 182, "EXIT": 67, "SCAN_DOWN": 183, "MEMORY": 186, "SOUND_FIELD_ON_OFF": 210, "TITLE_MENU": 68, "MODE_HALL": 212, "INPUT_CD": 121, "BAND": 185, "ENTER": 65, "MODE_JAZZ": 213, "MODE_THEATER": 214, "MODE_DISCO": 215, "MODE_STADIUM": 217, "MODE_NIGHT": 222, "MULTI_CH": 223, "INPUT_MODE_CHANGE": 224, "EQ_SLOPE": 251, "EQ_CHANNEL": 252, "INPUT_AUX": 125, "LEVEL_DOWN": 254, "FREQ_UP": 255, "REAR_LEVEL_UP": 257, "POWER_ON": 2, "RIGHT": 64, "STOP": 92, "REAR_LEVEL_DOWN": 258, "CENTER_LEVEL_DOWN": 260, "VOLUME_DOWN": 31, "SUBWOOFER_LEVEL_UP": 261, "SUBWOOFER_LEVEL_DOWN": 262, "AUDIO_CHANGE": 290, "STEP_FWD": 321, "MODE_DOLBY": 218, "REPLAY": 322, "REPEAT": 323, "CLEAR": 324}`)