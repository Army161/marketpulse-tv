' Billing.brs — Roku Billing wrapper for premium subscription.
'
' SKU `marketpulse_premium_monthly` must be created in the Roku Developer
' Dashboard under Channel Store → Products before sideloading.

function HasActiveSubscription() as Boolean
    store = CreateObject("roChannelStore")
    store.setMessagePort(CreateObject("roMessagePort"))
    purchases = store.getPurchases()
    if purchases = invalid then return false

    config = GetConfig()
    for each p in purchases
        if p.code = config.skuPremium then return true
    end for
    return false
end function

function PurchasePremium() as Boolean
    store = CreateObject("roChannelStore")
    port = CreateObject("roMessagePort")
    store.setMessagePort(port)

    config = GetConfig()
    products = [{ code: config.skuPremium, qty: 1 }]
    store.setOrder(products)
    store.doOrder()

    msg = wait(30000, port)
    if type(msg) = "roChannelStoreEvent" then
        return msg.isRequestSucceeded()
    end if
    return false
end function

function RestorePurchases() as Boolean
    return HasActiveSubscription()
end function
