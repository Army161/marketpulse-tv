' Dashboard.brs — focus handling + UI orchestration.
' Uses m. scope only (Roku best practice — no globals).
'
' All network I/O is delegated to the DataFetcher Task node, because
' roUrlTransfer is a MAIN|TASK-only component and cannot be created on the
' render thread where this scene runs. We set the task's baseUrl, kick it
' with control="RUN", and observe its output fields to update the UI.

sub init()
    m.config = GetConfig()
    m.ticker = m.top.findNode("ticker")
    m.cryptoGrid = m.top.findNode("cryptoGrid")
    m.newsPanel = m.top.findNode("newsPanel")
    m.moversList = m.top.findNode("moversList")
    m.status = m.top.findNode("status")

    m.moversList.setFocus(true)

    ' Background fetch task — network lives off the render thread.
    m.fetcher = CreateObject("roSGNode", "DataFetcher")
    m.fetcher.baseUrl = m.config.apiBaseUrl
    m.fetcher.observeField("stocks", "onStocks")
    m.fetcher.observeField("coins", "onCoins")
    m.fetcher.observeField("movers", "onMovers")
    m.fetcher.observeField("articles", "onArticles")
    m.fetcher.observeField("lastUpdated", "onLastUpdated")

    m.status.text = "Loading…"
    triggerRefresh()
    startRefreshTimer()
end sub

sub triggerRefresh()
    ' Re-running the task restarts its background fetch cycle.
    m.fetcher.control = "RUN"
end sub

sub onStocks()
    tickers = m.fetcher.stocks
    if tickers <> invalid then m.ticker.callFunc("setData", tickers)
end sub

sub onCoins()
    coins = m.fetcher.coins
    if coins <> invalid then m.cryptoGrid.callFunc("setData", coins)
end sub

sub onMovers()
    data = m.fetcher.movers
    if data = invalid then return
    items = []
    for each mv in data.gainers
        items.push({ title: "↑ " + mv.symbol + "  " + FormatPercent(mv.changePercent) })
    end for
    for each mv in data.losers
        items.push({ title: "↓ " + mv.symbol + "  " + FormatPercent(mv.changePercent) })
    end for
    m.moversList.content = BuildContentList(items)
end sub

sub onArticles()
    articles = m.fetcher.articles
    if articles <> invalid then m.newsPanel.callFunc("setData", articles)
end sub

sub onLastUpdated()
    m.status.text = "Last updated: " + m.fetcher.lastUpdated
end sub

sub startRefreshTimer()
    m.refreshTimer = CreateObject("roSGNode", "Timer")
    m.refreshTimer.duration = m.config.refreshSeconds
    m.refreshTimer.repeat = true
    m.refreshTimer.observeField("fire", "triggerRefresh")
    m.refreshTimer.control = "start"
end sub

function FormatPercent(value as Float) as String
    sign = ""
    if value > 0 then sign = "+"
    return sign + Str(Int(value * 100) / 100.0) + "%"
end function

function BuildContentList(items as Object) as Object
    root = CreateObject("roSGNode", "ContentNode")
    for each item in items
        node = root.createChild("ContentNode")
        node.title = item.title
    end for
    return root
end function
