' Central configuration for the Roku app.
' apiBaseUrl points at the deployed production backend by default.
' Override to "http://<host>:3000" when running against a local backend.

function GetConfig() as Object
    return {
        apiBaseUrl: "https://marketpulse-tv.vercel.app"
        refreshSeconds: 30
        newsRefreshSeconds: 300
        skuPremium: "marketpulse_premium_monthly"
    }
end function
