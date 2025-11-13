---
layout: page
title: About
permalink: /about/
---

This website is generated on [GitHub](https://github.com/features/actions) using [Jekyll](https://jekyllrb.com/) and hosted on [Cloudflare](https://www.cloudflare.com/). More about my website building / hosting process here:
<ul>
  {% for post in site.categories.website %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
