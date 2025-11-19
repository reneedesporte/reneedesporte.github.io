---
layout: page
title: Progress and Poverty
permalink: progress-and-poverty

---

<figure style=
  "float: right;
  margin: 0 0 0.5rem 0.5rem;
  width: 200px;
  background: #363636ff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);"
>
  <img src="/assets/img/Henry_George_c1885_retouched.jpg"
       alt="Henry George around 1885"
       style="width: 100%; height: auto; border-radius: 4px;">
  <figcaption style=
    "font-size: 0.85em;
    text-align: center;
    margin-top: 0.5rem;
    color: #ffffffff"
  >
    Henry George, c. 1885. Public domain.  
    Source: <a
      href="https://commons.wikimedia.org/wiki/File:Henry_George_c1885_retouched.jpg"
      style="color: #87b1ffff"
      >
      Wikimedia Commons</a>.
  </figcaption>
</figure>

[Henry George](https://en.wikipedia.org/wiki/Henry_George)'s [_Progress and Poverty_](https://cdn.mises.org/Progress%20and%20Poverty_3.pdf), written in 1879, was one of the most popular books on [political economy](https://en.wikipedia.org/wiki/Political_economy) ever written. 

<p style="text-align: center; margin-bottom: 20px;"><em>"The progress of society might be, and, if it is to continue, must be, toward equality, not toward inequality."</em></p>

<ul class="post-list" style=
  "background: #e9e9e9ff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);"
>
  {%- for post in site.categories["henry george"] -%}
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
