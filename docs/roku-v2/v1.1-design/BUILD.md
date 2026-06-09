# BUILD.md — Build / sideload / verify / package (v1.1)

Device: `192.168.1.80` ("War and Rock", Roku Express). Web pwd `rokudev:2789`.
Node path (git-bash): `export PATH="/c/Users/Armyg/AppData/Local/nvm/v24.11.1:/c/Users/Armyg/AppData/Roaming/npm:$PATH"`

## Validate (necessary, not sufficient)
```bash
cd apps/roku && npx brighterscript --project ./bsconfig.json
```

## Package + sideload (dev)
```bash
# 1) bump build_version in apps/roku/manifest FIRST
python3 scripts/package-roku.py                     # -> dist/marketpulse-roku.zip
curl.exe -s -S --user "rokudev:2789" --digest \
  -F "mysubmit=Replace" -F "archive=@dist/marketpulse-roku.zip" \
  "http://192.168.1.80/plugin_install"               # expect: Install Success
curl.exe -s -d "" "http://192.168.1.80:8060/launch/dev"   # launch
```

## Verify (REQUIRED before "done")
```bash
# console must be clean:
timeout 14 curl.exe -s "telnet://192.168.1.80:8085" | grep -iE "error|runtime|fail|invalid|crash|warning"
# confirm running build:
curl.exe -s "http://192.168.1.80:8060/query/active-app"
```
Then **the user must eyeball all 8 sections on the TV remote.** BrighterScript + clean
console are not enough — this repo has been burned by that before.

## Package a SIGNED .pkg for store update (v1.1)
> ⚠️ Use the **SAME signing key** as v1.0 or you cannot update the published channel.
> **Do NOT run `genkey` again.** Re-use the saved genkey password (DevID
> `ec81ec69fdd9f5b3ec0b8892e7a7fd1c8965bddc`). The password is NOT stored in this repo —
> it's in the owner's password manager. Substitute it below.
```bash
PKGTIME=$(date +%s)000
curl.exe -s -S --user "rokudev:2789" --digest \
  -F "mysubmit=Package" -F "app_name=MarketPulseTV/1.1" \
  -F "passwd=<SAVED_GENKEY_PASSWORD>" -F "pkg_time=$PKGTIME" \
  "http://192.168.1.80/plugin_package"               # response contains pkgs/<id>.pkg
curl.exe -s --user "rokudev:2789" --digest \
  "http://192.168.1.80/pkgs/<id>.pkg" -o dist/MarketPulseTV-1.1.pkg
```
Then developer.roku.com → the existing channel → upload the new `.pkg` as an update.

## Ports cheat-sheet
| Port | Use |
|---|---|
| 80 | dev web server (sideload/package), digest `rokudev:2789` |
| 8060 | ECP (launch, query/active-app) |
| 8085 | BrightScript console |
| 8080 | dev telnet / `genkey` (run ONCE, ever) |
