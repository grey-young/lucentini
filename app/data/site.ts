import type { PieceSlug } from './pieces'

export const contact = {
  email: 'Lucentiniantiquesnsculpture05@outlook.com',
  phone: '+1 (425) 548-3127',
  tel: 'tel:+14255483127',
  whatsapp: 'https://wa.me/14255483127',
}

export const chapters: { index: string, title: string, href: string, piece: PieceSlug }[] = [
  { index: 'I', title: 'Prologue', href: '/about#prologue', piece: 'crowned-lion' },
  { index: 'II', title: 'Where it began', href: '/about#origins', piece: 'old-centaur' },
  { index: 'III', title: 'A way of seeing', href: '/about#eye', piece: 'orientalist-warrior' },
  { index: 'IV', title: 'An inherited eye', href: '/about#today', piece: 'officer-bust' },
  { index: 'V', title: 'The collection', href: '/about#collection', piece: 'egyptian-figure' },
  { index: 'VI', title: 'How we work', href: '/about#approach', piece: 'horse-head' },
  { index: 'VII', title: 'Begin a conversation', href: '/about#contact', piece: 'figural-torchere' },
]

/** Pages beyond the About chapters, listed after them in the menu and footer. */
export const pages: { index: string, title: string, href: string, piece: PieceSlug }[] = [
  { index: '✦', title: 'The full collection', href: '/collection', piece: 'old-centaur' },
]
