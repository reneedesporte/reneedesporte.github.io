---
layout: post
title:  "Detecting Frequencies in Audio Signals with Python"
date:   2024-08-02
categories: [python, signal processing]
---
> This post's labels were updated on August 2nd, 2024, but the original post was published earlier this summer. This is a follow-up on the `pitch_detector` series.

# Introduction
In my [previous post](https://reneedesporte.github.io/2024/07/07/musical-notes-and-frequency/), I mentioned that the necessity for a deeper dive into the Fourier Transform for finding frequencies in the context of my [`pitch_detector`](https://github.com/reneedesporte/pitch_detector) project. Instead of explaining the deeper conceptual ideas behind the Fourier Transform in this post (since [others](https://www.youtube.com/watch?v=spUNpyF58BY) have done a better job of that than I could here today), I'll go over my basic code approach to the `pitch_detector` project.

> `NOTE`: This post a journey through the trials and tribulations of writing code. Skip ahead to the [Conclusion section](#conclusion) to see where things went wrong (spoiler: it was just an array shape thing).

As always, there's lot of great resources out there for Signal Processing, like [MIT's DSP course](https://www.youtube.com/watch?v=rkvEM5Y3N60&list=PL8157CA8884571BA2), [Iain Explains](https://www.youtube.com/@iain_explains), and Wikipedia.

# Applying FFTs with Python
It's easy to apply an FFT in Python, using libraries like [`SciPy`](https://scipy.org/) and [`NumPy`](https://numpy.org/). We can see an example of the FFT put into practice on [SciPy's documentation page](https://docs.scipy.org/doc/scipy/tutorial/fft.html#d-discrete-fourier-transforms). Let's apply the same processing to an audio clip.

## Collecting Audio
```python
import sounddevice as sd
import numpy as np
import matplotlib.pyplot as plt
import scipy

duration = 5  # seconds
sr = 44100  # Hz
data = sd.rec(duration*sr, samplerate=sr, channels=1)
sd.wait()
plt.plot(np.linspace(0, seconds, len(data)), data)
plt.title("Audio Timeseries")
plt.ylabel("Amplitude")
plt.xlabel("Time (seconds)")
plt.tight_layout()
plt.show()
```

Below is the plot of the collected audio, in which I strummed the lowest note on my guitar, the low E string, which vibrates at 82 Hz.

![Low E](/assets/img/guitar_string_collected_audio.PNG)

## Applying the FFT

Now let's apply the FFT calculations to the audio. `scipy.fft.fft` calculates the amplitudes of component frequencies, while `scipy.fft.fftfreq` calculates the frequencies themselves based on a provided $sample rate \div period$.

```python
N = len(data)
T = 1.0 / sr
x = np.linspace(0.0, N*T, N, endpoint=False)
yf = scipy.fft.fft(data)
xf = scipy.fft.fftfreq(N, T)[:N//2]
plt.plot(xf, 2.0/N * np.abs(yf[0:N//2]))
plt.grid()
plt.title("Positive Frequencies")
plt.xlabel("Frequency (Hz)")
plt.tight_layout()
plt.show()
```

![Positive freqencies](/assets/img/positive_frequencies.PNG)

We expect to see a peak at 82 Hz, so let's zoom in on the plot:

![Zoomed in positive frequencies](/assets/img/zoomed_in_positive_freqs.PNG)

**This FFT plot is extremely noisy**, i.e., something doesn't seem right, which is what I was confused about in [my previous post](https://reneedesporte.github.io/2024/07/07/musical-notes-and-frequency/). The musical note should be very clear and loud compared to background noise. I even saved the array to a wavfile, so I could re-play it on my computer and give it a listen. So why does the FFT plot look so bad?

## Saving the Audio to Wavfile

```python
scipy.io.wavfile.write("test.wav", sr, data)
```

I played this wavfile back on my computer and confirmed the audio sounded good. Then, I _loaded the data back into Python from the saved wavfile_.

```python
sr2, data2 = scipy.io.wavfile.read("test.wav")
duration2 = len(data2)/sr2
plt.plot(np.linspace(0, duration2, len(data2)), data2)
plt.title("Audio Timeseries - Loaded from File")
plt.ylabel("Amplitude")
plt.xlabel("Time (seconds)")
plt.tight_layout()
plt.show()
```

The waveform looks the same as before. **However**, when I re-appled the FFT to the _loaded_ audio, I noticed something crazy!

```python
N = len(data2)
T = 1.0 / sr2
x = np.linspace(0.0, N*T, N, endpoint=False)
yf = scipy.fft.fft(data2)
xf = scipy.fft.fftfreq(N, T)[:N//2]
plt.plot(xf, 2.0/N * np.abs(yf[0:N//2]))
plt.grid()
plt.title("Positive Frequencies - Loaded from File")
plt.xlabel("Frequency (Hz)")
plt.tight_layout()
plt.show()
```

The FFT plot suddently looks great!
![FFT of loaded data](/assets/img/loaded_data_fft_freqs.PNG)
![Zoomed FFT of loaded data](/assets/img/loaded_data_fft_freqs_zoomed.PNG)

The frequencies detected from the Fourier Transform look way cleaner. When we zoom into the plot, we can see that expected peak near 82 Hz, as well as the much larger peak at the second harmonic, 164 Hz (the existence of which I'll discuss in the [Conclusion](#conclusion) section of this article).

**But why did this happen in Python?** Why did applying the FFT on the immediately-collected array work poorly, but applying the FFT to the audio loaded-from-file work well?

After investigating several things about `data` (the audio recorded by `sounddevice`) versus `data2` (the audio loaded from file), I discovered that the two arrays were identical _except for their shapes_.

```python
print(data.shape, data2.shape)
>>> (220500, 1) (220500,)
```

This affects the FFT calculation because [the FFT is performed along the last axis of the input array by default](https://docs.scipy.org/doc/scipy/reference/generated/scipy.fft.fft.html). Thus, when I added the correct `axis` parameter, I get the expected result for the FFT on `data`:

```python
yf = scipy.fft.fft(data, axis=0)
```

Alternatively, we could [`flatten()`](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flatten.html) `data` before giving it to the `fft()` function.

# Extracting Frequencies from the FFT Calculation

We could extract the peaks of the FFT calculation using numpy... or we could use the convenient [`scipy.signal.find_peaks`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.find_peaks.html). I'll use the latter so as not to re-invent the wheel.

```python
N = len(data)
T = 1.0 / sr
yf = scipy.fft.fft(data, axis=0)
yf = 2.0/N * np.abs(yf[0:N//2]).flatten()  # We only care about positive freqs.
xf = scipy.fft.fftfreq(N, T)[:N//2]
peaks = xf[scipy.signal.find_peaks(yf, height=7*np.std(yf))[0]]
```

By setting the minimum peak height to be quite large, we can extract only the most prominent peaks. When we test this on audio containing the tuning frequency A440 (440 Hz), 3 peaks are found, all of which are harmonics of the note we played: 440 Hz (the first harmonic - the musical note A), 880 Hz (the second harmonic - also the musical note A), and 1320 Hz (**the third harmonic, the musical note E!**).

# Conclusion
Check out [my GitHub repo](https://github.com/reneedesporte/pitch_detector) for the code I've written for this project! And thanks again for reading.

## Things I Learned
- Regarding the supposed "bug" with the `scipy.fft.fft` calculation, **it's important to remember what our input array shape should look like** as well as along what axis a calculation is being performed.
- Regarding musical [harmonics](https://simple.wikipedia.org/wiki/Harmonic_series_%28music%29): **doubling** a musical note's frequency will result in the same note, though an octave higher. **Tripling** the original note's frequency will result in a **different** musical note, which will in fact be the original note's [perfect fifth](https://en.wikipedia.org/wiki/Perfect_fifth).

## Thing to Continue Investigating
Why is the second harmonic frequency sometimes easily detected with the FFT, as shown in the example above with the middle-C?
