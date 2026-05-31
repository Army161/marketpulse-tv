' MarketPulse TV — Roku entry point.
' Creates the SceneGraph application and shows the Dashboard scene.

sub Main()
    screen = CreateObject("roSGScreen")
    port = CreateObject("roMessagePort")
    screen.setMessagePort(port)

    screen.CreateScene("Dashboard")
    screen.show()

    ' Hand control to the message loop until the user exits.
    while true
        msg = wait(0, port)
        msgType = type(msg)
        if msgType = "roSGScreenEvent" then
            if msg.isScreenClosed() then return
        end if
    end while
end sub
