import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface TeaVariety {
  name: string;
  nameEn: string;
  origin: string;
  originEn: string;
  note: string;
  noteEn: string;
  id?: string;
}

interface APITea {
  slug: string;
  name: string;
  description: string;
  origin: string;
  type: string;
  caffeine: string;
  brew?: {
    temperature: string;
    steep_time: string;
  };
}

interface TeaCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  representativeTeas: TeaVariety[];
  color: string;
}

const CHINA_TEA_DATA: TeaCategory[] = [
  {
    id: 'green',
    name: '绿茶',
    nameEn: 'Green Tea',
    description: '不发酵茶，产量最大，种类最多。以“色翠、香郁、味甘、形美”四绝著称。',
    descriptionEn: 'Non-fermented tea with the largest production and most varieties. Renowned for its "four wonders": emerald color, rich aroma, sweet taste, and beautiful shape.',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    representativeTeas: [
      { name: '西湖龙井', nameEn: 'West Lake Longjing', origin: '浙江杭州', originEn: 'Hangzhou, Zhejiang', note: '中国第一名茶，形如扁雀舌。', noteEn: 'China’s #1 tea, shaped like a bird’s tongue.' },
      { name: '洞庭碧螺春', nameEn: 'Dongting Biluochun', origin: '江苏苏州', originEn: 'Suzhou, Jiangsu', note: '满披白毫，银白隐翠，卷曲成螺。', noteEn: 'Silver-white tips, curled like a snail.' },
      { name: '信阳毛尖', nameEn: 'Xinyang Maojian', origin: '河南信阳', originEn: 'Xinyang, Henan', note: '细圆紧直，色泽翠绿，白毫显露。', noteEn: 'Thin, round and straight, emerald green.' },
      { name: '黄山毛峰', nameEn: 'Huangshan Maofeng', origin: '安徽黄山', originEn: 'Huangshan, Anhui', note: '状似雀舌，色如象牙。', noteEn: 'Sparrow-tongue shape, ivory color.' }
    ]
  },
  {
    id: 'black',
    name: '红茶',
    nameEn: 'Black Tea',
    description: '全发酵茶，汤色红艳，滋味醇厚。中西方受众极广。',
    descriptionEn: 'Fully fermented tea with a bright red liquor and mellow, full-bodied flavor. Highly popular in both East and West.',
    color: 'bg-red-50 text-red-800 border-red-100',
    representativeTeas: [
      { name: '正山小种', nameEn: 'Lapsang Souchong', origin: '福建武夷山', originEn: 'Wuyishan, Fujian', note: '红茶鼻祖，带有独特的松烟香。', noteEn: 'The ancestor of black tea, distinctive smoky pine aroma.' },
      { name: '祁门红茶', nameEn: 'Keemun Black Tea', origin: '安徽祁门', originEn: 'Qimen, Anhui', note: '香气浓郁，带有果香与兰花香。', noteEn: 'Rich aroma with notes of fruit and orchid.' },
      { name: '滇红', nameEn: 'Dianhong (Yunnan Black)', origin: '云南临沧', originEn: 'Lincang, Yunnan', note: '金毫显露，滋味濃厚。', noteEn: 'Prominent golden tips with thick flavor.' },
      { name: '金骏眉', nameEn: 'Jin Jun Mei', origin: '福建武夷山', originEn: 'Wuyishan, Fujian', note: '高端红茶代表，滋味甘清。', noteEn: 'Premium black tea with a sweet and clear taste.' }
    ]
  },
  {
    id: 'oolong',
    name: '乌龙茶 (青茶)',
    nameEn: 'Oolong Tea',
    description: '半发酵茶，香气高雅，滋味丰富。注重“岩韵”与“观音韵”。',
    descriptionEn: 'Semi-fermented tea with elegant fragrance and complex flavors. Emphasizes "Rock Rhyme" (Yanhun) and "Guan Yin Rhyme".',
    color: 'bg-cyan-50 text-cyan-800 border-cyan-100',
    representativeTeas: [
      { name: '武夷大红袍', nameEn: 'Wuyi Da Hong Pao', origin: '福建武夷山', originEn: 'Wuyishan, Fujian', note: '岩茶之王，具备“岩骨花香”。', noteEn: 'King of rock teas, famous for its rock-bone floral fragrance.' },
      { name: '安溪铁观音', nameEn: 'Anxi Tie Guan Yin', origin: '福建安溪', originEn: 'Anxi, Fujian', note: '独特“观音韵”，清香雅致。', noteEn: 'Unique "Guan Yin Rhyme", elegant and orchid-like.' },
      { name: '凤凰单丛', nameEn: 'Fenghuang Dancong', origin: '广东潮州', originEn: 'Chaozhou, Guangdong', note: '香型极多，誉为“香水茶”。', noteEn: 'Dozens of aromatic profiles, dubbed "the perfume of tea".' },
      { name: '冻顶乌龙', nameEn: 'Dong Ding Oolong', origin: '台湾南投', originEn: 'Nantou, Taiwan', note: '球形卷曲，喉韵极佳。', noteEn: 'Tightly rolled balls, excellent lingering aftertaste.' }
    ]
  },
  {
    id: 'white',
    name: '白茶',
    nameEn: 'White Tea',
    description: '轻微发酵，简约工艺，“一年茶、三年药、七年宝”。',
    descriptionEn: 'Slightly fermented through simple processing. Famous for the saying: "One year tea, three years medicine, seven years treasure."',
    color: 'bg-neutral-50 text-neutral-800 border-neutral-100',
    representativeTeas: [
      { name: '白毫银针', nameEn: 'Silver Needle', origin: '福建宁德/南平', originEn: 'Ningde, Fujian', note: '仅采单芽，色白如银，细瘦如针。', noteEn: 'Only single buds, silvery-white and needle-shaped.' },
      { name: '白牡丹', nameEn: 'White Peony', origin: '福建宁德', originEn: 'Ningde, Fujian', note: '一芽一二叶，清甜、鲜爽。', noteEn: 'One bud with two leaves, sweet and refreshing.' },
      { name: '寿眉', nameEn: 'Shou Mei', origin: '福建宁德', originEn: 'Ningde, Fujian', note: '叶多芽少，陈放后药香显著。', noteEn: 'Bold leaves, becomes more medicinal with age.' }
    ]
  },
  {
    id: 'dark',
    name: '普洱/黑茶',
    nameEn: 'Dark/Puerh Tea',
    description: '后发酵茶，耐陈放。滋味浓郁圆润，具备越陈越香的特点。',
    descriptionEn: 'Post-fermented tea meant for aging. Full-bodied and mellow, improving in flavor and value as it ages.',
    color: 'bg-stone-100 text-stone-800 border-stone-200',
    representativeTeas: [
      { name: '西双版纳普洱', nameEn: 'Xishuangbanna Puerh', origin: '云南西双版纳', originEn: 'Yunnan', note: '生普清醇、熟普绵厚。', noteEn: 'Raw version is crisp, Ripe version is smooth.' },
      { name: '安化黑茶', nameEn: 'Anhua Dark Tea', origin: '湖南安化', originEn: 'Anhua, Hunan', note: '边销茶主干，口感独特。', noteEn: 'Historically a border-trade tea with a unique earthy taste.' },
      { name: '六堡茶', nameEn: 'Liu Bao Tea', origin: '广西苍梧', originEn: 'Cangwu, Guangxi', note: '具有独特的槟榔香，红浓陈醇。', noteEn: 'Notes of betel nut, dark red and vintage character.' },
      { name: '雅安藏茶', nameEn: 'Ya’an Tibetan Tea', origin: '四川雅安', originEn: 'Ya’an, Sichuan', note: '历史悠久，主要销往边疆地区。', noteEn: 'Ancient heritage, traditionally compressed for long travel.' }
    ]
  }
];

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-brand-accent/30 text-brand-text font-bold rounded-sm px-0.5">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
}


export default function ChinaOfTea({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTea, setSelectedTea] = useState<TeaVariety | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [apiTeas, setApiTeas] = useState<APITea[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeas = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://theteaapi.site/api/v1/teas.json');
        if (!response.ok) throw new Error('Failed to fetch teas');
        const data = await response.json();
        setApiTeas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching tea data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeas();
  }, []);

  const filteredCategories = CHINA_TEA_DATA.filter(cat => {
    const matchesSearch = 
      cat.name.includes(searchQuery) || 
      cat.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.representativeTeas.some(t => t.name.includes(searchQuery) || t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || cat.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredApiTeas = searchQuery.length > 1 ? apiTeas.filter(tea => 
    tea.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tea.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tea.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="h-full flex flex-col bg-brand-cream overflow-hidden relative">
      {/* Header */}
      <header className="p-8 border-b border-brand-border flex flex-col md:flex-row items-center justify-between bg-white/50 backdrop-blur-sm z-10 gap-6">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:bg-white transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-brand-text" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-3xl font-serif text-brand-text">中国之茶</h2>
            <p className="text-[10px] text-brand-accent font-sans tracking-[0.3em] uppercase opacity-70">Heritage of Chinese Tea</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowMap(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-accent/20 transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            Check the Map
          </button>
          
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search any tea..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-full text-sm font-sans focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all shadow-subtle"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-brand-accent" />}
          </div>
        </div>
      </header>

      {/* Categories Filter Tabs */}
      <div className="px-8 py-4 bg-white/30 border-b border-brand-border overflow-x-auto no-scrollbar flex items-center gap-4">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${!selectedCategory ? 'bg-brand-text text-white' : 'bg-white border border-brand-border text-gray-500'}`}
        >
          All
        </button>
        {CHINA_TEA_DATA.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-brand-accent text-white' : 'bg-white border border-brand-border text-gray-500'}`}
          >
            {cat.nameEn}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* API Global Search Results */}
          <AnimatePresence>
            {filteredApiTeas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-brand-accent" />
                  </div>
                  <h3 className="text-xl font-serif text-brand-text italic">Global Discovery Results</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApiTeas.map((tea) => (
                    <motion.div
                      key={tea.slug}
                      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTea({
                        name: tea.name,
                        nameEn: tea.slug.toUpperCase().replace('-', ' '),
                        origin: tea.origin,
                        originEn: tea.type,
                        note: tea.description,
                        noteEn: ""
                      })}
                      className="p-6 bg-white rounded-2xl border border-brand-accent/20 shadow-sm cursor-pointer transition-all flex flex-col gap-3 group relative z-10"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-lg font-serif text-brand-text group-hover:text-brand-accent transition-colors">
                          <Highlight text={tea.name} query={searchQuery} />
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-brand-accent/5 text-brand-accent rounded-full border border-brand-accent/10 uppercase tracking-widest">{tea.type}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">
                        <Highlight text={tea.description} query={searchQuery} />
                      </p>
                      <div className="flex items-center gap-2 mt-auto pt-2 text-[10px] text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{tea.origin}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className={`p-10 lg:col-span-4 ${cat.color.split(' ')[0]} border-r border-brand-border flex flex-col justify-center`}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-1.5 h-10 bg-brand-accent rounded-full"></span>
                        <div>
                          <h3 className="text-3xl font-serif text-brand-text">
                            <Highlight text={cat.name} query={searchQuery} />
                          </h3>
                          <span className="text-xs font-sans text-brand-accent uppercase tracking-widest font-bold">
                            <Highlight text={cat.nameEn} query={searchQuery} />
                          </span>
                        </div>
                      </div>
                      <p className="text-[14px] text-gray-700 leading-relaxed font-light mb-4">{cat.description}</p>
                      <p className="text-[13px] text-gray-500 leading-relaxed font-light italic border-l border-brand-accent/20 pl-4">{cat.descriptionEn}</p>
                    </div>

                    <div className="p-10 lg:col-span-8 bg-white/50 flex flex-col gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {cat.representativeTeas.map((tea, tIdx) => (
                          <motion.div 
                            key={tIdx}
                            onClick={() => setSelectedTea(tea)}
                            className="group flex flex-col p-5 rounded-2xl bg-white/30 hover:bg-white transition-all border border-brand-border/30 hover:border-brand-border shadow-none hover:shadow-lg cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-medium text-brand-text font-serif">
                                <Highlight text={tea.name} query={searchQuery} />
                              </span>
                              <div className="flex flex-col items-end text-brand-accent/70">
                                <span className="text-[10px] font-bold uppercase tracking-tighter">{tea.origin}</span>
                              </div>
                            </div>
                            <span className="text-xs font-sans text-gray-400 italic mb-3">
                              <Highlight text={tea.nameEn} query={searchQuery} />
                            </span>
                            <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-2">
                              <Highlight text={tea.note} query={searchQuery} />
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : filteredApiTeas.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 font-serif italic text-lg">No tea found in our collection...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tea Origins Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-brand-text/60 backdrop-blur-md"
            onClick={() => setShowMap(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-brand-cream max-w-6xl w-full h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-brand-border flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 border-b border-brand-border flex justify-between items-center bg-white/50">
                <div>
                  <h3 className="text-2xl font-serif text-brand-text">Tea Origins Map 产地地图</h3>
                  <p className="text-[10px] text-brand-accent uppercase tracking-widest font-bold">Geographical Distribution of Representative Teas</p>
                </div>
                <button 
                  onClick={() => setShowMap(false)}
                  className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:bg-white transition-all active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5 rotate-90" />
                </button>
              </div>

              <div className="flex-1 relative bg-emerald-50/10 p-2 md:p-4 overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.img 
                    src="/ChaMap.png" 
                    alt="Tea Map of China" 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-xl"
                  />
                </div>
              </div>

              <div className="p-6 bg-brand-text text-white text-center">
                 <p className="text-[10px] uppercase tracking-[0.3em] font-light italic opacity-80">Heritage of Tea: Exploring China's Ancient Growing Regions</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tea Detail Modal */}
      <AnimatePresence>
        {selectedTea && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-brand-text/40 backdrop-blur-md"
            onClick={() => setSelectedTea(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-cream max-w-lg w-full rounded-[2rem] overflow-hidden shadow-2xl border border-brand-border flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 bg-brand-accent overflow-hidden flex-shrink-0 flex items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                <div className="relative text-center">
                  <h3 className="text-5xl font-serif text-white mb-2">{selectedTea.name}</h3>
                  <span className="text-sm font-sans text-white/70 uppercase tracking-[0.4em] font-bold">{selectedTea.nameEn}</span>
                </div>
                <button 
                  onClick={() => setSelectedTea(null)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 transition-colors flex items-center justify-center text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between border-b border-brand-border pb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">Origin 产地</p>
                    <p className="text-lg font-serif text-brand-text">{selectedTea.origin}</p>
                    <p className="text-[10px] text-gray-500 font-sans tracking-tight uppercase">{selectedTea.originEn}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-brand-accent/20" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">Details & History</p>
                    <p className="text-base text-brand-text italic leading-relaxed font-light">
                      {selectedTea.note}
                    </p>
                  </div>
                  {selectedTea.noteEn && (
                    <div className="p-4 bg-white/50 border border-brand-border/40 rounded-xl">
                      <p className="text-[13px] text-gray-500 italic leading-relaxed font-light font-serif">
                        "{selectedTea.noteEn}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-center">
                  <button 
                    onClick={() => setSelectedTea(null)}
                    className="px-12 py-3 bg-brand-text text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-black transition-all shadow-md active:scale-95 rounded-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
