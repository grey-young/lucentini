<script setup lang="ts">
import { gsap } from 'gsap'
import { contact } from '~/data/site'

const root = ref<HTMLElement>()
const toast = ref('')
const [emailUser, emailDomain] = contact.email.split('@')
let toastTimer: ReturnType<typeof setTimeout> | undefined

function notify(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2600)
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(contact.email)
    notify('Email address copied')
  }
  catch {
    notify('Copying is blocked here. Select the address instead')
  }
}

onBeforeUnmount(() => clearTimeout(toastTimer))

useScene(root, ({ q, motion }) => {
  if (!motion) return
  revealChars(q('.contact__title')[0]!)
  revealLines(q('.contact__lede')[0]!)
  gsap.from(q('.contact__row'), {
    autoAlpha: 0,
    y: 40,
    duration: 1.2,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: q('.contact__rows')[0], start: 'top 88%', once: true },
  })
  gsap.from(q('.contact__badge')[0]!, {
    scale: 0,
    rotate: -90,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: q('.contact__badge')[0], start: 'top 92%', once: true },
  })
})
</script>

<template>
  <section id="contact" ref="root" class="contact" data-theme="oxblood" data-index="VII" data-chapter="Begin a conversation">
    <div class="contact__head">
      <p class="kicker"><b>(VII)</b> Inquiries</p>
      <h2 class="contact__title">Begin a <em>conversation</em></h2>
      <div class="contact__intro">
        <p class="contact__lede">
          We welcome inquiries from private collectors, the trade, and anyone searching for something extraordinary.
        </p>
        <a class="contact__badge" :href="`mailto:${contact.email}`" data-magnetic aria-label="Write to us by email">
          <svg class="contact__badge-ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="contact-badge-path" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" />
            </defs>
            <text>
              <textPath href="#contact-badge-path" textLength="502" lengthAdjust="spacing">WRITE TO US ✦ BEGIN A CONVERSATION ✦ </textPath>
            </text>
          </svg>
          <span class="contact__badge-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>

    <ul class="contact__rows">
      <li class="contact__row">
        <span class="kicker">Email</span>
        <a class="contact__value" :href="`mailto:${contact.email}`">{{ emailUser }}<wbr>@{{ emailDomain }}</a>
        <span class="contact__actions">
          <button type="button" class="contact__pill" data-magnetic @click="copyEmail">Copy</button>
          <a class="contact__pill" :href="`mailto:${contact.email}`" data-magnetic>Write</a>
        </span>
      </li>
      <li class="contact__row">
        <span class="kicker">WhatsApp / Phone</span>
        <a class="contact__value" :href="contact.whatsapp" target="_blank" rel="noopener">{{ contact.phone }}</a>
        <span class="contact__actions">
          <a class="contact__pill" :href="contact.whatsapp" target="_blank" rel="noopener" data-magnetic>Message</a>
          <a class="contact__pill" :href="contact.tel" data-magnetic>Call</a>
        </span>
      </li>
    </ul>

    <Transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <p v-if="toast" class="contact__toast" role="status">{{ toast }}</p>
    </Transition>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  padding: clamp(7rem, 14vw, 12rem) var(--pad) clamp(5rem, 10vw, 8rem);
}

.contact__head {
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.contact__title {
  font-size: clamp(4rem, 13vw, 16rem);
  letter-spacing: -0.05em;
  line-height: 0.84;
}

.contact__title em {
  color: var(--accent);
}

.contact__intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.contact__lede {
  max-width: 30rem;
  font-size: clamp(1.1rem, 1rem + 0.45vw, 1.45rem);
  line-height: 1.45;
}

.contact__badge {
  position: relative;
  display: grid;
  flex: none;
  place-items: center;
  width: clamp(7.5rem, 11vw, 10rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
}

.contact__badge-ring {
  position: absolute;
  inset: 0.5rem;
  width: calc(100% - 1rem);
  animation: spin 18s linear infinite;
}

.contact__badge-ring text {
  fill: currentColor;
  font-family: var(--font-mono);
  font-size: 12px;
}

.contact__badge-arrow {
  font-size: clamp(1.8rem, 2.6vw, 2.4rem);
  transition: transform 0.6s var(--ease-out);
}

.contact__badge:hover .contact__badge-arrow {
  transform: rotate(45deg);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.contact__rows {
  margin: clamp(4rem, 8vw, 7rem) 0 0;
  padding: 0;
  list-style: none;
}

.contact__row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(10rem, 1fr) minmax(0, 3fr) auto;
  gap: 1.5rem;
  align-items: center;
  padding: clamp(1.4rem, 3vw, 2.2rem) 0;
  border-top: 1px solid var(--line);
}

.contact__row:last-child {
  border-bottom: 1px solid var(--line);
}

.contact__value {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3.6vw, 3.8rem);
  letter-spacing: -0.02em;
  line-height: 1.05;
  overflow-wrap: anywhere;
  transition: color 0.4s ease;
}

.contact__value:hover {
  color: var(--accent);
}

.contact__actions {
  display: flex;
  gap: 0.6rem;
}

.contact__pill {
  padding: 0.7rem 1.25rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
}

.contact__pill:hover {
  border-color: var(--fg);
  background: var(--fg);
  color: var(--bg);
}

.contact__toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  z-index: 850;
  margin-left: -9rem;
  width: 18rem;
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  background: #f0e3d3;
  color: #3d0f0c;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-align: center;
  text-transform: uppercase;
  --animate-duration: 0.6s;
}

@media (max-width: 48rem) {
  .contact__intro {
    align-items: flex-start;
    flex-direction: column;
  }

  .contact__row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
