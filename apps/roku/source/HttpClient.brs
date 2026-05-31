' Async-friendly wrapper around roUrlTransfer for SceneGraph tasks.
' Returns parsed JSON (associative array) or invalid on failure.
'
' HTTPS hardening: EnablePeerVerification + EnableHostVerification default to
' true on Roku OS 11+, but we set them explicitly so older firmware also
' validates the server certificate against the bundled CA store.
'
' Timeout: 15s accommodates the worst-case latency of /api/news, which can
' spend several seconds on the upstream Gemini summarization round-trip.

function HttpGetJson(url as String) as Object
    transfer = CreateObject("roUrlTransfer")
    port = CreateObject("roMessagePort")
    transfer.setMessagePort(port)
    transfer.setUrl(url)
    transfer.setCertificatesFile("common:/certs/ca-bundle.crt")
    transfer.initClientCertificates()
    transfer.enablePeerVerification(true)
    transfer.enableHostVerification(true)
    transfer.addHeader("Accept", "application/json")

    if transfer.asyncGetToString() then
        msg = wait(15000, port)
        if type(msg) = "roUrlEvent" then
            code = msg.getResponseCode()
            if code = 200 then
                return ParseJson(msg.getString())
            else
                print "[HttpClient] non-200 from " ; url ; ": HTTP " ; code ; " reason=" ; msg.getFailureReason()
            end if
        else
            print "[HttpClient] timeout/no-event for " ; url
        end if
    else
        print "[HttpClient] asyncGetToString failed for " ; url
    end if
    return invalid
end function
