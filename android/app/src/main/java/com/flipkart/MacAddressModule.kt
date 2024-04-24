package com.flipkart

import android.content.Context
import android.net.wifi.WifiInfo
import android.net.wifi.WifiManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MacAddressModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val wifiManager: WifiManager by lazy {
        reactContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
    }

    override fun getName(): String {
        return "MacAddressModule"
    }

    @ReactMethod
    fun getMacAddress(promise: Promise) {
        try {
            val wifiInfo: WifiInfo? = wifiManager.connectionInfo
            val macAddress: String? = wifiInfo?.macAddress
            promise.resolve(macAddress)
        } catch (e: Exception) {
            promise.reject("MAC_ADDRESS_ERROR", e)
        }
    }
}
