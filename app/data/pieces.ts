// Editorial imagery: public-domain works from the Art Institute of Chicago
// (CC0), fetched by scripts/fetch-images.mjs. They illustrate the kinds of
// pieces the house deals in and are not items offered for sale.
import data from './pieces.json'

export type PieceSlug = keyof typeof data

export type Discipline = 'jewelry' | 'sculpture' | 'artifacts' | 'art'

export const disciplines: { id: Discipline, title: string, text: string }[] = [
  {
    id: 'jewelry',
    title: 'Fine Jewelry',
    text: 'Necklaces and chains, pearls, diamonds, rings, earrings, and gold, each selected for its craftsmanship and character, to be worn for a lifetime and treasured long after.',
  },
  {
    id: 'sculpture',
    title: 'Sculpture',
    text: 'Works of real presence that command a room and hold their meaning for generations.',
  },
  {
    id: 'artifacts',
    title: 'Historical Artifacts',
    text: 'Survivors of earlier ages that offer a tangible connection to the lives and hands that came before us.',
  },
  {
    id: 'art',
    title: 'Fine Art',
    text: 'Pieces to live with, return to, and one day pass on.',
  },
]

// Catalogue order, which also sets each piece's lot number, with a short note
// for its page.
const catalogue: { slug: PieceSlug, discipline: Discipline, note: string }[] = [
  {
    slug: 'lion-earring',
    discipline: 'jewelry',
    note: 'Worked in gold and finished with a lion’s head, a motif Hellenistic goldsmiths returned to again and again. Small enough to sit in the palm, and fine enough to reward the loupe.',
  },
  {
    slug: 'ship-pendant',
    discipline: 'jewelry',
    note: 'Reinhold Vasters of Aachen made jewels in the Renaissance manner for nineteenth-century collectors. This ship, rigged in gold and enamel and hung with pearls, is the form at its most theatrical.',
  },
  {
    slug: 'claudius-cameo',
    discipline: 'jewelry',
    note: 'Claudius appears in the guise of Jupiter, cut from layered sardonyx in the middle of the first century. A late sixteenth-century Italian goldsmith gave the stone the enamelled, pearl-hung mount it wears today.',
  },
  {
    slug: 'tiberius-cameo',
    discipline: 'jewelry',
    note: 'A sardonyx portrait of the emperor Tiberius, carved during his reign and remounted some fifteen centuries later in gold, enamel, and pearl. Two workshops, far apart in time, meet in a single jewel.',
  },
  {
    slug: 'baroque-pearl',
    discipline: 'jewelry',
    note: 'An irregular baroque pearl becomes the body of a grotesque beast, completed in enamelled gold and diamonds. Jewellers of the period prized such pearls for the creatures their shapes suggested.',
  },
  {
    slug: 'bow-brooch',
    discipline: 'jewelry',
    note: 'An enamelled bow of silver gilt, set with aquamarines. Its date is given as either the seventeenth or the nineteenth century, a reminder of how faithfully later jewellers could follow earlier models.',
  },
  {
    slug: 'intaglio-ring',
    discipline: 'jewelry',
    note: 'A Roman gold ring set with a carved stone showing a woman’s head in profile. Intaglios were cut in reverse to be pressed into wax, so a ring like this served as a signature as much as an ornament.',
  },
  {
    slug: 'pearl-brooch',
    discipline: 'jewelry',
    note: 'A French brooch of the early nineteenth century, setting stone and pearls in gold. Restrained, symmetrical, and made to be worn close.',
  },
  {
    slug: 'houdon-bust',
    discipline: 'sculpture',
    note: 'Jean Antoine Houdon’s marble portrait of the Comtesse de Pange, carved in 1780. Houdon was the great portraitist of his age, and his sitters seem caught in the middle of a thought.',
  },
  {
    slug: 'amphitrite-bust',
    discipline: 'sculpture',
    note: 'Lambert Sigisbert Adam modelled the sea goddess Amphitrite in terracotta around 1725. The clay keeps the quickness of the sculptor’s hand in a way finished marble rarely does.',
  },
  {
    slug: 'nola-amphora',
    discipline: 'artifacts',
    note: 'A red-figure storage jar of the mid-fifth century BCE, associated with Nola in Campania. The figures are left in the colour of the clay while the ground around them is painted black.',
  },
  {
    slug: 'irene-solidus',
    discipline: 'artifacts',
    note: 'A gold solidus struck for Irene, the first woman to rule Byzantium in her own name, between 797 and 802. Small, heavy, and still bright after twelve centuries.',
  },
  {
    slug: 'marlborough-snuff-box',
    discipline: 'artifacts',
    note: 'A Parisian gold box by Nicolas André Courtois, set with an enamel portrait of the Duchess of Marlborough and framed in diamonds. Boxes like this were given as tokens of favour and kept as treasures.',
  },
  {
    slug: 'sevres-vases',
    discipline: 'artifacts',
    note: 'A pair of soft-paste porcelain vases from the Sèvres manufactory, dated 1769, painted in polychrome enamels and mounted in gilt bronze. Pairs that have stayed together are rarer than either vase alone.',
  },
  {
    slug: 'globe-table',
    discipline: 'artifacts',
    note: 'A Viennese work table of about 1820, built as a globe in fruitwood veneers with ebonized and gilded details. Opened, it reveals a fitted interior.',
  },
  {
    slug: 'sampler-map',
    discipline: 'artifacts',
    note: 'An English needlework map of around 1800. Map samplers taught geography and stitching at once, and each is the work of a single, patient hand.',
  },
  {
    slug: 'curtain-still-life',
    discipline: 'art',
    note: 'Adriaen van der Spelt painted a garland of flowers half hidden by a painted curtain in 1658. The trompe-l’oeil invites the hand to draw the curtain back: a picture about looking closely.',
  },
  {
    slug: 'heirlooms-still-life',
    discipline: 'art',
    note: 'Family treasures, among them an ostrich egg cup, painted by Pieter Gerritsz. van Roestraeten around 1670. The picture is itself a record of what one household chose to keep.',
  },
  {
    slug: 'portrait-miniature',
    discipline: 'art',
    note: 'A portrait miniature painted in watercolor on ivory by Anna Claypoole Peale in 1818. Peale was among the first professional women painters in America, and miniatures like this were made to be carried close.',
  },
  {
    slug: 'world-map',
    discipline: 'art',
    note: 'The known world drawn in black line on a single engraved sheet, attributed to John Paul Cimerlin.',
  },
]

export function isPieceSlug(slug: unknown): slug is PieceSlug {
  return typeof slug === 'string' && Object.hasOwn(data, slug)
}

export function piece(slug: PieceSlug) {
  const p = data[slug]
  const src = (width: 720 | 1400 | 2400) => `/images/pieces/${slug}-${width}.webp`
  const index = catalogue.findIndex(c => c.slug === slug)
  const entry = catalogue[index]!
  // The page takes a dark or light palette to match the photograph's ground.
  const shade = Number(p.color.match(/\d+/)?.[0] ?? 0)
  return {
    ...p,
    slug,
    src,
    srcset: `${src(720)} 720w, ${src(1400)} 1400w`,
    alt: p.medium ? `${p.title}, ${p.medium.split('\n')[0]!.toLowerCase()}` : p.title,
    meta: [p.artist, p.date.replace(/\n/g, ' ')].filter(Boolean).join(', '),
    href: `/collection/${slug}`,
    lot: String(index + 1).padStart(2, '0'),
    discipline: disciplines.find(d => d.id === entry.discipline)!,
    note: entry.note,
    theme: shade < 100 ? 'ink' : 'bone',
  }
}

export type Piece = ReturnType<typeof piece>

/** Every piece, in catalogue order. */
export const allPieces = (): Piece[] => catalogue.map(c => piece(c.slug))
