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
},
{
    id: 'ayah_2',
    text: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    textWithHarakat: 'وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    type: 'ayah',
    source: 'سورة الطلاق، الآية 3',
    category: 'general'
},
{
    id: 'ayah_3',
    text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    textWithHarakat: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    type: 'ayah',
    source: 'سورة الشرح، الآية 5',
    category: 'general'
},
{
    id: 'ayah_4',
    text: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    textWithHarakat: 'وَقُلْ رَبِّ زِدْنِي عِلْمًا',
    type: 'ayah',
    source: 'سورة طه، الآية 114',
    category: 'morning'
},
{
    id: 'hadith_5',
    text: 'إن الله يحب إذا عمل أحدكم عملاً أن يتقنه',
    textWithHarakat: 'إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ',
    type: 'hadith',
    source: 'البيهقي',
    category: 'general'
},
{
    id: 'hadith_6',
    text: 'خير الناس أنفعهم للناس',
    textWithHarakat: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    type: 'hadith',
    source: 'الطبراني',
    category: 'general'
},
{
    id: 'hadith_7',
    text: 'من سلك طريقاً يلتمس فيه علماً سهّل الله له طريقاً إلى الجنة',
    textWithHarakat: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
    type: 'hadith',
    source: 'مسلم',
    category: 'morning'
},
{
    id: 'hadith_8',
    text: 'لا يشكر الله من لا يشكر الناس',
    textWithHarakat: 'لَا يَشْكُرُ اللَّهَ مَنْ لَا يَشْكُرُ النَّاسَ',
    type: 'hadith',
    source: 'أبو داود',
    category: 'general'
},
{
    id: 'dhikr_6',
    text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور',
    textWithHarakat: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    type: 'dhikr',
    source: 'الترمذي',
    category: 'morning'
},
{
    id: 'dhikr_7',
    text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير',
    textWithHarakat: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    type: 'dhikr',
    source: 'الترمذي',
    category: 'evening'
},
{
    id: 'dhikr_8',
    text: 'أعوذ بكلمات الله التامات من شر ما خلق',
    textWithHarakat: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    type: 'dhikr',
    source: 'مسلم',
    category: 'evening'
},
{
    id: 'dhikr_9',
    text: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم',
    textWithHarakat: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    type: 'dhikr',
    source: 'أبو داود والترمذي',
    category: 'morning'
},
{
    id: 'wisdom_4',
    text: 'ليس الغنى عن كثرة العرض ولكن الغنى غنى النفس',
    textWithHarakat: 'لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ',
    type: 'wisdom',
    source: 'البخاري',
    category: 'general'
},
{
    id: 'wisdom_5',
    text: 'القناعة كنز لا يفنى',
    textWithHarakat: 'الْقَنَاعَةُ كَنْزٌ لَا يَفْنَى',
    type: 'wisdom',
    category: 'general'
},
{
    id: 'wisdom_6',
    text: 'العقل زينة والعلم سلاح والأخلاق تاج',
    textWithHarakat: 'الْعَقْلُ زِينَةٌ وَالْعِلْمُ سِلَاحٌ وَالْأَخْلَاقُ تَاجٌ',
    type: 'wisdom',
    category: 'general'
},
{
    id: 'wisdom_7',
    text: 'اللسان سبع إن أُطلق عقر',
    textWithHarakat: 'اللِّسَانُ سَبُعٌ إِنْ أُطْلِقَ عَقَرَ',
    type: 'wisdom',
    category: 'general'
},
{
    id: 'ayah_5',
    text: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
    textWithHarakat: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
    type: 'ayah',
    source: 'سورة فاطر، الآية 28',
    category: 'general'
},
{
    id: 'hadith_9',
    text: 'المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف',
    textWithHarakat: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    type: 'hadith',
    source: 'مسلم',
    category: 'general'
},
{
    id: 'hadith_10',
    text: 'اتق الله حيثما كنت وأتبع السيئة الحسنة تمحها وخالق الناس بخلق حسن',
    textWithHarakat: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
    type: 'hadith',
    source: 'الترمذي',
    category: 'general'
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
