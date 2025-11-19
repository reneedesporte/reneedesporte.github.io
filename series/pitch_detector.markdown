---
layout: page
title: Pitch Detector Project
permalink: pitch-detector
---

<img src="/assets/img/loaded_data_fft_freqs_zoomed.PNG"
  style="
    float: left;
    width: 50%;
    height: auto;
    border-radius: 4px;
    margin-right: 1.5rem;
    padding: 1rem;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 10;
  ">

I worked on [`pitch_detector`](https://github.com/reneedesporte/pitch_detector) &mdash; a Python program to detect the most prominent musical note in live audio &mdash; intermittently for about a year.

<ul class="post-list" style=
  "background: #e9e9e9ff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);"
>
  {%- for post in site.categories["pitch detector"] -%}
  <li>
    {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
    <span class="post-meta">{{ post.date | date: date_format }}</span>
    <h3>
      <a class="post-link" href="{{ post.url | relative_url }}">
        {{ post.title | escape }}
      </a>
    </h3>
    {%- if site.show_excerpts -%}
      {{ post.excerpt }}
    {%- endif -%}
  </li>
  {%- endfor -%}
</ul>
