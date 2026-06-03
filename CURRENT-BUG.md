# CURRENT BUG — Section navigation shows empty pages

**Priority: P0 — Fix this before anything else.**
**Build affected:** 00007 (latest sideloaded)
**Status:** Active on device, not fixed.

---

## Symptom (user-confirmed on real Roku hardware)

- **Home page renders correctly** on launch: gainers/losers, Fear&Greed gauge,
  headlines, bottom chyron all show fine.
- **Pressing any nav button** (Crypto / Stocks / News / Calendar / Sentiment /
  Settings / Upgrade):
  - Sidebar highlight moves correctly between items.
  - SELECT registers (home content disappears).
  - **Target page renders EMPTY BLUE** — not even the static title Label
    ("CRYPTO • TOP 20") appears. Only header bar + chyron + sidebar remain.
- **BACK and Home button do nothing** — the app stays on the empty page.
  User must exit the entire channel and relaunch to get Home back.

## Key diagnostic clue
The static title Label has **no data dependency** — it's hardcoded text in XML.
If even that doesn't render, it means the page Group's `visible=true` never
executed. The router broke BEFORE or DURING setting visibility.

---

## Root cause analysis

### Suspect: `Dashboard.brs > onSectionChange()`

The section router does:
1. Hides Home (or all groups).
2. Shows the target group.
3. Routes focus to the target list.

If step 3 calls `callFunc("setListFocus", ...)` or sets `rowsFocus = true` on
an **invalid node reference**, BrightScript throws a runtime error that aborts
the entire `onSectionChange` handler — AFTER home was hidden but BEFORE the
target was made visible. Result: everything hidden, app stuck.

### Most likely causes (in priority order)

**H1: `callFunc` on an invalid node** ← most likely
- `m.calendarList`, `m.newsPanel`, `m.cryptoList`, etc. — any one of these
  being `invalid` (because `findNode("id")` didn't match a real id in
  `Dashboard.xml`) will cause a fatal runtime error on `callFunc`.

**H2: `setListFocus` function not declared in a component's `<interface>`**
- `CalendarList.xml` and `NewsPanel.xml` (rewritten in v2.2) need to have
  `<function name="setListFocus" />` in their `<interface>` block.
  If missing, `callFunc` returns invalid and downstream code breaks.

**H3: Missing `alwaysNotify="true"` on `rowsFocus` in new list components**
- `CalendarList.xml` — added in v2.2, may not have the fix.
- `NewsPanel.xml` — rewritten in v2.2 from LabelList to MarkupList; the focus
  field may have been lost in the rewrite.

---

## Diagnostic procedure

### Step 1: Capture BrightScript console during a nav press
```bash
# Launch app
curl.exe -s -d "" "http://192.168.1.80:8060/launch/dev"
sleep 3

# Start console capture in background (or pipe to file)
timeout 30 curl.exe -s "telnet://192.168.1.80:8085" 2>&1 | \
  grep -iE "error|runtime|line [0-9]|\.brs\(|invalid|cannot|undefined|focus" \
  > /tmp/roku-console.txt &

# Ask user to press a nav button NOW (e.g. Calendar)
# Then read the console output
cat /tmp/roku-console.txt | head -40
```

The `.brs(line_number)` in the error output points exactly to the bad callFunc.

### Step 2: Audit all findNode calls in Dashboard.brs init()
Verify each id exists in `Dashboard.xml`:
- `nav`, `ticker`, `gauge`, `gauge2`, `status`, `clock`, `fngMini`, `liveDot`
- `overlay`, `gainers`, `losers`, `teaser`
- `cryptoList`, `stocksList`, `newsPanel`, `calendarList`
- `settingsRows`, `pricingCards`, `sentExplain`
- All 8 page group ids: `dashGroup`, `cryptoGroup`, `stocksGroup`, `newsGroup`,
  `calendarGroup`, `sentimentGroup`, `settingsGroup`, `upgradeGroup`

---

## Fix (apply defensively regardless of console output)

### 1. Guard every callFunc and field set in `onSectionChange` and `refocusContent`

```brightscript
' SAFE pattern — check before calling
if m.calendarList <> invalid
    m.calendarList.callFunc("setListFocus", true)
end if
```

Apply to ALL: `m.newsPanel.callFunc(...)`, `m.cryptoList.rowsFocus`,
`m.stocksList.rowsFocus`, `m.calendarList.callFunc(...)`, `m.nav.navFocus`.

### 2. Rewrite `onSectionChange` visibility loop defensively

```brightscript
sub onSectionChange()
    name = m.nav.selectedSection
    if name = invalid or name = "" then return

    targetGroup = m.groups[name]
    if targetGroup = invalid
        print "[Dashboard] unknown section: " + name
        return
    end if

    ' Hide all groups first
    for each key in m.groups
        g = m.groups[key]
        if g <> invalid then g.visible = false
    end for

    ' Show target
    targetGroup.visible = true
    m.currentSection = name

    ' Route focus with guards
    m.inContent = false
    if name = "Crypto" and m.cryptoList <> invalid
        m.cryptoList.rowsFocus = true
        m.inContent = true
    else if name = "Stocks" and m.stocksList <> invalid
        m.stocksList.rowsFocus = true
        m.inContent = true
    else if name = "News" and m.newsPanel <> invalid
        m.newsPanel.callFunc("setListFocus", true)
        m.inContent = true
    else if name = "Calendar" and m.calendarList <> invalid
        m.calendarList.callFunc("setListFocus", true)
        m.inContent = true
    end if

    if not m.inContent and m.nav <> invalid
        m.nav.navFocus = true
    end if
end sub
```

### 3. Verify CalendarList.xml exports `setListFocus`
```xml
<interface>
    <function name="setData" />
    <function name="setListFocus" />    <!-- MUST be present -->
</interface>
```

### 4. Verify NewsPanel.xml exports `setListFocus` (rewrite may have lost it)
Same as above — check that `<function name="setListFocus" />` is in the interface.

### 5. Add `alwaysNotify="true"` to `rowsFocus` in CalendarList.xml
```xml
<field id="rowsFocus" type="boolean" alwaysNotify="true" onChange="onFocusReq" />
```

---

## Verification checklist (after fix)

Sideload build 00008, then have user test with actual remote:
- [ ] Home loads correctly on launch
- [ ] Home → Crypto → data visible → BACK → Home restored
- [ ] Home → Stocks → SELECT a row → glass overlay opens → BACK → BACK → Home
- [ ] Home → News → Benzinga cards visible (thumbnail + ticker chips)
- [ ] Home → Calendar → earnings rows visible (date / ticker / EPS)
- [ ] Home → Sentiment → gauge visible
- [ ] Home → Settings → glass info rows visible
- [ ] Home → Upgrade → glass pricing cards visible
- [ ] Chyron still scrolling throughout all sections
- [ ] BrightScript console clean (no errors/warnings)

All 9 points must pass before this bug is closed.

---

## Files to edit for the fix
- `apps/roku/components/Dashboard.brs` — main fix here
- `apps/roku/components/CalendarList.xml` — add setListFocus interface + alwaysNotify
- `apps/roku/components/NewsPanel.xml` — verify setListFocus interface
- `apps/roku/components/CalendarList.brs` — add setListFocus sub if missing
