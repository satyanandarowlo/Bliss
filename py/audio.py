import numpy as np
from scipy.io.wavfile import write

# Parameters
sample_rate = 44100  # Samples per second
duration = 30  # seconds
frequency_left = 310  # Left ear frequency in Hz
frequency_right = 315  # Right ear frequency in Hz

# Generate time points
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

# Generate sine waves for both left and right ears
sine_wave_left = 0.5 * np.sin(2 * np.pi * frequency_left * t)
sine_wave_right = 0.5 * np.sin(2 * np.pi * frequency_right * t)

# Combine into stereo (left, right) and convert to 16-bit PCM format
stereo_wave = np.column_stack((sine_wave_left, sine_wave_right))
stereo_wave_16bit = np.int16(stereo_wave * 32767)  # Convert to 16-bit PCM

# Write the stereo wave to a WAV file
write('binaural_beat2.wav', sample_rate, stereo_wave_16bit)
