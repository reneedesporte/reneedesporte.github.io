---
layout: post
title:  "Detecting Musical Notes in Python \u2014 Updates"
date:   2025-04-28
categories: [python, signal processing, pitch detector]
---

# Introduction
In my [last post](https://reneedesporte.github.io/2024/08/02/detecting-frequencies-in-audio-signals-with-python/), I introduced my [`pitch_detector`](https://github.com/reneedesporte/pitch_detector) project, the goal of which is to detect musical notes from recorded audio. In this post, I'll provide a quick update on my (very slow) progress on the project:
- Using [`uv`](https://docs.astral.sh/uv/)
- Calculating musical notes from frequency
- Writing tests
Please feel free to download and run the program yourself to test it out! ([Link again to code](https://github.com/reneedesporte/pitch_detector))

# Using `uv`
One of the first things I did when returning to this project was initialize the project with [`uv`](https://docs.astral.sh/uv/), which was introduced to me by [Todd Valentic](https://github.com/valentic). It's really simple to use and makes tracking dependencies, creating virtual environments, and sharing code really easy.

# Calculating musical notes from frequency
I also finally finished the main goal of the program: converting frequencies into musical notes. I'll ignore how I extracted frequencies from recorded audio. Instead, I'll just focus on how I came up with a function that does this:
```python
musical_note, octave = f(frequency_Hz)
```

## [12 equal temperament](https://en.wikipedia.org/wiki/12_equal_temperament)
As discussed in [previous posts](https://reneedesporte.github.io/2024/08/02/detecting-frequencies-in-audio-signals-with-python/), musical notes of the chromatic scale are equal-tempered (equidistant) on a logarithmic scale, which we can see clearly if we look at frequencies of the 0th octave:

![Logarithmic plot](/assets/img/desmos_plot_frequencies.png)

If we just look at the 0th octave, we can determine which musical note a given frequency is closest to (logarithmically) with this formula:
<div style="text-align: center;">
$note = min (abs (\log_2(notes) - \log_2(frequency)))$
</div>
This works for:
<div style="text-align: center;">
$min(notes) < frequency < max(notes)$
</div>
In non-mathy terms, this is:
- Take the log of everything.
- Calculate the distance between the input frequency and known musical frequencies.
- Find the distance that's closest to 0 (the minimum distance).
This approach breaks when we test frequencies outside of the 0th octave range, since the "distances" calculated will not hover around 0, but will hover around the input frequency's octave. I'll skip the derivation, but the formulae we actually want are:
<div style="text-align: center;">
$octave = round (frequency - MIDDLE)$

$note = min (abs(octave - (\log_2(notes) - \log_2(frequency))))$
</div>

Where $MIDDLE$ is the logarithmic middle of the 0th octave.

# Writing tests
I'm now writing test cases to see where my code fails. I'm working to keep my tests readable and modular, guided by [a testing blog](https://testing.googleblog.com/2018/06/testing-on-toilet-keep-tests-focused.html) sent to me by a friend. I'm utilizing [`pytest`](https://docs.pytest.org/en/stable/) and hope to take full advantage of its features (such as `fixtures`) going forward.

# Moving forward
My goal is a command-line program that can do real-time audio collect and processing, similar to a guitar tuner. Stay _tuned_ for that (ba dum tss) haha.

# Acknowledgements
Thanks to [Todd Valentic](https://github.com/valentic) for his guidance during the work day! The stuff I learn from him has been widely applied here. Thanks also to [Mike Fosco](https://www.linkedin.com/in/michael-fosco-73706569/) for his advice on coding and software.
