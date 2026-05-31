' NavItem.brs — itemComponent for the NavSidebar (glassmorphism focus).

sub init()
    m.glass = m.top.findNode("glass")
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
        m.glass.visible = true
        m.focusBar.visible = true
        m.label.color = m.theme.colors.text
    else
        m.glass.visible = false
        m.focusBar.visible = false
        m.label.color = m.theme.colors.textMuted
    end if
end sub
