package com.awesomemodule

import android.content.Context
import android.net.wifi.WifiManager
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WifiSsidModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WifiSsidModule"
    }

    @ReactMethod
    fun getWifiSsid(callback: Callback) {
        val wifiManager = reactApplicationContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        val connectionInfo = wifiManager.connectionInfo
        val ssid = connectionInfo.ssid?.replace("\"", "") // Remove quotes if present
        callback.invoke(ssid)
    }
}
