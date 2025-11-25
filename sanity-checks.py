# Sanity checks between frontend and backend

from commands import Command

def check_icon_mappings():
    icon_mappings_commands = []

    with open('frontend/src/icon_mappings.ts', 'r') as icon_mappings_ts:
        lines = icon_mappings_ts.readlines()

        checking = False
        
        for line in lines:
            if line.startswith("export const IconMappings = {"):
                checking = True
                continue
            if line.startswith('}'):
                checking = False
                continue

            if not checking:
                continue

            split = line.split(':')
            if len(split) < 2:
                continue
            
            icon_mappings_commands.append(split[0].strip())


    real_commands_set = set(Command.items.keys())
    icon_mappings_set = set(icon_mappings_commands)

    logs = []

    for difference in real_commands_set.difference(icon_mappings_commands):
        logs.append(f'Commands have "{difference}" but icon mappings do not')
    for difference in icon_mappings_set.difference(real_commands_set):
        logs.append(f'Icon mappings have "{difference}" but commands do not')

    return logs

checks = [check_icon_mappings()]

checks_failed = False
for check in checks:
    if len(check) > 0:
        print('\n'.join(check))
        checks_failed = True

if checks_failed:
    exit(1)

exit(0)