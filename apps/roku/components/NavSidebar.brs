' NavSidebar.brs — vertical section navigation (D-pad).
' SELECT (or focus change) publishes the chosen section name.

sub init()
    m.list = m.top.findNode("list")
    m.sections = ["Dashboard", "Crypto", "Stocks", "News"]

    root = CreateObject("roSGNode", "ContentNode")
    for each s in m.sections
        node = root.createChild("ContentNode")
        node.title = s
    end for
    m.list.content = root
    m.list.observeField("itemSelected", "onItemSelected")
    m.list.jumpToItem = 0
end sub

sub onItemSelected()
    idx = m.list.itemSelected
    if idx >= 0 and idx < m.sections.count()
        m.top.selectedSection = m.sections[idx]
    end if
end sub

sub onFocusReq()
    if m.top.navFocus then m.list.setFocus(true)
end sub
