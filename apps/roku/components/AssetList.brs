' AssetList.brs — selectable list of assets (crypto or stocks).
' Wraps a MarkupList of AssetRow itemComponents. On SELECT it republishes the
' chosen asset's payload via `selectedPayload` so the Dashboard can open a
' detail overlay.

sub init()
    m.list = m.top.findNode("list")
    m.payloads = []
    m.list.observeField("itemSelected", "onItemSelected")
end sub

' setData([{symbol, price, change, name}])
function setData(items as Object) as Void
    root = CreateObject("roSGNode", "ContentNode")
    m.payloads = []
    for each it in items
        chg = it.change
        if chg = invalid then chg = it.changePercent
        if chg = invalid then chg = it.change24h
        if chg = invalid then chg = 0

        node = root.createChild("ContentNode")
        node.title = it.symbol
        node.addField("priceText", "string", false)
        node.priceText = "$" + Str(Int(it.price * 100) / 100.0).trim()
        node.addField("changeText", "string", false)
        node.changeText = FmtPct(chg)
        node.addField("changeColor", "string", false)
        node.changeColor = ChangeColor(chg)

        nm = it.name
        if nm = invalid then nm = it.symbol
        m.payloads.push({ symbol: it.symbol, name: nm, price: it.price, change: chg })
    end for
    m.list.content = root
    return
end function

sub onItemSelected()
    idx = m.list.itemSelected
    if idx >= 0 and idx < m.payloads.count()
        m.top.selectedPayload = m.payloads[idx]
    end if
end sub

sub onFocusReq()
    if m.top.rowsFocus then m.list.setFocus(true)
end sub
