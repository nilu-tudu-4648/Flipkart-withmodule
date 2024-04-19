package com.awesomemodule

import android.os.Build
import android.util.DisplayMetrics
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.opengl.GLES10
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import android.os.Build.VERSION
import android.os.Build.VERSION_CODES
import com.facebook.react.bridge.WritableMap
import android.os.SystemClock
import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import kotlin.math.abs
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.*

class AwesomeModuleModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), SensorEventListener {

   private var sensorManager: SensorManager? = null
    private var proximitySensor: Sensor? = null
    private var isSensorRegistered: Boolean = false
    private var isNear: Boolean = false

    override fun getName(): String {
        return NAME
    }
    
       init {
        sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        proximitySensor = sensorManager?.getDefaultSensor(Sensor.TYPE_PROXIMITY)
        registerProximitySensor()
    }

    override fun onCatalystInstanceDestroy() {
        unregisterProximitySensor()
        super.onCatalystInstanceDestroy()
    }

    private fun registerProximitySensor() {
        if (!isSensorRegistered && sensorManager != null && proximitySensor != null) {
            sensorManager?.registerListener(
                this,
                proximitySensor,
                SensorManager.SENSOR_DELAY_NORMAL
            )
            isSensorRegistered = true
        }
    }

    private fun unregisterProximitySensor() {
        if (isSensorRegistered && sensorManager != null) {
            sensorManager?.unregisterListener(this)
            isSensorRegistered = false
        }
    }

    @ReactMethod
    fun getProximityData(promise: Promise) {
        val proximityData = Arguments.createMap()
        proximityData.putBoolean("isNear", isNear)
        promise.resolve(proximityData)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not needed for proximity sensor
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_PROXIMITY) {
            val distance = event.values[0]
            isNear = distance < (proximitySensor?.maximumRange ?: 0f)
            sendEvent("ProximityData", isNear)
        }
    }

    private fun sendEvent(eventName: String, data: Any) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }

    @ReactMethod
    fun getBootTime(promise: Promise) {
        try {
            val bootTimeMillis = SystemClock.elapsedRealtime()
            promise.resolve(bootTimeMillis)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getKernelInformation(promise: Promise) {
        try {
            val kernelVersion = System.getProperty("os.version")
            val kernelArchitecture = System.getProperty("os.arch")
            val kernelInformation = "$kernelVersion ($kernelArchitecture)"
            promise.resolve(kernelInformation)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getColorDepth(promise: Promise) {
        try {
            val colorDepth = Build.VERSION.SDK_INT
            promise.resolve(colorDepth.toString())
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getDeviceCores(promise: Promise) {
        try {
            val cores = if (VERSION.SDK_INT >= VERSION_CODES.JELLY_BEAN_MR1) {
                Runtime.getRuntime().availableProcessors()
            } else {
                1 // Fallback to 1 if the API level is lower than Jelly Bean MR1
            }
            promise.resolve(cores)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getGPUDetails(promise: Promise) {
        val gpuDetails = HashMap<String, String>()
        try {
            val extensions = GLES10.glGetString(GLES10.GL_EXTENSIONS)
            val renderer = GLES10.glGetString(GLES10.GL_RENDERER)
            val version = GLES10.glGetString(GLES10.GL_VERSION)

            gpuDetails["extensions"] = extensions ?: ""
            gpuDetails["renderer"] = renderer ?: ""
            gpuDetails["version"] = version ?: ""

            promise.resolve(gpuDetails)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getViewPort(promise: Promise) {
        try {
            val displayMetrics = getCurrentActivity()?.resources?.displayMetrics
            val widthPixels = displayMetrics?.widthPixels ?: 0
            val heightPixels = displayMetrics?.heightPixels ?: 0

            val viewportSize = Arguments.createMap().apply {
                putInt("width", widthPixels)
                putInt("height", heightPixels)
            }
            promise.resolve(viewportSize)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    companion object {
        const val NAME = "AwesomeModule"
    }
}
