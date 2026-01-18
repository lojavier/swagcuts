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

  const clearLocalCart = () => {
    if (!storage) {
      return;
    }
    storage.write(CART_KEY, []);
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

  const renderItems = (items, total) => {
    const list = document.getElementById("cart-items");
    const count = document.getElementById("cart-count");
    const totalEl = document.getElementById("cart-total");
    if (!list) {
      return;
    }

    list.innerHTML = "";

    if (!items.length) {
      list.innerHTML = "<p>Your cart is empty.</p>";
      if (count) {
        count.textContent = "0 items";
      }
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

    if (count) {
      count.textContent = `${items.length} items`;
    }
    if (totalEl) {
      totalEl.textContent = formatPrice(total);
    }
  };

  const initClearCart = () => {
    const button = document.querySelector("[data-clear-cart]");
    const message = document.getElementById("cart-message");
    if (!button) {
      return;
    }
    button.addEventListener("click", () => {
      clearLocalCart();
      renderItems([], 0);
      if (message) {
        message.textContent = "Local cart cleared.";
        message.classList.add("success");
      }
      analytics?.track("cart_cleared", {});
    });
  };

  const init = async () => {
    const message = document.getElementById("cart-message");
    const cart = await fetchCart();
    if (cart?.items) {
      renderItems(cart.items, cart.total || 0);
      analytics?.track("cart_view", {
        itemCount: cart.items.length,
        total: cart.total || 0
      });
      return;
    }

    const items = readLocalCart();
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    renderItems(items, total);
    if (message && items.length) {
      message.textContent = "Using local cart cache. Connect the API to sync carts.";
    }
    analytics?.track("cart_view", {
      itemCount: items.length,
      total
    });
  };

  initClearCart();
  init();
})();
