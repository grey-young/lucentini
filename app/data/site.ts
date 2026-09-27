import type { PieceSlug } from './pieces'

export const contact = {
  email: 'Lucentiniantiquesnsculpture05@outlook.com',
  phone: '+1 (425) 548-3127',
  tel: 'tel:+14255483127',
  whatsapp: 'https://wa.me/14255483127',
}

export const chapters: { index: string, title: string, href: string, piece: PieceSlug }[] = [
  { index: 'I', title: 'Prologue', href: '/about#prologue', piece: 'lion-earring' },
  { index: 'II', title: 'Where it began', href: '/about#origins', piece: 'claudius-cameo' },
  { index: 'III', title: 'A way of seeing', href: '/about#eye', piece: 'marlborough-snuff-box' },
  { index: 'IV', title: 'An inherited eye', href: '/about#today', piece: 'world-map' },
  { index: 'V', title: 'The collection', href: '/about#collection', piece: 'ship-pendant' },
  { index: 'VI', title: 'How we work', href: '/about#approach', piece: 'portrait-miniature' },
  { index: 'VII', title: 'Begin a conversation', href: '/about#contact', piece: 'baroque-pearl' },
]

/** Pages beyond the About chapters, listed after them in the menu and footer. */
export const pages: { index: string, title: string, href: string, piece: PieceSlug }[] = [
  { index: '✦', title: 'The full collection', href: '/collection', piece: 'bow-brooch' },
]
