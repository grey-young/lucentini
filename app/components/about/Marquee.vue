<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const root = ref<HTMLElement>()
const disciplines = ['Fine Jewelry', 'Sculpture', 'Historical Artifacts', 'Fine Art']

useScene(root, ({ el, q, motion }) => {
  if (!motion) return
  const loop = gsap.to(q('.marquee__group'), { xPercent: -100, duration: 32, ease: 'none', repeat: -1 })
  const skew = gsap.quickTo(q('.marquee__track')[0]!, 'skewX', { duration: 0.5, ease: 'power3' })

  // Scrolling speeds the band up; it settles back once the page is still.
  let boost = 0
  const settle = () => {
    boost *= 0.93
    loop.timeScale(1 + boost)
    skew(-boost * 1.4)
  }
  gsap.ticker.add(settle)
  ScrollTrigger.create({
    trigger: el,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      boost = Math.max(boost, Math.min(Math.abs(self.getVelocity()) / 350, 5))
    },
  })
  return () => gsap.ticker.remove(settle)
})
</script>

<template>
  <section ref="root" class="marquee" data-theme="bone" data-index="V" data-chapter="The collection" aria-label="Fine jewelry, sculpture, historical artifacts and fine art">
    <div class="marquee__track" aria-hidden="true">
      <div v-for="n in 2" :key="n" class="marquee__group">
        <template v-for="d in disciplines" :key="d">
          <span class="marquee__item">{{ d }}</span>
          <span class="marquee__star">✦</span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  padding: clamp(3rem, 7vw, 6rem) 0;
  overflow: hidden;
  border-block: 1px solid var(--line);
}

.marquee__track {
  display: flex;
  width: max-content;
}

.marquee__group {
  display: flex;
  flex: none;
  align-items: center;
}

.marquee__item {
  padding-inline: 0.35em;
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 9vw, 10rem);
  letter-spacing: -0.035em;
  line-height: 1;
  white-space: nowrap;
}

.marquee__item:nth-of-type(even) {
  font-style: italic;
  color: var(--accent);
}

.marquee__star {
  padding-inline: 0.35em;
  font-size: clamp(1.2rem, 2.6vw, 2.6rem);
  color: var(--accent);
}
</style>
