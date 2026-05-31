' CryptoGrid.brs — vertical list of top crypto coins.
' Packs symbol + price + 24h change into the LabelList title (LabelList only
' renders `title`, so everything visible must live there). Money and percent
' are truncated to 2 decimals to match the Ticker/Movers formatting.

sub init()
    m.list = m.top.findNode("list")
end sub

function setData(coins as Object) as Void
    root = CreateObject("roSGNode", "ContentNode")
    for each c in coins
        node = root.createChild("ContentNode")
        node.title = c.symbol + "   " + FormatMoney(c.price) + "   " + FormatPct(c.change24h)
    end for
    m.list.content = root
end function

function FormatMoney(value as Float) as String
    if value = invalid then return "$0"
    return "$" + Str(Int(value * 100) / 100.0).trim()
end function

function FormatPct(value as Float) as String
    if value = invalid then value = 0
    sign = ""
    if value > 0 then sign = "+"
    return sign + Str(Int(value * 100) / 100.0).trim() + "%"
end function
