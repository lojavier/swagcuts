(() => {
  const DEFAULT_POLICY_CONFIG = {
    terms: { version: "2026-01-17", effective: "2026-01-17" },
    privacy: { version: "2026-01-17", effective: "2026-01-17" },
    grooming: { version: "2026-01-17", effective: "2026-01-17" },
    cancellation: { version: "2026-01-17", effective: "2026-01-17" },
    accessibility: { version: "2026-01-17", effective: "2026-01-17" },
    affiliate: { version: "2026-01-17", effective: "2026-01-17" },
    cookie: { version: "2026-01-17", effective: "2026-01-17" }
  };

  const REQUIRED_POLICIES = ["terms", "privacy", "grooming", "cancellation"];
  const POLICY_CONFIG_KEY = "swagcuts.policyConfig";
  const POLICY_ACCEPTANCE_KEY = "swagcuts.policyAcceptance";
  const COOKIE_CONSENT_KEY = "swagcuts.cookieConsent";
  const MARKETING_CONSENT_KEY = "swagcuts.marketingConsent";
  const PENDING_BOOKINGS_KEY = "swagcuts.pendingBookings";
  const ANALYTICS_QUEUE_KEY = "swagcuts.analyticsQueue";
  const ANALYTICS_SESSION_KEY = "swagcuts.analyticsSession";
  const ANALYTICS_ATTRIBUTION_KEY = "swagcuts.attribution";
  const ANALYTICS_PAGE_VIEW_KEY = "swagcuts.pageView";
  const ANALYTICS_MAX_QUEUE = 100;
  const ANALYTICS_SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  const EVENTS_READ_KEY = "swagcuts.eventsReadKey";
  const COMMENTS_READ_KEY = "swagcuts.commentsReadKey";
  const API_BASE = window.SWAGCUTS_API_BASE || "/api";

  const storageAvailable = () => {
    try {
      const testKey = "__swagcuts_test__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  };

  const readStorage = (key) => {
    if (!storageAvailable()) {
      return null;
    }
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    if (!storageAvailable()) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  };

  const postJson = async (path, payload) => {
    const response = await fetch(API_BASE + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return response.json();
  };

  const queuePendingBooking = (payload) => {
    const existing = readStorage(PENDING_BOOKINGS_KEY) || [];
    existing.push({
      savedAt: new Date().toISOString(),
      payload
    });
    writeStorage(PENDING_BOOKINGS_KEY, existing);
  };

  const exposeGlobals = () => {
    window.SwagCuts = window.SwagCuts || {};
    window.SwagCuts.api = {
      base: API_BASE,
      postJson
    };
    window.SwagCuts.storage = {
      read: readStorage,
      write: writeStorage
    };
    window.SwagCuts.analytics = {
      track: trackEvent,
      flush: flushAnalyticsQueue
    };
  };

  const mergePolicyConfig = (stored) => {
    const merged = { ...DEFAULT_POLICY_CONFIG };
    if (!stored) {
      return merged;
    }
    Object.keys(merged).forEach((key) => {
      if (stored[key]) {
        merged[key] = {
          version: stored[key].version || merged[key].version,
          effective: stored[key].effective || merged[key].effective
        };
      }
    });
    return merged;
  };

  const getPolicyConfig = () => mergePolicyConfig(readStorage(POLICY_CONFIG_KEY));

  const getAcceptance = () => readStorage(POLICY_ACCEPTANCE_KEY) || {};

  const saveAcceptance = (acceptance) => writeStorage(POLICY_ACCEPTANCE_KEY, acceptance);

  const setPolicyAccepted = (policyKey, policyConfig) => {
    const acceptance = getAcceptance();
    acceptance[policyKey] = {
      version: policyConfig[policyKey]?.version || "unknown",
      timestamp: new Date().toISOString()
    };
    saveAcceptance(acceptance);
  };

  const needsPolicyAcceptance = (policyKey, policyConfig) => {
    const acceptance = getAcceptance();
    const accepted = acceptance[policyKey];
    return !accepted || accepted.version !== policyConfig[policyKey]?.version;
  };

  const updatePolicyText = (policyConfig) => {
    document.querySelectorAll("[data-policy-version]").forEach((el) => {
      const key = el.getAttribute("data-policy-version");
      el.textContent = policyConfig[key]?.version || "n/a";
    });
    document.querySelectorAll("[data-policy-effective]").forEach((el) => {
      const key = el.getAttribute("data-policy-effective");
      el.textContent = policyConfig[key]?.effective || "n/a";
    });
  };

  const updatePolicyBanner = (policyConfig) => {
    const banner = document.getElementById("policy-banner");
    if (!banner) {
      return;
    }
    const needsUpdate = REQUIRED_POLICIES.some((key) => needsPolicyAcceptance(key, policyConfig));
    banner.style.display = needsUpdate ? "block" : "none";
    document.body.classList.toggle("policy-banner-visible", needsUpdate);
  };

  const getCookieConsent = () => readStorage(COOKIE_CONSENT_KEY);

  const createSessionId = () => {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `session_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  };

  const getSession = () => {
    const now = Date.now();
    const stored = readStorage(ANALYTICS_SESSION_KEY);
    const lastSeen = stored?.lastSeenAt ? new Date(stored.lastSeenAt).getTime() : 0;
    if (!stored?.id || !lastSeen || now - lastSeen > ANALYTICS_SESSION_TIMEOUT_MS) {
      const session = {
        id: createSessionId(),
        startedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString()
      };
      writeStorage(ANALYTICS_SESSION_KEY, session);
      return session;
    }
    const updated = { ...stored, lastSeenAt: new Date().toISOString() };
    writeStorage(ANALYTICS_SESSION_KEY, updated);
    return updated;
  };

  const getUtmFromLocation = () => {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const utm = {};
    keys.forEach((key) => {
      const value = params.get(key);
      if (value) {
        utm[key.replace("utm_", "")] = value;
      }
    });
    return Object.keys(utm).length ? utm : null;
  };

  const getAttribution = () => {
    const now = new Date().toISOString();
    const stored = readStorage(ANALYTICS_ATTRIBUTION_KEY) || {};
    const utm = getUtmFromLocation();
    const attribution = stored.landingPage
      ? { ...stored }
      : {
          landingPage: window.location.href,
          referrer: document.referrer || null,
          utm: utm || null,
          firstSeenAt: now
        };

    if (utm) {
      attribution.utm = utm;
      attribution.landingPage = window.location.href;
      attribution.referrer = document.referrer || attribution.referrer || null;
    }

    attribution.lastSeenAt = now;
    writeStorage(ANALYTICS_ATTRIBUTION_KEY, attribution);
    return attribution;
  };

  const shouldTrackAnalytics = () => {
    const consent = getCookieConsent();
    if (!consent) {
      return false;
    }
    if (consent.choice === "all") {
      return true;
    }
    if (consent.choice === "essential") {
      return false;
    }
    return Boolean(consent.analytics);
  };

  const queueAnalyticsEvent = (payload) => {
    const existing = readStorage(ANALYTICS_QUEUE_KEY) || [];
    existing.push(payload);
    if (existing.length > ANALYTICS_MAX_QUEUE) {
      existing.splice(0, existing.length - ANALYTICS_MAX_QUEUE);
    }
    writeStorage(ANALYTICS_QUEUE_KEY, existing);
  };

  const sendAnalyticsEvent = async (payload) => {
    const response = await fetch(API_BASE + "/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
    if (!response.ok) {
      throw new Error("Analytics request failed");
    }
    return response.json();
  };

  const flushAnalyticsQueue = async () => {
    if (!shouldTrackAnalytics()) {
      return;
    }
    const queue = readStorage(ANALYTICS_QUEUE_KEY) || [];
    if (!queue.length) {
      return;
    }
    const remaining = [];
    for (const payload of queue) {
      try {
        await sendAnalyticsEvent(payload);
      } catch (error) {
        remaining.push(payload);
      }
    }
    writeStorage(ANALYTICS_QUEUE_KEY, remaining);
  };

  const buildEventPayload = (name, properties = {}) => {
    const session = getSession();
    const attribution = getAttribution();
    return {
      name,
      timestamp: new Date().toISOString(),
      sessionId: session.id,
      page: {
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer || null
      },
      utm: attribution?.utm || null,
      properties,
      context: {
        language: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
  };

  const trackEvent = (name, properties = {}) => {
    if (!shouldTrackAnalytics()) {
      return;
    }
    const payload = buildEventPayload(name, properties);
    sendAnalyticsEvent(payload).catch(() => {
      queueAnalyticsEvent(payload);
    });
  };

  const trackPageView = () => {
    if (!shouldTrackAnalytics()) {
      return;
    }
    const session = getSession();
    const marker = `${session.id}:${window.location.pathname}`;
    const existing = readStorage(ANALYTICS_PAGE_VIEW_KEY);
    if (existing === marker) {
      return;
    }
    writeStorage(ANALYTICS_PAGE_VIEW_KEY, marker);
    trackEvent("page_view", {
      title: document.title,
      path: window.location.pathname
    });
  };

  const initLinkTracking = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) {
        return;
      }
      const href = link.getAttribute("href") || "";
      const rel = link.getAttribute("rel") || "";
      const trackName = link.getAttribute("data-track");
      if (trackName) {
        trackEvent(trackName, { href });
        return;
      }
      if (rel.includes("sponsored")) {
        trackEvent("affiliate_click", {
          href,
          label: link.textContent.trim().slice(0, 80)
        });
        return;
      }
      if (href.includes("#booking")) {
        trackEvent("booking_cta_click", { href });
      }
    });
  };

  const initAnalytics = () => {
    getAttribution();
    flushAnalyticsQueue();
    trackPageView();
    initLinkTracking();
  };

  const setCookieConsent = (choice, options, policyConfig) => {
    const consent = {
      version: policyConfig.cookie.version,
      choice,
      analytics: Boolean(options?.analytics),
      marketing: Boolean(options?.marketing),
      timestamp: new Date().toISOString()
    };
    writeStorage(COOKIE_CONSENT_KEY, consent);
    if (consent.choice === "all" || consent.analytics) {
      flushAnalyticsQueue();
      trackEvent("consent_update", {
        choice: consent.choice,
        analytics: consent.analytics,
        marketing: consent.marketing
      });
      trackPageView();
    }
    return consent;
  };

  const initConsentBanner = (policyConfig) => {
    const banner = document.getElementById("cookie-banner");
    const preferences = document.getElementById("consent-preferences");
    if (!banner) {
      return;
    }

    const openBanner = () => banner.classList.add("active");
    const closeBanner = () => banner.classList.remove("active");

    const existingConsent = getCookieConsent();
    if (!existingConsent || existingConsent.version !== policyConfig.cookie.version) {
      openBanner();
    }

    const updatePreferenceInputs = (consent) => {
      if (!preferences) {
        return;
      }
      const analytics = preferences.querySelector('[data-consent-option="analytics"]');
      const marketing = preferences.querySelector('[data-consent-option="marketing"]');
      if (analytics) {
        analytics.checked = Boolean(consent?.analytics);
      }
      if (marketing) {
        marketing.checked = Boolean(consent?.marketing);
      }
    };

    updatePreferenceInputs(existingConsent);

    banner.addEventListener("click", (event) => {
      const action = event.target.getAttribute("data-consent");
      if (!action) {
        return;
      }

      if (action === "manage" && preferences) {
        preferences.classList.toggle("active");
        return;
      }

      if (action === "all") {
        setCookieConsent("all", { analytics: true, marketing: true }, policyConfig);
        closeBanner();
        return;
      }

      if (action === "essential") {
        setCookieConsent("essential", { analytics: false, marketing: false }, policyConfig);
        closeBanner();
        return;
      }

      if (action === "save") {
        const analytics = preferences?.querySelector('[data-consent-option="analytics"]')?.checked;
        const marketing = preferences?.querySelector('[data-consent-option="marketing"]')?.checked;
        setCookieConsent("custom", { analytics, marketing }, policyConfig);
        closeBanner();
      }
    });

    const openConsentButtons = document.querySelectorAll("#open-consent, [data-open-consent]");
    openConsentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openBanner();
        updatePreferenceInputs(getCookieConsent());
      });
    });
  };

  const initBookingForm = (policyConfig) => {
    const form = document.getElementById("booking-form");
    if (!form) {
      return;
    }
    const message = document.getElementById("booking-message");
    const phoneInput = form.querySelector("#phone");
    const emailInput = form.querySelector("#email");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const smsConsent = form.querySelector('[data-consent="sms"]');
      if (smsConsent?.checked && !phoneInput?.value) {
        if (message) {
          message.textContent = "Add a mobile phone number for SMS updates.";
          message.classList.remove("success");
        }
        return;
      }

      const emailConsent = form.querySelector('[data-consent="email"]');
      if (emailConsent?.checked && !emailInput?.value) {
        if (message) {
          message.textContent = "Add an email address for email updates.";
          message.classList.remove("success");
        }
        return;
      }

      form.querySelectorAll("[data-policy-check]").forEach((checkbox) => {
        if (checkbox.checked) {
          setPolicyAccepted(checkbox.getAttribute("data-policy-check"), policyConfig);
        }
      });

      const marketingConsent = {
        sms: Boolean(smsConsent?.checked),
        email: Boolean(emailConsent?.checked),
        marketing: Boolean(form.querySelector('[data-consent="marketing"]')?.checked),
        timestamp: new Date().toISOString()
      };
      writeStorage(MARKETING_CONSENT_KEY, marketingConsent);

      updatePolicyBanner(policyConfig);

      const payload = {
        name: form.querySelector("#name")?.value.trim(),
        email: emailInput?.value.trim(),
        phone: phoneInput?.value.trim(),
        pet: form.querySelector("#pet")?.value.trim(),
        size: form.querySelector("#size")?.value,
        service: form.querySelector("#service")?.value,
        date: form.querySelector("#date")?.value,
        time: form.querySelector("#time")?.value,
        notes: form.querySelector("#notes")?.value.trim(),
        consents: marketingConsent,
        analytics: {
          sessionId: getSession().id,
          attribution: getAttribution()
        },
        policyVersions: {
          terms: policyConfig.terms.version,
          privacy: policyConfig.privacy.version,
          grooming: policyConfig.grooming.version,
          cancellation: policyConfig.cancellation.version
        }
      };

      trackEvent("booking_submit", {
        service: payload.service,
        size: payload.size,
        hasPhone: Boolean(payload.phone),
        hasEmail: Boolean(payload.email)
      });

      try {
        await postJson("/bookings", payload);
        if (message) {
          message.textContent = "Request received. We will confirm your booking shortly.";
          message.classList.add("success");
        }
        trackEvent("booking_submit_success", {
          service: payload.service,
          size: payload.size
        });
      } catch (error) {
        queuePendingBooking(payload);
        if (message) {
          message.textContent = "Request saved. We will confirm your booking shortly.";
          message.classList.add("success");
        }
        trackEvent("booking_submit_queued", {
          service: payload.service,
          size: payload.size
        });
      }

      form.reset();
    });
  };

  const initPolicyAcknowledgements = (policyConfig) => {
    const buttons = document.querySelectorAll("[data-accept-policy]");
    if (!buttons.length) {
      return;
    }
    const message = document.querySelector("[data-policy-message]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const policyKey = button.getAttribute("data-accept-policy");
        if (!policyKey) {
          return;
        }
        setPolicyAccepted(policyKey, policyConfig);
        updatePolicyBanner(policyConfig);
        if (message) {
          message.textContent = "Acknowledgement saved on " + new Date().toLocaleString() + ".";
          message.classList.add("success");
        }
      });
    });
  };

  const initAdminPanel = (policyConfig) => {
    const form = document.getElementById("policy-admin-form");
    if (!form) {
      return;
    }
    const message = document.getElementById("admin-message");

    form.querySelectorAll("[data-policy-field]").forEach((input) => {
      const key = input.getAttribute("data-policy-key");
      const field = input.getAttribute("data-policy-field");
      if (key && field && policyConfig[key]) {
        input.value = policyConfig[key][field];
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const updated = { ...policyConfig };
      form.querySelectorAll("[data-policy-field]").forEach((input) => {
        const key = input.getAttribute("data-policy-key");
        const field = input.getAttribute("data-policy-field");
        if (!key || !field) {
          return;
        }
        updated[key] = updated[key] || {};
        updated[key][field] = input.value.trim() || updated[key][field];
      });
      writeStorage(POLICY_CONFIG_KEY, updated);
      Object.keys(updated).forEach((key) => {
        policyConfig[key] = updated[key];
      });
      updatePolicyText(policyConfig);
      updatePolicyBanner(policyConfig);
      if (message) {
        message.textContent = "Policy versions saved. Existing acceptances may now require re-acknowledgement.";
        message.classList.add("success");
      }
    });

    const resetButton = document.getElementById("policy-reset");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        writeStorage(POLICY_ACCEPTANCE_KEY, {});
        if (message) {
          message.textContent = "Policy acceptances cleared.";
          message.classList.add("success");
        }
        updatePolicyBanner(policyConfig);
      });
    }

    const defaultsButton = document.getElementById("policy-defaults");
    if (defaultsButton) {
      defaultsButton.addEventListener("click", () => {
        writeStorage(POLICY_CONFIG_KEY, DEFAULT_POLICY_CONFIG);
        Object.keys(DEFAULT_POLICY_CONFIG).forEach((key) => {
          policyConfig[key] = DEFAULT_POLICY_CONFIG[key];
        });
        updatePolicyText(policyConfig);
        updatePolicyBanner(policyConfig);
        if (message) {
          message.textContent = "Policy versions reset to defaults.";
          message.classList.add("success");
        }
        form.querySelectorAll("[data-policy-field]").forEach((input) => {
          const key = input.getAttribute("data-policy-key");
          const field = input.getAttribute("data-policy-field");
          if (key && field && DEFAULT_POLICY_CONFIG[key]) {
            input.value = DEFAULT_POLICY_CONFIG[key][field];
          }
        });
      });
    }
  };

  const initAdminEvents = () => {
    const list = document.getElementById("events-list");
    if (!list) {
      return;
    }

    const limitInput = document.getElementById("events-limit");
    const filterInput = document.getElementById("events-filter");
    const keyInput = document.getElementById("events-key");
    const refreshButton = document.getElementById("events-refresh");
    const message = document.getElementById("events-message");

    const renderEvents = (events) => {
      list.innerHTML = "";
      if (!events.length) {
        const empty = document.createElement("p");
        empty.textContent = "No events loaded.";
        list.appendChild(empty);
        return;
      }

      const truncate = (value, max = 180) => {
        if (!value) return "";
        return value.length > max ? `${value.slice(0, max)}...` : value;
      };

      events.forEach((event) => {
        const card = document.createElement("div");
        card.className = "card soft";

        const title = document.createElement("strong");
        title.textContent = event.name || "event";
        card.appendChild(title);

        const time = document.createElement("div");
        const timestamp = event.receivedAt || event.createdAt;
        time.textContent = `Time: ${timestamp ? new Date(timestamp).toLocaleString() : "unknown"}`;
        card.appendChild(time);

        if (event.pageUrl) {
          const page = document.createElement("div");
          page.textContent = `Page: ${truncate(event.pageUrl, 220)}`;
          card.appendChild(page);
        }

        if (event.utm) {
          const utm = document.createElement("div");
          utm.textContent = `UTM: ${truncate(JSON.stringify(event.utm))}`;
          card.appendChild(utm);
        }

        if (event.properties && Object.keys(event.properties).length) {
          const props = document.createElement("div");
          props.textContent = `Props: ${truncate(JSON.stringify(event.properties))}`;
          card.appendChild(props);
        }

        list.appendChild(card);
      });
    };

    const storedKey = readStorage(EVENTS_READ_KEY);
    if (keyInput && storedKey) {
      keyInput.value = storedKey;
    }

    const fetchEvents = async () => {
      const limit = Number.parseInt(limitInput?.value || "50", 10);
      const eventName = filterInput?.value.trim();
      const readKey = keyInput?.value.trim();

      if (keyInput) {
        writeStorage(EVENTS_READ_KEY, readKey || null);
      }

      const params = new URLSearchParams();
      if (Number.isFinite(limit)) {
        params.set("limit", String(limit));
      }
      if (eventName) {
        params.set("event", eventName);
      }

      const endpoint = API_BASE + "/events";
      const url = params.toString() ? `${endpoint}?${params}` : endpoint;

      try {
        const response = await fetch(url, {
          headers: readKey ? { "x-api-key": readKey } : {}
        });
        if (!response.ok) {
          throw new Error("Unable to load events.");
        }
        const data = await response.json();
        renderEvents(data.events || []);
        if (message) {
          message.textContent = `Loaded ${(data.events || []).length} events.`;
          message.classList.add("success");
        }
      } catch (error) {
        if (message) {
          message.textContent = error.message || "Unable to load events.";
          message.classList.remove("success");
        }
      }
    };

    refreshButton?.addEventListener("click", fetchEvents);
    fetchEvents();
  };

  const initAdminComments = () => {
    const list = document.getElementById("comments-list");
    if (!list) {
      return;
    }

    const limitInput = document.getElementById("comments-limit");
    const statusSelect = document.getElementById("comments-status");
    const postInput = document.getElementById("comments-post");
    const keyInput = document.getElementById("comments-key");
    const refreshButton = document.getElementById("comments-refresh");
    const message = document.getElementById("comments-message");

    const storedKey = readStorage(COMMENTS_READ_KEY);
    if (keyInput && storedKey) {
      keyInput.value = storedKey;
    }

    const renderComments = (comments) => {
      list.innerHTML = "";
      if (!comments.length) {
        const empty = document.createElement("p");
        empty.textContent = "No comments found.";
        list.appendChild(empty);
        return;
      }

      comments.forEach((comment) => {
        const card = document.createElement("div");
        card.className = "card soft comment-admin";

        const header = document.createElement("div");
        header.className = "comment-meta";

        const author = document.createElement("div");
        author.className = "comment-author";

        const name = document.createElement("strong");
        name.textContent = comment.name || "Anonymous";
        author.appendChild(name);

        const status = document.createElement("span");
        const statusValue = comment.status || "pending";
        status.className = `pill status-${statusValue}`;
        status.textContent = statusValue;
        author.appendChild(status);

        const time = document.createElement("time");
        const date = comment.createdAt ? new Date(comment.createdAt) : null;
        time.dateTime = comment.createdAt || "";
        time.textContent = date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "Recent";

        header.appendChild(author);
        header.appendChild(time);

        const body = document.createElement("p");
        body.textContent = comment.message || "";

        const details = document.createElement("div");
        details.className = "comment-admin__details";
        const addDetail = (label, value) => {
          if (!value) {
            return;
          }
          const item = document.createElement("span");
          item.textContent = `${label}: ${value}`;
          details.appendChild(item);
        };
        addDetail("Post", comment.postTitle || comment.postId);
        addDetail("Post ID", comment.postId);
        addDetail("Email", comment.email);
        addDetail("ID", comment.id);

        const actions = document.createElement("div");
        actions.className = "comment-actions";
        const createButton = (label, action, disabled) => {
          const button = document.createElement("button");
          button.className = "btn outline sm";
          button.type = "button";
          button.textContent = label;
          if (disabled) {
            button.disabled = true;
          } else {
            button.addEventListener("click", () => moderateComment(comment.id, action));
          }
          return button;
        };

        const isApproved = statusValue === "approved";
        const isRejected = statusValue === "rejected";
        actions.appendChild(createButton("Approve", "approved", isApproved));
        actions.appendChild(createButton("Reject", "rejected", isRejected));
        actions.appendChild(createButton("Delete", "delete", false));

        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(details);
        card.appendChild(actions);
        list.appendChild(card);
      });
    };

    const setMessage = (text, isSuccess) => {
      if (!message) {
        return;
      }
      message.textContent = text;
      message.classList.toggle("success", Boolean(isSuccess));
    };

    const fetchComments = async () => {
      const limit = Number.parseInt(limitInput?.value || "50", 10);
      const status = statusSelect?.value || "pending";
      const postId = postInput?.value.trim();
      const readKey = keyInput?.value.trim();

      if (keyInput) {
        writeStorage(COMMENTS_READ_KEY, readKey || null);
      }

      const params = new URLSearchParams();
      if (Number.isFinite(limit)) {
        params.set("limit", String(limit));
      }
      if (status) {
        params.set("status", status);
      }
      if (postId) {
        params.set("postId", postId);
      }

      const endpoint = API_BASE + "/comments/admin";
      const url = params.toString() ? `${endpoint}?${params}` : endpoint;

      try {
        const response = await fetch(url, {
          headers: readKey ? { "x-api-key": readKey } : {}
        });
        if (!response.ok) {
          throw new Error("Unable to load comments.");
        }
        const data = await response.json();
        renderComments(data.comments || []);
        setMessage(`Loaded ${(data.comments || []).length} comments.`, true);
      } catch (error) {
        renderComments([]);
        setMessage(error.message || "Unable to load comments.", false);
      }
    };

    const moderateComment = async (id, action) => {
      const readKey = keyInput?.value.trim();
      const payload = action === "delete" ? { id, action } : { id, status: action };
      try {
        const response = await fetch(API_BASE + "/comments/moderate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(readKey ? { "x-api-key": readKey } : {})
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error("Unable to update comment.");
        }
        await fetchComments();
      } catch (error) {
        setMessage(error.message || "Unable to update comment.", false);
      }
    };

    refreshButton?.addEventListener("click", fetchComments);
    fetchComments();
  };

  const initRevealAnimations = () => {
    const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-in";
    const items = document.querySelectorAll(selectors);

    if (!items.length) return;

    // Fallback for browsers without IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
  };

  const initMobileNav = () => {
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (!toggle || !navLinks) {
      return;
    }

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    };

    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      navLinks.classList.add("is-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("is-open") &&
        !toggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close when navigating to a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });
  };

  const initCrawlList = () => {
    const container = document.querySelector("[data-crawl-list]");
    if (!container) {
      return;
    }
    const list = document.getElementById("crawl-list");
    const count = document.getElementById("crawl-count");
    if (!list) {
      return;
    }
    fetch("crawl_sites.txt")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load crawl list.");
        }
        return response.text();
      })
      .then((text) => {
        const urls = text.split(/\r?\n/).filter(Boolean);
        list.innerHTML = "";
        urls.forEach((url) => {
          const item = document.createElement("li");
          const link = document.createElement("a");
          link.href = url;
          link.textContent = url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          item.appendChild(link);
          list.appendChild(item);
        });
        if (count) {
          count.textContent = urls.length + " URLs loaded";
        }
      })
      .catch(() => {
        if (count) {
          count.textContent = "Unable to load crawl list.";
        }
      });
  };

  const initBlogSearch = () => {
    const forms = document.querySelectorAll("[data-blog-search-form]");
    if (!forms.length) {
      return;
    }

    const cards = Array.from(document.querySelectorAll("[data-blog-card]"));
    const meta = document.querySelector("[data-blog-search-meta]");
    const pagination = document.querySelector("[data-blog-pagination]");
    const prevLink = pagination?.querySelector("[data-page-prev]");
    const nextLink = pagination?.querySelector("[data-page-next]");
    const currentLabel = pagination?.querySelector("[data-page-current]");
    const pageSize = 9;
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";
    const initialCategory = params.get("category") || "";
    let currentPage = Number.parseInt(params.get("page") || "1", 10);
    if (!Number.isFinite(currentPage) || currentPage < 1) {
      currentPage = 1;
    }
    const categoryLabels = {
      "pet-wellness": "Pet Wellness",
      "grooming-tips": "Grooming Tips",
      "animal-hygiene": "Animal Hygiene",
      "veterinary-care": "Veterinary Care",
      guide: "Guide",
      seasonal: "Seasonal",
      shop: "Shop"
    };

    const buildUrl = (page, query, category) => {
      const next = new URL(window.location.href);
      if (query) {
        next.searchParams.set("q", query);
      } else {
        next.searchParams.delete("q");
      }
      if (category) {
        next.searchParams.set("category", category);
      } else {
        next.searchParams.delete("category");
      }
      if (page > 1) {
        next.searchParams.set("page", String(page));
      } else {
        next.searchParams.delete("page");
      }
      return `${next.pathname}${next.search}`;
    };

    const setPaginationLink = (link, page, isDisabled, query, category) => {
      if (!link) {
        return;
      }
      if (isDisabled) {
        link.classList.add("disabled");
        link.setAttribute("aria-disabled", "true");
        link.removeAttribute("href");
        link.tabIndex = -1;
      } else {
        link.classList.remove("disabled");
        link.setAttribute("aria-disabled", "false");
        link.href = buildUrl(page, query, category);
        link.tabIndex = 0;
      }
    };

    const updatePagination = (totalPages, query, category) => {
      if (!pagination) {
        return;
      }
      if (totalPages <= 1) {
        pagination.style.display = "none";
        return;
      }
      pagination.style.display = "flex";
      if (currentLabel) {
        currentLabel.textContent = String(currentPage);
      }
      setPaginationLink(prevLink, Math.max(currentPage - 1, 1), currentPage <= 1, query, category);
      setPaginationLink(
        nextLink,
        Math.min(currentPage + 1, totalPages),
        currentPage >= totalPages,
        query,
        category
      );
    };

    const applyFilters = (query, category) => {
      const trimmedQuery = (query || "").trim();
      const trimmedCategory = (category || "").trim();
      const normalizedQuery = trimmedQuery.toLowerCase();
      const normalizedCategory = trimmedCategory.toLowerCase();
      const matching = [];

      cards.forEach((card) => {
        const haystack = `${card.dataset.title || ""} ${card.dataset.excerpt || ""} ${card.dataset.category || ""}`.toLowerCase();
        const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
        const matchesCategory = !normalizedCategory || card.dataset.category === normalizedCategory;
        if (matchesQuery && matchesCategory) {
          matching.push(card);
        }
        card.style.display = "none";
      });

      if (meta && cards.length) {
        if (!normalizedQuery && !normalizedCategory) {
          meta.textContent = `${cards.length} articles`;
        } else {
          const label = categoryLabels[normalizedCategory] || normalizedCategory;
          let message = `${matching.length} result${matching.length === 1 ? "" : "s"}`;
          if (trimmedQuery) {
            message += ` for "${trimmedQuery}"`;
          }
          if (normalizedCategory) {
            message += ` in ${label}`;
          }
          meta.textContent = message;
        }
      }

      const totalPages = Math.max(1, Math.ceil(matching.length / pageSize));
      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      matching.forEach((card, index) => {
        const pageIndex = Math.floor(index / pageSize) + 1;
        card.style.display = pageIndex === currentPage ? "" : "none";
      });

      updatePagination(totalPages, trimmedQuery, normalizedCategory);
    };

    forms.forEach((form) => {
      const input = form.querySelector("[data-blog-search-input]");
      if (input && initialQuery) {
        input.value = initialQuery;
      }
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = input?.value.trim() || "";
        if (cards.length) {
          currentPage = 1;
          applyFilters(query, initialCategory);
          const next = new URL(window.location.href);
          if (query) {
            next.searchParams.set("q", query);
          } else {
            next.searchParams.delete("q");
          }
          next.searchParams.delete("page");
          window.history.replaceState({}, "", next.toString());
          return;
        }
        const destination = query ? `index.html?q=${encodeURIComponent(query)}` : "index.html";
        window.location.href = destination;
      });
    });

    if (cards.length) {
      applyFilters(initialQuery, initialCategory);
    }
  };

  const initCommentForms = (policyConfig) => {
    const forms = document.querySelectorAll("[data-comment-form]");
    if (!forms.length) {
      return;
    }

    const renderComments = (listEl, emptyEl, comments) => {
      if (!listEl) {
        return;
      }
      listEl.innerHTML = "";
      if (!comments.length) {
        if (emptyEl) {
          emptyEl.style.display = "";
        }
        return;
      }
      if (emptyEl) {
        emptyEl.style.display = "none";
      }

      comments.forEach((comment) => {
        const card = document.createElement("div");
        card.className = "comment-card";

        const header = document.createElement("div");
        header.className = "comment-meta";

        const name = document.createElement("strong");
        name.textContent = comment.name || "Anonymous";
        header.appendChild(name);

        const time = document.createElement("time");
        const date = comment.createdAt ? new Date(comment.createdAt) : null;
        time.dateTime = comment.createdAt || "";
        time.textContent = date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : "Recent";
        header.appendChild(time);

        const message = document.createElement("p");
        message.textContent = comment.message || "";

        card.appendChild(header);
        card.appendChild(message);
        listEl.appendChild(card);
      });
    };

    const loadComments = async (postId, listEl, emptyEl) => {
      if (!postId || !listEl) {
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/comments?postId=${encodeURIComponent(postId)}`);
        if (!response.ok) {
          throw new Error("Unable to load comments.");
        }
        const data = await response.json();
        renderComments(listEl, emptyEl, data.comments || []);
      } catch (error) {
        renderComments(listEl, emptyEl, []);
      }
    };

    forms.forEach((form) => {
      const message = form.querySelector("[data-comment-message]");
      const commentSection = form.closest(".comment-section");
      const listEl = commentSection?.querySelector("[data-comment-list]");
      const emptyEl = commentSection?.querySelector("[data-comment-empty]");
      const postId = form.dataset.postId;

      loadComments(postId, listEl, emptyEl);

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        form.querySelectorAll("[data-policy-check]").forEach((checkbox) => {
          if (checkbox.checked) {
            setPolicyAccepted(checkbox.getAttribute("data-policy-check"), policyConfig);
          }
        });
        updatePolicyBanner(policyConfig);

        const name = form.querySelector("[data-comment-name]")?.value.trim();
        const email = form.querySelector("[data-comment-email]")?.value.trim();
        const comment = form.querySelector("[data-comment-message-input]")?.value.trim();

        const payload = {
          postId: form.dataset.postId,
          postTitle: form.dataset.postTitle,
          name,
          email,
          message: comment
        };

        try {
          trackEvent("comment_submit", {
            postId: payload.postId,
            postTitle: payload.postTitle
          });
          await postJson("/comments", payload);
          if (message) {
            message.textContent = "Thanks for the comment. It will appear after review.";
            message.classList.add("success");
          }
          form.reset();
          loadComments(postId, listEl, emptyEl);
        } catch (error) {
          if (message) {
            message.textContent = "Unable to submit comment right now. Please try again soon.";
            message.classList.remove("success");
          }
        }
      });
    });
  };

  const initBeforeAfterSliders = () => {
    const sliders = document.querySelectorAll(".before-after");
    if (!sliders.length) return;

    sliders.forEach((slider) => {
      const container = slider.querySelector(".before-after__container");
      const beforeImage = slider.querySelector(".before-after__image--before");
      const sliderHandle = slider.querySelector(".before-after__slider");
      const handle = slider.querySelector(".before-after__handle");

      if (!container || !beforeImage || !sliderHandle) return;

      let isDragging = false;

      const updateSlider = (clientX) => {
        const rect = container.getBoundingClientRect();
        let position = ((clientX - rect.left) / rect.width) * 100;
        position = Math.max(0, Math.min(100, position));

        beforeImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
        sliderHandle.style.left = `${position}%`;
        if (handle) handle.style.left = `${position}%`;
      };

      const startDrag = (e) => {
        e.preventDefault();
        isDragging = true;
        slider.classList.add("is-dragging");
      };

      const stopDrag = () => {
        isDragging = false;
        slider.classList.remove("is-dragging");
      };

      const onDrag = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        updateSlider(clientX);
      };

      // Mouse events
      sliderHandle.addEventListener("mousedown", startDrag);
      if (handle) handle.addEventListener("mousedown", startDrag);
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);

      // Touch events
      sliderHandle.addEventListener("touchstart", startDrag, { passive: false });
      if (handle) handle.addEventListener("touchstart", startDrag, { passive: false });
      document.addEventListener("touchmove", onDrag, { passive: true });
      document.addEventListener("touchend", stopDrag);

      // Click to move
      container.addEventListener("click", (e) => {
        if (!isDragging) {
          updateSlider(e.clientX);
        }
      });
    });
  };

  const policyConfig = getPolicyConfig();
  updatePolicyText(policyConfig);
  updatePolicyBanner(policyConfig);
  initConsentBanner(policyConfig);
  initAnalytics();
  initBookingForm(policyConfig);
  initPolicyAcknowledgements(policyConfig);
  initAdminPanel(policyConfig);
  initAdminEvents();
  initAdminComments();
  initRevealAnimations();
  initMobileNav();
  initBlogSearch();
  initCommentForms(policyConfig);
  initBeforeAfterSliders();
  exposeGlobals();
  initCrawlList();
})();
