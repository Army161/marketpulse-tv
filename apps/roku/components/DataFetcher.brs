' DataFetcher.brs — Task-thread network fetcher.
'
' Runs on a dedicated task thread (NOT the render thread), which is the only
' place roUrlTransfer is allowed to be created. Pulls all four data endpoints
' from the production backend and writes each result to an observed output
' field so the Dashboard scene can pick them up on the render thread.

sub init()
    m.top.functionName = "runFetch"
end sub

sub runFetch()
    base = m.top.baseUrl
    if base = invalid or base = "" then return

    stocks = HttpGetJson(base + "/api/stocks")
    if stocks <> invalid and stocks.tickers <> invalid then
        m.top.stocks = stocks.tickers
    end if

    crypto = HttpGetJson(base + "/api/crypto?limit=7")
    if crypto <> invalid and crypto.coins <> invalid then
        m.top.coins = crypto.coins
    end if

    movers = HttpGetJson(base + "/api/movers")
    if movers <> invalid then
        m.top.movers = movers
    end if

    news = HttpGetJson(base + "/api/news?limit=5")
    if news <> invalid and news.articles <> invalid then
        m.top.articles = news.articles
    end if

    m.top.lastUpdated = CurrentDateTimeString()
end sub

function CurrentDateTimeString() as String
    dt = CreateObject("roDateTime")
    return dt.asDateString("short-date") + " " + dt.asTimeStringLoc("short")
end function
