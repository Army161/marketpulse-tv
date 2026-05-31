' Dashboard.brs — scene orchestrator.
' - Background DataFetcher (network off the render thread)
' - NavSidebar drives section switching
' - AssetList SELECT opens a DetailOverlay
' - BACK choreography: overlay -> content list -> sidebar -> exit
' - Live clock + blinking LIVE dot + 30s data refresh

sub init()
    m.theme = Theme()
    m.config = GetConfig()

    m.nav = m.top.findNode("nav")
    m.ticker = m.top.findNode("ticker")
    m.gauge = m.top.findNode("gauge")
    m.status = m.top.findNode("status")
    m.clock = m.top.findNode("clock")
    m.fngMini = m.top.findNode("fngMini")
    m.liveDot = m.top.findNode("liveDot")
    m.overlay = m.top.findNode("overlay")

    m.gainers = m.top.findNode("gainers")
    m.losers = m.top.findNode("losers")
    m.teaser = m.top.findNode("teaser")

    m.cryptoList = m.top.findNode("cryptoList")
    m.stocksList = m.top.findNode("stocksList")
    m.newsPanel = m.top.findNode("newsPanel")

    m.groups = {
        Dashboard: m.top.findNode("dashGroup")
        Crypto:    m.top.findNode("cryptoGroup")
        Stocks:    m.top.findNode("stocksGroup")
        News:      m.top.findNode("newsGroup")
    }

    m.currentSection = "Dashboard"
    m.inContent = false
    m.overlayOpen = false
    m.coins = []
    m.stocks = []

    ' Section + selection wiring
    m.nav.observeField("selectedSection", "onSectionChange")
    m.cryptoList.observeField("selectedPayload", "onCryptoSelected")
    m.stocksList.observeField("selectedPayload", "onStockSelected")

    startFetch()
    startTimers()

    ' Initial focus on the sidebar.
    m.nav.navFocus = true
end sub

' ---------- Data ----------
sub startFetch()
    m.fetcher = CreateObject("roSGNode", "DataFetcher")
    m.fetcher.baseUrl = m.config.apiBaseUrl
    m.fetcher.observeField("coins", "onCoins")
    m.fetcher.observeField("stocks", "onStocks")
    m.fetcher.observeField("movers", "onMovers")
    m.fetcher.observeField("articles", "onArticles")
    m.fetcher.observeField("sentiment", "onSentiment")
    m.fetcher.observeField("lastUpdated", "onLastUpdated")
    m.status.text = "Connecting to live market feed…"
    triggerRefresh()
end sub

sub triggerRefresh()
    m.fetcher.control = "RUN"
end sub

sub onCoins()
    m.coins = m.fetcher.coins
    if m.coins <> invalid
        m.cryptoList.callFunc("setData", m.coins)
        refreshTicker()
    end if
end sub

sub onStocks()
    m.stocks = m.fetcher.stocks
    if m.stocks <> invalid
        m.stocksList.callFunc("setData", m.stocks)
        refreshTicker()
    end if
end sub

sub refreshTicker()
    m.ticker.callFunc("setData", { coins: m.coins, stocks: m.stocks })
end sub

sub onMovers()
    data = m.fetcher.movers
    if data = invalid then return
    renderMovers(m.gainers, data.gainers, m.theme.colors.up, "▲ ")
    renderMovers(m.losers, data.losers, m.theme.colors.down, "▼ ")
end sub

sub renderMovers(container as Object, items as Object, color as String, arrow as String)
    while container.getChildCount() > 0
        container.removeChildIndex(0)
    end while
    if items = invalid then return
    y = 0
    for each mv in items
        row = container.createChild("Label")
        row.text = arrow + mv.symbol + "    " + FmtPct(mv.changePercent)
        row.font = "font:MediumBoldSystemFont"
        row.color = color
        row.translation = [0, y]
        y = y + 70
    end for
end sub

sub onArticles()
    articles = m.fetcher.articles
    if articles = invalid then return
    m.newsPanel.callFunc("setData", articles)
    ' teaser: top 3 headlines on the overview
    while m.teaser.getChildCount() > 0
        m.teaser.removeChildIndex(0)
    end while
    y = 0
    count = 0
    for each a in articles
        if count >= 4 then exit for
        lbl = m.teaser.createChild("Label")
        lbl.text = "•  " + a.headline
        lbl.font = "font:SmallSystemFont"
        lbl.color = m.theme.colors.textMuted
        lbl.width = 780
        lbl.maxLines = 2
        lbl.wrap = true
        lbl.translation = [0, y]
        y = y + 80
        count = count + 1
    end for
end sub

sub onSentiment()
    s = m.fetcher.sentiment
    if s = invalid then return
    m.gauge.callFunc("setData", s)
    m.fngMini.text = "Fear & Greed  " + Str(s.value).trim() + "  " + s.label
end sub

sub onLastUpdated()
    m.status.text = "Live market feed  •  updated " + m.fetcher.lastUpdated + "  •  auto-refresh 30s"
end sub

' ---------- Section switching ----------
sub onSectionChange()
    name = m.nav.selectedSection
    if name = invalid or m.groups[name] = invalid then return
    for each key in m.groups
        m.groups[key].visible = (key = name)
    end for
    m.currentSection = name

    ' Move focus into the section's list if it has one.
    if name = "Crypto"
        m.cryptoList.rowsFocus = true
        m.inContent = true
    else if name = "Stocks"
        m.stocksList.rowsFocus = true
        m.inContent = true
    else if name = "News"
        m.newsPanel.callFunc("setListFocus", true)
        m.inContent = true
    else
        m.nav.navFocus = true
        m.inContent = false
    end if
end sub

' ---------- Selection -> overlay ----------
sub onCryptoSelected()
    openOverlay(m.cryptoList.selectedPayload)
end sub

sub onStockSelected()
    openOverlay(m.stocksList.selectedPayload)
end sub

sub openOverlay(payload as Object)
    if payload = invalid then return
    m.overlay.callFunc("show", payload)
    m.overlayOpen = true
end sub

' ---------- Keys ----------
function onKeyEvent(key as String, press as Boolean) as Boolean
    if not press then return false

    if key = "back"
        if m.overlayOpen
            m.overlay.visible = false
            m.overlayOpen = false
            refocusContent()
            return true
        else if m.inContent
            m.nav.navFocus = true
            m.inContent = false
            return true
        end if
        return false   ' from sidebar/main -> let Roku exit the channel
    end if

    ' LEFT from a content list returns to the sidebar (nice-to-have).
    if key = "left" and m.inContent and not m.overlayOpen
        m.nav.navFocus = true
        m.inContent = false
        return true
    end if

    return false
end function

sub refocusContent()
    if m.currentSection = "Crypto"
        m.cryptoList.rowsFocus = true
    else if m.currentSection = "Stocks"
        m.stocksList.rowsFocus = true
    else if m.currentSection = "News"
        m.newsPanel.callFunc("setListFocus", true)
    else
        m.nav.navFocus = true
    end if
end sub

' ---------- Timers ----------
sub startTimers()
    m.refreshTimer = CreateObject("roSGNode", "Timer")
    m.refreshTimer.duration = m.config.refreshSeconds
    m.refreshTimer.repeat = true
    m.refreshTimer.observeField("fire", "triggerRefresh")
    m.refreshTimer.control = "start"

    m.clockTimer = CreateObject("roSGNode", "Timer")
    m.clockTimer.duration = 1
    m.clockTimer.repeat = true
    m.clockTimer.observeField("fire", "onTick")
    m.clockTimer.control = "start"
    m.blink = true
end sub

sub onTick()
    dt = CreateObject("roDateTime")
    dt.toLocalTime()
    m.clock.text = dt.asTimeStringLoc("short")
    ' blink the LIVE dot
    m.blink = not m.blink
    if m.blink
        m.liveDot.color = "0xFF3B47FF"
    else
        m.liveDot.color = "0xFF3B4733"
    end if
end sub
