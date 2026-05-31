' Raf.brs — Roku Advertising Framework wrapper.
'
' Free-tier users see pre-roll / interstitial ads inserted by RAF. Roku
' splits revenue with the developer automatically when ads are served
' through this framework — third-party ad SDKs are NOT permitted.
'
' Call ShowPreRoll() before transitioning to any video playback surface
' (in MVP that's a future feature — this stub keeps the integration
' point ready so it doesn't get bolted on later).

function CreateAdIface() as Object
    adIface = Roku_Ads()
    adIface.setAdUrl("")  ' Will be set per-stream when video playback ships
    adIface.setContentGenre("News")
    adIface.setContentLength(0)
    return adIface
end function

function ShowPreRoll(stream as Object) as Boolean
    adIface = CreateAdIface()
    ads = adIface.getAds()
    if ads = invalid or ads.count() = 0 then return true

    rendered = adIface.showAds(ads, invalid, stream)
    return rendered
end function

function ShouldShowAds(entitled as Boolean) as Boolean
    ' Free tier sees ads; premium subscribers don't.
    return not entitled
end function
