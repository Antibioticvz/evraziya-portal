import type { Brand } from '@/types/database'

const CDN_BASE = 'https://cdn-st2.vigbo.com/u57016/95830/blog/5771001/5232231'

// Static brands data as fallback when Supabase is not available
export const staticBrands: Brand[] = [
  {
    id: '1',
    slug: 'campomaggi',
    name: 'CAMPOMAGGI',
    short_description:
      'Кожа, абсолютный герой всех коллекций Campomaggi, является живым материалом, который может быть сформирован и обработан без изменения.',
    full_description:
      'Руководствуясь идеей создания сумок и предметов, которые отражают это, Марко Кампомаджи думает, мечтает и разрабатывает коллекции, в которых древнее искусство обработки кожи сочетается с творчеством, точностью в деталях и почти маниакальной осторожностью в ремесленном процессе.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87630281/952daf2fdb4e9023b667bbd2d5261e73.jpg`,
      `${CDN_BASE}/87630281/2805b20e8a5617f1cd7b9fc411d8cacc.jpg`,
      `${CDN_BASE}/87630281/bf90f9c7ce33221e180439f11914584a.jpg`,
      `${CDN_BASE}/87630281/00bfb709278204f8ff3be95141434d5e.jpg`,
      `${CDN_BASE}/87630281/42ed3b3c7366193580bd82eac4e0f018.jpg`,
      `${CDN_BASE}/87630281/02fb9d77d261cd1664bf5a85c03a61e2.jpg`,
      `${CDN_BASE}/87630281/ece40f614f81f4ed1a33e3f9f0ae5654.jpg`,
    ],
    is_active: true,
    sort_order: 1,
  },
  {
    id: '2',
    slug: 'caterina-lucchi',
    name: 'CATERINA LUCCHI',
    short_description:
      'Художественное использование цветов, способность играть с различными материалами, утонченная женственность и устойчивое производство являются основными характеристиками бренда.',
    full_description:
      'Художественное использование цветов, способность играть с различными материалами, утонченная женственность и устойчивое производство являются основными характеристиками бренда.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87630252/6e73816e43ce8b2e985be47c9497397f.jpg`,
      `${CDN_BASE}/87630252/c0aa14389caea69c54fcc014952b94c6.jpg`,
      `${CDN_BASE}/87630252/539df0ac799ae2b54c8389a29ca71b9f.jpg`,
      `${CDN_BASE}/87630252/251e76faa158438da2459d13bfd7098f.jpg`,
      `${CDN_BASE}/87630252/8289bd58583c998117d60adc416024bb.jpg`,
      `${CDN_BASE}/87630252/4c29701a57f76a9848c31fe9ae292e31.jpg`,
      `${CDN_BASE}/87630252/3ccf7c9bcb99484c38e3e59c0a9d6549.jpg`,
    ],
    is_active: true,
    sort_order: 2,
  },
  {
    id: '3',
    slug: 'cristian-marcucci',
    name: 'CRISTIAN MARCUCCI',
    short_description:
      'Страсть прежде всего. Затем опыт. И, наконец, решимость расти и выражать предвзятый свободный стиль в своей собственной линии.',
    full_description:
      'Страсть прежде всего. Затем опыт. И, наконец, решимость расти и выражать предвзятый свободный стиль в своей собственной линии.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/89026264/c1bbbddae556d5c1e45bd70a282a370f.jpg`,
      `${CDN_BASE}/89026264/bd388c9d2c0ffdb9de012ac2fa10cddc.jpg`,
      `${CDN_BASE}/89026264/1f1435c465bd6b4793618ab1a48a19c2.jpg`,
      `${CDN_BASE}/89026264/c98248c043e8d07feb4f5007907ba4b4.jpg`,
      `${CDN_BASE}/89026264/6475a0aa95f5c5a0ba5f8bd7fdca249a.jpg`,
      `${CDN_BASE}/89026264/1ec8c1aa39793d7f199f7633d24321b6.jpg`,
    ],
    is_active: true,
    sort_order: 3,
  },
  {
    id: '4',
    slug: '101meme',
    name: '101 MEME',
    short_description:
      'На название нас вдохновила тетя Мем, которая в возрасте 101 года продолжала собирать хорошо сшитые сумки и любить аутентичные вещи, потому что то, что является "истинным", не всегда идеально, но, безусловно, уникально.',
    full_description:
      'На название нас вдохновила тетя Мем, которая в возрасте 101 года продолжала собирать хорошо сшитые сумки и любить аутентичные вещи, потому что то, что является "истинным", не всегда идеально, но, безусловно, уникально.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87630207/ee7e61fa7e12c98e8d296a776e825689.jpg`,
      `${CDN_BASE}/87630207/aa963ce285ca24d551f3689797326742.jpg`,
      `${CDN_BASE}/87630207/6bc8e2801b7ec8ace47cffba1a44a4d5.jpg`,
      `${CDN_BASE}/87630207/7a06410709b243f6b1195805eef2e550.jpg`,
      `${CDN_BASE}/87630207/b5abdd00d157001fdb6d87a2bef1a10f.jpg`,
      `${CDN_BASE}/87630207/d8948ef47abc8e8f701cd1bd31155667.jpg`,
    ],
    is_active: true,
    sort_order: 4,
  },
  {
    id: '5',
    slug: 'maizena',
    name: 'MAIZENA',
    short_description:
      'Наша цель – создавать неподвластные времени, оригинальные, шикарные и модные сумки. Мы всегда ищем новые и эффективные формы, которые универсальны и удобны в носке.',
    full_description:
      'Наша цель – создавать неподвластные времени, оригинальные, шикарные и модные сумки. Мы всегда ищем новые и эффективные формы, которые универсальны и удобны в носке. Нам нравится думать, что, надев одну из наших сумок, человек может почувствовать себя лучшей версией себя.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87630077/7c14f1e6b50a35b4c2bc89e1c0c4f0c3.jpg`,
      `${CDN_BASE}/87630077/3d3e44f24c719d23f0d68c921b438762.jpg`,
      `${CDN_BASE}/87630077/b69ae5d110dda1221a24dcd82f20857b.jpg`,
      `${CDN_BASE}/87630077/b3d04b95fd1a2072cb8f87f6145ee285.jpg`,
      `${CDN_BASE}/87630077/abe7168f1c29a00cf724eaa0fbb94093.jpg`,
      `${CDN_BASE}/87630077/835edccdf6068a188a82e4af99bf6c54.jpg`,
      `${CDN_BASE}/87630077/721641ef27b785147c096c6fc96f6808.jpg`,
    ],
    is_active: true,
    sort_order: 5,
  },
  {
    id: '6',
    slug: 'chiarugi',
    name: 'CHIARUGI',
    short_description:
      'Chiarugi демонстрирует неподвластный времени стиль, коллекции производятся исключительно в Италии с использованием только итальянской рабочей силы.',
    full_description:
      'Chiarugi демонстрирует неподвластный времени стиль, коллекции производятся исключительно в Италии с использованием только итальянской рабочей силы, чтобы передать безошибочный признак подлинного made in italy.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87629991/91ae1f2544ce4e3a1a06c0ba57320a34.JPG`,
      `${CDN_BASE}/87629991/f548e7b6129ab70fc80db9e8bfd16428.jpg`,
      `${CDN_BASE}/87629991/be8cc5eeaf863f858e441b1b45575ba2.JPG`,
      `${CDN_BASE}/87629991/c67de1355a901ff71d4a8c3c3a92120d.jpg`,
      `${CDN_BASE}/87629991/cade71ee9c2dd6f855cb27bdccb286db.JPG`,
      `${CDN_BASE}/87629991/85386c4f1a9833a32de85016465b1a4a.JPG`,
      `${CDN_BASE}/87629991/8efcfd579fee8a7b1266b4a68a40e815.JPG`,
    ],
    is_active: true,
    sort_order: 6,
  },
  {
    id: '7',
    slug: 'gabs',
    name: 'GABS',
    short_description:
      'Простые и функциональные материалы, цвета и формы являются ключевыми элементами этого бренда. Принты являются оригинальными и уникальными в каждой коллекции.',
    full_description:
      'Простые и функциональные материалы, цвета и формы являются ключевыми элементами этого бренда. Принты являются оригинальными и уникальными в каждой коллекции.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87629945/316939f95e2fc8b3fd4a4129b259c5dd.jpg`,
      `${CDN_BASE}/87629945/822f426c6f9239f35cb08c4b5c749bcd.jpg`,
      `${CDN_BASE}/87629945/df9b923356909bc9692c1399760fa938.jpg`,
      `${CDN_BASE}/87629945/deb7d3909d48ec2c27a0348c98b453c2.jpg`,
      `${CDN_BASE}/87629945/1ccb0ea21b693b19feda7c494a4a68fc.jpg`,
      `${CDN_BASE}/87629945/8396af6249bd8fe8d5f1f1e19586fb07.jpg`,
      `${CDN_BASE}/87629945/08f88b20dcbad85e52d665aa9d8a4af6.jpg`,
      `${CDN_BASE}/87629945/195cf2fbab15f0eb464cd379ed011930.jpg`,
    ],
    is_active: true,
    sort_order: 7,
  },
  {
    id: '8',
    slug: 'charlotte-marchetti',
    name: 'CHARLOTTE-MARCHETTI',
    short_description:
      'Каждая сумка и аксессуар рождаются в результате взаимодействия творческого искусства и мастерства, при этом особое внимание уделяется выбору лучшей кожи.',
    full_description:
      'Каждая сумка и аксессуар рождаются в результате взаимодействия творческого искусства и мастерства, при этом особое внимание уделяется выбору лучшей кожи, предлагаемой на национальной арене.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87629418/d638646255fe699fc612019fc0b5bc31.jpeg`,
      `${CDN_BASE}/87629418/5f7eebc3029ce9d27083dc365620c5bd.jpeg`,
      `${CDN_BASE}/87629418/42a37221c10a12934d083a9968f7bbc1.jpeg`,
      `${CDN_BASE}/87629418/e3b394e15875872d099cb9f8b2f8a60e.jpeg`,
      `${CDN_BASE}/87629418/76695cb2dece92801bc401d66481f097.jpeg`,
    ],
    is_active: true,
    sort_order: 8,
  },
  {
    id: '9',
    slug: 'la-via-firenze',
    name: 'LA VIA FIRENZE',
    short_description:
      'Наша продукция отличается от конкурентов невероятным качеством телячьей кожи, долговечностью аксессуаров, авторским стилем и ассортиментом доступных цветов.',
    full_description:
      'Наша продукция отличается от конкурентов невероятным качеством телячьей кожи, которую мы выбираем, долговечностью наших аксессуаров, авторским стилем постоянно меняющейся продукции и ассортиментом доступных цветов.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87629187/1816d797ba7317c035d727aad40e4ae9.jpg`,
      `${CDN_BASE}/87629187/7c1a970a004111efa118dc777b79cd00.jpeg`,
      `${CDN_BASE}/87629187/3117d3919720c8b93d1035930bf68c78.jpeg`,
      `${CDN_BASE}/87629187/56b6e01aff2c05b5481eda295cd1f687.jpeg`,
      `${CDN_BASE}/87629187/c9fcdf403ec4f9b242acbe50929056bc.jpeg`,
      `${CDN_BASE}/87629187/6af8c68cee87fcd025bf10674fd1a00b.jpeg`,
      `${CDN_BASE}/87629187/eaed45fd04739b9e5a1c7e280ab6853b.jpeg`,
    ],
    is_active: true,
    sort_order: 9,
  },
  {
    id: '10',
    slug: 'vilenca-holland',
    name: 'VILENCA HOLLAND',
    short_description:
      'Сумки и аксессуары изготавливаются вручную из премиальной кожи производства Индии. Благодаря использованию цельной кожи бренд популярен и востребован в Европе и России.',
    full_description:
      'Сумки и аксессуары изготавливаются вручную из премиальной кожи производства Индии. Благодаря использованию цельной кожи и специальной обработке бренд популярен и востребован уже много лет в Европе и России.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/102292676/8029afdd4bb6045b4495b40c70669d7f.JPG`,
      `${CDN_BASE}/102292676/e099541980842718204ddc5373168cf7.JPG`,
      `${CDN_BASE}/102292676/29b158a72b4830b049e3f2855ea2517e.JPG`,
      `${CDN_BASE}/102292676/ec62626dc0d3557c64c0179e524b541f.JPG`,
      `${CDN_BASE}/102292676/7f1a79cf851a4911270538edbb345201.JPG`,
      `${CDN_BASE}/102292676/3e75b62df7934b2eba44c16046ac9f4c.JPG`,
      `${CDN_BASE}/102292676/b131a25327461a5f40b03e92a6778d40.JPG`,
      `${CDN_BASE}/102292676/2541486133c9d726e23b877f88783cd1.JPG`,
      `${CDN_BASE}/102292676/d635bfb1906dd5f6d8615dff29691f9f.JPG`,
    ],
    is_active: true,
    sort_order: 10,
  },
  {
    id: '11',
    slug: 'bear-design',
    name: 'BEAR DESIGN',
    short_description:
      'Сумки и аксессуары Bear Design изготавливаются вручную из хорошей и прочной кожи производства Индии.',
    full_description:
      'Сумки и аксессуары Bear Design изготавливаются вручную из хорошей и прочной кожи производства Индии. Благодаря использованию цельной кожи и специальной отделке сумки Bear Design популярны и востребованы уже много лет.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87628920/721e0ce22ba901c4d14bc1d6210693c0.jpg`,
      `${CDN_BASE}/87628920/4920ca3345f83ec68eb1e18d89a4a880.jpg`,
      `${CDN_BASE}/87628920/7afbb20d8e46a6c1263ea04c13f33134.jpg`,
      `${CDN_BASE}/87628920/cfc12047c02a244da9b21d0328772a5f.jpg`,
      `${CDN_BASE}/87628920/4a958f6bfe3051befe78ad342cb09685.jpg`,
      `${CDN_BASE}/87628920/80c77cac26a4b87350ce872b88571275.jpg`,
      `${CDN_BASE}/87628920/15a7ad2abfde7e295a2f64d3184337ac.JPG`,
    ],
    is_active: true,
    sort_order: 11,
  },
  {
    id: '12',
    slug: 'roberto-mantellassi',
    name: 'ROBERTO MANTELLASSI',
    short_description:
      'Фирменный аксессуар Роберто Мантелласси — это философия жизни. Это решимость, смелость, честолюбие.',
    full_description:
      'Фирменный аксессуар Роберто Мантелласси — это философия жизни. Это решимость, смелость, честолюбие. Это каждый день направлять себя, вспоминая наши силы, через уникальный браслет, брелок, аксессуар.',
    logo_url: null,
    hero_image_url: null,
    preview_images: [
      `${CDN_BASE}/87652444/a5dc2cd8cb9a080fcaf29fead30d87ba.jpeg`,
      `${CDN_BASE}/87652444/d4c35c7aad8f5aca81ce2f3022466dae.jpeg`,
      `${CDN_BASE}/87652444/af4b8f4cb30bbf709433852cc5b48270.jpg`,
      `${CDN_BASE}/87652444/0af319a26ad63b27a4367bb426c71068.jpg`,
      `${CDN_BASE}/87652444/310510b4b6ea08f7d0b027cd8a68e3e7.jpg`,
      `${CDN_BASE}/87652444/8084ccad488fd33719726d1e8ccbf557.jpg`,
    ],
    is_active: true,
    sort_order: 12,
  },
]
