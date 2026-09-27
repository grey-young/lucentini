<script setup lang="ts">
useHead({
  titleTemplate: title => (title ? `${title} | Lucentini Antiques & Sculpture` : 'Lucentini Antiques & Sculpture'),
})

const transition = usePageTransition()
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage :transition="transition" />
  </NuxtLayout>
</template>
