' FearGreedGauge.brs — broadcast-style sentiment gauge.
' Positions a marker along the red->green gradient bar by the 0-100 value and
' colors the value/label to match the sentiment zone.

sub init()
    m.value = m.top.findNode("value")
    m.label = m.top.findNode("label")
    m.marker = m.top.findNode("marker")
    m.bar = m.top.findNode("bar")
    m.theme = Theme()
end sub

' setData expects { value: 0-100, label: "Fear", source: "..." }
function setData(s as Object) as Void
    if s = invalid then return
    v = s.value
    if v = invalid then v = 50

    m.value.text = Str(v).trim()
    m.label.text = UCase(s.label)

    color = ZoneColor(v)
    m.value.color = color
    m.label.color = color

    ' Position marker along the 520px bar.
    barX = 0
    barW = 520
    mx = barX + Int((v / 100.0) * barW)
    if mx < barX then mx = barX
    if mx > barX + barW - 6 then mx = barX + barW - 6
    m.marker.translation = [mx, 172]
    m.marker.color = color
    return
end function

function ZoneColor(v as Integer) as String
    th = Theme()
    if v < 25 then return th.colors.down            ' extreme fear -> red
    if v < 45 then return "0xFF8A3DFF"              ' fear -> orange
    if v < 55 then return th.colors.accent          ' neutral -> gold
    if v < 75 then return "0xAED81FFF"              ' greed -> lime
    return th.colors.up                              ' extreme greed -> green
end function
