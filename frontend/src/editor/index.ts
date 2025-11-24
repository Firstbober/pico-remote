import type { GridStack } from "gridstack";
import { fillOutCommandsAndDevices, fillOutPresets, setupEditorElementsTab } from "./elements";
import { setupEditorPresetsTab } from "./presets";
import { getMacros, getPresetByName, importPresetIntoGrid, type V1Commands, type V1Devices } from "../data";
import { fillOutMacrosAndDevices, setupEditorMacrosTab } from "./macros";

let trash_mode = false;

export function isTrashModeActive(): boolean {
    return trash_mode;
}

export function setupEditor(grid: GridStack, v1_commands_json: V1Commands, v1_devices_json: V1Devices) {

    document.getElementById('editor-trash')?.addEventListener('click', ev => {
        trash_mode = !trash_mode;

        if (trash_mode) {
            grid.disable();
            for (const el of document.querySelectorAll('.grid-stack .tile')) {
                el.classList.add('trash-active');
            }
            (ev.currentTarget as HTMLElement).classList.add('trash-active')
        } else {
            grid.enable();
            for (const el of document.querySelectorAll('.grid-stack .tile')) {
                el.classList.remove('trash-active');
            }
            (ev.currentTarget as HTMLElement).classList.remove('trash-active')
        }
    });

    document.getElementById('editor-open')?.addEventListener('click', ev => {
        (ev.currentTarget as HTMLButtonElement).disabled = true;
        document.getElementById('editor')!.style.display = 'flex';
        grid.setStatic(false);
    });

    document.getElementById('editor-close')?.addEventListener('click', ev => {
        grid.setStatic(true);
        document.getElementById('editor')!.style.display = 'none';
        (document.getElementById('editor-open')! as HTMLButtonElement).disabled = false;
    });

    setupEditorElementsTab(v1_commands_json, v1_devices_json, grid);
    setupEditorPresetsTab((preset_name) => {
        fillOutPresets();

        grid.removeAll(true, false);
        importPresetIntoGrid(grid, getPresetByName(preset_name)!);
    });
    setupEditorMacrosTab(v1_devices_json, v1_commands_json);

    // Fill
    fillOutCommandsAndDevices(v1_devices_json);
    fillOutPresets();
    fillOutMacrosAndDevices(getMacros(), v1_devices_json);
}