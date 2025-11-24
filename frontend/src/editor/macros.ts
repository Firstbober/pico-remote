import { commandToPretty, createMacro, getCurrentPreset, getMacroByName, getMacros, removeMacro, searchForBlacklistedCharacters, type Binds, type ExecutableCommand, type Macro, type V1Commands, type V1Devices } from "../data";
import Sortable from 'sortablejs';
import { savePresetToStorage } from "../storage";


function sanitizeMacroName(name: string): string {
    return name.replaceAll(" ", "_");
}

function desanitizeMacroName(name: string): string {
    return name.replaceAll("_", " ");
}

export function setupEditorMacrosTab(devices: V1Devices, commands: V1Commands) {
    const macro_remove = document.getElementById("editor-macros-remove")! as HTMLButtonElement;
    const macro_select = document.getElementById("editor-macros-select")! as HTMLSelectElement;
    const macro_add = document.getElementById("editor-macros-add")! as HTMLButtonElement;

    const macro_commands = document.getElementById("macro-editor-elements")! as HTMLUListElement;

    const macro_command_device = document.getElementById("editor-macros-devices")! as HTMLSelectElement;
    const macro_command_command = document.getElementById("editor-macros-commands")! as HTMLSelectElement;
    const macro_command_add = document.getElementById("editor-macros-add-command")! as HTMLButtonElement;

    // Sortable
    Sortable.create(macro_commands, {
        scroll: true,
        handle: '.handle',
        animation: 150,
        onEnd: (_) => {
            updatePresetMacroCommands();
        }
    });

    // Selects

    macro_select.addEventListener('sl-change', _ => {
        macro_remove.disabled = !macro_select.value;
        macro_command_add.disabled = !(macro_command_device.value && macro_command_command.value && macro_select.value);

        macro_commands.innerHTML = '';
        for (const command of getMacroByName(sanitizeMacroName(macro_select.value!)).commands) {
            addCommandToMacroCommandsEditor(command[0], command[1])
        }
        addClickForRemoveButtons();
    });

    macro_command_device.addEventListener('sl-change', _ => {
        const device = devices[Number(macro_command_device.value)];

        macro_command_command.innerHTML = device.commands.map((command) => {
            const command_name = commandToPretty(device, command, commands);

            return `<sl-option value="${command}">${command_name}</sl-option>`;
        }).join("\n");

        macro_command_add.disabled = !(macro_command_device.value && macro_command_command.value && macro_select.value);
    });

    macro_command_command.addEventListener('sl-change', _ => {
        macro_command_add.disabled = !(macro_command_device.value && macro_command_command.value && macro_select.value);
    });

    // Buttons

    macro_add.addEventListener('click', _ => {
        let errorMessage = '';
        let name = ''
        do {
            name = prompt("Macro name")!;
            errorMessage = searchForBlacklistedCharacters(name);
            if (name == '' || name == null) {
                errorMessage += `Please fill out the name.`;
            }
            if (Object.values(getMacros()).filter(v => v.name == name).length > 0) {
                errorMessage += `Found macro with name '${name}', use different identifier.`;
            }
            if (errorMessage != '')
                alert(errorMessage);
        } while (errorMessage != '')

        createMacro(sanitizeMacroName(name));
        fillOutMacros(macro_select, getMacros())
    });

    macro_remove.addEventListener('click', _ => {
        removeMacro(Number(macro_select.value));
        fillOutMacros(macro_select, getMacros());
    });

    macro_command_add.addEventListener('click', _ => {
        const device = Number(macro_command_device.value);
        const command = Number(macro_command_command.value);

        addCommandToMacroCommandsEditor(device, command);
        addClickForRemoveButtons();

        updatePresetMacroCommands();
    });

    // Reusable

    function updatePresetMacroCommands() {
        let commands: ExecutableCommand[] = [];
        for (const li of macro_commands.children) {
            let s = li.id.split(":");
            commands.push([Number(s[1]), Number(s[2])]);
        }

        getMacroByName(sanitizeMacroName(macro_select.value!)).commands = commands;
        savePresetToStorage(getCurrentPreset());
    }

    function addClickForRemoveButtons() {
        for (const btn of macro_commands.getElementsByClassName('remove')) {
            btn.addEventListener('click', (_) => {
                btn.parentElement?.remove();
                updatePresetMacroCommands();
            });
        }
    }

    function addCommandToMacroCommandsEditor(device: number, command: number): string {
        const liId = `${macro_commands.children.length}:${device}:${command}`;

        const command_name = commandToPretty(devices[device], command, commands);
        const device_name = `${devices[device].name} | ${devices[device].description}`;

        macro_commands.innerHTML += `
        <li id="${liId}">
            <iconify-icon icon="material-symbols-light:drag-handle" width="24" height="24" class="handle"></iconify-icon>
            <span title="${command_name}">${command_name}</span>
            <span title="${device_name}">${device_name}</span>
            <button class="remove">
                <iconify-icon icon="material-symbols-light:close" width="24" height="24"></iconify-icon>
            </button>
        </li>
        `;

        return liId;
    }
}

export function fillOutMacrosAndDevices(macro: Binds, devices: V1Devices) {
    const macro_select = document.getElementById("editor-macros-select")! as HTMLSelectElement;
    const macro_command_device = document.getElementById("editor-macros-devices")! as HTMLSelectElement;

    fillOutMacros(macro_select, macro);

    macro_command_device.innerHTML = devices.map((device, idx) => {
        return `<sl-option value="${idx}">${device.name} | ${device.description}</sl-option>`;
    }).join('\n');
}

function fillOutMacros(macro_select: HTMLSelectElement, macros: Binds) {
    macro_select.innerHTML = Object.entries(macros).map((entry) => {
        return `<sl-option value="${entry[1].name}">${desanitizeMacroName(entry[1].name!)}</sl-option>`;
    }).join('\n');
}
