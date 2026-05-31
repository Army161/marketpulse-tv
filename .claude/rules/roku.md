---
paths: ["apps/roku/**"]
---
# Roku Rules

- All SceneGraph components must define focus chain explicitly
- Use RAF (Roku Advertising Framework) for all ad insertion — no third party ad SDKs
- Test all components in Roku Developer Environment (RDE) before submission
- Manifest must include: title, subtitle, mm_icon_focus_hd, splash_screen_hd
- BrightScript: no global variables — use m. scope only
- All network calls must use roUrlTransfer with async event handling
