<script setup lang="ts">
import { NuxtLink } from '#components'
import { piece, type PieceSlug } from '~/data/pieces'

const props = withDefaults(defineProps<{
  slug: PieceSlug
  sizes?: string
  /** Enables the magnifying loupe on pointer devices. */
  loupe?: boolean
  caption?: boolean
  /** Links the plate to the piece's page. */
  link?: boolean
  eager?: boolean
  fit?: 'cover' | 'contain'
  position?: string
  /** CSS aspect-ratio for the frame; defaults to the image's own. */
  ratio?: string
}>(), {
  sizes: '(min-width: 64rem) 40vw, 90vw',
  fit: 'cover',
  position: '50% 50%',
})

const p = computed(() => piece(props.slug))
const img = ref<HTMLImageElement>()
const loaded = ref(false)

// An image cached before hydration never fires `load` on the client.
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth) loaded.value = true
})
</script>

<template>
  <figure class="plate" :style="{ '--plate': p.color, '--ratio': ratio ?? `${p.width} / ${p.height}` }">
    <component
      :is="link ? NuxtLink : 'div'"
      class="plate__frame"
      :to="link ? p.href : undefined"
      :tabindex="link && caption ? -1 : undefined"
      :aria-hidden="link && caption ? 'true' : undefined"
      :data-cursor-label="link ? 'View' : undefined"
    >
      <img
        ref="img"
        class="plate__img"
        :class="{ 'is-loaded': loaded }"
        :src="p.src(1400)"
        :srcset="p.srcset"
        :sizes="sizes"
        :width="p.width"
        :height="p.height"
        :alt="p.alt"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
        decoding="async"
        :data-loupe="loupe && p.zoom ? p.src(2400) : undefined"
        :style="{ objectFit: fit, objectPosition: position }"
        @load="loaded = true"
      >
    </component>
    <figcaption v-if="caption" class="plate__label">
      <NuxtLink v-if="link" :to="p.href" class="plate__title plate__title--link">{{ p.title }}</NuxtLink>
      <span v-else class="plate__title">{{ p.title }}</span>
      <span class="plate__meta">{{ p.meta }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.plate {
  margin: 0;
}

.plate__frame {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: var(--ratio);
  background: var(--plate);
}

.plate__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.9s var(--ease-out);
}

.plate__img.is-loaded {
  opacity: 1;
}

.plate__label {
  display: grid;
  gap: 0.15rem;
  margin-top: 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.02em;
  line-height: 1.45;
  text-transform: uppercase;
  color: var(--muted);
}

.plate__title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--fg);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.plate__title--link {
  width: fit-content;
  transition: color 0.3s ease;
}

.plate__title--link:hover {
  color: var(--accent);
}

</style>
