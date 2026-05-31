' TickerRow.brs — horizontal scrolling ticker for stock + crypto quotes.

sub init()
    m.content = m.top.findNode("content")
    m.anim = m.top.findNode("scrollAnim")

    ' Bind the interpolator to content.translation at runtime, after the node
    ' tree exists. Doing this in XML resolved the path too early and logged
    ' "Could not find node content".
    interp = m.top.findNode("scrollInterp")
    interp.fieldToInterp = "content.translation"
end sub

function setData(items as Object) as Void
    ' Clear existing children.
    while m.content.getChildCount() > 0
        m.content.removeChildIndex(0)
    end while

    x = 0
    for each item in items
        symbolLabel = m.content.createChild("Label")
        symbolLabel.text = item.symbol
        symbolLabel.font = "font:MediumBoldSystemFont"
        symbolLabel.color = "0xFFFFFFFF"
        symbolLabel.translation = [x, 16]
        x = x + 120

        priceLabel = m.content.createChild("Label")
        priceLabel.text = "$" + Str(item.price).trim()
        priceLabel.font = "font:MediumSystemFont"
        priceLabel.color = "0x8B96ABFF"
        priceLabel.translation = [x, 16]
        x = x + 160

        change = item.changePercent
        if change = invalid then change = item.change24h
        changeLabel = m.content.createChild("Label")
        changeLabel.text = FormatChange(change)
        changeLabel.font = "font:MediumSystemFont"
        if change >= 0 then
            changeLabel.color = "0x00D88AFF"
        else
            changeLabel.color = "0xFF5860FF"
        end if
        changeLabel.translation = [x, 16]
        x = x + 200
    end for

    m.anim.control = "start"
end function

function FormatChange(value as Float) as String
    if value = invalid then value = 0
    rounded = Int(value * 100) / 100.0
    if value >= 0 then return "+" + Str(rounded).trim() + "%"
    return Str(rounded).trim() + "%"
end function
