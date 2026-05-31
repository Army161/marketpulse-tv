' Theme.brs — central design system for the channel.
' One source of truth for color, type, and spacing so every component looks
' like part of the same broadcast, not a pile of ad-hoc styles.

function Theme() as Object
    return {
        colors: {
            bg:        "0x05070BFF"   ' deepest base (behind the gradient poster)
            panel:     "0x111B2BCC"   ' translucent card fill
            panelSolid:"0x131E30FF"
            border:    "0x2A3B52FF"
            text:      "0xFFFFFFFF"
            textMuted: "0x9AA7BCFF"
            textDim:   "0x5C6B82FF"
            accent:    "0xFFB800FF"   ' gold — CTAs, focus, branding
            accentSoft:"0xFFB80022"
            up:        "0x00E58FFF"   ' green
            down:      "0xFF5B63FF"   ' red
            live:      "0xFF3B47FF"   ' broadcast "LIVE" red dot
        }
        font: {
            display: "font:LargeBoldSystemFont"
            header:  "font:MediumBoldSystemFont"
            body:    "font:MediumSystemFont"
            label:   "font:SmallestSystemFont"
            small:   "font:SmallSystemFont"
        }
        space: { xs: 8, sm: 16, md: 24, lg: 40, xl: 64 }
    }
end function

' Pick up/down/flat color for a numeric change.
function ChangeColor(value as Dynamic) as String
    th = Theme()
    if value = invalid then return th.colors.textMuted
    if value > 0 then return th.colors.up
    if value < 0 then return th.colors.down
    return th.colors.textMuted
end function

' 2-decimal money with no leading-space artifact.
function FmtMoney(value as Dynamic) as String
    if value = invalid then return "$0"
    return "$" + Str(Int(value * 100) / 100.0).trim()
end function

' Signed 2-decimal percent.
function FmtPct(value as Dynamic) as String
    if value = invalid then value = 0
    sign = ""
    if value > 0 then sign = "+"
    return sign + Str(Int(value * 100) / 100.0).trim() + "%"
end function
