' Theme.brs — MarketPulse "Midnight" design system.
' One disciplined palette: a single signature gold accent, a tight slate-navy
' neutral ramp, and refined (not neon) semantic green/red. Every component
' derives its color from here so the whole channel reads cohesive and premium.

function Theme() as Object
    return {
        colors: {
            bg:        "0x070B12FF"   ' deep slate-navy base
            panel:     "0x111A2BCC"   ' frosted card fill
            panelSolid:"0x111A2BFF"
            border:    "0x1E293BFF"
            text:      "0xF8FAFCFF"   ' near-white
            textMuted: "0x94A3B8FF"   ' slate
            textDim:   "0x64748BFF"
            accent:    "0xF7C948FF"   ' signature gold
            accentSoft:"0xF7C94822"
            up:        "0x34D399FF"   ' emerald
            down:      "0xF43F5EFF"   ' rose-red
            live:      "0xF43F5EFF"
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

function ChangeColor(value as Dynamic) as String
    th = Theme()
    if value = invalid then return th.colors.textMuted
    if value > 0 then return th.colors.up
    if value < 0 then return th.colors.down
    return th.colors.textMuted
end function

function FmtMoney(value as Dynamic) as String
    if value = invalid then return "$0"
    return "$" + Str(Int(value * 100) / 100.0).trim()
end function

function FmtPct(value as Dynamic) as String
    if value = invalid then value = 0
    sign = ""
    if value > 0 then sign = "+"
    return sign + Str(Int(value * 100) / 100.0).trim() + "%"
end function
