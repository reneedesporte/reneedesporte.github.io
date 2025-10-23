---
layout: post
title:  "Bayes' Theorem"
date:   2024-07-02
categories: statistics
---

# Introduction

This post is an exercise for me to describe, and therefore better understand, one of the most fundamental concepts in probability and statistics: Bayes’ Theorem. I won’t go over the history of it, since there’s plenty of great resources online for that, such as Wikipedia or 3Blue1Brown.

## Example

Consider the following population, about which we have gathered data on _2 features_: each person’s "smoker" status, and each person’s "over 65 years old" status.

![Bayes1](/assets/img/Bayes1.PNG)

Now let’s ask a question about the population, like "**(if I select one person at random from this population) what’s the likelihood that they’re a smoker?**"

"Likelihood" means "probability", so we should provide some number between 0 and 1. To calculate the probability of some event (or in this case, some feature), we need only calculate the ratio of the event to all possible events. So, what’s the ratio of "smokers" to "all possible samples"? After counting, we see that it’s $3/9$, or $0.33$.

Ok, what if we ask a question about one feature _based on another feature_, e.g., "**Given that someone is over 65 years old, what is the likelihood that they’re a smoker?**"

We’re again asking for a probability, but the "given that someone is over 65 years old" implies that we’re looking at a condition—i.e., knowing that someone is over 65 years old should give us some _additional information_ about their smoker status.

We can count as we did before, but now we’re looking at the ratio of "smokers" to "all possible 65 year olds", which is $2/3$ or $0.67$. Thus, if we know someone is over 65 years old, we know that they’re more likely to be a smoker.

# Bayes’ Theorem

Ok, so where does Bayes’ Theorem come in? Bayes’ Theorem is a formula that allows us to calculate the likelihood we just calculated _using different information about our population_. Here’s the formula for our example question and features:

![Bayes2](/assets/img/Bayes2.PNG)

Let’s calculate each of the factors on the right-hand side of the equation first.

$P(65 \vert smoker)$ means "probability of being over 65 years old given that someone is a smoker". We can calculate this in the same way as its reverse (probability of smoker given age): coincidentally, this is also $2/3$.

Now $P(smoker)$ is just the number of smokers / the number of people total: $3/9$.

Similarly, $P(65) = 3/9$.

If we plug all these values into the formula, we see that we end up with the same probability as originally calculated for $P(smoker \vert 65)$: $2/3$.

# Conclusion
#### Why is Bayes’ Theorem Useful?
You might be wondering, "Ok, so why is this formula useful? We calculated way more stuff in order to end up with the same result," and you’d be right to wonder that… Because I’m also wondering that.

Why _is_ Bayes’ Theorem useful, or (even better) _when_ (for what applications) is it useful?
I’ll address this in another post later, along with Bayesian Inference.
