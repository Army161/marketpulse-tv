' DataFetcher.brs — Task-thread network fetcher (roUrlTransfer is task-only).
' Pulls all dashboard data and writes each result to an observed output field
' so the Dashboard scene picks it up on the render thread.

sub init()
    m.top.functionName = "runFetch"
end sub

sub runFetch()
    base = m.top.baseUrl
    if base = invalid or base = "" then return

    coins = HttpGetJson(base + "/api/crypto?limit=100")
    if coins <> invalid and coins.coins <> invalid then
        m.top.coins = coins.coins
    end if

    stocks = HttpGetJson(base + "/api/stocks")
    if stocks <> invalid and stocks.tickers <> invalid then
        m.top.stocks = stocks.tickers
    end if

    movers = HttpGetJson(base + "/api/movers")
    if movers <> invalid then
        m.top.movers = movers
    end if

    news = HttpGetJson(base + "/api/news?limit=8")
    if news <> invalid and news.articles <> invalid then
        m.top.articles = news.articles
    end if

    sentiment = HttpGetJson(base + "/api/sentiment")
    if sentiment <> invalid and sentiment.primary <> invalid then
        m.top.sentiment = sentiment.primary
    end if

    cal = HttpGetJson(base + "/api/calendar")
    if cal <> invalid and cal.earnings <> invalid then
        m.top.earnings = cal.earnings
    end if

    m.top.lastUpdated = CurrentDateTimeString()

    ' AI market brief (heavier on a server cache-miss; fetched last so it never
    ' delays the market data or the "updated" status line). Server caches 30 min,
    ' so most cycles return instantly.
    brief = HttpGetJson(base + "/api/brief")
    if brief <> invalid then
        m.top.brief = brief
    end if
end sub

function CurrentDateTimeString() as String
    dt = CreateObject("roDateTime")
    dt.toLocalTime()
    return dt.asTimeStringLoc("short")
end function
