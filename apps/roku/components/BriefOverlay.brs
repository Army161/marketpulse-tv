' BriefOverlay.brs — full-screen AI market-brief reader + audio player.
' Shows the spoken-brief script; plays the MP3 when an audioUrl is present
' (audio activates once Google TTS + Vercel Blob are wired on the backend).
' No modals on TV per UX rules — Dashboard shows/hides this and BACK dismisses.

sub init()
    m.title = m.top.findNode("title")
    m.status = m.top.findNode("status")
    m.script = m.top.findNode("script")
    m.player = m.top.findNode("player")
    m.top.visible = false
end sub

' show(brief) where brief = { scriptText, audioUrl, voice, source, generatedAt }
function show(brief as Object) as Void
    notReady = "Your daily brief isn't ready yet. It will appear here once the live feed has generated today's summary."

    if brief = invalid
        m.script.text = notReady
        m.status.text = ""
        m.top.visible = true
        return
    end if

    txt = brief.scriptText
    if txt = invalid or txt = "" then txt = notReady
    m.script.text = txt

    url = brief.audioUrl
    if url <> invalid and url <> ""
        m.status.text = "▶  Playing audio…"
        content = CreateObject("roSGNode", "ContentNode")
        content.url = url
        content.streamFormat = "mp3"
        m.player.content = content
        m.player.control = "play"
    else
        m.status.text = "Audio coming soon — read along below."
    end if

    m.top.visible = true
    return
end function

function hide() as Void
    if m.player <> invalid then m.player.control = "stop"
    m.top.visible = false
    return
end function
