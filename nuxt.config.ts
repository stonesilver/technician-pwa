// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  devServer: {
    port: 5177,
    https: {
      key: "./localhost+2-key.pem",
      cert: "./localhost+2.pem",
    },
  },
  modules: ["@vite-pwa/nuxt", "@nuxt/image", "@nuxtjs/tailwindcss", "shadcn-nuxt", "@vee-validate/nuxt"],
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
  // css: ["~/assets/css/tailwind.css"],
  shadcn: {
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  pwa: {
    registerType: "autoUpdate", // "prompt", //
    strategies: "injectManifest",
    // srcDir: "service-worker",
    // filename: "sw.ts",
    manifest: {
      id: "/?v=1.0.0",
      name: "MCA-Technician-App",
      short_name: "MTA",
      description: "Technicians auto parts reporting",
      theme_color: "#3BAA90",
      icons: [
        {
          src: "app-icons/app-icons-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-128x128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-384x384.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "app-icons/app-icons-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "app-icons/app-icons-512x512.png",
          sizes: "512x512",
          type: "image/png",
          form_factor: "wide",
        },
        {
          src: "app-icons/app-icons-512x512.png",
          sizes: "512x512",
          type: "image/png",
          form_factor: "narrow",
        },
      ],
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      prefer_related_applications: true,
      // lang: "en",
      // orientation: "portrait",
    },
    workbox: {
      cleanupOutdatedCaches: true,
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
      suppressWarnings: true,
    },
  },
  // experimental: { appManifest: true },
})
