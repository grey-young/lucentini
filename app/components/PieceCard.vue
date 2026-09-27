<script setup lang="ts">
import type { Piece } from '~/data/pieces'

withDefaults(defineProps<{
  piece: Piece
  sizes?: string
  eager?: boolean
}>(), {
  sizes: '(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 90vw',
})
</script>

<template>
  <article class="card">
    <NuxtLink :to="piece.href" class="card__link" data-cursor-label="View">
      <PieceImage :slug="piece.slug" ratio="4 / 5" :sizes="sizes" :eager="eager" />
      <span class="card__label">
        <span class="card__row kicker">
          <span>Lot {{ piece.lot }}</span>
          <span>{{ piece.discipline.title }}</span>
        </span>
        <span class="card__title">{{ piece.title }}</span>
        <span class="card__meta kicker">{{ piece.meta }}</span>
      </span>
    </NuxtLink>
  </article>
</template>

<style scoped>
.card__link {
  display: grid;
  gap: 1rem;
}

.card__link :deep(.plate__img) {
  transition: opacity 0.9s var(--ease-out), transform 1.4s var(--ease-out);
}

.card__link:hover :deep(.plate__img),
.card__link:focus-visible :deep(.plate__img) {
  transform: scale(1.06);
}

.card__label {
  display: grid;
  gap: 0.45rem;
}

.card__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
}

.card__title {
  display: -webkit-box;
  overflow: hidden;
  font-family: var(--font-serif);
  font-size: clamp(1.45rem, 1.2rem + 0.8vw, 2.1rem);
  letter-spacing: -0.015em;
  line-height: 1.02;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 0.4s ease;
}

.card__link:hover .card__title,
.card__link:focus-visible .card__title {
  color: var(--accent);
  font-style: italic;
}

.card__meta {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
