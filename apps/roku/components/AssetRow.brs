' AssetRow.brs — itemComponent for the AssetList MarkupList.
' Renders one asset (symbol / price / change%) with a focus highlight.

sub init()
    m.rowBg = m.top.findNode("rowBg")
    m.focusBar = m.top.findNode("focusBar")
    m.sym = m.top.findNode("sym")
    m.price = m.top.findNode("price")
    m.chg = m.top.findNode("chg")
    m.theme = Theme()
end sub

sub onContentSet()
    c = m.top.itemContent
    if c = invalid then return
    m.sym.text = c.title
    m.price.text = c.priceText
    m.chg.text = c.changeText
    if c.changeColor <> invalid and c.changeColor <> "" then
        m.chg.color = c.changeColor
    end if
end sub

sub onSizeSet()
    w = m.top.width
    if w > 0
        m.rowBg.width = w
        ' right-align the change column to the row width
        m.chg.translation = [w - 220, 18]
    end if
end sub

' focusPercent goes 0->1 as the row gains focus; show the accent bar + a
' subtle fill so the focused row clearly stands out (broadcast highlight).
sub onFocusSet()
    f = m.top.focusPercent
    if f > 0.5
        m.focusBar.visible = true
        m.rowBg.color = "0x1B2A40FF"
        m.sym.color = m.theme.colors.accent
    else
        m.focusBar.visible = false
        m.rowBg.color = "0x111B2B00"
        m.sym.color = m.theme.colors.text
    end if
end sub
