---
layout: post
title:  "Destructive Interference: A Python Demonstration"
date:   2025-09-11
categories: [python, signal processing, acoustics]
---
Today I'll be demonstrating destructive acoustic interference &mdash; the main principle behind Active Noise Control &mdash; with Python and a simple stereo speaker! The code I wrote and used lives on GitHub. Before we jump into how it works, take a look at the before and after:

<iframe
  style="display: block; margin-left: auto; margin-right: auto;"
  width="420"
  height="315"
  src="https://www.youtube.com/embed/bKjprY37uNE"
  frameborder="0"
  allowfullscreen>
</iframe>

<div class="note">
    <p class="note-title">Note</p>
    <p>To embed a YouTube video in an <code>HTML</code> post (like this one), make sure to include <code>/embed/</code> in your YouTube link.</p>
</div>

It's not perfect, but it's still cool to see (hear) some effect!

# My Approach

Destructive interference has been explained time and time again, but honestly I think this picture from [Wikipedia](https://en.wikipedia.org/wiki/Active_noise_control) explains it best:

![Destructive interference](/assets/img/destructive_interference.png)

I wanted to demonstrate the most basic case: a plain sine wave. 

My code is available on [GitHub](https://github.com/reneedesporte/destructive_acoustic_interference/tree/main). It essentially does what's demonstrated in the graphic above. I output a 400 Hz sine wave from one channel of my laptop speakers and a 180° phase shifted 400 Hz sine wave from the other channel. When you stand in the right spot, the sound becomes muted!

# Conclusion
This was a really simple experiment to put together. Maybe in the future I'll try detecting real noise and inverting it real-time, like noise-cancelling headphones.
