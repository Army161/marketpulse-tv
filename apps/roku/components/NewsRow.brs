' NewsRow.brs — rich news card itemComponent (thumbnail + headline + ticker
' chips + source/category meta). Reads custom fields set by NewsPanel.

sub init()
    m.rowBg = m.top.findNode("rowBg")
    m.focusBar = m.top.findNode("focusBar")
    m.thumb = m.top.findNode("thumb")
    m.headline = m.top.findNode("headline")
    m.tickers = m.top.findNode("tickers")
    m.meta = m.top.findNode("meta")
    m.theme = Theme()
end sub

sub onContentSet()
    c = m.top.itemContent
    if c = invalid then return
    m.headline.text = c.title

    if c.tickersText <> invalid and c.tickersText <> ""
        m.tickers.text = c.tickersText
        m.tickers.visible = true
    else
        m.tickers.visible = false
    end if

    m.meta.text = c.metaText

    ' thumbnail: only show if a URL is present; otherwise hide and pull text left.
    ' y-positions give a 2-line headline (ends ~y=94) clearance above the ticker
    ' line (y=104); meta at y=134 fits inside the 172px row.
    if c.imageUri <> invalid and c.imageUri <> ""
        m.thumb.uri = c.imageUri
        m.thumb.visible = true
        m.headline.translation = [212, 14]
        m.tickers.translation = [212, 104]
        m.meta.translation = [212, 134]
    else
        m.thumb.visible = false
        m.headline.translation = [24, 14]
        m.tickers.translation = [24, 104]
        m.meta.translation = [24, 134]
    end if
end sub

sub onSizeSet()
    w = m.top.width
    if w > 0 then m.rowBg.width = w
end sub

sub onFocusSet()
    if m.top.focusPercent > 0.5
        m.focusBar.visible = true
        m.rowBg.color = "0x1B263BFF"
        m.headline.color = m.theme.colors.accent
    else
        m.focusBar.visible = false
        m.rowBg.color = "0x111B2B00"
        m.headline.color = m.theme.colors.text
    end if
end sub
