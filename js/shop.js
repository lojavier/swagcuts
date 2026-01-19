(() => {
  const API = window.SwagCuts?.api;
  const storage = window.SwagCuts?.storage;
  const analytics = window.SwagCuts?.analytics;
  const CART_KEY = "swagcuts.cart";
  const CART_ID_KEY = "swagcuts.cartId";
  const CART_ACTIVITY_KEY = "swagcuts.cartActivity";
  const ABANDONMENT_THRESHOLD_MS = 30 * 60 * 1000;

  const readCart = () => {
    if (!storage) {
      return [];
    }
    return storage.read(CART_KEY) || [];
  };

  const writeCart = (items) => {
    if (!storage) {
      return;
    }
    storage.write(CART_KEY, items);
  };

  const mergeCartItem = (items, payload) => {
    const quantity = Number.parseInt(payload.quantity, 10) || 1;
    const price = Number.isFinite(payload.price) ? payload.price : null;
    const existing = items.find((item) => item.productId === payload.productId);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + quantity;
      existing.price = price ?? existing.price ?? null;
      existing.name = payload.name || existing.name || null;
      existing.updatedAt = new Date().toISOString();
      return items;
    }
    items.push({
      ...payload,
      quantity,
      price,
      addedAt: new Date().toISOString()
    });
    return items;
  };

  const persistLocalCart = (payload) => {
    const existing = readCart();
    const updated = mergeCartItem(existing, payload);
    writeCart(updated);
    updateCartActivity();
  };

  const getCartActivity = () => storage?.read(CART_ACTIVITY_KEY) || null;

  const updateCartActivity = () => {
    if (!storage) return;
    const cart = readCart();
    if (!cart.length) {
      storage.write(CART_ACTIVITY_KEY, null);
      return;
    }
    storage.write(CART_ACTIVITY_KEY, {
      lastActiveAt: new Date().toISOString(),
      itemCount: cart.length,
      totalValue: cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    });
  };

  const checkCartAbandonment = () => {
    if (!analytics || !storage) return;
    const activity = getCartActivity();
    if (!activity?.lastActiveAt) return;
    const lastActive = new Date(activity.lastActiveAt).getTime();
    const now = Date.now();
    if (now - lastActive > ABANDONMENT_THRESHOLD_MS && activity.itemCount > 0) {
      analytics.track("cart_abandonment_risk", {
        itemCount: activity.itemCount,
        totalValue: activity.totalValue,
        inactiveMinutes: Math.round((now - lastActive) / 60000)
      });
      storage.write(CART_ACTIVITY_KEY, { ...activity, abandonmentTracked: true });
    }
  };

  const getSourceContext = () => {
    const path = window.location.pathname;
    if (path.includes("/blog/")) return "blog";
    if (path.includes("/shop/") && !path.endsWith("/shop/index.html") && !path.endsWith("/shop/")) return "product_page";
    if (path.includes("/shop/")) return "shop_listing";
    return "other";
  };

  const addToCart = async (payload) => {
    if (API) {
      try {
        const cartId = storage?.read(CART_ID_KEY) || payload.cartId || null;
        const response = await API.postJson("/cart/items", { ...payload, cartId });
        if (response?.cartId && storage) {
          storage.write(CART_ID_KEY, response.cartId);
        }
        persistLocalCart(payload);
        return;
      } catch (error) {
        // Fall back to local cart storage.
      }
    }
    persistLocalCart(payload);
  };

  const updateButtonState = (button, label) => {
    const original = button.getAttribute("data-original-label") || button.textContent;
    if (!button.getAttribute("data-original-label")) {
      button.setAttribute("data-original-label", original);
    }
    button.textContent = label;
    setTimeout(() => {
      button.textContent = original;
    }, 2000);
  };

  const initAddToCartButtons = () => {
    document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
      button.addEventListener("click", async () => {
        const productId = button.getAttribute("data-product-id");
        const productName = button.getAttribute("data-product-name");
        const productPrice = Number.parseFloat(button.getAttribute("data-product-price"));
        const quantityInput = button.parentElement?.querySelector('input[type="number"]');
        const quantity = Number.parseInt(quantityInput?.value || "1", 10);

        if (!productId) {
          updateButtonState(button, "Missing product");
          return;
        }

        await addToCart({
          productId,
          name: productName,
          price: Number.isFinite(productPrice) ? productPrice : null,
          quantity
        });
        updateButtonState(button, "Added");
        analytics?.track("add_to_cart", {
          productId,
          name: productName,
          price: Number.isFinite(productPrice) ? productPrice : null,
          quantity,
          source: getSourceContext(),
          affiliateContext: window.location.pathname.includes("/blog/") ? "blog_recommendation" : null
        });
      });
    });
  };

  const trackProductView = () => {
    if (!analytics) {
      return;
    }
    const buttons = Array.from(document.querySelectorAll("[data-add-to-cart]"));
    if (buttons.length !== 1) {
      return;
    }
    const button = buttons[0];
    const productId = button.getAttribute("data-product-id");
    const productName = button.getAttribute("data-product-name");
    const productPrice = Number.parseFloat(button.getAttribute("data-product-price"));
    if (!productId) {
      return;
    }
    analytics.track("product_view", {
      productId,
      name: productName,
      price: Number.isFinite(productPrice) ? productPrice : null,
      source: getSourceContext()
    });
  };

  const trackAffiliateProductClick = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a.btn");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (!href.includes("/shop/") || href.includes("index.html")) return;
      const source = getSourceContext();
      if (source !== "blog" && source !== "shop_listing") return;
      const productSlug = href.split("/").pop()?.replace(".html", "") || "";
      const card = link.closest(".card");
      const productName = card?.querySelector("h3")?.textContent?.trim() || "";
      const priceEl = card?.querySelector(".price");
      const price = priceEl ? Number.parseFloat(priceEl.textContent.replace(/[^0-9.]/g, "")) : null;
      analytics?.track("affiliate_product_click", {
        productSlug,
        productName,
        price: Number.isFinite(price) ? price : null,
        source,
        href
      });
    });
  };

  initAddToCartButtons();
  trackProductView();
  trackAffiliateProductClick();
  checkCartAbandonment();
})();
