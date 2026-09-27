<script setup lang="ts">
const menuOpen = useMenuOpen()
</script>

<template>
  <div>
    <a class="skip-link" href="#main">Skip to content</a>
    <SitePreloader />
    <SiteHeader />
    <SiteMenu />
    <main id="main" :inert="menuOpen || undefined">
      <slot />
    </main>
    <SiteFooter :inert="menuOpen || undefined" />
    <SiteCurtain />
    <SiteCursor />
    <div class="grain" aria-hidden="true" />
  </div>
</template>
