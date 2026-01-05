# Solutions for Repeated Issues

## Drone menu popping up after issuing actions (e.g., Follow / Goto WP)
- **Problem:** After issuing an action like `Follow drone #X` or `Goto WP`, the drone tooltip/menu would pop back up a moment later.
- **Solution that worked:** After issuing the action, clear selection for the acting drone (`pinnedDroneId = null`) and suppress tooltip reopen briefly. This prevents the menu from reappearing right after the command is sent.
