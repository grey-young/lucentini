<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact } from '~/data/site'

const description = 'Family-owned since 1963, Lucentini Antiques & Sculpture offers fine jewelry, sculpture, historical artifacts, and fine art to collectors around the world.'

useSeoMeta({
  title: 'About Us',
  description,
  ogTitle: 'About Lucentini Antiques & Sculpture',
  ogDescription: description,
  ogType: 'website',
  ogImage: '/images/pieces/crowned-lion-1400.webp',
})

useHead({
  script: [{
    type: 'application/ld+json',
    textContent: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Lucentini Antiques & Sculpture',
      description,
      'foundingDate': '1963-02',
      'founder': { '@type': 'Person', 'name': 'Hortencia T. Scott' },
      'email': contact.email,
      'telephone': contact.tel.replace('tel:', ''),
    },
  }],
})

const root = ref<HTMLElement>()
const ready = useSiteReady()
const scrollTo = useScrollTo()

useThemeScroll(root)

// Arriving with a #chapter in the URL on a fresh load: go there once the
// curtain lifts. (Page transitions handle it themselves while covered.)
const stop = watch(ready, (isReady) => {
  if (!isReady) return
  stop()
  ScrollTrigger.refresh()
  if (location.hash) scrollTo(location.hash, { immediate: true })
})
</script>

<template>
  <div ref="root">
    <AboutHero />
    <AboutPrologue />
    <AboutOrigins />
    <AboutEye />
    <AboutToday />
    <AboutStatement />
    <AboutCollection />
    <AboutMarquee />
    <AboutApproach />
    <AboutContact />
  </div>
</template>
