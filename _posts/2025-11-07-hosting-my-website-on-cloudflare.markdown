---
layout: post
title:  "Hosting my Website on Cloudflare"
date:   2025-11-07
categories: [
    cloudflare,
    github,
    jekyll,
    cicd,
    chatgpt,
    cloudflare workers,
    website,
    static site,
    dynamic site
]
---

If you're not new to my blog, then you may have noticed that my domain changed from [reneedesporte.github.io](https://reneedesporte.github.io/) to [reneedesporte.com](https://reneedesporte.com/). I've also changed the way I host this site: I now utilize [Cloudflare](https://www.cloudflare.com/) instead of [GitHub Pages](https://reneedesporte.com/2025/10/22/setting-up-my-website-with-github-pages-and-jekyll/). In this post, I'll give a high-level look at [why](#motivation) and [how](#migrating-a-jekyll-site-from-github-pages-to-cloudflare-workers) I migrated my website from GitHub to Cloudflare (and set up a custom domain along the way).

> **Use of AI**: I used ChatGPT throughout much of this process. I think LLMs should be used with caution, as they have an impact on both [the environment](https://news.mit.edu/2025/explained-generative-ai-environmental-impact-0117) and the economy.

# Motivation
Why would I want to change where/how I host this website? Great question.

As I mentioned in my [last post](https://reneedesporte.com/2025/10/22/setting-up-my-website-with-github-pages-and-jekyll/), a big inspirator (I think that's a word) for the creation of my website has been [Nicky Masso](https://www.nickymasso.com/), a friend of mine who hosts their site on GitHub Pages. Another is [Riley Walz](https://walzr.com/). Walz isn't someone I know personally (since he's [kind of famous](https://www.nytimes.com/2025/10/04/us/riley-walz-san-francisco-parking-tickets-app.html)) but I admire his work and [website](https://walzr.com/) a lot.

<div style="position: relative; width: 100%; padding-top: 50%; border: 2px solid #ccc; border-radius: 8px; margin-bottom: 20px;">
  <a href="https://walzr.com" target="_blank"
     style="position: absolute; inset: 0; display: block; z-index: 2;">
  </a>
  <iframe
    src="https://walzr.com"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; overflow: hidden; pointer-events: none;"
    scrolling="no">
  </iframe>
</div>

So I took a look under the hood... or I had ChatGPT take a look (I'm still new to all this HTML/CSS/JavaScript stuff). I fed in [Walz's home page](https://walzr.com/)'s source code and learned that Walz's site was likely hosted on Cloudflare since "the HTML includes a Cloudflare beacon script at the bottom".

That was enough for me. Well, that and the fact that [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#about-github-pages) only hosts [static sites](https://www.geeksforgeeks.org/websites-apps/static-vs-dynamic-website/).

## Cloudflare Hosting Options
Cloudflare has (so far as I can tell) just two options for hosting websites: [Pages](https://developers.cloudflare.com/pages/) and [Workers](https://developers.cloudflare.com/workers/). Cloudflare Pages is just like GitHub Pages &mdash; static sites only &mdash; while **Cloudflare Workers does both**. Since I don't know what kind of capabilities my site might need in the future, I went with Cloudflare Workers.

<blockquote class="reddit-embed-bq" data-embed-height="240"><a href="https://www.reddit.com/r/CloudFlare/comments/1ip87mx/comment/mcuji1d/">Comment</a><br> by<a href="https://www.reddit.com/user/MagedIbrahimDev/">u/MagedIbrahimDev</a> from discussion<a href="https://www.reddit.com/r/CloudFlare/comments/1ip87mx/workers_vs_pages/"></a><br> in<a href="https://www.reddit.com/r/CloudFlare/">CloudFlare</a></blockquote><script async="" src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>

# Migrating a Jekyll Site from GitHub Pages to Cloudflare Workers
## _The Before_: GitHub Pages 
My website is currently a [static site](https://www.geeksforgeeks.org/websites-apps/static-vs-dynamic-website/), meaning it's just a collection of files written in HTML, CSS, and JavaScript living on a computer somewhere (a **server**) and being put on the Internet (**hosted**). Where do these HTML files come from? 

I could write the HTML files myself, but this is tedious. Instead, I use a [static site generator](https://en.wikipedia.org/wiki/Static_site_generator) called [Jekyll](https://jekyllrb.com/) to convert files I've written in [markdown](https://en.wikipedia.org/wiki/Markdown) to HTML. I do this locally, first, to see how things look (check out my [previous post](https://reneedesporte.com/2025/10/22/setting-up-my-website-with-github-pages-and-jekyll/)) before pushing my markdown and Jekyll files to GitHub. Then, _GitHub runs Jekyll on their computers to generate the same HTML files_ before **hosting** these files on their **servers**. The whole process looks like this:

<img src="/assets/img/github-pages-workflow.png" alt="GitHub Pages workflow" style="border: 2px solid #ccc; border-radius: 8px;">

I've highlighted the two main steps: **build** and **deploy**. GitHub pages does _both_ of these things automatically when you set up a GitHub Pages site using a [GitHub Action](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows) called `pages-build-deployment`. This workflow is visible in the "Actions" tab of the repo where a website's code lives, e.g., [here](https://github.com/reneedesporte/reneedesporte.github.io/actions/workflows/pages/pages-build-deployment) for my website.

## _The Migration_: A New GitHub Action
To migrate my Jekyll-built website from GitHub Pages to Cloudflare with Workers, we'll need to set up a <mark><strong>custom GitHub Action</strong></mark>, one that does the **build on GitHub** and **deploys on Cloudflare** (since [Cloudflare Workers doesn't support Jekyll](https://developers.cloudflare.com/workers/framework-guides/) builds). I asked ChatGPT to make me a custom workflow for GitHub:

```yaml
name: Build and Deploy Jekyll to Cloudflare Workers

on:
  push:
    branches: [ main ]  # or your deploy branch
  workflow_dispatch:     # allows manual runs

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      # 1 Check out the repository
      - name: Checkout code
        uses: actions/checkout@v4

      # 2 Setup Ruby and install Jekyll dependencies
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Install gems
        run: bundle install

      # 3 Cache bundle
      - name: Cache bundle
        uses: actions/cache@v4
        with:
          path: vendor/bundle
          key: ${{ runner.os }}-gems-${{ hashFiles('**/Gemfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-gems-

      # 4 Build Jekyll site
      - name: Build site
        run: bundle exec jekyll build

      # 5 Install Wrangler CLI
      - name: Install Wrangler
        run: npm install -g wrangler

      # 6 Deploy to Cloudflare Workers
      - name: Deploy to Cloudflare
        run: wrangler deploy --domain=reneedesporte.com
        env:
          CLOUDFLARE_API_TOKEN: ${% raw %}{{ secrets.CLOUDFLARE_API_TOKEN }}{% endraw %}
```

For this setup to work, I needed to do 4 things:
1. [Set up a Cloudflare account](https://developers.cloudflare.com/fundamentals/account/create-account/).
2. [Link Cloudflare to my website's Git repo](https://developers.cloudflare.com/workers/ci-cd/builds/#connect-a-new-worker).
3. [Create a Cloudflare API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) and [add it to my GitHub Action's Secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) (see step 6: `secrets.CLOUDFLARE_API_TOKEN`).
4. [Purchase my custom domain](https://www.cloudflare.com/products/registrar/)

<mark><strong>That's it!</strong></mark> Since I purchased the domain through Cloudflare, routing my site to the custome domain was as straight-forward as `wrangler deploy --domain=reneedesporte.com`. I did also add a [`wrangler.jsonc`](https://github.com/reneedesporte/reneedesporte.github.io/blob/dbdacbd643e9c8e5cd52f41d8a5e3f951d84f365/wrangler.jsonc) to my repo, but that might've been overkill:

```jsonc
{
    "name": "reneedesporte",
    "compatibility_date": "2025-11-01",
    "assets": {
      "directory": "_site"
    },
    "routes": [
        { "pattern": "reneedesporte.com/*", "zone_name": "reneedesporte.com" },
        {"pattern": "www.reneedesporte.com/*", "zone_name": "reneedesporte.com"}
    ]
}
```

## _The After_: Redirecting Visitors from my Old Site
I "disabled" (in a sense) my [old GitHub website](https://reneedesporte.github.io/) by redirecting visitors to my new site with this script:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=https://reneedesporte.com${window.location.pathname}" />
    <link rel="canonical" href="https://reneedesporte.com/" />
    <title>Redirecting to reneedesporte.com...</title>
    <script>
      const dest = "https://reneedesporte.com" + window.location.pathname + window.location.search + window.location.hash;
      window.location.replace(dest);
    </script>
  </head>
  <body>
    <p>
      Redirecting to
      <a href="https://reneedesporte.com/">reneedesporte.com</a>...
    </p>
  </body>
</html>
```

I put this script by itself in a branch called `redirect` and set my [GitHub publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch) to be that branch. "Set it and forget it".

# Conclusion
This was fairly straightforward to do, and I'm excited about the possibility of making more complex webpages for my site now!
