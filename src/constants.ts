import { TeaData } from './types';

export const TEAS: TeaData[] = [
  {
    id: 'longjing',
    chineseName: '西湖龙井',
    englishName: 'West Lake Longjing',
    category: 'Green',
    origin: 'Hangzhou, Zhejiang',
    description: 'Flat, emerald-green leaves known for their "four perfections": emerald color, aromatic flavor, sweet taste, and beautiful shape.',
    culturalBackground: 'Grown near the tranquil West Lake, this tea was granted the status of Imperial Tea during the Qing Dynasty by the Qianlong Emperor.',
    history: 'Longjing tea history dates back to the Tang Dynasty. It gained fame during the Qing Dynasty when the Qianlong Emperor visited the area and granted 18 tea trees "Imperial" status.',
    healthBenefits: ['Rich in antioxidants', 'Supports weight management', 'Improves focus'],
    caffeineLevel: 'Medium',
    brewingTemp: 80,
    color: 'emerald',
    steps: [
      {
        title: 'Warm the cup',
        description: 'Preheating the vessel ensures consistent temperature and awakens the porcelain.',
        instruction: 'Pour hot water into the vessel to warm it, then discard.',
        action: 'Warm Vessel'
      },
      {
        title: 'Add tea leaves',
        description: 'Approximately 3-5g of flat Longjing leaves are used for a single session.',
        instruction: 'Add the emerald, flat leaves into the warmed vessel.',
        action: 'Add Tea'
      },
      {
        title: 'Smell aroma',
        description: 'The residual heat releases the initial chestnut-like fragrance of the dry leaves.',
        instruction: 'Close the lid and shake gently to experience the "first scent."',
        action: 'Shake & Smell'
      },
      {
        title: 'Pour hot water & brew',
        description: 'Longjing prefers 80°C (176°F) to maintain its delicate sweetness without bitterness.',
        instruction: 'Pour water and wait as the leaves begin their "dance."',
        action: 'Pour & Brew',
        targetTemp: 80,
        duration: 30
      },
      {
        title: 'Pour into fairness cup',
        description: 'Transferring to the fairness cup ensures the tea strength remains uniform for all.',
        instruction: 'Pour the emerald infusion into the fairness cup.',
        action: 'Pour into Fairness Cup'
      },
      {
        title: 'Serve tea',
        description: 'Distribute the infusion into small tasting cups for appreciation.',
        instruction: 'Pour the tea from the fairness cup into the cups.',
        action: 'Serve'
      }
    ],
    stampImage: '🐉',
    stampIllustration: '/stamp_tea_green.png',
    heroImage: '/longjing.jpg',
    cardImage: '/longjing-1.jpg',
    aroma: ['Chestnut', 'Bean-like', 'Fresh-cut-grass'],
    taste: ['Sweet', 'Nutty', 'Umami'],
    summary: 'You have mastered the delicate art of Longjing. This tea reminds us of the misty hills of Hangzhou.',
  },
  {
    id: 'yinzhen',
    chineseName: '白毫银针',
    englishName: 'Silver Needle',
    category: 'White',
    origin: 'Fujian',
    description: 'Composed entirely of tender buds covered in fine white down, creating a pale, shimmering infusion.',
    culturalBackground: 'The least processed of all teas, Silver Needle is prized for its cooling properties and subtle, floral elegance.',
    history: 'Originally developed in the late 18th century in Fujian province, it was reserved for the Imperial court due to its rarity and delicate nature.',
    healthBenefits: ['Anti-aging properties', 'Supports healthy skin', 'Gentle detoxification'],
    caffeineLevel: 'Low',
    brewingTemp: 85,
    color: 'stone',
    steps: [
      {
        title: 'Warm the cup',
        description: 'White tea is traditionally brewed in a porcelain Gaiwan to maintain its purity.',
        instruction: 'Rinse the vessel with hot water, then discard.',
        action: 'Warm Vessel'
      },
      {
        title: 'Add tea leaves',
        description: 'Note the tiny white hairs (the "down") on the silver buds.',
        instruction: 'Place the delicate silver buds into the warmed vessel.',
        action: 'Add Tea'
      },
      {
        title: 'Smell aroma',
        description: 'The gentle heat awakens the floral, melon-like notes hidden in the silver buds.',
        instruction: 'Close the lid and shake gently to release the subtle floral scent.',
        action: 'Shake & Smell'
      },
      {
        title: 'Pour hot water & brew',
        description: 'Avoid pouring directly onto the buds to keep the flavor gentle at 85°C.',
        instruction: 'Pour water and wait as the shimmering buds begin to soften.',
        action: 'Pour & Brew',
        targetTemp: 85,
        duration: 45
      },
      {
        title: 'Pour into fairness cup',
        description: 'The liquid should be pale ivory, tasting like honeysuckle.',
        instruction: 'Pour the infusion into the fairness cup.',
        action: 'Pour into Fairness Cup'
      },
      {
        title: 'Serve tea',
        description: 'Distribute the shimmering pale infusion into small tasting cups.',
        instruction: 'Pour the tea from the fairness cup into the cups.',
        action: 'Serve'
      }
    ],
    stampImage: '✨',
    stampIllustration: '/stamp_tea_white.png',
    heroImage: '/silver-needle.jpg',
    cardImage: '/yinzhen-1.jpg',
    aroma: ['Honeysuckle', 'Fresh Hay', 'Cucumber'],
    taste: ['Silky', 'Sweet', 'Floral-undertones'],
    summary: 'You discovered the subtle grace of the Silver Needle. True beauty often speaks in whispers.',
  },
  {
    id: 'tieguanyin',
    chineseName: '安溪铁观音',
    englishName: 'Anxi Tieguanyin',
    category: 'Oolong',
    origin: 'Anxi, Fujian',
    description: 'A semi-oxidized oolong with tightly rolled, heavy leaves that produce a distinct orchid-like aroma.',
    culturalBackground: 'Named after the "Iron Goddess of Mercy." Legend tells of a poor farmer who tended a neglected temple and was rewarded with this miraculous tea.',
    history: 'Dating back to the 18th century in Anxi, it is one of China\'s most beloved oolongs, representing the perfect balance of oxidation.',
    healthBenefits: ['Digestion aid', 'Heart health support', 'Stress relief'],
    caffeineLevel: 'Medium',
    brewingTemp: 95,
    color: 'teal',
    steps: [
      {
        title: 'Warm the cup',
        description: 'A ceramic vessel is ideal for capturing the intense orchid fragrance.',
        instruction: 'Heat the vessel thoroughly with near-boiling water.',
        action: 'Warm Vessel'
      },
      {
        title: 'Add tea leaves',
        description: 'Listen for the "clink" as the heavy, rolled leaves hit the porcelain.',
        instruction: 'Fill the vessel with the tightly rolled "iron" leaves.',
        action: 'Add Tea'
      },
      {
        title: 'Smell aroma',
        description: 'The heat awakens the distinct, deep orchid-like aroma of Tieguanyin.',
        instruction: 'Close the lid and shake gently to concentrate the floral fragrance.',
        action: 'Shake & Smell'
      },
      {
        title: 'Pour hot water & brew',
        description: 'Oolong thrives on heat (95°C / 203°F) to unfurl its complex layers.',
        instruction: 'Pour hot water and watch the leaves expand and unfurl.',
        action: 'Pour & Brew',
        targetTemp: 95,
        duration: 30
      },
      {
        title: 'Pour into fairness cup',
        description: 'The golden liquid carries the soul of the Anxi mountains.',
        instruction: 'Pour the tea from the vessel into the fairness cup.',
        action: 'Pour into Fairness Cup'
      },
      {
        title: 'Serve tea',
        description: 'Traditional service involves quick, multiple infusions shared with friends.',
        instruction: 'Pour the tea from the fairness cup into the cups.',
        action: 'Serve'
      }
    ],
    stampImage: '🏮',
    stampIllustration: '/stamp_tea_tieguanyin.png',
    heroImage: '/tieguanyin.jpg',
    cardImage: '/guanyin-1.jpg',
    aroma: ['Orchid', 'Osmanthus', 'Honey'],
    taste: ['Creamy', 'Floral', 'Refreshing-aftertaste'],
    summary: 'You have explored the deep floral layers of Tieguanyin. Each infusion tells a new story.',
  },
  {
    id: 'xiaozhong',
    chineseName: '正山小种',
    englishName: 'Lapsang Souchong',
    category: 'Red',
    origin: 'Wuyi Mountains, Fujian',
    description: 'The world\'s first black tea, known for its bold character and traditional pine-smoke drying process.',
    culturalBackground: 'Born by accident when soldiers camped in a tea factory, forcing the farmers to dry the tea over pine fires to save the harvest.',
    history: 'Originating in the late 16th century, it was the first black tea exported to Europe, famously enjoyed by the British Royal Family.',
    healthBenefits: ['Energy boost', 'Circulation support', 'Digestive health'],
    caffeineLevel: 'High',
    brewingTemp: 95,
    color: 'amber',
    steps: [
      {
        title: 'Warm the cup',
        description: 'Black tea brings warmth. A sturdy vessel fits its bold character.',
        instruction: 'Warm the vessel thoroughly with hot water.',
        action: 'Warm Vessel'
      },
      {
        title: 'Add tea leaves',
        description: 'These leaves are fully oxidized and often carry a hint of pine smoke.',
        instruction: 'Add the wiry dark leaves into the warmed vessel.',
        action: 'Add Tea'
      },
      {
        title: 'Smell aroma',
        description: 'The residual heat releases the bold, smoky pine fragrance of the dry leaves.',
        instruction: 'Close the lid and shake gently to enjoy the unique smoky aroma.',
        action: 'Shake & Smell'
      },
      {
        title: 'Pour hot water & brew',
        description: 'High temperatures (95°C) bring out the malty, sweet, and smoky notes.',
        instruction: 'Pour hot water vigorously and wait for the deep amber extraction.',
        action: 'Pour & Brew',
        targetTemp: 95,
        duration: 40
      },
      {
        title: 'Pour into fairness cup',
        description: 'The reddish-gold liquid is known in China as "Red Tea."',
        instruction: 'Pour the dark infusion into the fairness cup.',
        action: 'Pour into Fairness Cup'
      },
      {
        title: 'Serve tea',
        description: 'The taste is sweet like dried longan, with a comforting finish.',
        instruction: 'Pour the tea from the fairness cup into the cups.',
        action: 'Serve'
      }
    ],
    stampImage: '🔥',
    stampIllustration: '/stamp_tea_black.png',
    heroImage: '/lapsang-souchong.jpg',
    cardImage: '/xiaozhong-1.jpg',
    aroma: ['Pine Smoke', 'Longan', 'Sweet Potato'],
    taste: ['Malt', 'Fruity', 'Smoky-but-smooth'],
    summary: 'You felt the warmth of the Wuyi Mountains. The smoke of the pine fire lingers on the palate.',
  },
  {
    id: 'puer',
    chineseName: '云南普洱',
    englishName: 'Yunnan Pu’er',
    category: 'Dark',
    origin: 'Yunnan',
    description: 'A post-fermented tea that ages like fine wine, developing earthy, woody, and complex depth over time.',
    culturalBackground: 'Famously transported on the Ancient Tea Horse Road. It was compressed into cakes to survive the long journey across the Himalayas.',
    history: 'For over 1,700 years, Pu\'er has been produced in Yunnan and traded along the Tea Horse Road, prized for its ability to age and improve.',
    healthBenefits: ['Lowers cholesterol', 'Aids metabolism', 'Rich in probiotics'],
    caffeineLevel: 'Medium',
    brewingTemp: 100,
    color: 'orange',
    steps: [
      {
        title: 'Warm the cup',
        description: 'Pu\'er is dense and requires high heat. A sturdy gaiwan is preferred.',
        instruction: 'Heat the vessel with boiling water to prepare for the fermentation.',
        action: 'Warm Vessel'
      },
      {
        title: 'Add tea leaves',
        description: 'If using a cake, these aged leaves carry the stories of Yunnan.',
        instruction: 'Add the dark, aged leaves to the warmed vessel.',
        action: 'Add Tea'
      },
      {
        title: 'Smell aroma',
        description: 'The heat awakens the earthy, woody, and grounding depth of the leaves.',
        instruction: 'Close the lid and shake gently to sense the ancient forest aroma.',
        action: 'Shake & Smell'
      },
      {
        title: 'Pour hot water & brew',
        description: 'Use the hottest water (100°C / 212°F) to wake the soul of Pu\'er.',
        instruction: 'Pour boiling water and wait for the dark liquor to form.',
        action: 'Pour & Brew',
        targetTemp: 100,
        duration: 25
      },
      {
        title: 'Pour into fairness cup',
        description: 'The infusion is deep, dark, and grounding, like time itself.',
        instruction: 'Pour the dark, grounded liquid into the fairness cup.',
        action: 'Pour into Fairness Cup'
      },
      {
        title: 'Serve tea',
        description: 'Pu\'er has a "Hui Gan" – a returning sweetness shared by all.',
        instruction: 'Pour the tea from the fairness cup into the cups.',
        action: 'Serve'
      }
    ],
    stampImage: '⛰️',
    stampIllustration: '/stamp_tea_puer.png',
    heroImage: '/puer.jpg',
    cardImage: '/puer-1.jpg',
    aroma: ['Damp Earth', 'Woody', 'Aged Leather'],
    taste: ['Rich', 'Earthy', 'Camphor'],
    summary: 'You have tasted time itself. Pu\'er connects us to the ancient mountains of Yunnan.',
  }
];

export const DIVINATIONS = [
  "A peaceful day invites patience and reflection.",
  "A small new beginning may appear today, like a fresh tea bud.",
  "Careful observation will reveal something meaningful in your cup.",
  "Like tea leaves unfurling, your potential will expand with time.",
  "The heat of the moment will soon settle into a warm clarity.",
  "A friend from afar may bring news as sweet as honeyed oolong.",
  "Your roots are strong; stay grounded like the ancient tea trees.",
  "Clarity comes not from rushing, but from letting things settle.",
  "A hidden opportunity is steeping nearby; wait for the right moment.",
  "The aroma of success is subtle but unmistakably present."
];
