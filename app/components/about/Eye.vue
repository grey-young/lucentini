<script setup lang="ts">
import { gsap } from 'gsap'
import { piece } from '~/data/pieces'

const root = ref<HTMLElement>()
const box = piece('orientalist-warrior')

useScene(root, ({ q, motion, desktop }) => {
  if (!motion) return
  const lines = q('.eye__line')
  gsap.timeline({ scrollTrigger: { trigger: q('.eye__statement')[0], start: 'top 75%', end: 'bottom 45%', scrub: 0.8 } })
    .fromTo(lines, { opacity: 0.16 }, { opacity: 1, stagger: 0.5, duration: 1, ease: 'none' })

  gsap.fromTo(q('.eye__plate')[0]!, { scale: 0.84, rotate: -4, y: 90 }, {
    scale: 1,
    rotate: 0,
    y: 0,
    ease: 'none',
    scrollTrigger: { trigger: q('.eye__stage')[0], start: 'top bottom', end: 'center 55%', scrub: 1 },
  })
  gsap.to(q('.eye__halo')[0]!, {
    rotate: 90,
    scale: desktop ? 1.15 : 1.05,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
  })
  gsap.from(q('.eye__hint')[0]!, {
    autoAlpha: 0,
    y: 16,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: q('.eye__stage')[0], start: 'top 60%', once: true },
  })
})
</script>

<template>
  <section id="eye" ref="root" class="eye" data-theme="oxblood" data-index="III" data-chapter="A way of seeing">
    <div class="eye__copy">
      <p class="kicker"><b>(III)</b> Interlude</p>
      <p class="eye__statement">
        <span class="eye__line">What she handed down</span>
        <span class="eye__line">was never simply</span>
        <span class="eye__line">an inventory.</span>
        <span class="eye__line eye__line--accent"><em>It was a way of seeing.</em></span>
      </p>
    </div>

    <div class="eye__stage">
      <svg class="eye__halo" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="198" />
        <circle cx="200" cy="200" r="170" stroke-dasharray="2 6" />
        <circle cx="200" cy="200" r="120" />
        <path d="M200 0v26M200 374v26M0 200h26M374 200h26" />
      </svg>
      <div class="eye__plate">
        <PieceImage slug="orientalist-warrior" loupe caption link sizes="(min-width: 64rem) 40vw, 88vw" />
      </div>
      <p class="kicker eye__hint">
        <span class="eye__hint-dot" aria-hidden="true" />
        <span class="eye__hint-fine">Hover the bronze to look closer</span>
        <span class="eye__hint-touch">Patinated bronze, late 19th century</span>
      </p>
      <!-- On touch screens a fixed detail stands in for the loupe. -->
      <div class="eye__detail" aria-hidden="true" :style="{ backgroundImage: `url(${box.src(2400)})` }" />
    </div>
  </section>
</template>

<style scoped>
.eye {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(3rem, 6vw, 7rem);
  align-items: center;
  min-height: 100vh;
  padding: clamp(7rem, 14vw, 12rem) var(--pad);
  overflow: hidden;
}

.eye__copy {
  display: grid;
  gap: 2rem;
}

.eye__statement {
  display: grid;
  font-family: var(--font-serif);
  font-size: clamp(2.6rem, 5.4vw, 6.6rem);
  letter-spacing: -0.025em;
  line-height: 0.98;
}

.eye__line--accent {
  margin-top: 0.3em;
  color: var(--accent);
}

.eye__stage {
  position: relative;
  display: grid;
  justify-items: center;
  padding: clamp(2rem, 5vw, 5rem) 0;
}

.eye__halo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(120%, 44rem);
  translate: -50% -50%;
  fill: none;
  stroke: var(--line);
  stroke-width: 1;
  pointer-events: none;
}

.eye__plate {
  position: relative;
  width: min(100%, 34rem);
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.6);
}

.eye__plate :deep(.plate__label) {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
}

.eye__hint {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--fg);
}

.eye__hint-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 var(--accent);
  animation: pulse 2.2s ease-out infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(224, 179, 106, 0.6); }
  100% { box-shadow: 0 0 0 12px rgba(224, 179, 106, 0); }
}

.eye__hint-touch,
.eye__detail {
  display: none;
}

@media (hover: none) {
  .eye__hint-fine {
    display: none;
  }

  .eye__hint-touch {
    display: inline;
  }

  .eye__detail {
    position: absolute;
    right: 4%;
    bottom: 12%;
    display: block;
    width: 38%;
    aspect-ratio: 1;
    border: 1px solid rgba(255, 244, 222, 0.85);
    border-radius: 50%;
    background-position: 50% 30%;
    background-size: 420%;
    box-shadow: 0 0 0 5px rgba(14, 13, 11, 0.3), 0 20px 50px rgba(0, 0, 0, 0.45);
  }
}

@media (max-width: 56rem) {
  .eye {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .eye__hint {
    position: static;
    margin-top: 5rem;
  }
}
</style>
