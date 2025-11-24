import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import "iconify-icon";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import './style.css'
import { ButtonColor, getMacros, getPresetByName, importPresetIntoGrid, loadPresets, updatePreset, v1_commands_json, v1_devices_json, type Button } from './data';
import { fillOutCommandsAndDevices, fillOutPresets, setupEditorElementsTab } from './editor/elements';
import { setupEditorPresetsTab } from './editor/presets';
import { fillOutMacrosAndDevices, setupEditorMacrosTab } from './editor/macros';

var grid = GridStack.init({
  column: 4,
  cellHeight: ((document.body.clientWidth / 4) - 5) / 2
});

grid.on('added', () => {
  updatePreset(grid);
})

grid.on('change', () => {
  updatePreset(grid);
})

grid.on('removed', () => {
  updatePreset(grid);
})

// grid.setStatic(true);

GridStack.renderCB = (el, w) => {
  let button: Button = JSON.parse(w.content!);

  el.classList.add("tile");
  // el.classList.add("trash-active");

  el.style.animationDuration = `${(Math.random() * (0.20 - 0.33) + 0.33).toFixed(4)}s`

  if (button.spacer) {
    el.innerText = button.icon;
    el.style.background = "none";
    el.style.color = "rgba(255, 255, 255, 0.8)";
    w.w = 4;
    w.noResize = true;
    return
  }

  let bg = '#EFEDE5';

  if (button.color == ButtonColor.Red) {
    bg = '#b45a5a';
  }
  if (button.color == ButtonColor.Yellow) {
    bg = '#f9f871'
  }
  if (button.color == ButtonColor.Blue) {
    bg = '#8685ef'
  }
  if (button.color == ButtonColor.Green) {
    bg = '#00b38f';
  }
  if (button.color == ButtonColor.Orange) {
    bg = '#f6b162';
  }

  el.style.background = bg;
  el.innerHTML = `<iconify-icon icon="${button.icon}" height="48"></iconify-icon>`;

  tippy(el, {
    content: button.tooltip,
  });

  w.minH = 2;
}

// Setup
loadPresets();
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