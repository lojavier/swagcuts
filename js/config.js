(() => {
  if (window.SWAGCUTS_API_BASE) {
    return;
  }

  const hostname = window.location.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  window.SWAGCUTS_API_BASE = isLocalhost ? "http://localhost:3000/api" : "/api";
})();
