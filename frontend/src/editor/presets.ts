import { addPreset, getCurrentPreset, getPresetByName, getPresetNames, removePreset, searchForBlacklistedCharacters, setCurrentPreset } from "../data";

export function setupEditorPresetsTab(onPresetChange: (name: string) => void) {
    const select_preset = document.getElementById("editor-presets-preset")! as HTMLSelectElement;
    const button_remove_preset = document.getElementById("editor-presets-remove-preset")! as HTMLButtonElement;
    const button_set_preset = document.getElementById("editor-presets-set-preset")! as HTMLButtonElement;
    const input_rename_preset = document.getElementById("editor-presets-rename-preset")! as HTMLInputElement;

    const input_new_preset_name = document.getElementById("editor-presets-new-preset-name")! as HTMLInputElement;
    const button_create_preset = document.getElementById("editor-presets-create-preset")! as HTMLButtonElement;

    // Load

    loadPresets();

    // Events

    select_preset.addEventListener('sl-change', _ => {
        button_remove_preset.disabled = !(select_preset.value) || !(getPresetNames().length > 1);
        button_set_preset.disabled = !(select_preset.value) || getCurrentPreset().name == select_preset.value;

        input_rename_preset.value = select_preset.value;
    });

    input_rename_preset.addEventListener('sl-change', _ => {
        getPresetByName(select_preset.value)!.name = input_rename_preset.value;
        loadPresets();
        input_rename_preset.value = '';
    })

    button_remove_preset.addEventListener('click', _ => {
        removePreset(select_preset.value);
        loadPresets();
    });

    button_set_preset.addEventListener('click', _ => {
        setCurrentPreset(select_preset.value);
        onPresetChange(select_preset.value);
    });

    input_new_preset_name.addEventListener('sl-input', _ => {
        button_create_preset.disabled = !(input_new_preset_name.value);
    });

    button_create_preset.addEventListener('click', _ => {
        let errorMessage = searchForBlacklistedCharacters(input_new_preset_name.value);

        if(errorMessage == ``) {
            if(!addPreset(input_new_preset_name.value)) {
                alert(`Adding preset failed! Found preset with name "${input_new_preset_name.value}"`);
            } else {
                input_new_preset_name.value = '';
                button_create_preset.disabled = true;
                loadPresets();
            }
            return
        }

        alert(errorMessage)
    })

    // Inner methods

    function loadPresets() {
        select_preset.innerHTML = getPresetNames().map((preset_name) => {
            return `<sl-option value="${preset_name}">${preset_name}</sl-option>`;
        }).join('\n');
    }
}