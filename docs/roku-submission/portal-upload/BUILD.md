# BUILD.md — Where the package came from (and how to re-cut)

## The package is ALREADY built — you do not need to build anything
- **Submit this:** `C:\Users\Armyg\marketpulse-tv-claude-code.zip\dist\MarketPulseTV-1.0.pkg`
- 267 KB, header "Roku Channel Pak", **build 00010**, signed with the device genkey
  (DevID `ec81ec69fdd9f5b3ec0b8892e7a7fd1c8965bddc`).

## If it's ever missing / needs re-cutting (device must be ON at 192.168.1.80)
Build 00010 source: `dist/marketpulse-roku-00010-STORE.zip` (sideload it so the dev
channel = 00010), then package via the dev web server. Sign with the **SAME** genkey
password (in the owner's password manager — NOT in the repo). Never run `genkey` again.

```bash
# (only if re-cutting) sideload 00010, then:
PKGTIME=$(date +%s)000
curl.exe -s -S --user "rokudev:2789" --digest \
  -F "mysubmit=Package" -F "app_name=MarketPulseTV/1.0" \
  -F "passwd=<SAVED_GENKEY_PASSWORD>" -F "pkg_time=$PKGTIME" \
  "http://192.168.1.80/plugin_package"
# response → pkgs/<id>.pkg ; download:
curl.exe -s --user "rokudev:2789" --digest \
  "http://192.168.1.80/pkgs/<id>.pkg" -o dist/MarketPulseTV-1.0.pkg
```

## Future updates (v1.1 cinematic)
Bump to `MarketPulseTV/1.1`, re-package with the **same key**, upload as an update to
the same channel. Details in `docs/roku-v2/v1.1-design/BUILD.md`.
