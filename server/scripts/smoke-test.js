require("../load-env");

const { create: createBooking } = require("../routes/bookings");
const { addItem, checkout } = require("../routes/cart");

const useDatabase = process.env.SWAGCUTS_SMOKE_USE_DB === "true";
if (!useDatabase) {
  delete process.env.DATABASE_URL;
  delete process.env.PGHOST;
  delete process.env.PGUSER;
}

const logResult = (label, result) => {
  const error = result?.body?.error;
  const details = error ? `error=${error}` : `body=${JSON.stringify(result.body)}`;
  console.log(`${label}: status=${result.status} ${details}`);
};

const run = async () => {
  const bookingPayload = {
    name: "Demo Client",
    email: "client@example.com",
    phone: "555-0100",
    pet: "Swag",
    size: "small",
    service: "signature",
    date: "2026-02-01",
    time: "10:00",
    notes: "Smoke test booking.",
    consents: { sms: false, email: false, marketing: false },
    policyVersions: {
      terms: "2026-01-17",
      privacy: "2026-01-17",
      grooming: "2026-01-17",
      cancellation: "2026-01-17"
    }
  };

  const bookingResponse = await createBooking({ body: bookingPayload });
  logResult("booking", bookingResponse);

  const cartResponse = await addItem({
    body: {
      productId: "demo_splatter_bone",
      name: "Splatter Bone Chew Toy",
      price: 24,
      quantity: 1
    }
  });
  logResult("cart_add", cartResponse);

  const checkoutResponse = await checkout({
    body: {
      items: [
        {
          productId: "demo_splatter_bone",
          name: "Splatter Bone Chew Toy",
          price: 24,
          quantity: 1
        }
      ]
    }
  });
  logResult("checkout", checkoutResponse);
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Smoke test failed:", error);
    process.exit(1);
  });
