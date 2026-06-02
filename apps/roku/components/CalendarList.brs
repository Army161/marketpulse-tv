' CalendarList.brs — scrollable earnings calendar.

sub init()
    m.list = m.top.findNode("list")
end sub

' setData([{date, ticker, company, time, epsEst, epsActual, surprisePct, upcoming}])
function setData(events as Object) as Void
    root = CreateObject("roSGNode", "ContentNode")
    for each e in events
        node = root.createChild("ContentNode")
        node.title = PrettyDate(e.date)
        node.addField("ticker", "string", false)
        node.ticker = e.ticker
        node.addField("company", "string", false)
        node.company = e.company

        node.addField("epsText", "string", false)
        est = e.epsEst
        act = e.epsActual
        if act <> invalid and act <> ""
            node.epsText = "Est " + est + "  →  " + act
        else if est <> invalid and est <> ""
            node.epsText = "Est " + est
        else
            node.epsText = "—"
        end if

        node.addField("timeText", "string", false)
        t = e.time
        if t = invalid then t = ""
        if e.upcoming = false then t = t + "  (reported)"
        node.timeText = t
    end for
    m.list.content = root
    return
end function

' "2026-07-14" -> "Jul 14"
function PrettyDate(iso as String) as String
    if iso = invalid or Len(iso) < 10 then return iso
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    mm = Val(Mid(iso, 6, 2))
    dd = Mid(iso, 9, 2)
    if mm >= 1 and mm <= 12 then return months[mm-1] + " " + dd
    return iso
end function

function setListFocus(on as Boolean) as Void
    m.list.setFocus(on)
    return
end function
