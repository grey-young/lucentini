// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '@fontsource/instrument-serif/400.css',
    '@fontsource/instrument-serif/400-italic.css',
    '@fontsource-variable/instrument-sans/wght.css',
    '@fontsource/dm-mono/400.css',
    '@fontsource/dm-mono/500.css',
    'lenis/dist/lenis.css',
    // Only the animate.css pieces the site uses, from its unprefixed source build.
    'animate.css/source/_vars.css',
    'animate.css/source/_base.css',
    'animate.css/source/fading_entrances/fadeInUp.css',
    'animate.css/source/fading_exits/fadeOutDown.css',
    '~/assets/css/main.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'theme-color', content: '#0e0d0b' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
