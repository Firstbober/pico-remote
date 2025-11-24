import { fetchCommands, fetchDevices, setApiBase } from "./api";

export function setupApiInit(ready: () => void) {
    const api_alert = (document.getElementById('api-init-alert')! as any);
    const api_url = (document.getElementById('api-init-url')! as HTMLInputElement);
    const api_next_button = (document.getElementById('api-init-next')! as HTMLButtonElement);
    const api_loading = (document.getElementById('api-init-loading')! as HTMLElement);

    api_alert.open = false;

    api_url.addEventListener('sl-input', _ => {
        api_next_button.disabled = !api_url.value;
    });

    api_next_button.addEventListener('click', async _ => {
        api_loading.style.display = 'flex';

        setApiBase(`http://${api_url.value}`);

        try {
            const devices = await fetchDevices();
            const commands = await fetchCommands();

            api_url.parentElement!.style.display = 'none';
            ready();

            return;
        } catch (error) {
            api_alert.open = true
        }

        api_loading.style.display = 'none';
    });
}