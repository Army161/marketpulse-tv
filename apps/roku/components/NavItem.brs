' NavItem.brs — itemComponent for the NavSidebar.

sub init()
    m.bg = m.top.findNode("bg")
    m.focusBar = m.top.findNode("focusBar")
    m.label = m.top.findNode("label")
    m.theme = Theme()
end sub

sub onContentSet()
    c = m.top.itemContent
    if c <> invalid then m.label.text = c.title
end sub

sub onFocusSet()
    if m.top.focusPercent > 0.5
        m.focusBar.visible = true
        m.bg.color = "0x16223399"
        m.label.color = m.theme.colors.accent
    else
        m.focusBar.visible = false
        m.bg.color = "0x00000000"
        m.label.color = m.theme.colors.textMuted
    end if
end sub
