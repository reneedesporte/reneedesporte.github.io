export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.reneedesporte.com") {
      url.hostname = "reneedesporte.com";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request); // fallback to static site
  },
};
