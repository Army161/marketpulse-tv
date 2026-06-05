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
    m.calendarList = m.top.findNode("calendarList")

    ' new page refs
    m.gauge2 = m.top.findNode("gauge2")
    m.sentExplain = m.top.findNode("sentExplain")
    m.settingsRows = m.top.findNode("settingsRows")
    m.pricingCards = m.top.findNode("pricingCards")

    m.groups = {
        Home:      m.top.findNode("dashGroup")
        Crypto:    m.top.findNode("cryptoGroup")
        Stocks:    m.top.findNode("stocksGroup")
        News:      m.top.findNode("newsGroup")
        Calendar:  m.top.findNode("calendarGroup")
        Sentiment: m.top.findNode("sentimentGroup")
        Settings:  m.top.findNode("settingsGroup")
        Upgrade:   m.top.findNode("upgradeGroup")
    }

    m.currentSection = "Home"
    m.inContent = false
    m.overlayOpen = false
    m.coins = []
    m.stocks = []

    buildSettings()
    buildPricing()

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
    m.fetcher.observeField("earnings", "onEarnings")
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
    m.gauge2.callFunc("setData", s)
    m.fngMini.text = "Fear & Greed  " + Str(s.value).trim() + "  " + s.label
    m.sentExplain.text = SentimentBlurb(s.value) + Chr(10) + Chr(10) + "Source: " + s.source + "  •  updates daily."
end sub

function SentimentBlurb(v as Integer) as String
    if v < 25 then return "Extreme Fear (" + Str(v).trim() + "). Investors are very worried — historically a zone where assets are oversold and contrarian buyers start looking for value."
    if v < 45 then return "Fear (" + Str(v).trim() + "). Caution dominates the market; sentiment is risk-off but not panicked."
    if v < 55 then return "Neutral (" + Str(v).trim() + "). The market is balanced between fear and greed — no strong directional bias in sentiment."
    if v < 75 then return "Greed (" + Str(v).trim() + "). Optimism is rising; momentum is positive but watch for froth."
    return "Extreme Greed (" + Str(v).trim() + "). Euphoria dominates — historically a zone where markets can be due for a pullback."
end function

sub onEarnings()
    e = m.fetcher.earnings
    if e <> invalid then m.calendarList.callFunc("setData", e)
end sub

sub onLastUpdated()
    m.status.text = "Live market feed  •  updated " + m.fetcher.lastUpdated + "  •  auto-refresh 30s"
end sub

' ---------- Section switching ----------
sub onSectionChange()
    name = m.nav.selectedSection
    if name = invalid or name = "" then return

    targetGroup = m.groups[name]
    if targetGroup = invalid
        print "[Dashboard] unknown section: " + name
        return
    end if

    ' BrightScript "for each x in AA" gives VALUES not keys.
    ' Hide all groups explicitly by name to avoid that trap.
    m.groups["Home"].visible      = (name = "Home")
    m.groups["Crypto"].visible    = (name = "Crypto")
    m.groups["Stocks"].visible    = (name = "Stocks")
    m.groups["News"].visible      = (name = "News")
    m.groups["Calendar"].visible  = (name = "Calendar")
    m.groups["Sentiment"].visible = (name = "Sentiment")
    m.groups["Settings"].visible  = (name = "Settings")
    m.groups["Upgrade"].visible   = (name = "Upgrade")

    m.currentSection = name
    m.inContent = false

    ' Route focus with guards on every node ref.
    if name = "Crypto" and m.cryptoList <> invalid
        m.cryptoList.rowsFocus = true
        m.inContent = true
    else if name = "Stocks" and m.stocksList <> invalid
        m.stocksList.rowsFocus = true
        m.inContent = true
    else if name = "News" and m.newsPanel <> invalid
        m.newsPanel.callFunc("setListFocus", true)
        m.inContent = true
    else if name = "Calendar" and m.calendarList <> invalid
        m.calendarList.callFunc("setListFocus", true)
        m.inContent = true
    else
        if m.nav <> invalid then m.nav.navFocus = true
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
    if m.currentSection = "Crypto" and m.cryptoList <> invalid
        m.cryptoList.rowsFocus = true
    else if m.currentSection = "Stocks" and m.stocksList <> invalid
        m.stocksList.rowsFocus = true
    else if m.currentSection = "News" and m.newsPanel <> invalid
        m.newsPanel.callFunc("setListFocus", true)
    else if m.currentSection = "Calendar" and m.calendarList <> invalid
        m.calendarList.callFunc("setListFocus", true)
    else
        if m.nav <> invalid then m.nav.navFocus = true
    end if
end sub

' ---------- Settings page (glass info rows) ----------
sub buildSettings()
    rows = [
        ["Refresh rate", "30 seconds (auto)"],
        ["Stocks data", "Alpaca Markets (live)"],
        ["Crypto data", "CoinGecko (live)"],
        ["News", "NewsAPI + Gemini AI summaries"],
        ["Sentiment", "Alternative.me Fear & Greed"],
        ["Theme", "MarketPulse Dark — Glass"],
        ["Version", "1.0  (build 00009)"],
        ["Privacy", "marketpulse-tv.vercel.app/privacy"]
    ]
    y = 0
    for each r in rows
        lbl = m.settingsRows.createChild("Label")
        lbl.text = r[0]
        lbl.font = "font:MediumBoldSystemFont"
        lbl.color = m.theme.colors.textMuted
        lbl.translation = [0, y]
        lbl.width = 440

        val = m.settingsRows.createChild("Label")
        val.text = r[1]
        val.font = "font:MediumSystemFont"
        val.color = m.theme.colors.text
        val.translation = [470, y]
        val.width = 620
        y = y + 60
    end for
end sub

' ---------- Upgrade page (glass pricing cards) ----------
sub buildPricing()
    tiers = [
        { name: "FREE", price: "$0", accent: m.theme.colors.textMuted, feats: ["60s refresh", "Basic ticker", "Ad-supported (Roku)"] },
        { name: "PREMIUM", price: "$9.99/mo", accent: m.theme.colors.accent, feats: ["10s refresh", "Full markets data", "AI news feed", "Ad-free"] },
        { name: "PRO", price: "$14.99/mo", accent: m.theme.colors.up, feats: ["Everything in Premium", "Portfolio tracker", "Custom watchlist", "Price alerts"] }
    ]
    x = 0
    for each t in tiers
        card = m.pricingCards.createChild("Poster")
        card.uri = "pkg:/images/glass_panel.9.png"
        card.width = 370
        card.height = 580
        card.translation = [x, 0]

        nm = card.createChild("Label")
        nm.text = t.name
        nm.font = "font:LargeBoldSystemFont"
        nm.color = t.accent
        nm.translation = [36, 36]

        pr = card.createChild("Label")
        pr.text = t.price
        pr.font = "font:MediumBoldSystemFont"
        pr.color = m.theme.colors.text
        pr.translation = [36, 120]

        ' step of 84 leaves room for a feature that wraps to 2 lines (e.g.
        ' "Everything in Premium") without colliding with the next feature.
        fy = 206
        for each f in t.feats
            fl = card.createChild("Label")
            fl.text = "•  " + f
            fl.font = "font:MediumSystemFont"
            fl.color = m.theme.colors.textMuted
            fl.translation = [36, fy]
            fl.width = 320
            fl.wrap = true
            fl.maxLines = 2
            fy = fy + 84
        end for
        x = x + 400
    end for
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
        m.liveDot.color = "0xF43F5EFF"
    else
        m.liveDot.color = "0xF43F5E55"
    end if
end sub
