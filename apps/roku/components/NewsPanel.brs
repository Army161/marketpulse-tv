' NewsPanel.brs — list of rich Benzinga news cards (NewsRow itemComponent).

sub init()
    m.list = m.top.findNode("list")
end sub

function setData(articles as Object) as Void
    root = CreateObject("roSGNode", "ContentNode")
    for each a in articles
        node = root.createChild("ContentNode")
        node.title = a.headline

        node.addField("tickersText", "string", false)
        node.tickersText = TickerChips(a.tickers)

        node.addField("metaText", "string", false)
        src = a.source
        if src = invalid then src = "Benzinga"
        cat = a.category
        if cat = invalid then cat = ""
        node.metaText = src + "  •  " + cat

        node.addField("imageUri", "string", false)
        img = a.imageUrl
        if img = invalid then img = ""
        node.imageUri = img
    end for
    m.list.content = root
    return
end function

function TickerChips(tickers as Object) as String
    if tickers = invalid then return ""
    out = ""
    n = 0
    for each t in tickers
        if n >= 5 then exit for
        if out <> "" then out = out + "   ·   "
        out = out + t
        n = n + 1
    end for
    return out
end function

function setListFocus(on as Boolean) as Void
    m.list.setFocus(on)
    return
end function
