# Command/Action Catalog

Current supported/placeholder commands in the UI and mock logic:

- Arm
- Disarm
- Takeoff (only when armed and on ground)
- Land (when in air)
- Hold position (when in air)
- Goto waypoint (with speed)
- Orbit (around waypoint/home/drone/target; radius, orbit period (min/orbit), altitude, CW/CCW)
- Follow drone (follow drone #X)
- Search target
- Attack target
- Boid group (join group #X)
- Return to home / ground station anchor (future: send to HQ/helipad)

## Local command flow (per drone)

- Landed & **Disarmed** → only **Arm** is available.
- Landed & **Armed** → **Disarm** or **Takeoff**.
- In Air (not landed) → **Land**, **Hold position**, **Disarm** (requires confirmation dialog: “Are you sure you want to disarm in mid-air?”).
- “Landed” is determined by the flight controller state: `RESCUE_COMPLETE` means landed (from Betaflight rescue state machine). `RESCUE_LANDING` is still considered in-air/landing.
- After **Disarm**, a 3s lockout applies; no actions are available during this window. Show a 3s progress bar; once complete, **Arm** reappears.

## Notes
- Local commands apply directly to the selected drone (Arm/Disarm/Takeoff/Land/Hold).
- Relative commands target other entities (e.g., Follow drone #X).
- Global/group commands (e.g., Boid group, return-to-home to a Ground Station) will use ground station anchors.

## Gaps / scenarios to clarify
- Takeoff while already in air: no; use **Hold position** then proceed.
- Landed detection now uses `RESCUE_COMPLETE`; clarify fallback when rescue phase is unknown (altitude heuristic remains secondary).
- **Hold position** is not shown on the ground.
- Disarm lockout set to 3s; confirm whether re-arm should be blocked by other safety checks.
- Command gating on stale link/low battery: not enforced yet; low-battery gets a blinking indicator instead.
