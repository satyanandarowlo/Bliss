package com.meditation.bliss

import android.media.AudioTrack
import android.media.AudioFormat
import android.media.AudioAttributes
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlin.concurrent.thread
import kotlin.math.PI
import kotlin.math.sin

class BinauralBeatsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var audioTrack: AudioTrack? = null
    private var isPlaying: Boolean = false

    override fun getName(): String {
        return "BinauralBeats"
    }

    @ReactMethod
    fun playBinauralBeats(baseFrequency: Double, beatFrequency: Double, duration: Int, volume: Float) { // Duration is in seconds, volume as float
        thread {
            val sampleRate = 44100
            val chunkDuration = 5 // Process audio in 5-second chunks
            val chunkSamples = chunkDuration * sampleRate // Number of samples in each chunk
            val buffer = ShortArray(chunkSamples * 2) // Stereo buffer for each chunk

            // Use AudioTrack.Builder to avoid the deprecated constructor
            audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                        .build()
                )
                .setBufferSizeInBytes(buffer.size)
                .build()

            audioTrack?.setVolume(volume)
            audioTrack?.play()
            isPlaying = true

            val totalChunks = duration / chunkDuration
            var currentSampleIndex = 0

            for (chunk in 0 until totalChunks) {
                if (!isPlaying) break

                for (i in 0 until chunkSamples) {
                    // Calculate left and right channel samples
                    val leftSample = sin(2 * PI * currentSampleIndex / (sampleRate / baseFrequency))
                    val rightSample = sin(2 * PI * currentSampleIndex / (sampleRate / (baseFrequency + beatFrequency)))

                    // Fill buffer - alternating left and right channels
                    buffer[i * 2] = (leftSample * Short.MAX_VALUE).toInt().toShort()  // Left channel
                    buffer[i * 2 + 1] = (rightSample * Short.MAX_VALUE).toInt().toShort()  // Right channel

                    currentSampleIndex++
                }

                // Write the chunk of audio to the AudioTrack for playback
                audioTrack?.write(buffer, 0, buffer.size)
            }

            stopBinauralBeats() // Stop after the full duration
        }
    }

    @ReactMethod
    fun setVolume(volume: Float) {
        audioTrack?.setVolume(volume)
    }

    @ReactMethod
    fun stopBinauralBeats() {
        // Ensure thread-safe access
        synchronized(this) {
            if (audioTrack != null && isPlaying) {
                isPlaying = false
                audioTrack?.stop()
                audioTrack?.flush() // Flush any remaining data in the buffer
                audioTrack?.release()
                audioTrack = null
            }
        }
    }

}
