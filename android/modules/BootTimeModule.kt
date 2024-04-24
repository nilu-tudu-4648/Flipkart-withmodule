package com.awesomemodule

import android.os.SystemClock

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BootTimeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BootTimeModule"
    }

    @ReactMethod
    fun getBootTime(callback: com.facebook.react.bridge.Callback) {
        val uptime = SystemClock.elapsedRealtime()
        callback.invoke(uptime)
    }
}
