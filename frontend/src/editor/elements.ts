import type { GridStack } from "gridstack";
import { addButton, ButtonColor, commandToPretty, getCommandBind, getCurrentPreset, getKeyByValue, getMacros, getPresetByName, getPresetNames, importPresetIntoGrid, type Binds, type V1Commands, type V1Devices } from "../data";
import { clearAllData, clearApiBase } from "../storage";
import { IconMappings } from "../icon_mappings";

export function setupEditorElementsTab(commands: V1Commands, devices: V1Devices, grid: GridStack) {
    setupCommandsTab(devices, commands, grid);
    setupSpacersTab(grid);
    setupPresetsTab(grid);

    const clear_all_data = document.getElementById("editor-elements-advanced-clear-all-data")! as HTMLButtonElement
    const clear_api_base = document.getElementById("editor-elements-advanced-clear-api-base")! as HTMLButtonElement
    const export_data = document.getElementById("editor-elements-advanced-export-data")! as HTMLButtonElement
    const import_data = document.getElementById("editor-elements-advanced-import-data")! as HTMLButtonElement

    clear_all_data.addEventListener('click', _ => {
        clearAllData();
        alert("Cleared all data!");
        window.location.reload()
    });

    clear_api_base.addEventListener('click', _ => {
        clearApiBase()
        alert("Cleared api!");
        window.location.reload()
    });

    export_data.addEventListener('click', _ => {
        window.location.reload()
    });

    import_data.addEventListener('click', _ => {
        window.location.reload()
    });
}

function setupPresetsTab(grid: GridStack) {
    const add_button = document.getElementById('editor-elements-presets-add')! as HTMLButtonElement;
    const preset_select = document.getElementById('editor-elements-presets-preset')! as HTMLSelectElement;

    preset_select.addEventListener('sl-change', _ => {
        add_button.disabled = !preset_select.value;
    });

    add_button.addEventListener('click', _ => {
        const preset = getPresetByName(preset_select.value)!;

        addButton({
            icon: `Preset: ${preset.name}`,
            bind: 0,
            color: ButtonColor.Blue,
            spacer: true,
            tooltip: ''
        }, grid);

        importPresetIntoGrid(grid, preset, true);
    });
}

function setupSpacersTab(grid: GridStack) {
    const add_button = document.getElementById('editor-elements-spacers-add')! as HTMLButtonElement;
    const spacer_content = document.getElementById('editor-elements-spacers-content')! as HTMLInputElement;

    spacer_content.addEventListener('sl-input', _ => {
        add_button.disabled = !spacer_content.value;
    });

    add_button.addEventListener('click', _ => {
        addButton({
            icon: spacer_content.value,
            bind: 0,
            color: ButtonColor.Blue,
            spacer: true,
            tooltip: ''
        }, grid);

        spacer_content.value = '';
        add_button.disabled = true;
    });
}

function setupCommandsTab(devices: V1Devices, commands: V1Commands, grid: GridStack) {
    const add_button = document.getElementById('editor-elements-commands-add')! as HTMLButtonElement;

    const device_select = document.getElementById('editor-elements-commands-device')! as HTMLSelectElement;
    const command_select = document.getElementById('editor-elements-commands-command')! as HTMLSelectElement;
    const color_select = document.getElementById('editor-elements-commands-color')! as HTMLSelectElement;
    const icon_select = document.getElementById('editor-elements-commands-icon')! as HTMLSelectElement;

    // Handle updates
    function checkIfAddShouldBeEnabled() {
        const should = device_select.value && command_select.value && color_select.value && icon_select.value;
        add_button.disabled = !should;
    }

    device_select.addEventListener('sl-change', _ => {
        if (device_select.value == 'macros') {
            console.log(getCurrentPreset());
            console.log(getMacros())
            command_select.innerHTML = Object.entries(getMacros()).map(entry => {
                return `<sl-option value="${entry[0]}">${entry[1].name}</sl-option>`;
            }).join('\n');
            return;
        }

        const device = devices[Number(device_select.value)];

        command_select.innerHTML = device.commands.map((command) => {
            const command_name = commandToPretty(device, command, commands);

            return `<sl-option value="${command}">${command_name}</sl-option>`;
        }).join("\n");

        checkIfAddShouldBeEnabled();
    });

    command_select.addEventListener('sl-change', _ => {
        icon_select.value = IconMappings[(getKeyByValue(commands, Number(command_select.value!)) as string) as keyof typeof IconMappings];

        checkIfAddShouldBeEnabled();
    });

    icon_select.addEventListener('sl-change', _ => {
        checkIfAddShouldBeEnabled();
    });

    color_select.addEventListener('sl-change', _ => {
        checkIfAddShouldBeEnabled();
    });

    // Handle adding
    add_button.addEventListener('click', _ => {
        const commandId = Number(device_select.value);
        const bind = device_select.value == 'macros'
            ? Number(command_select.value)
            : getCommandBind(commandId, Number(command_select.value));
        const tooltip = device_select.value == 'macros'
            ? getMacros()[Number(command_select.value) as keyof Binds].name
            : commandToPretty(devices[Number(device_select.value)], Number(command_select.value), commands) + ' | ' + devices[Number(device_select.value)].name + ' | ' + devices[Number(device_select.value)].description;

        addButton({
            icon: icon_select.value,
            bind: bind,
            color: ButtonColor[color_select.value as keyof typeof ButtonColor],
            spacer: false,
            tooltip: tooltip!
        }, grid);
    });
}

export function fillOutCommandsAndDevices(devices: V1Devices) {
    const device_select = document.getElementById('editor-elements-commands-device')! as HTMLSelectElement;
    const color_select = document.getElementById('editor-elements-commands-color')! as HTMLSelectElement;
    const icon_select = document.getElementById('editor-elements-commands-icon')! as HTMLSelectElement;

    // Load options

    device_select.innerHTML = devices.map((device, idx) => {
        return `<sl-option value="${idx}">${device.name} | ${device.description}</sl-option>`;
    }).join('\n');
    device_select.innerHTML += `<sl-option value="macros">Macros</sl-option>`

    color_select.innerHTML = Object.keys(ButtonColor).filter((v) => !(Number(v) > -1)).map((color) => {
        return `<sl-option value="${color}">${color}</sl-option>`;
    }).join('\n');

    icon_select.innerHTML = Object.entries(IconMappings).map((icon) => {
        return `<sl-option value="${icon[1]}"><div class="icon-select"><iconify-icon icon="${icon[1]}" height="32"></iconify-icon> ${icon[1].split(":")[1].split("-").join(" ")}</div></sl-option>`;
    }).join('\n');
}

export function fillOutPresets() {
    const preset_select = document.getElementById('editor-elements-presets-preset')! as HTMLSelectElement;

    preset_select.innerHTML = getPresetNames().map((preset_name) => {
        return `<sl-option value="${preset_name}">${preset_name}</sl-option>`;
    }).join('\n');
}