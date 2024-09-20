package com.meditation.bliss

import android.media.AudioTrack
import android.media.AudioFormat
import android.media.AudioManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlin.concurrent.thread
import kotlin.math.PI
import kotlin.math.sin

class BinauralBeatsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var audioTrack: AudioTrack? = null

    override fun getName(): String {
        return "BinauralBeats"
    }

    @ReactMethod
    fun playBinauralBeats(baseFrequency: Double, beatFrequency: Double, duration: Int) { // duration is now Int
        thread {
            val sampleRate = 44100
            val numSamples = duration * sampleRate // No need to convert, duration is now Int

            // Stereo output - each short value holds left and right channels
            val buffer = ShortArray(numSamples * 2) // Multiply by 2 for stereo (Left + Right)

            for (i in 0 until numSamples) {
                // Left channel (base frequency)
                val leftSample = sin(2 * PI * i / (sampleRate / baseFrequency))

                // Right channel (base frequency + beat frequency)
                val rightSample = sin(2 * PI * i / (sampleRate / (baseFrequency + beatFrequency)))

                // Fill buffer - alternating left and right channels
                buffer[i * 2] = (leftSample * Short.MAX_VALUE).toInt().toShort()  // Left channel
                buffer[i * 2 + 1] = (rightSample * Short.MAX_VALUE).toInt().toShort()  // Right channel
            }

            audioTrack = AudioTrack(
                AudioManager.STREAM_MUSIC,
                sampleRate,
                AudioFormat.CHANNEL_OUT_STEREO,  // Ensure stereo output
                AudioFormat.ENCODING_PCM_16BIT,
                buffer.size,  // buffer.size is the correct number of samples, no need to multiply by 2
                AudioTrack.MODE_STATIC
            )

            audioTrack?.write(buffer, 0, buffer.size)
            audioTrack?.play()
        }
    }

    @ReactMethod
    fun stopBinauralBeats() {
        audioTrack?.stop()
        audioTrack?.release()
        audioTrack = null
    }
}
