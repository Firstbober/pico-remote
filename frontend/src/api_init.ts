import { API_BASE, fetchCommands, fetchDevices, setApiBase } from "./api";
import type { V1Commands, V1Devices } from "./data";
import { getApiBaseFromStorage, getCommandsFromStorage, getDevicesFromStorage, saveApiBaseToStorage, saveCommandsToStorage, saveDevicesToStorage } from "./storage";

export function setupApiInit(ready: (commands: V1Commands, devices: V1Devices) => void) {
    const api_alert = (document.getElementById('api-init-alert')! as any);
    const api_url = (document.getElementById('api-init-url')! as HTMLInputElement);
    const api_next_button = (document.getElementById('api-init-next')! as HTMLButtonElement);
    const api_loading = (document.getElementById('api-init-loading')! as HTMLElement);

    api_alert.open = false;

    let potential_api_base = getApiBaseFromStorage();
    if (potential_api_base != null) {
        api_url.parentElement!.style.display = 'none';

        setApiBase(potential_api_base);
        ready(getCommandsFromStorage()!, getDevicesFromStorage()!);
        return;
    }

    api_url.addEventListener('sl-input', _ => {
        api_next_button.disabled = !api_url.value;
    });

    api_next_button.addEventListener('click', async _ => {
        api_loading.style.display = 'flex';

        setApiBase(`http://${api_url.value}/v1`);

        try {
            const devices = await fetchDevices();
            const commands = await fetchCommands();

            api_url.parentElement!.style.display = 'none';

            saveApiBaseToStorage(API_BASE);

            saveCommandsToStorage(commands);
            saveDevicesToStorage(devices);

            ready(commands, devices);

            return;
        } catch (error) {
            api_alert.open = true
        }

        api_loading.style.display = 'none';
    });
}