---
layout: post
title:  "Musical Notes and Frequency"
date:   2024-07-07
categories: [music theory, python, signal processing, pitch detector]
---
# Introduction
This post goes hand-in-hand with [a GitHub project I'm working on](https://github.com/reneedesporte/pitch_detector). This is part of the background research that's gone into understanding pitch and frequency in the context of human hearing and the Chromatic scale.

# The Chromatic Scale
"The chromatic scale is a musical scale with twelve pitches" ([source](https://en.wikipedia.org/wiki/Chromatic_scale)) &mdash; C, C#, D, D#, E, F, F#, G#, A, A#, and B &mdash; each of which represents a specific frequency within an [octave](https://en.wikipedia.org/wiki/Octave). An octave is the interval (of frequencies) between two adjacent [harmonic](https://en.wikipedia.org/wiki/Harmonic#:~:text=In%20physics%2C%20acoustics%2C%20and%20telecommunications,are%20known%20as%20higher%20harmonics.) pitches (which in the chromatic scale are [given the same name](https://en.wikipedia.org/wiki/Chromatic_scale#Notation)). The twelve pitches in an octave are [equal-tempered](https://www.britannica.com/art/equal-temperament), meaning each pitch is a multiple of the prior pitch by a factor of $2^{1/12} ≈ 1.05946$. 

See the [table below](https://mixbutton.com/music-tools/frequency-and-pitch/music-note-to-frequency-chart#1st) for a look at all the frequencies of pitches in the chromatic scale.

![Frequencies of Musical Pitches](/assets/img/freqpitchtable.png "Frequencies of Musical Pitches")


# The Nyquist Theorem
> "The Nyquist theorem states that an analog signal can be digitized without aliasing error if and only if the sampling rate is greater than or equal to twice the highest frequency component in a given signal." ([source](https://www.sciencedirect.com/topics/engineering/nyquist-theorem))

Most microphones are capable of at least [44.1 kHz](https://resoundsound.com/sample-rate-bit-depth/), so any sound heard by [the human ear](https://en.wikipedia.org/wiki/Hearing_range) can be captured with enough fidelity.

# Frequency Extraction
My first thought when approaching [this application](https://github.com/reneedesporte/pitch_detector) was to apply a [Fourier Transform](https://en.wikipedia.org/wiki/Fourier_transform), which breaks down a signal into its component frequencies. In fact (as of Jul 7th, 2024), the Wikipedia article on the Fourier transform contains an example of [this exact application](https://en.wikipedia.org/wiki/Fourier_transform#/media/File:CQT-piano-chord.png), i.e., of utilizing the Fourier transform to determine the constituent pitches in a musical waveform:

![Piano Chord to Spectrogram](/assets/img/CQT-piano-chord.png)

### Fourier Transform on Recorded Audio
When I tried to utilize the Fourier Transform on a piece of audio I recorded, I could not see any obvious frequencies extracted, though the recorded audio contained a fairly clear recording of me whistling a single musical note. The following plots show the waveform and power-spectrum of the recorded audio.

![Raw waveform of 2-second whistle](/assets/img/timeseries.png) **Raw waveform of a 2-second recording containing a whistle (single note and noise).**

![Power spectrum of 2-second whistle](/assets/img/fft.png) **Power Spectrum calculated from the above waveform using [SciPy](https://docs.scipy.org/doc/scipy/tutorial/fft.html#d-discrete-fourier-transforms).**

# Conclusion
I'll end the post here, since the background research regarding musical notes and frequency has been concluded. Subsequent posts and research will involve a deeper dive into the Fourier Transform and other signal processing methods.
