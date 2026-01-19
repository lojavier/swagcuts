(() => {
  const API = window.SwagCuts?.api;
  const storage = window.SwagCuts?.storage;
  const analytics = window.SwagCuts?.analytics;
  const CART_KEY = "swagcuts.cart";
  const CART_ID_KEY = "swagcuts.cartId";
  const CART_ACTIVITY_KEY = "swagcuts.cartActivity";

  const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;
  const getItemCount = (items) =>
    items.reduce((sum, item) => sum + (item.quantity || 1), 0);

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
    storage.write(CART_ACTIVITY_KEY, null);
  };

  const syncLocalCart = (items) => {
    if (!storage) {
      return;
    }
    storage.write(CART_KEY, items);
    if (!items.length) {
      storage.write(CART_ACTIVITY_KEY, null);
      return;
    }
    storage.write(CART_ACTIVITY_KEY, {
      lastActiveAt: new Date().toISOString(),
      itemCount: getItemCount(items),
      totalValue: items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    });
  };

  const fetchCart = async () => {
    const cartId = storage?.read(CART_ID_KEY);
    if (API && cartId) {
      try {
        const response = await fetch(`${API.base}/cart?cartId=${encodeURIComponent(cartId)}`);
        if (!response.ok) {
          throw new Error("Cart request failed");
        }
        const data = await response.json();
        if (data?.items) {
          syncLocalCart(data.items);
        }
        return data;
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
      const itemCount = getItemCount(items);
      count.textContent = itemCount === 1 ? "1 item" : `${itemCount} items`;
    }
    if (totalEl) {
      totalEl.textContent = formatPrice(total);
    }
  };

  const clearCart = async (message) => {
    const cartId = storage?.read(CART_ID_KEY);
    let apiCleared = false;

    if (API && cartId) {
      try {
        await API.postJson("/cart/clear", { cartId });
        apiCleared = true;
      } catch (error) {
        apiCleared = false;
      }
    }

    clearLocalCart();
    if (apiCleared && storage) {
      storage.write(CART_ID_KEY, null);
    }
    renderItems([], 0);
    if (message) {
      message.textContent = apiCleared
        ? "Cart cleared."
        : "Local cart cleared. Connect the API to clear server carts.";
      message.classList.toggle("success", apiCleared);
    }
    analytics?.track("cart_cleared", { apiCleared });
  };

  const initClearCart = () => {
    const button = document.querySelector("[data-clear-cart]");
    const message = document.getElementById("cart-message");
    if (!button) {
      return;
    }
    button.addEventListener("click", () => {
      clearCart(message);
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
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    renderItems(items, total);
    if (message && items.length) {
      message.textContent = "Using local cart cache. Connect the API to sync carts.";
    }
    analytics?.track("cart_view", {
      itemCount: getItemCount(items),
      total
    });
  };

  initClearCart();
  init();
})();
