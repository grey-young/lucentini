<script setup lang="ts">
import { gsap } from 'gsap'

const root = ref<HTMLElement>()

useScene(root, ({ el, q, motion }) => {
  if (!motion) return
  const scrub = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
  gsap.fromTo(q('.statement__row--a')[0]!, { xPercent: 4 }, { xPercent: -38, ease: 'none', scrollTrigger: scrub })
  gsap.fromTo(q('.statement__row--b')[0]!, { xPercent: -42 }, { xPercent: 2, ease: 'none', scrollTrigger: scrub })
  gsap.fromTo(q('.statement__oval')[0]!, { scale: 0.7, rotate: -10 }, { scale: 1.08, rotate: 8, ease: 'none', scrollTrigger: scrub })
})
</script>

<template>
  <section ref="root" class="statement" data-theme="ink" data-index="IV" data-chapter="An inherited eye">
    <h2 class="visually-hidden">The reach is new. The standard is the one Hortencia set in 1963.</h2>
    <p class="statement__row statement__row--a" aria-hidden="true">
      The reach is new <span class="statement__star">✦</span> The reach is new <span class="statement__star">✦</span>
    </p>
    <figure class="statement__cameo">
      <div class="statement__oval">
        <PieceImage slug="egyptian-figure" loupe link ratio="3 / 4" position="50% 22%" sizes="(min-width: 64rem) 20vw, 50vw" />
      </div>
      <figcaption class="kicker">
        Bronze and marble, late 19th century
        <span>An ancient world, seen anew</span>
      </figcaption>
    </figure>
    <p class="statement__row statement__row--b" aria-hidden="true">
      <em>The standard is the one Hortencia set in 1963</em>
    </p>
  </section>
</template>

<style scoped>
.statement {
  position: relative;
  display: grid;
  /* The unwrapped lines must overflow, not widen the column the cameo centres in. */
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: clamp(6rem, 12vw, 10rem) 0;
  overflow: hidden;
}

.statement__row {
  font-family: var(--font-serif);
  font-size: clamp(4rem, 11vw, 13rem);
  letter-spacing: -0.04em;
  line-height: 0.9;
  white-space: nowrap;
  will-change: transform;
}

.statement__row--b {
  color: var(--accent);
}

.statement__star {
  display: inline-block;
  margin-inline: 0.2em;
  font-size: 0.4em;
  vertical-align: 0.6em;
  color: var(--accent);
}

.statement__cameo {
  display: grid;
  justify-items: center;
  gap: 1.25rem;
  margin: 0;
}

.statement__oval {
  width: clamp(9rem, 17vw, 16rem);
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--line), 0 0 0 10px rgba(237, 230, 218, 0.03);
}

.statement__cameo figcaption {
  display: grid;
  justify-items: center;
  gap: 0.2rem;
  text-align: center;
}

.statement__cameo figcaption span {
  color: var(--fg);
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-style: italic;
  letter-spacing: 0;
  text-transform: none;
}
</style>
