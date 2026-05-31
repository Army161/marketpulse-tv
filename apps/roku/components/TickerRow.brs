' TickerRow.brs — broadcast chyron. Streams 20 crypto + 20 stocks continuously
' and seamlessly (content rendered twice; we scroll one length and repeat, so
' the second copy slides in with no gap). Fixes the old "4 tickers then repeat"
' bug, which was caused by a fixed 1920px interpolation regardless of content.

sub init()
    m.content = m.top.findNode("content")
    m.theme = Theme()
    m.singleWidth = 0
end sub

' setData expects { coins: [...], stocks: [...] }
function setData(payload as Object) as Void
    while m.content.getChildCount() > 0
        m.content.removeChildIndex(0)
    end while

    cells = []
    if payload.coins <> invalid
        for each c in payload.coins
            cells.push({ sym: c.symbol, price: c.price, chg: c.change24h })
        end for
    end if
    if payload.stocks <> invalid
        for each s in payload.stocks
            cells.push({ sym: s.symbol, price: s.price, chg: s.changePercent })
        end for
    end if
    if cells.count() = 0 then return

    ' Render the cell list TWICE for a seamless wrap.
    x = 0
    x = renderPass(cells, x)
    m.singleWidth = x          ' width of one full pass
    renderPass(cells, x)       ' second copy starts where the first ended

    startScroll()
    return
end function

function renderPass(cells as Object, startX as Integer) as Integer
    x = startX
    for each cell in cells
        ' Symbol (bold, white)
        symLbl = m.content.createChild("Label")
        symLbl.text = cell.sym
        symLbl.font = "font:SmallBoldSystemFont"
        symLbl.color = m.theme.colors.text
        symLbl.translation = [x, 32]
        x = x + estWidth(cell.sym, 19) + 12

        ' Price (muted)
        priceTxt = "$" + Str(Int(cell.price * 100) / 100.0).trim()
        prLbl = m.content.createChild("Label")
        prLbl.text = priceTxt
        prLbl.font = "font:SmallSystemFont"
        prLbl.color = m.theme.colors.textMuted
        prLbl.translation = [x, 32]
        x = x + estWidth(priceTxt, 16) + 10

        ' Change% (green/red)
        chg = cell.chg
        if chg = invalid then chg = 0
        chgTxt = FmtPct(chg)
        chgLbl = m.content.createChild("Label")
        chgLbl.text = chgTxt
        chgLbl.font = "font:SmallBoldSystemFont"
        chgLbl.color = ChangeColor(chg)
        chgLbl.translation = [x, 32]
        x = x + estWidth(chgTxt, 16) + 18

        ' Separator dot
        dot = m.content.createChild("Label")
        dot.text = "•"
        dot.font = "font:SmallSystemFont"
        dot.color = m.theme.colors.textDim
        dot.translation = [x, 32]
        x = x + 26
    end for
    return x
end function

' Rough text width estimate (Roku system fonts have no easy metric API at
' build time; per-char approximation is sufficient for ticker layout).
function estWidth(s as String, perChar as Integer) as Integer
    return Len(s) * perChar
end function

sub startScroll()
    if m.anim <> invalid then m.anim.control = "stop"

    m.anim = m.top.createChild("Animation")
    m.anim.duration = m.singleWidth / 150.0    ' ~150 px/sec
    m.anim.repeat = true
    m.anim.easeFunction = "linear"

    interp = m.anim.createChild("Vector2DFieldInterpolator")
    interp.fieldToInterp = "content.translation"
    interp.key = [0.0, 1.0]
    ' Scroll left by exactly one pass width; the duplicate copy fills the gap.
    interp.keyValue = [[240, 0], [240 - m.singleWidth, 0]]

    m.anim.control = "start"
end sub
