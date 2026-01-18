(() => {
  const API = window.SwagCuts?.api;
  const storage = window.SwagCuts?.storage;
  const analytics = window.SwagCuts?.analytics;
  const CART_KEY = "swagcuts.cart";
  const CART_ID_KEY = "swagcuts.cartId";

  const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;

  const readLocalCart = () => {
    if (!storage) {
      return [];
    }
    return storage.read(CART_KEY) || [];
  };

  const fetchCart = async () => {
    const cartId = storage?.read(CART_ID_KEY);
    if (API && cartId) {
      try {
        const response = await fetch(`${API.base}/cart?cartId=${encodeURIComponent(cartId)}`);
        if (!response.ok) {
          throw new Error("Cart request failed");
        }
        return await response.json();
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const renderSummary = (items, total) => {
    const list = document.getElementById("checkout-items");
    const totalEl = document.getElementById("checkout-total");
    if (!list) {
      return;
    }
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = "<p>Your cart is empty.</p>";
      if (totalEl) {
        totalEl.textContent = formatPrice(0);
      }
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "card soft";
      const name = item.name || item.productId || "Item";
      const price = formatPrice(item.price);
      const quantity = item.quantity || 1;
      row.innerHTML = `<strong>${name}</strong><div class="inline-meta"><span>${price}</span><span>Qty ${quantity}</span></div>`;
      list.appendChild(row);
    });
    if (totalEl) {
      totalEl.textContent = formatPrice(total);
    }
  };

  const initCheckout = () => {
    const button = document.querySelector("[data-start-checkout]");
    const message = document.getElementById("checkout-message");
    if (!button) {
      return;
    }

    button.addEventListener("click", async () => {
      const cartId = storage?.read(CART_ID_KEY);
      const localItems = readLocalCart();
      const payload = {
        cartId,
        items: localItems
      };
      analytics?.track("checkout_start", {
        itemCount: localItems.length
      });

      if (!API) {
        if (message) {
          message.textContent = "Checkout requires the API or a connected commerce provider.";
        }
        return;
      }

      try {
        const response = await API.postJson("/checkout", payload);
        if (response?.checkoutUrl) {
          analytics?.track("checkout_redirect", {
            provider: response.provider || "custom"
          });
          window.location.href = response.checkoutUrl;
          return;
        }
        if (message) {
          message.textContent = "Checkout is unavailable. Please contact us to place an order.";
        }
      } catch (error) {
        if (message) {
          message.textContent = "Checkout failed. Please try again or contact support.";
        }
      }
    });
  };

  const init = async () => {
    const message = document.getElementById("checkout-message");
    const cart = await fetchCart();
    if (cart?.items) {
      renderSummary(cart.items, cart.total || 0);
      analytics?.track("checkout_view", {
        itemCount: cart.items.length,
        total: cart.total || 0
      });
      return;
    }
    const items = readLocalCart();
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    renderSummary(items, total);
    if (message && items.length) {
      message.textContent = "Using local cart cache. Connect the API for live checkout.";
    }
    analytics?.track("checkout_view", {
      itemCount: items.length,
      total
    });
  };

  initCheckout();
  init();
})();
