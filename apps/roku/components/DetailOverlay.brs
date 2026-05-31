' DetailOverlay.brs — full-screen detail card shown when a ticker is SELECTed.
' (No modals on TV per UX rules — this is a full-screen overlay the Dashboard
' shows/hides and BACK dismisses.)

sub init()
    m.sym = m.top.findNode("sym")
    m.name = m.top.findNode("name")
    m.price = m.top.findNode("price")
    m.chg = m.top.findNode("chg")
    m.top.visible = false
end sub

' show({symbol, name, price, change})
function show(p as Object) as Void
    if p = invalid then return
    m.sym.text = p.symbol
    m.name.text = p.name
    m.price.text = "$" + Str(Int(p.price * 100) / 100.0).trim()
    m.chg.text = FmtPct(p.change) + "  (24h / day)"
    m.chg.color = ChangeColor(p.change)
    m.top.visible = true
    return
end function
