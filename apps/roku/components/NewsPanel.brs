' NewsPanel.brs — vertical list of AI-summarized news articles.

sub init()
    m.list = m.top.findNode("list")
end sub

function setData(articles as Object) as Void
    root = CreateObject("roSGNode", "ContentNode")
    for each a in articles
        node = root.createChild("ContentNode")
        node.title = a.headline
        node.shortDescriptionLine1 = a.source + " • " + a.category
        node.shortDescriptionLine2 = a.summary
    end for
    m.list.content = root
end function
