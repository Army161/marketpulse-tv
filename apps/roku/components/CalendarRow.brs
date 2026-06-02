' CalendarRow.brs — one earnings calendar entry.

sub init()
    m.rowBg = m.top.findNode("rowBg")
    m.focusBar = m.top.findNode("focusBar")
    m.date = m.top.findNode("date")
    m.ticker = m.top.findNode("ticker")
    m.company = m.top.findNode("company")
    m.eps = m.top.findNode("eps")
    m.time = m.top.findNode("time")
    m.theme = Theme()
end sub

sub onContentSet()
    c = m.top.itemContent
    if c = invalid then return
    m.date.text = c.title          ' formatted date (e.g. "Jul 14")
    m.ticker.text = c.ticker
    m.company.text = c.company
    m.eps.text = c.epsText
    m.time.text = c.timeText
end sub

sub onSizeSet()
    w = m.top.width
    if w > 0 then m.rowBg.width = w
end sub

sub onFocusSet()
    if m.top.focusPercent > 0.5
        m.focusBar.visible = true
        m.rowBg.color = "0x1B263BFF"
        m.ticker.color = m.theme.colors.accent
    else
        m.focusBar.visible = false
        m.rowBg.color = "0x111B2B00"
        m.ticker.color = m.theme.colors.text
    end if
end sub
