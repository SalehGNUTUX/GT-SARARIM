// src/data/wisdom.ts
export interface WisdomCard {
    id: string;
    text: string;
    textWithHarakat: string; // نص مع حركات
    type: 'hadith' | 'dhikr' | 'wisdom' | 'ayah';
    source?: string;
    category: 'morning' | 'evening' | 'general';
}

export const WISDOM_CARDS: WisdomCard[] = [
    // أذكار الصباح والمساء
    {
        id: 'dhikr_1',
        text: 'سبحان الله وبحمده',
        textWithHarakat: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        type: 'dhikr',
        source: 'متفق عليه',
        category: 'general'
    },
{
    id: 'dhikr_2',
    text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير',
    textWithHarakat: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    type: 'dhikr',
    source: 'متفق عليه',
    category: 'morning'
},
{
    id: 'hadith_1',
    text: 'الكلمة الطيبة صدقة',
    textWithHarakat: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    type: 'hadith',
    source: 'البخاري',
    category: 'general'
},
{
    id: 'hadith_2',
    text: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت',
    textWithHarakat: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    type: 'hadith',
    source: 'متفق عليه',
    category: 'general'
},
{
    id: 'ayah_1',
    text: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    textWithHarakat: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    type: 'ayah',
    source: 'سورة البقرة، الآية 153',
    category: 'general'
},
{
    id: 'wisdom_1',
    text: 'العلم نور والجهل ظلام',
    textWithHarakat: 'الْعِلْمُ نُورٌ وَالْجَهْلُ ظَلَامٌ',
    type: 'wisdom',
    category: 'general'
},
{
    id: 'dhikr_3',
    text: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم',
    textWithHarakat: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    type: 'dhikr',
    source: 'سنن أبي داود',
    category: 'morning'
},
{
    id: 'hadith_3',
    text: 'تبسمك في وجه أخيك صدقة',
    textWithHarakat: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
    type: 'hadith',
    source: 'الترمذي',
    category: 'general'
},
{
    id: 'wisdom_2',
    text: 'خير الناس أنفعهم للناس',
    textWithHarakat: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    type: 'wisdom',
    category: 'general'
},
{
    id: 'dhikr_4',
    text: 'اللهم إني أسألك علماً نافعاً ورزقاً طيباً وعملاً متقبلاً',
    textWithHarakat: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً',
    type: 'dhikr',
    source: 'ابن ماجه',
    category: 'morning'
},
{
    id: 'hadith_4',
    text: 'طلب العلم فريضة على كل مسلم',
    textWithHarakat: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    type: 'hadith',
    source: 'ابن ماجه',
    category: 'general'
},
{
    id: 'wisdom_3',
    text: 'من جد وجد ومن زرع حصد',
    textWithHarakat: 'مَنْ جَدَّ وَجَدَ وَمَنْ زَرَعَ حَصَدَ',
    type: 'wisdom',
    category: 'general'
},
{
    id: 'dhikr_5',
    text: 'أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه',
    textWithHarakat: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    type: 'dhikr',
    source: 'النسائي',
    category: 'evening'
}
];

// للحصول على حكمة عشوائية
export const getRandomWisdom = (category?: 'morning' | 'evening' | 'general'): WisdomCard => {
    let filtered = WISDOM_CARDS;
    if (category) {
        filtered = WISDOM_CARDS.filter(w => w.category === category);
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
};

// للحصول على حكمة حسب الوقت (صباح/مساء)
export const getWisdomByTime = (): WisdomCard => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return getRandomWisdom('morning');
    } else if (hour >= 17 && hour < 20) {
        return getRandomWisdom('evening');
    }
    return getRandomWisdom('general');
};
