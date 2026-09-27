<script setup lang="ts">
import { gsap } from 'gsap'

const root = ref<HTMLElement>()

useScene(root, ({ el, q, motion, desktop }) => {
  if (!motion) return
  gsap.from(q('.origins__digit'), {
    yPercent: 100,
    duration: 1.8,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: { trigger: q('.origins__year')[0], start: 'top 82%', once: true },
  })
  parallax(q('.origins__year')[0]!, desktop ? 70 : 30, el)
  revealChars(q('.origins__title')[0]!)
  q('[data-lines]').forEach(text => revealLines(text))
  q('.origins__plate').forEach((plate) => {
    revealPlate(plate.querySelector('.plate__frame')!)
    if (desktop) parallax(plate, Number(plate.dataset.drift))
  })
  gsap.from(q('.origins__facts > div'), {
    autoAlpha: 0,
    y: 24,
    duration: 1.1,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: q('.origins__facts')[0], start: 'top 92%', once: true },
  })
})
</script>

<template>
  <section id="origins" ref="root" class="origins" data-theme="parchment" data-index="II" data-chapter="Where it began">
    <header class="origins__head">
      <p class="kicker"><b>(II)</b> Chapter one</p>
      <p class="kicker">Acc. no. 1963.02</p>
    </header>

    <div class="origins__year" aria-hidden="true">
      <span v-for="digit in '1963'" :key="digit" class="origins__digit-mask"><span class="origins__digit">{{ digit }}</span></span>
    </div>
    <h2 class="origins__title">Where it <em>began</em></h2>

    <div class="origins__grid">
      <div class="origins__media">
        <div class="origins__plate origins__plate--main" data-drift="50">
          <PieceImage slug="claudius-cameo" loupe caption link sizes="(min-width: 64rem) 30vw, 80vw" />
        </div>
        <div class="origins__plate origins__plate--small" data-drift="-70">
          <PieceImage slug="intaglio-ring" loupe caption link sizes="(min-width: 64rem) 18vw, 50vw" />
        </div>
      </div>

      <div class="origins__text">
        <p class="origins__lead" data-lines>
          The house was founded in February 1963 by Hortencia T. Scott.
        </p>
        <p class="origins__body" data-lines>
          For fifty years, Hortencia gave herself to the trade with a passion that never dimmed, and with what dealers simply call <em>the eye</em>: the ability to recognize, among a hundred fine things, the one that is truly exceptional. Rare, centuries-old gems and antiques passed through her hands, and every one was held to the same exacting standard.
        </p>
        <dl class="origins__facts">
          <div>
            <dt class="kicker">Founded</dt>
            <dd>February 1963</dd>
          </div>
          <div>
            <dt class="kicker">Founder</dt>
            <dd>Hortencia T. Scott</dd>
          </div>
          <div>
            <dt class="kicker">In the trade</dt>
            <dd>Fifty years</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.origins {
  position: relative;
  padding: clamp(6rem, 12vw, 10rem) var(--pad) clamp(7rem, 14vw, 12rem);
  overflow: hidden;
}

.origins__head {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.origins__year {
  display: flex;
  margin: clamp(1.5rem, 4vw, 3rem) 0 0 -0.04em;
  color: var(--accent);
  font-family: var(--font-serif);
  font-size: clamp(9rem, 33vw, 40rem);
  letter-spacing: -0.055em;
  line-height: 0.8;
}

.origins__digit-mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.03em;
}

.origins__digit {
  display: block;
}

.origins__title {
  position: relative;
  width: fit-content;
  margin: -0.55em 0 0 auto;
  padding-right: clamp(0rem, 6vw, 7rem);
  font-size: clamp(3.2rem, 8.5vw, 10rem);
}

.origins__title em {
  color: var(--accent);
}

.origins__grid {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: clamp(3rem, 7vw, 8rem);
  margin-top: clamp(4rem, 9vw, 8rem);
}

.origins__media {
  position: relative;
  padding-bottom: clamp(6rem, 12vw, 10rem);
}

.origins__plate--main {
  width: 78%;
}

.origins__plate--small {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 46%;
}

/* The past is shown in sepia; the loupe restores the colour. */
.origins :deep(.plate__img) {
  filter: sepia(0.38) saturate(0.82) contrast(1.03);
  transition: opacity 0.9s var(--ease-out), filter 0.8s ease;
}

.origins :deep(.plate__frame:hover .plate__img) {
  filter: none;
}

.origins__text {
  display: grid;
  align-content: start;
  gap: clamp(1.75rem, 3vw, 2.5rem);
  padding-top: clamp(0rem, 6vw, 6rem);
}

.origins__lead {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3.8vw, 4rem);
  letter-spacing: -0.02em;
  line-height: 1.02;
}

.origins__body {
  max-width: 34rem;
  font-size: clamp(1.05rem, 1rem + 0.3vw, 1.25rem);
  line-height: 1.6;
}

.origins__body em {
  font-family: var(--font-serif);
  font-size: 1.15em;
}

.origins__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  max-width: 38rem;
  margin: clamp(0.5rem, 2vw, 1.5rem) 0 0;
}

.origins__facts > div {
  display: grid;
  gap: 0.4rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--line);
}

.origins__facts dd {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 1.45rem;
  line-height: 1.1;
}

@media (max-width: 56rem) {
  .origins__title {
    margin: 0.25em 0 0;
    padding-right: 0;
  }

  .origins__grid {
    grid-template-columns: 1fr;
  }

  .origins__media {
    padding-bottom: 0;
  }

  .origins__plate--main {
    width: 78%;
  }

  .origins__plate--small {
    position: static;
    width: 52%;
    margin: 2rem 0 0 auto;
  }
}

@media (max-width: 36rem) {
  .origins__facts {
    grid-template-columns: 1fr;
  }
}
</style>
