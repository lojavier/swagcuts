import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        // Root pages
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        accessibility: resolve(__dirname, 'accessibility.html'),
        admin: resolve(__dirname, 'admin.html'),
        affiliateDisclosure: resolve(__dirname, 'affiliate-disclosure.html'),
        aiFeatures: resolve(__dirname, 'ai-features.html'),
        cancellation: resolve(__dirname, 'cancellation.html'),
        contact: resolve(__dirname, 'contact.html'),
        cookiePolicy: resolve(__dirname, 'cookie-policy.html'),
        faq: resolve(__dirname, 'faq.html'),
        groomingWaiver: resolve(__dirname, 'grooming-waiver.html'),
        petShop: resolve(__dirname, 'pet-shop.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        services: resolve(__dirname, 'services.html'),
        servicesPlus: resolve(__dirname, 'services-plus.html'),
        team: resolve(__dirname, 'team.html'),
        terms: resolve(__dirname, 'terms.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        veterinaryClinic: resolve(__dirname, 'veterinary-clinic.html'),
        templateCrawl: resolve(__dirname, 'template-crawl.html'),
        notFound: resolve(__dirname, '404.html'),

        // Blog pages
        blogIndex: resolve(__dirname, 'blog/index.html'),
        blogPuppyGrooming: resolve(__dirname, 'blog/puppy-grooming-checklist.html'),
        blogSheddingSeason: resolve(__dirname, 'blog/shedding-season-guide.html'),
        blogWhenToSeekCare: resolve(__dirname, 'blog/when-to-seek-professional-grooming-or-veterinary-care.html'),
        blogPositiveGrooming: resolve(__dirname, 'blog/creating-a-positive-grooming-experience-for-your-pet.html'),
        blogGroomingMistakes: resolve(__dirname, 'blog/common-grooming-mistakes-pet-owners-should-avoid.html'),
        blogVetCheckups: resolve(__dirname, 'blog/understanding-routine-veterinary-checkups-for-pets.html'),
        blogVetSigns: resolve(__dirname, 'blog/top-signs-your-pet-needs-to-visit-the-veterinarian.html'),
        blogRegularGrooming: resolve(__dirname, 'blog/how-regular-grooming-keeps-your-pet-healthy-and-happy.html'),
        blogGroomingTools: resolve(__dirname, 'blog/choosing-the-right-grooming-tools-for-your-furry-friend.html'),
        blogSpotHealth: resolve(__dirname, 'blog/how-to-spot-health-problems-during-pet-grooming.html'),
        blogShinyCoat: resolve(__dirname, 'blog/simple-pet-grooming-tips-for-a-shiny-coat-at-home.html'),

        // Shop pages
        shopIndex: resolve(__dirname, 'shop/index.html'),
        shopCart: resolve(__dirname, 'shop/cart.html'),
        shopCheckout: resolve(__dirname, 'shop/checkout.html'),
        shopAccount: resolve(__dirname, 'shop/account.html'),
        shopBluePawBed: resolve(__dirname, 'shop/blue-paw-print-tunnel-bed.html'),
        shopDualToneRope: resolve(__dirname, 'shop/dual-tone-rope-dog-toy.html'),
        shopGreenCollar: resolve(__dirname, 'shop/green-canvas-dog-collar.html'),
        shopGreenBed: resolve(__dirname, 'shop/green-polka-dot-dog-bed.html'),
        shopLogsTreats: resolve(__dirname, 'shop/logs-dog-treats.html'),
        shopHexagonHouse: resolve(__dirname, 'shop/modern-hexagon-pet-house.html'),
        shopOrganicFood: resolve(__dirname, 'shop/organic-lamb-dry-dog-food.html'),
        shopRedBowl: resolve(__dirname, 'shop/red-ceramic-bone-dog-bowl.html'),
        shopSplatterToy: resolve(__dirname, 'shop/splatter-bone-chew-toy.html'),

        // Shop category pages
        shopCatAccessories: resolve(__dirname, 'shop/categories/accessories.html'),
        shopCatBowls: resolve(__dirname, 'shop/categories/bowls.html'),
        shopCatFood: resolve(__dirname, 'shop/categories/food.html'),
        shopCatHouses: resolve(__dirname, 'shop/categories/houses.html'),
        shopCatScratchers: resolve(__dirname, 'shop/categories/scratchers.html'),
        shopCatToys: resolve(__dirname, 'shop/categories/toys.html'),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
