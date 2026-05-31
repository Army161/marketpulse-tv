' NewsPanel.brs — scrollable list of AI-summarized headlines.

sub init()
    m.list = m.top.findNode("list")
end sub

function setData(articles as Object) as Void
    root = CreateObject("roSGNode", "ContentNode")
    for each a in articles
        node = root.createChild("ContentNode")
        src = a.source
        if src = invalid then src = ""
        cat = a.category
        if cat = invalid then cat = ""
        node.title = "[" + cat + "]  " + a.headline + "   — " + src
    end for
    m.list.content = root
    return
end function

function setListFocus(on as Boolean) as Void
    m.list.setFocus(on)
    return
end function
