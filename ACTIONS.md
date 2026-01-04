# Command/Action Catalog

Current supported/placeholder commands in the UI and mock logic:

- Arm
- Disarm
- Takeoff (only when armed and on ground)
- Land (when in air)
- Hold position (when in air)
- Goto waypoint (with speed)
- Follow drone (follow drone #X)
- Search target
- Attack target
- Boid group (join group #X)
- Return to home / ground station anchor (future: send to HQ/helipad)

Notes:
- Local commands are those that apply to the selected drone directly (Arm/Disarm/Takeoff/Land/Hold).
- Relative commands will target other entities (e.g., Follow drone #X).
- Global/group commands (e.g., Boid group, return-to-home to a Ground Station) are planned to use ground stations/anchors.
