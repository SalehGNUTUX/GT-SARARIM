import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AppState, UserProfile, ParentSettings, Story, StoryQuestion,
  Question, Puzzle, BackgroundSound, FontSettings, LevelInfo,
  LevelProgress, Level, LocalImage, PendingDelete, StoryCategory
} from '../types';

export const LEVELS: LevelInfo[] = [
  { id: 'beginner',     name: 'Beginner',     nameAr: 'تَمْهِيدِيّ', description: 'لِلْأَطْفَالِ مِنْ 4-6 سَنَوَاتٍ', requiredPoints: 0,    icon: '🌱', color: '#4CAF50' },
  { id: 'intermediate', name: 'Intermediate', nameAr: 'مُبْتَدِئ',   description: 'لِلْأَطْفَالِ مِنْ 6-8 سَنَوَاتٍ', requiredPoints: 500,  icon: '📚', color: '#FF9F43' },
  { id: 'advanced',     name: 'Advanced',     nameAr: 'مُتَوَسِّط',   description: 'لِلْأَطْفَالِ مِنْ 8-10 سَنَوَاتٍ', requiredPoints: 1500, icon: '⭐', color: '#54A0FF' },
  { id: 'expert',       name: 'Expert',       nameAr: 'مُتَقَدِّم',   description: 'لِلْأَطْفَالِ مِنْ 10-12 سَنَةً', requiredPoints: 3000, icon: '🏆', color: '#FF6B6B' },
];

const DEFAULT_CATEGORIES: StoryCategory[] = [
  { id: 'prophets',    name: 'قِصَصُ الْأَنْبِيَاءِ',       icon: '🕌', color: '#4CAF50', isDefault: true },
  { id: 'moral',       name: 'قِصَصُ الْأَخْلَاقِ وَالْقِيَمِ', icon: '⭐', color: '#FF9F43', isDefault: true },
  { id: 'scholar',     name: 'عُلَمَاءُ الْمُسْلِمِينَ',      icon: '📚', color: '#54A0FF', isDefault: true },
  { id: 'science',     name: 'قِصَصُ الْعُلُومِ',            icon: '🔬', color: '#FF6B6B', isDefault: true },
  { id: 'educational', name: 'قِصَصٌ تَعْلِيمِيَّةٌ',         icon: '📖', color: '#A29BFE', isDefault: true },
];

const BUILT_IN_SOUNDS: BackgroundSound[] = [
  { id: 'sound_stream',  name: 'خَرِيرُ الْمِيَاهِ وَتَغْرِيدُ الطُّيُورِ', isBuiltIn: true, synthType: 'stream_birds' },
  { id: 'sound_rain',    name: 'صَوْتُ الْمَطَرِ',        isBuiltIn: true, synthType: 'rain' },
  { id: 'sound_nature',  name: 'نَسِيمُ الطَّبِيعَةِ',    isBuiltIn: true, synthType: 'nature' },
  { id: 'sound_calm',    name: 'مُوسِيقَى هَادِئَةٌ',     isBuiltIn: true, synthType: 'calm' },
];

const DEFAULT_SETTINGS: ParentSettings = {
  dailyTimeLimit: 60,
  lockedSections: [],
  pin: '1234',
  parentName: 'الْوَالِدَيْنِ',
  parentPassword: 'admin',
  securityQuestion: undefined,
  backgroundSoundId: undefined,
  soundVolume: 50,
  soundEnabled: false,
  fontSettings: { fontFamily: 'ubuntu-arabic', customFonts: [] },
  storyCategories: DEFAULT_CATEGORIES,
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ======= STORIES =======
const INITIAL_STORIES: Story[] = [
  {
    id: 'prophet_1', title: 'نُوحٌ عَلَيْهِ السَّلَامُ وَالسَّفِينَةُ',
    content: 'كَانَ النَّبِيُّ نُوحٌ عَلَيْهِ السَّلَامُ يَدْعُو قَوْمَهُ إِلَى عِبَادَةِ اللَّهِ وَحْدَهُ. فَأَمَرَهُ اللَّهُ بِبِنَاءِ سَفِينَةٍ كَبِيرَةٍ. وَحَمَلَ مَعَهُ مِنْ كُلِّ زَوْجَيْنِ اثْنَيْنِ. وَاسْتَقَرَّتِ السَّفِينَةُ عَلَى جَبَلِ الْجُودِيِّ.',
    textWithHarakat: 'كَانَ النَّبِيُّ نُوحٌ عَلَيْهِ السَّلَامُ يَدْعُو قَوْمَهُ إِلَى عِبَادَةِ اللَّهِ وَحْدَهُ لَا شَرِيكَ لَهُ، وَلَكِنَّهُمْ كَانُوا يُكَذِّبُونَهُ. فَأَمَرَهُ اللَّهُ تَعَالَى بِبِنَاءِ سَفِينَةٍ كَبِيرَةٍ. فَأَخَذَ نُوحٌ يَبْنِي السَّفِينَةَ بِصَبْرٍ وَإِيمَانٍ. ثُمَّ أَرْسَلَ اللَّهُ الْمَطَرَ غَزِيرًا، وَرَكِبَ نُوحٌ وَمَنْ آمَنَ مَعَهُ فِي السَّفِينَةِ، وَحَمَلَ مَعَهُ مِنْ كُلِّ زَوْجَيْنِ اثْنَيْنِ. وَاسْتَقَرَّتِ السَّفِينَةُ عَلَى جَبَلِ الْجُودِيِّ. وَهَكَذَا نَجَّى اللَّهُ نُوحًا وَالْمُؤْمِنِينَ.',
    image: '', ageGroup: '6-8', level: 'intermediate', category: 'prophets',
    exercises: [
      { id: 'p1q1', text: 'مَاذَا بَنَى النَّبِيُّ نُوحٌ عَلَيْهِ السَّلَامُ؟', options: ['سَفِينَةً', 'مَسْجِدًا', 'بَيْتًا', 'جِسْرًا'], correctAnswer: 0 },
      { id: 'p1q2', text: 'أَيْنَ اسْتَقَرَّتِ السَّفِينَةُ بَعْدَ الطُّوفَانِ؟', options: ['عَلَى جَبَلِ الْجُودِيِّ', 'عَلَى جَبَلِ أُحُدٍ', 'عَلَى جَبَلِ سِينَاءَ', 'فِي الْبَحْرِ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'prophet_2', title: 'يُوسُفُ عَلَيْهِ السَّلَامُ وَالْأَحْلَامُ',
    content: 'رَأَى النَّبِيُّ يُوسُفُ فِي مَنَامِهِ أَحَدَ عَشَرَ كَوْكَبًا وَالشَّمْسَ وَالْقَمَرَ سَاجِدُونَ لَهُ.',
    textWithHarakat: 'رَأَى النَّبِيُّ يُوسُفُ عَلَيْهِ السَّلَامُ فِي مَنَامِهِ أَنَّ أَحَدَ عَشَرَ كَوْكَبًا وَالشَّمْسَ وَالْقَمَرَ سَاجِدُونَ لَهُ. فَقَصَّ رُؤْيَاهُ عَلَى أَبِيهِ يَعْقُوبَ عَلَيْهِ السَّلَامُ، فَعَلِمَ أَنَّ اللَّهَ سَيَرْفَعُ شَأْنَ يُوسُفَ. وَلَكِنَّ إِخْوَتَهُ حَسَدُوهُ فَأَلْقَوْهُ فِي الْجُبِّ. وَبَعْدَ سِنِينَ أَصْبَحَ يُوسُفُ عَزِيزَ مِصْرَ، وَسَامَحَ إِخْوَتَهُ وَعَفَا عَنْهُمْ.',
    image: '', ageGroup: '9-12', level: 'advanced', category: 'prophets',
    exercises: [
      { id: 'p2q1', text: 'مَاذَا رَأَى يُوسُفُ فِي مَنَامِهِ؟', options: ['أَحَدَ عَشَرَ كَوْكَبًا وَالشَّمْسَ وَالْقَمَرَ', 'سَبْعَ بَقَرَاتٍ سِمَانٍ', 'بُسْتَانًا جَمِيلًا', 'نَهْرًا كَبِيرًا'], correctAnswer: 0 },
      { id: 'p2q2', text: 'مَاذَا فَعَلَ يُوسُفُ بِإِخْوَتِهِ بَعْدَ لِقَائِهِمْ؟', options: ['سَامَحَهُمْ وَعَفَا عَنْهُمْ', 'عَاقَبَهُمْ بِشِدَّةٍ', 'طَرَدَهُمْ مِنْ مِصْرَ', 'أَخْبَرَ الْفِرْعَوْنَ بِهِمْ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'moral_1', title: 'اَلصِّدْقُ مَنْجَاةٌ',
    content: 'كَانَ تَاجِرٌ صَغِيرٌ يُدْعَى أَحْمَدُ مَعْرُوفًا بِصِدْقِهِ وَأَمَانَتِهِ. وَجَدَ مَحْفَظَةً مَلِيئَةً بِالذَّهَبِ فَأَعَادَهَا إِلَى صَاحِبِهَا. فَدَعَا لَهُ صَاحِبُهَا بِالْخَيْرِ.',
    textWithHarakat: 'كَانَ تَاجِرٌ صَغِيرٌ يُدْعَى \"أَحْمَدُ\" مَعْرُوفًا بِصِدْقِهِ وَأَمَانَتِهِ. وَجَدَ مَحْفَظَةً جِلْدِيَّةً تَحْتَ شَجَرَةِ زَيْتُونٍ كَبِيرَةٍ، فَتَحَهَا فَوَجَدَهَا مَلِيئَةً بِالذَّهَبِ وَالْجَوَاهِرِ. لَمْ يَتَرَدَّدْ أَحْمَدُ فِي إِعَادَتِهَا إِلَى صَاحِبِهَا. فَدَعَا لَهُ صَاحِبُهَا بِالْخَيْرِ. وَعَلِمَ الْجَمِيعُ أَنَّ الصِّدْقَ مَنْجَاةٌ وَأَنَّ الْأَمَانَةَ تُجْلِبُ الْبَرَكَةَ.',
    image: '', ageGroup: '6-8', level: 'intermediate', category: 'moral',
    exercises: [
      { id: 'm1q1', text: 'مَاذَا وَجَدَ أَحْمَدُ تَحْتَ شَجَرَةِ الزَّيْتُونِ؟', options: ['مَحْفَظَةَ ذَهَبٍ', 'كِتَابًا', 'لُعْبَةً', 'طَعَامًا'], correctAnswer: 0 },
      { id: 'm1q2', text: 'مَاذَا فَعَلَ أَحْمَدُ بِالْمَحْفَظَةِ؟', options: ['أَعَادَهَا إِلَى صَاحِبِهَا', 'أَخَذَهَا لِنَفْسِهِ', 'رَمَاهَا فِي الطَّرِيقِ', 'أَعْطَاهَا لِغَيْرِهِ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'moral_2', title: 'بِرُّ الْوَالِدَيْنِ',
    content: 'كَانَ زَيْدٌ يُحِبُّ أَبَوَيْهِ حُبًّا شَدِيدًا. حِينَ مَرِضَتْ أُمُّهُ كَانَ يُحْضِرُ لَهَا الطَّعَامَ وَالدَّوَاءَ.',
    textWithHarakat: 'كَانَ زَيْدٌ وَلَدًا صَغِيرًا يُحِبُّ أَبَوَيْهِ حُبًّا شَدِيدًا. كُلَّمَا طَلَبَ مِنْهُ أَبُوهُ شَيْئًا أَسْرَعَ إِلَيْهِ فَرِحًا. فِي يَوْمٍ مَرِضَتْ أُمُّهُ فَكَانَ يُحْضِرُ لَهَا الطَّعَامَ وَالدَّوَاءَ وَيُسَاعِدُهَا فِي كُلِّ شَيْءٍ. فَرَآهُ أَبُوهُ فَافْتَخَرَ بِهِ وَقَالَ: أَنْتَ وَلَدِي الْبَارُّ. وَدَعَا لَهُ أَبَوَاهُ بِالْبَرَكَةِ.',
    image: '', ageGroup: '6-8', level: 'beginner', category: 'moral',
    exercises: [
      { id: 'm2q1', text: 'مَاذَا فَعَلَ زَيْدٌ حِينَ مَرِضَتْ أُمُّهُ؟', options: ['اعْتَنَى بِهَا وَسَاعَدَهَا', 'لَعِبَ مَعَ أَصْدِقَائِهِ', 'ذَهَبَ إِلَى الْمَدْرَسَةِ', 'نَامَ طَوِيلًا'], correctAnswer: 0 },
      { id: 'm2q2', text: 'كَيْفَ يُسَمَّى الْوَلَدُ الَّذِي يَعْتَنِي بِوَالِدَيْهِ؟', options: ['الْوَلَدُ الْبَارُّ', 'الْوَلَدُ الْكَسُولُ', 'الْوَلَدُ الْعَنِيدُ', 'الْوَلَدُ الصَّغِيرُ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'scholar_1', title: 'الْخَوَارِزْمِيُّ أَبُو الْجَبْرِ',
    content: 'مُحَمَّدُ بْنُ مُوسَى الْخَوَارِزْمِيُّ عَالِمٌ مُسْلِمٌ وَضَعَ أُسُسَ عِلْمِ الْجَبْرِ وَأَدْخَلَ الصِّفْرَ إِلَى الرِّيَاضِيَّاتِ.',
    textWithHarakat: 'مُحَمَّدُ بْنُ مُوسَى الْخَوَارِزْمِيُّ، عَالِمُ رِيَاضِيَّاتٍ مُسْلِمٌ، عَاشَ فِي بَغْدَادَ فِي الْقَرْنِ التَّاسِعِ الْمِيلَادِيِّ. وَضَعَ أُسُسَ عِلْمِ الْجَبْرِ وَالْمُقَابَلَةِ، وَأَدْخَلَ الْأَرْقَامَ الْهِنْدِيَّةَ إِلَى الْعَالَمِ الْغَرْبِيِّ، وَطَوَّرَ مَفْهُومَ الصِّفْرِ. كَانَ يَعْمَلُ فِي بَيْتِ الْحِكْمَةِ بِبَغْدَادَ. اسْمُهُ بِاللَّاتِينِيَّةِ هُوَ الَّذِي أَعْطَى كَلِمَةَ \"Algorithm\" لِلْعَالَمِ.',
    image: '', ageGroup: '9-12', level: 'advanced', category: 'scholar',
    exercises: [
      { id: 's1q1', text: 'بِمَاذَا يُلَقَّبُ الْخَوَارِزْمِيُّ؟', options: ['أَبُو الْجَبْرِ', 'أَمِيرُ الْأَطِبَّاءِ', 'أَبُو الْقَانُونِ', 'شَيْخُ الْمُعَلِّمِينَ'], correctAnswer: 0 },
      { id: 's1q2', text: 'أَيْنَ كَانَ يَعْمَلُ الْخَوَارِزْمِيُّ؟', options: ['بَيْتُ الْحِكْمَةِ', 'جَامِعَةُ الْأَزْهَرِ', 'الْمَدْرَسَةُ النِّظَامِيَّةُ', 'دَارُ الْعِلْمِ'], correctAnswer: 0 },
      { id: 's1q3', text: 'مَاذَا أَدْخَلَ الْخَوَارِزْمِيُّ إِلَى الرِّيَاضِيَّاتِ؟', options: ['مَفْهُومُ الصِّفْرِ', 'الْمَعَادَلَاتُ التَّرْبِيعِيَّةُ', 'الْهَنْدَسَةُ الْإِقْلِيدِيَّةُ', 'حِسَابُ الْمُثَلَّثَاتِ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'scholar_2', title: 'ابْنُ سِينَا أَمِيرُ الْأَطِبَّاءِ',
    content: 'ابْنُ سِينَا طَبِيبٌ وَعَالِمٌ مُسْلِمٌ حَفِظَ الْقُرْآنَ وَهُوَ ابْنُ عَشْرٍ وَكِتَابُهُ الْقَانُونُ ظَلَّ مَرْجِعًا لِقُرُونٍ.',
    textWithHarakat: 'أَبُو عَلِيٍّ الْحُسَيْنُ ابْنُ سِينَا وُلِدَ عَامَ 980م فِي بُخَارَى. حَفِظَ الْقُرْآنَ الْكَرِيمَ وَعُمْرُهُ 10 سَنَوَاتٍ، وَتَفَوَّقَ فِي الطِّبِّ وَعُمْرُهُ 16 سَنَةً. كِتَابُهُ \"الْقَانُونُ فِي الطِّبِّ\" ظَلَّ الْمَرْجِعَ الْأَسَاسِيَّ فِي أُورُوبَّا لِعِدَّةِ قُرُونٍ. ابْتَكَرَ فِكْرَةَ الْجَرَاثِيمِ وَانْتِقَالِ الْأَمْرَاضِ قَبْلَ اكْتِشَافِ الْمِجْهَرِ.',
    image: '', ageGroup: '9-12', level: 'advanced', category: 'scholar',
    exercises: [
      { id: 's2q1', text: 'مَا اسْمُ أَشْهَرِ كِتَابٍ لِابْنِ سِينَا؟', options: ['الْقَانُونُ فِي الطِّبِّ', 'الْحَاوِي', 'التَّصْرِيفُ', 'الشِّفَاءُ'], correctAnswer: 0 },
      { id: 's2q2', text: 'فِي أَيِّ مَدِينَةٍ وُلِدَ ابْنُ سِينَا؟', options: ['بُخَارَى', 'بَغْدَادُ', 'الْقَاهِرَةُ', 'دِمَشْقُ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'science_1', title: 'رِحْلَةٌ إِلَى الْفَضَاءِ',
    content: 'شَاهَدَ رَائِدُ الْفَضَاءِ بَدْرٌ الْمِرِّيخَ الْأَحْمَرَ وَزُحَلَ بِحَلَقَاتِهِ الْجَلِيدِيَّةِ وَعَلِمَ أَنَّ الشَّمْسَ مَرْكَزُ الْمَجْمُوعَةِ.',
    textWithHarakat: 'صَعِدَ رَائِدُ الْفَضَاءِ الصَّغِيرُ \"بَدْرٌ\" إِلَى مَرْكَبَتِهِ الْفَضَائِيَّةِ. شَاهَدَ كَوْكَبَ الْمِرِّيخِ الْأَحْمَرَ، ثُمَّ الْمُشْتَرِيَ الْأَضْخَمَ، ثُمَّ زُحَلَ بِحَلَقَاتِهِ الْجَلِيدِيَّةِ الرَّائِعَةِ. تَعَلَّمَ بَدْرٌ أَنَّ الشَّمْسَ هِيَ مَرْكَزُ الْمَجْمُوعَةِ الشَّمْسِيَّةِ، وَأَنَّ كُلَّ كَوْكَبٍ يَدُورُ فِي مَدَارٍ مُحَدَّدٍ بِإِذْنِ اللَّهِ. سُبْحَانَ مَنْ خَلَقَ هَذَا الْكَوْنَ الْعَظِيمَ!',
    image: '', ageGroup: '6-8', level: 'intermediate', category: 'science',
    exercises: [
      { id: 'sc1q1', text: 'مَا لَقَبُ كَوْكَبِ الْمِرِّيخِ؟', options: ['الْكَوْكَبُ الْأَحْمَرُ', 'الْكَوْكَبُ الْأَزْرَقُ', 'الْكَوْكَبُ الْأَخْضَرُ', 'الْكَوْكَبُ الْأَبْيَضُ'], correctAnswer: 0 },
      { id: 'sc1q2', text: 'مَا الَّذِي يُمَيِّزُ كَوْكَبَ زُحَلَ؟', options: ['حَلَقَاتٌ جَلِيدِيَّةٌ', 'لَوْنٌ أَحْمَرُ', 'أَكْبَرُ حَجْمٍ', 'قُرْبُهُ مِنَ الشَّمْسِ'], correctAnswer: 0 },
    ]
  },

  // ── قصص إضافية ──
  {
    id: 'prophet_3', title: 'إِبْرَاهِيمُ عَلَيْهِ السَّلَامُ خَلِيلُ اللَّهِ',
    content: 'إِبْرَاهِيمُ عَلَيْهِ السَّلَامُ أَبُو الْأَنْبِيَاءِ، كَسَرَ الْأَصْنَامَ وَدَعَا قَوْمَهُ إِلَى التَّوْحِيدِ. أَلْقَوْهُ فِي النَّارِ فَقَالَ اللَّهُ لَهَا: كُونِي بَرْدًا وَسَلَامًا عَلَى إِبْرَاهِيمَ، فَكَانَتْ كَذَلِكَ. ثُمَّ أَمَرَهُ اللَّهُ بِبِنَاءِ الْكَعْبَةِ الْمُشَرَّفَةِ مَعَ ابْنِهِ إِسْمَاعِيلَ عَلَيْهِ السَّلَامُ.',
    textWithHarakat: 'إِبْرَاهِيمُ عَلَيْهِ السَّلَامُ أَبُو الْأَنْبِيَاءِ وَخَلِيلُ الرَّحْمَنِ. كَسَرَ أَصْنَامَ قَوْمِهِ لِأَنَّهَا لَا تَنْفَعُ وَلَا تَضُرُّ، وَدَعَاهُمْ إِلَى عِبَادَةِ اللَّهِ وَحْدَهُ. فَأَلْقَوْهُ فِي نَارٍ عَظِيمَةٍ، فَقَالَ اللَّهُ لَهَا: كُونِي بَرْدًا وَسَلَامًا عَلَى إِبْرَاهِيمَ، فَخَرَجَ مِنْهَا سَالِمًا مُعَافًى. ثُمَّ أَمَرَهُ اللَّهُ بِبِنَاءِ الْكَعْبَةِ الْمُشَرَّفَةِ مَعَ ابْنِهِ إِسْمَاعِيلَ عَلَيْهِ السَّلَامُ، فَبَنَيَاهَا وَهُمَا يَقُولَانِ: رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ.',
    image: '', ageGroup: '6-8', level: 'intermediate', category: 'prophets',
    exercises: [
      { id: 'p3q1', text: 'بِمَاذَا يُلَقَّبُ إِبْرَاهِيمُ عَلَيْهِ السَّلَامُ؟', options: ['خَلِيلُ الرَّحْمَنِ','نَبِيُّ اللَّهِ','رَسُولُ الرَّحْمَةِ','إِمَامُ الْأَنْبِيَاءِ'], correctAnswer: 0 },
      { id: 'p3q2', text: 'مَاذَا قَالَ اللَّهُ لِلنَّارِ حِينَ أُلْقِيَ فِيهَا إِبْرَاهِيمُ؟', options: ['كُونِي بَرْدًا وَسَلَامًا','كُونِي حَارَّةً أَكْثَرَ','كُونِي بِلَا لَهِيبٍ','اِشْتَعِلِي'], correctAnswer: 0 },
      { id: 'p3q3', text: 'مَعَ مَنْ بَنَى إِبْرَاهِيمُ الْكَعْبَةَ؟', options: ['مَعَ إِسْمَاعِيلَ ابْنِهِ','مَعَ إِسْحَاقَ','مَعَ يَعْقُوبَ','وَحْدَهُ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'moral_3', title: 'حُبُّ الْقُرْآنِ',
    content: 'كَانَتْ فَاطِمَةُ تُحِبُّ أَنْ تَحْفَظَ الْقُرْآنَ، فَكَانَتْ تُكَرِّرُهُ كُلَّ يَوْمٍ. ذَاتَ مَرَّةٍ جَاءَتْ صَدِيقَتُهَا تَدْعُوهَا لِلَّعِبِ فَقَالَتْ: انْتَظِرِينِي حَتَّى أَتِمَّ وِرْدِي. فَأَتَمَّتْهُ ثُمَّ لَعِبَتَا. فَبَارَكَ اللَّهُ فِي حِفْظِهَا وَصَارَتْ تَحْفَظُ الْقُرْآنَ كَامِلًا.',
    textWithHarakat: 'كَانَتْ فَاطِمَةُ طِفْلَةً صَغِيرَةً تُحِبُّ الْقُرْآنَ الْكَرِيمَ حُبًّا شَدِيدًا. كَانَتْ تُكَرِّرُ مَا تَحْفَظُهُ كُلَّ يَوْمٍ بَعْدَ الصَّلَاةِ. ذَاتَ مَرَّةٍ جَاءَتْ صَدِيقَتُهَا نُورُ تَدْعُوهَا لِلَّعِبِ فِي الْحَدِيقَةِ فَقَالَتْ فَاطِمَةُ: انْتَظِرِينِي حَتَّى أَتِمَّ وِرْدِي مِنَ الْقُرْآنِ. فَأَتَمَّتْهُ ثُمَّ لَعِبَتَا مَعًا فِي فَرَحٍ. فَبَارَكَ اللَّهُ فِي حِفْظِهَا وَصَارَتْ تَحْفَظُ الْقُرْآنَ الْكَرِيمَ كَامِلًا وَهِيَ صَغِيرَةٌ.',
    image: '', ageGroup: '4-6', level: 'beginner', category: 'moral',
    exercises: [
      { id: 'm3q1', text: 'مَاذَا كَانَتْ فَاطِمَةُ تُحِبُّ؟', options: ['حِفْظُ الْقُرْآنِ الْكَرِيمِ','اللَّعِبُ بِالدُّمَى','السِّبَاحَةُ','رَسْمُ الصُّوَرِ'], correctAnswer: 0 },
      { id: 'm3q2', text: 'مَاذَا فَعَلَتْ فَاطِمَةُ حِينَ جَاءَتْ صَدِيقَتُهَا؟', options: ['أَتَمَّتِ الْوِرْدَ أَوَّلًا ثُمَّ لَعِبَتْ','تَرَكَتِ الْقُرْآنَ وَذَهَبَتْ','رَفَضَتِ اللَّعِبَ','صَرَخَتْ عَلَى صَدِيقَتِهَا'], correctAnswer: 0 },
    ]
  },
  {
    id: 'scholar_3', title: 'اِبْنُ الْهَيْثَمِ أَبُو الْبَصَرِيَّاتِ',
    content: 'الْحَسَنُ بْنُ الْهَيْثَمِ عَالِمٌ مُسْلِمٌ عَاشَ فِي الْقَرْنِ الْعَاشِرِ الْمِيلَادِيِّ. كَتَبَ كِتَابَ الْمَنَاظِرِ وَهُوَ أَوَّلُ مَنْ فَسَّرَ نَظَرِيَّةَ الرُّؤْيَةِ تَفْسِيرًا صَحِيحًا. اخْتَرَعَ الْغُرْفَةَ الْمُظْلِمَةَ أَصْلَ الْكَامِيرَا. يُعَدُّ مِنْ أَوَائِلِ مَنِ اسْتَخْدَمَ الْمَنْهَجَ الْعِلْمِيَّ التَّجْرِيبِيَّ.',
    textWithHarakat: 'الْحَسَنُ بْنُ الْهَيْثَمِ، أَبُو الْبَصَرِيَّاتِ، عَالِمٌ مُسْلِمٌ وُلِدَ فِي الْبَصْرَةِ عَامَ 965م. كَتَبَ كِتَابَ الْمَنَاظِرِ الَّذِي فَسَّرَ فِيهِ كَيْفَ نَرَى الْأَشْيَاءَ: الضَّوْءُ يَنْعَكِسُ مِنَ الْأَجْسَامِ وَيَدْخُلُ الْعَيْنَ. اخْتَرَعَ الْغُرْفَةَ الْمُظْلِمَةَ كَامِيرَا أُوبْسْكُورَا وَهِيَ أَصْلُ الْكَامِيرَا الْحَدِيثَةِ. وَكَانَ مِنْ أَوَائِلِ الْعُلَمَاءِ الَّذِينَ يَعْتَمِدُونَ التَّجْرِبَةَ الْعِلْمِيَّةَ قَبْلَ إِصْدَارِ الْأَحْكَامِ.',
    image: '', ageGroup: '9-12', level: 'advanced', category: 'scholar',
    exercises: [
      { id: 's3q1', text: 'بِمَاذَا يُلَقَّبُ ابْنُ الْهَيْثَمِ؟', options: ['أَبُو الْبَصَرِيَّاتِ','أَبُو الْجَبْرِ','أَمِيرُ الْأَطِبَّاءِ','أَبُو الْكِيمْيَاءِ'], correctAnswer: 0 },
      { id: 's3q2', text: 'مَا أَشْهَرُ كِتَابٍ لِابْنِ الْهَيْثَمِ؟', options: ['كِتَابُ الْمَنَاظِرِ','الْقَانُونُ','الشِّفَاءُ','الْجَبْرُ'], correctAnswer: 0 },
      { id: 's3q3', text: 'مَاذَا اخْتَرَعَ ابْنُ الْهَيْثَمِ وَكَانَ أَصْلَ الْكَامِيرَا؟', options: ['الْغُرْفَةُ الْمُظْلِمَةُ','الْمِنْظَارُ','الْمِجْهَرُ','الدُّرَّاجَةُ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'science_3', title: 'الْمَاءُ دَوْرَةُ الْحَيَاةِ',
    content: 'الْمَاءُ أَصْلُ الْحَيَاةِ. تَتَبَخَّرُ مِيَاهُ الْبِحَارِ بِحَرَارَةِ الشَّمْسِ فَتَتَكَوَّنُ الْغُيُومُ ثُمَّ تَنْزِلُ أَمْطَارًا تُحْيِي الْأَرْضَ وَتَسْقِي الشَّجَرَ وَالزَّرْعَ وَتَمْلَأُ الْأَنْهَارَ.',
    textWithHarakat: 'الْمَاءُ أَصْلُ الْحَيَاةِ، قَالَ تَعَالَى: وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ. تَتَبَخَّرُ مِيَاهُ الْبِحَارِ وَالْبُحَيْرَاتِ بِفِعْلِ حَرَارَةِ الشَّمْسِ فَتَرْتَفِعُ بُخَارًا إِلَى السَّمَاءِ. وَهُنَاكَ يَتَكَوَّنُ السَّحَابُ، فَإِذَا بَرَدَ الْهَوَاءُ نَزَلَ مَطَرًا يُحْيِي الْأَرْضَ وَيَسْقِي الزُّرُوعَ وَالْأَشْجَارَ وَيَمْلَأُ الْأَنْهَارَ وَالْبُحَيْرَاتِ مِنْ جَدِيدٍ. هَذِهِ هِيَ دَوْرَةُ الْمَاءِ الَّتِي يُتِمُّهَا اللَّهُ سُبْحَانَهُ وَتَعَالَى.',
    image: '', ageGroup: '6-8', level: 'intermediate', category: 'science',
    exercises: [
      { id: 'sc3q1', text: 'مَاذَا يَحْدُثُ لِمِيَاهِ الْبِحَارِ بِفِعْلِ الشَّمْسِ؟', options: ['تَتَبَخَّرُ وَتَرْتَفِعُ','تَجْمُدُ وَتَتَحَجَّرُ','تَخْضَرُّ وَتُزْهِرُ','تَنْزِلُ إِلَى الْأَعْمَاقِ'], correctAnswer: 0 },
      { id: 'sc3q2', text: 'مَاذَا يَتَكَوَّنُ مِنَ الْبُخَارِ فِي السَّمَاءِ؟', options: ['السَّحَابُ','الرَّعْدُ','الْبَرْقُ','الضَّبَابُ'], correctAnswer: 0 },
    ]
  },
  {
    id: 'science_2', title: 'عَجَائِبُ عَالَمِ الْحَيَوَانِ',
    content: 'الْفِيلُ أَضْخَمُ حَيَوَانٍ بَرِّيٍّ وَالزَّرَافَةُ أَطْوَلُ الْحَيَوَانَاتِ وَالْحُوتُ الْأَزْرَقُ أَضْخَمُ كَائِنٍ عَلَى الْأَرْضِ.',
    textWithHarakat: 'الْفِيلُ هُوَ أَضْخَمُ حَيَوَانٍ يَعِيشُ عَلَى الْيَابِسَةِ. الزَّرَافَةُ هِيَ أَطْوَلُ حَيَوَانٍ فِي الْعَالَمِ. الْحُوتُ الْأَزْرَقُ هُوَ أَضْخَمُ كَائِنٍ حَيٍّ عَلَى وَجْهِ الْأَرْضِ، يَصِلُ طُولُهُ إِلَى 30 مِتْرًا. الْفَهْدُ هُوَ أَسْرَعُ حَيَوَانٍ بَرِّيٍّ. سُبْحَانَ اللَّهِ الَّذِي خَلَقَ هَذِهِ الْكَائِنَاتِ الْمُتَنَوِّعَةَ!',
    image: '', ageGroup: '6-8', level: 'beginner', category: 'science',
    exercises: [
      { id: 'sc2q1', text: 'مَا هُوَ أَضْخَمُ حَيَوَانٍ يَعِيشُ عَلَى الْيَابِسَةِ؟', options: ['الْفِيلُ', 'الزَّرَافَةُ', 'الْأَسَدُ', 'الْحُوتُ'], correctAnswer: 0 },
      { id: 'sc2q2', text: 'مَا هُوَ أَسْرَعُ حَيَوَانٍ بَرِّيٍّ؟', options: ['الْفَهْدُ', 'الْأَسَدُ', 'الْغَزَالُ', 'الْحِصَانُ'], correctAnswer: 0 },
    ]
  },
];

// ======= QUESTIONS =======
const INITIAL_QUESTIONS: Question[] = [
  { id: 'q1', text: 'مَا هُوَ الْكِتَابُ الَّذِي أَنْزَلَهُ اللَّهُ عَلَى النَّبِيِّ مُحَمَّدٍ ﷺ؟', options: ['الْقُرْآنُ الْكَرِيمُ', 'التَّوْرَاةُ', 'الْإِنْجِيلُ', 'الزَّبُورُ'], correctAnswer: 0, category: 'دِين', ageGroup: 'all', level: 'beginner' },
  { id: 'q2', text: 'كَمْ عَدَدُ الصَّلَوَاتِ الْمَفْرُوضَةِ فِي الْيَوْمِ وَاللَّيْلَةِ؟', options: ['خَمْسُ صَلَوَاتٍ', 'ثَلَاثُ صَلَوَاتٍ', 'سَبْعُ صَلَوَاتٍ', 'أَرْبَعُ صَلَوَاتٍ'], correctAnswer: 0, category: 'دِين', ageGroup: 'all', level: 'beginner' },
  { id: 'q3', text: 'مَا هُوَ الرُّكْنُ الْأَوَّلُ مِنْ أَرْكَانِ الْإِسْلَامِ؟', options: ['الشَّهَادَتَانِ', 'الصَّلَاةُ', 'الصَّوْمُ', 'الزَّكَاةُ'], correctAnswer: 0, category: 'دِين', ageGroup: 'all', level: 'beginner' },
  { id: 'q4', text: 'مَاذَا نَقُولُ عِنْدَمَا نَقَابِلُ مُسْلِمًا؟', options: ['السَّلَامُ عَلَيْكُمْ', 'صَبَاحُ الْخَيْرِ', 'مَرْحَبًا', 'أَهْلًا'], correctAnswer: 0, category: 'أَخْلَاق', ageGroup: 'all', level: 'beginner' },
  { id: 'q5', text: 'مَا نَاتِجُ 5 + 3؟', options: ['8', '7', '9', '6'], correctAnswer: 0, category: 'رِيَاضِيَّات', ageGroup: '6-8', level: 'beginner' },
  { id: 'q6', text: 'مَا نَاتِجُ 2 × 4؟', options: ['8', '6', '10', '12'], correctAnswer: 0, category: 'رِيَاضِيَّات', ageGroup: '6-8', level: 'intermediate' },
  { id: 'q7', text: 'مَا نَاتِجُ 10 - 4؟', options: ['6', '5', '7', '8'], correctAnswer: 0, category: 'رِيَاضِيَّات', ageGroup: '6-8', level: 'beginner' },
  { id: 'q8', text: 'أَيُّ حَيَوَانٍ يَعِيشُ فِي الْمَاءِ؟', options: ['الدُّلْفِينُ', 'الْأَسَدُ', 'الْأَرْنَبُ', 'الْفِيلُ'], correctAnswer: 0, category: 'عُلُوم', ageGroup: 'all', level: 'beginner' },
  { id: 'q9', text: 'مَا هُوَ الْكَوْكَبُ الَّذِي نَعِيشُ عَلَيْهِ؟', options: ['الْأَرْضُ', 'الْمِرِّيخُ', 'الْمُشْتَرِي', 'زُحَلُ'], correctAnswer: 0, category: 'عُلُوم', ageGroup: 'all', level: 'beginner' },
  { id: 'q10', text: 'كَمْ عَدَدُ أَضْلَاعِ الْمُرَبَّعِ؟', options: ['4', '3', '5', '6'], correctAnswer: 0, category: 'هَنْدَسَة', ageGroup: 'all', level: 'beginner' },
  { id: 'q11', text: 'مَا هُوَ الْحَرْفُ الَّذِي يَبْدَأُ بِهِ اسْمُ \"أَسَدٌ\"؟', options: ['أَلِفٌ', 'بَاءٌ', 'تَاءٌ', 'جِيمٌ'], correctAnswer: 0, category: 'لُغَةٌ عَرَبِيَّةٌ', ageGroup: '6-8', level: 'beginner' },
  { id: 'q12', text: 'مَا نَاتِجُ 9 × 3؟', options: ['27', '24', '21', '30'], correctAnswer: 0, category: 'رِيَاضِيَّات', ageGroup: '9-12', level: 'advanced' },
  { id: 'q13', text: 'مَا هُوَ الْجُزْءُ الَّذِي يَمْتَصُّ الْمَاءَ فِي النَّبَاتِ؟', options: ['الْجُذُورُ', 'الْأَوْرَاقُ', 'الْأَزْهَارُ', 'السَّاقُ'], correctAnswer: 0, category: 'عُلُوم', ageGroup: 'all', level: 'intermediate' },
  { id: 'q14', text: 'مَتَى يَكُونُ شَهْرُ رَمَضَانَ الْمُبَارَكُ؟', options: ['فِي الشَّهْرِ التَّاسِعِ مِنَ الْهِجْرَةِ', 'فِي الشَّهْرِ الْأَوَّلِ', 'فِي الشَّهْرِ السَّادِسِ', 'فِي الشَّهْرِ الثَّانِي عَشَرَ'], correctAnswer: 0, category: 'دِين', ageGroup: 'all', level: 'intermediate' },
  { id: 'q15', text: 'مَا هِيَ عَاصِمَةُ الْمَمْلَكَةِ الْعَرَبِيَّةِ السُّعُودِيَّةِ؟', options: ['الرِّيَاضُ', 'جِدَّةُ', 'مَكَّةُ الْمُكَرَّمَةُ', 'الدَّمَّامُ'], correctAnswer: 0, category: 'جُغْرَافِيَا', ageGroup: 'all', level: 'intermediate' },
  // ── أسئلة إضافية ──
  { id: 'q16', text: 'مَا عَدَدُ أَرْكَانِ الْإِسْلَامِ؟', options: ['خَمْسَةُ أَرْكَانٍ','ثَلَاثَةُ أَرْكَانٍ','سِتَّةُ أَرْكَانٍ','أَرْبَعَةُ أَرْكَانٍ'], correctAnswer: 0, category: 'دِين', ageGroup: 'all', level: 'beginner' },
  { id: 'q17', text: 'مَا اسْمُ أَوَّلِ سُورَةٍ فِي الْقُرْآنِ الْكَرِيمِ؟', options: ['سُورَةُ الْفَاتِحَةِ','سُورَةُ الْبَقَرَةِ','سُورَةُ الْإِخْلَاصِ','سُورَةُ النَّاسِ'], correctAnswer: 0, category: 'دِين', ageGroup: 'all', level: 'beginner' },
  { id: 'q18', text: 'فِي أَيِّ مَدِينَةٍ وُلِدَ النَّبِيُّ مُحَمَّدٌ ﷺ؟', options: ['مَكَّةُ الْمُكَرَّمَةُ','الْمَدِينَةُ الْمُنَوَّرَةُ','الطَّائِفُ','جِدَّةُ'], correctAnswer: 0, category: 'دِين', ageGroup: 'all', level: 'beginner' },
  { id: 'q19', text: 'مَا نَاتِجُ 12 × 3؟', options: ['36','32','30','39'], correctAnswer: 0, category: 'رِيَاضِيَّات', ageGroup: '9-12', level: 'advanced' },
  { id: 'q20', text: 'مَا نَاتِجُ 100 ÷ 4؟', options: ['25','20','30','40'], correctAnswer: 0, category: 'رِيَاضِيَّات', ageGroup: '9-12', level: 'advanced' },
  { id: 'q21', text: 'مَا هُوَ أَضْخَمُ كَوْكَبٍ فِي الْمَجْمُوعَةِ الشَّمْسِيَّةِ؟', options: ['الْمُشْتَرِي','زُحَلُ','أُورَانُوسُ','الْأَرْضُ'], correctAnswer: 0, category: 'عُلُوم', ageGroup: 'all', level: 'intermediate' },
  { id: 'q22', text: 'كَمْ عَدَدُ أَضْلَاعِ الْمُسَدَّسِ؟', options: ['6','5','7','8'], correctAnswer: 0, category: 'هَنْدَسَة', ageGroup: 'all', level: 'intermediate' },
  { id: 'q23', text: 'مَا الْحَيَوَانُ الَّذِي يُسَمَّى سَفِينَةَ الصَّحْرَاءِ؟', options: ['الْجَمَلُ','الْحِصَانُ','الْفِيلُ','الزَّرَافَةُ'], correctAnswer: 0, category: 'عُلُوم', ageGroup: 'all', level: 'beginner' },
  { id: 'q24', text: 'كَمْ عَدَدُ أَيَّامِ الْأُسْبُوعِ؟', options: ['7','5','6','8'], correctAnswer: 0, category: 'عَامّ', ageGroup: '4-6', level: 'beginner' },
  { id: 'q25', text: 'مَا الشَّيْءُ الَّذِي يَجْعَلُ النَّبَاتَاتِ خَضْرَاءَ؟', options: ['الْكُلُورُوفِيلُ','الضَّوْءُ','الْمَاءُ','التُّرْبَةُ'], correctAnswer: 0, category: 'عُلُوم', ageGroup: '9-12', level: 'advanced' },
  { id: 'q26', text: 'مَا نَاتِجُ 15 + 27؟', options: ['42','40','44','38'], correctAnswer: 0, category: 'رِيَاضِيَّات', ageGroup: '6-8', level: 'intermediate' },
  { id: 'q27', text: 'مَا هِيَ أَكْبَرُ قَارَّةٍ فِي الْعَالَمِ؟', options: ['آسِيَا','أَفْرِيقِيَا','أُورُوبَّا','أَمِيرِيكَا'], correctAnswer: 0, category: 'جُغْرَافِيَا', ageGroup: 'all', level: 'intermediate' },
  { id: 'q28', text: 'مَا الَّذِي يَصْنَعُ النَّحْلُ مِنْ رَحِيقِ الزُّهُورِ؟', options: ['الْعَسَلُ','الزَّيْتُ','الْحَلِيبُ','السُّكَّرُ'], correctAnswer: 0, category: 'عُلُوم', ageGroup: 'all', level: 'beginner' },
  { id: 'q29', text: 'مَا عَدَدُ شُهُورِ السَّنَةِ؟', options: ['12','10','11','13'], correctAnswer: 0, category: 'عَامّ', ageGroup: '4-6', level: 'beginner' },
  { id: 'q30', text: 'مَا مَعْنَى كَلِمَةِ الصَّبْرِ؟', options: ['اَلتَّحَمُّلُ وَعَدَمُ اليَأسِ','الْغَضَبُ وَالضَّجَرُ','الْفَرَحُ وَالسُّرُورُ','النَّوْمُ وَالرَّاحَةُ'], correctAnswer: 0, category: 'أَخْلَاق', ageGroup: 'all', level: 'intermediate' },

  // ── أسئلة إسلامية متخصصة ──
  { id: 'qi1', text: 'كَمْ عَدَدُ الصَّلَوَاتِ الْمَفْرُوضَةِ فِي الْيَوْمِ وَاللَّيْلَةِ؟', options: ['خَمْسُ صَلَوَاتٍ','ثَلَاثُ صَلَوَاتٍ','أَرْبَعُ صَلَوَاتٍ','سِتُّ صَلَوَاتٍ'], correctAnswer: 0, category: 'الصَّلَاة', ageGroup: 'all', level: 'beginner', explanation: 'الصُّبْحُ وَالظُّهْرُ وَالْعَصْرُ وَالْمَغْرِبُ وَالْعِشَاءُ' },
  { id: 'qi2', text: 'مَا هِيَ أَوَّلُ صَلَاةٍ فِي الْيَوْمِ؟', options: ['صَلَاةُ الْفَجْرِ','صَلَاةُ الظُّهْرِ','صَلَاةُ الْعَصْرِ','صَلَاةُ الْمَغْرِبِ'], correctAnswer: 0, category: 'الصَّلَاة', ageGroup: 'all', level: 'beginner' },
  { id: 'qi3', text: 'كَمْ رَكْعَةً فِي صَلَاةِ الْفَجْرِ؟', options: ['رَكْعَتَانِ','ثَلَاثُ رَكَعَاتٍ','أَرْبَعُ رَكَعَاتٍ','رَكْعَةٌ وَاحِدَةٌ'], correctAnswer: 0, category: 'الصَّلَاة', ageGroup: '6-8', level: 'beginner' },
  { id: 'qi4', text: 'فِي أَيِّ شَهْرٍ يَصُومُ الْمُسْلِمُونَ؟', options: ['رَمَضَانُ','شَعْبَانُ','رَجَبٌ','مُحَرَّمٌ'], correctAnswer: 0, category: 'الصِّيَام', ageGroup: 'all', level: 'beginner' },
  { id: 'qi5', text: 'مَا هُوَ الرُّكْنُ الْخَامِسُ مِنْ أَرْكَانِ الْإِسْلَامِ؟', options: ['الْحَجُّ','الصَّلَاةُ','الزَّكَاةُ','الصِّيَامُ'], correctAnswer: 0, category: 'أَرْكَانُ الْإِسْلَام', ageGroup: 'all', level: 'intermediate' },
  { id: 'qi6', text: 'مَا هُوَ الرُّكْنُ الْأَوَّلُ مِنْ أَرْكَانِ الْإِسْلَامِ؟', options: ['الشَّهَادَتَانِ','الصَّلَاةُ','الزَّكَاةُ','الصِّيَامُ'], correctAnswer: 0, category: 'أَرْكَانُ الْإِسْلَام', ageGroup: 'all', level: 'beginner' },
  { id: 'qi7', text: 'كَمْ عَدَدُ أَرْكَانِ الْإِيمَانِ؟', options: ['سِتَّةُ أَرْكَانٍ','أَرْبَعَةُ أَرْكَانٍ','خَمْسَةُ أَرْكَانٍ','سَبْعَةُ أَرْكَانٍ'], correctAnswer: 0, category: 'الْإِيمَان', ageGroup: '6-8', level: 'intermediate', explanation: 'الْإِيمَانُ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ وَالْقَدَرِ' },
  { id: 'qi8', text: 'إِلَى أَيِّ مَدِينَةٍ يَتَوَجَّهُ الْحُجَّاجُ لِأَدَاءِ فَرِيضَةِ الْحَجِّ؟', options: ['مَكَّةُ الْمُكَرَّمَةُ','الْمَدِينَةُ الْمُنَوَّرَةُ','الْقُدْسُ','عَرَفَاتٌ'], correctAnswer: 0, category: 'الْحَجّ', ageGroup: 'all', level: 'beginner' },
  { id: 'qi9', text: 'مَاذَا نَقُولُ عِنْدَ بَدْءِ الطَّعَامِ؟', options: ['بِسْمِ اللَّهِ','الْحَمْدُ لِلَّهِ','سُبْحَانَ اللَّهِ','اللَّهُ أَكْبَرُ'], correctAnswer: 0, category: 'آدَابُ الطَّعَام', ageGroup: 'all', level: 'beginner' },
  { id: 'qi10', text: 'مَاذَا نَقُولُ عِنْدَ الِانْتِهَاءِ مِنَ الطَّعَامِ؟', options: ['الْحَمْدُ لِلَّهِ','بِسْمِ اللَّهِ','اللَّهُ أَكْبَرُ','سُبْحَانَ اللَّهِ'], correctAnswer: 0, category: 'آدَابُ الطَّعَام', ageGroup: 'all', level: 'beginner' },
  { id: 'qi11', text: 'مَا هُوَ أَدَبُ الِاسْتِئْذَانِ قَبْلَ الدُّخُولِ؟', options: ['قَوْلُ السَّلَامِ وَالِاسْتِئْذَانِ','الدُّخُولُ مُبَاشَرَةً','الطَّرْقُ بِلَا سَلَامٍ','الِانْتِظَارُ صَامِتًا'], correctAnswer: 0, category: 'الْآدَاب', ageGroup: 'all', level: 'beginner' },
  { id: 'qi12', text: 'مَا مَعْنَى كَلِمَةِ الزَّكَاةِ؟', options: ['التَّطْهِيرُ وَالنَّمَاءُ','الصِّيَامُ وَالصَّلَاةُ','الْحَجُّ وَالْعُمْرَةُ','الصَّدَقَةُ وَالْهِبَةُ'], correctAnswer: 0, category: 'الزَّكَاة', ageGroup: '9-12', level: 'advanced' },
  { id: 'qi13', text: 'مَا الْفَرْقُ بَيْنَ الصَّدَقَةِ وَالزَّكَاةِ؟', options: ['الزَّكَاةُ وَاجِبَةٌ وَالصَّدَقَةُ تَطَوُّعٌ','هُمَا نَفْسُ الشَّيْءِ','الصَّدَقَةُ وَاجِبَةٌ وَالزَّكَاةُ تَطَوُّعٌ','لَا فَرْقَ بَيْنَهُمَا'], correctAnswer: 0, category: 'الزَّكَاة', ageGroup: '9-12', level: 'advanced' },
  { id: 'qi14', text: 'مَا هِيَ قِبْلَةُ الْمُسْلِمِينَ فِي الصَّلَاةِ؟', options: ['الْكَعْبَةُ الْمُشَرَّفَةُ','الْمَسْجِدُ النَّبَوِيُّ','مَسْجِدُ الْأَقْصَى','أَيُّ مَسْجِدٍ قَرِيبٍ'], correctAnswer: 0, category: 'الصَّلَاة', ageGroup: 'all', level: 'beginner' },
  { id: 'qi15', text: 'مَاذَا نَقُولُ عِنْدَ الصَّلَاةِ عَلَى النَّبِيِّ ﷺ؟', options: ['اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ','سُبْحَانَ اللَّهِ وَبِحَمْدِهِ','لَا إِلَهَ إِلَّا اللَّهُ','اللَّهُ أَكْبَرُ'], correctAnswer: 0, category: 'الصَّلَاة', ageGroup: 'all', level: 'beginner' },
  { id: 'qi16', text: 'مَا هِيَ أَجْزَاءُ الْوُضُوءِ الرَّئِيسِيَّةُ؟', options: ['الْوَجْهُ وَالْيَدَانِ وَالرَّأْسُ وَالرِّجْلَانِ','الْجِسْمُ كُلُّهُ','الْوَجْهُ وَالرِّجْلَانِ فَقَطْ','لَا شُرُوطَ لِلْوُضُوءِ'], correctAnswer: 0, category: 'الطَّهَارَة', ageGroup: '6-8', level: 'intermediate' },
  { id: 'qi17', text: 'مَاذَا يُقَالُ عِنْدَ رُؤْيَةِ الْهِلَالِ؟', options: ['اللَّهُ أَكْبَرُ، هِلَالُ خَيْرٍ وَرُشْدٍ','بِسْمِ اللَّهِ','لَا إِلَهَ إِلَّا اللَّهُ','الْحَمْدُ لِلَّهِ'], correctAnswer: 0, category: 'الصِّيَام', ageGroup: '9-12', level: 'advanced' },
  { id: 'qi18', text: 'مَا هُوَ الرُّكْنُ الثَّالِثُ مِنْ أَرْكَانِ الْإِسْلَامِ؟', options: ['إِيتَاءُ الزَّكَاةِ','الصَّلَاةُ','الصِّيَامُ','الْحَجُّ'], correctAnswer: 0, category: 'أَرْكَانُ الْإِسْلَام', ageGroup: '6-8', level: 'intermediate' },
  { id: 'qi19', text: 'مَا الَّذِي يُبْطِلُ الصِّيَامَ؟', options: ['الْأَكْلُ وَالشُّرْبُ وَالْكَذِبُ','النَّوْمُ وَالرَّاحَةُ','التَّحَدُّثُ وَالْمَشْيُ','الدُّعَاءُ وَالذِّكْرُ'], correctAnswer: 0, category: 'الصِّيَام', ageGroup: '6-8', level: 'intermediate' },
  { id: 'qi20', text: 'كَيْفَ نُحِبُّ جِيرَانَنَا كَمَا أَمَرَنَا النَّبِيُّ ﷺ؟', options: ['نُؤَدِّي حُقُوقَهُمْ وَنُحْسِنُ إِلَيْهِمْ','نَتَجَنَّبُهُمْ وَلَا نَتَكَلَّمُ مَعَهُمْ','نَأْخُذُ مِنْهُمْ وَلَا نُعْطِي','لَا نَهْتَمُّ بِهِمْ'], correctAnswer: 0, category: 'قِيَمُ الْمُسْلِم', ageGroup: 'all', level: 'intermediate' },


];

// ======= PUZZLES =======
const INITIAL_PUZZLES: Puzzle[] = [
  { id: 'pz1', title: 'لُغْزُ الْأَرْقَامِ', type: 'logic', content: 'أَنَا رَقْمٌ، إِذَا أَضَفْتَ إِلَيَّ نَفْسِي ثُمَّ أَضَفْتَ 4 أَصْبَحَ النَّاتِجُ 14. فَمَنْ أَنَا؟', solution: '5', ageGroup: '6-8', level: 'intermediate', hint: 'فَكِّرْ فِي عَدَدٍ بَيْنَ 1 وَ10' },
  { id: 'pz2', title: 'لُغْزُ الطَّائِرِ بِلَا جَنَاحٍ', type: 'riddle', content: 'أَنَا أَطِيرُ بِلَا أَجْنِحَةٍ، وَأَبْكِي بِلَا عُيُونٍ. فَمَنْ أَنَا؟', solution: 'السَّحَابُ', ageGroup: 'all', level: 'beginner', hint: 'أَنَا فِي السَّمَاءِ وَمِنِّي يَنْزِلُ الْمَطَرُ' },
  { id: 'pz3', title: 'لُغْزُ الشَّيْءِ الَّذِي لَا يُعَادُ', type: 'riddle', content: 'مَا هُوَ الشَّيْءُ الَّذِي يَمُرُّ أَمَامَكَ لَكِنَّكَ لَا تَرَاهُ أَبَدًا؟', solution: 'الْوَقْتُ', ageGroup: 'all', level: 'intermediate', hint: 'لَا يُمْكِنُ إِيقَافُهُ وَلَا إِعَادَتُهُ' },
  { id: 'pz4', title: 'لُغْزُ الشَّيْءِ الَّذِي يَكْبُرُ بِالْأَخْذِ', type: 'riddle', content: 'مَا هُوَ الشَّيْءُ الَّذِي كُلَّمَا أَخَذْتَ مِنْهُ كَبُرَ؟', solution: 'الْحُفْرَةُ', ageGroup: 'all', level: 'intermediate', hint: 'فَكِّرْ فِي الْأَرْضِ' },
  { id: 'pz5', title: 'لُغْزُ الشَّيْءِ الَّذِي يَنْكَسِرُ', type: 'riddle', content: 'مَا هُوَ الشَّيْءُ الَّذِي إِذَا قُلْتَهُ كَسَرْتَهُ؟', solution: 'الصَّمْتُ', ageGroup: '9-12', level: 'advanced', hint: 'لِيَكُنْ فِي حَيَاتِكَ كَثِيرٌ مِنْهُ' },
  { id: 'pz6', title: 'لُغْزُ الشَّكْلِ ذِي الْوُجُوهِ السِّتَّةِ', type: 'logic', content: 'لَدَيَّ سِتَّةُ وُجُوهٍ وَاثْنَا عَشَرَ حَافَّةً وَثَمَانِيَةُ زَوَايَا. فَمَا أَنَا؟', solution: 'الْمُكَعَّبُ', ageGroup: '9-12', level: 'advanced', hint: 'شَكْلٌ هَنْدَسِيٌّ ثَلَاثِيُّ الْأَبْعَادِ' },
  { id: 'pz7', title: 'لُغْزُ الدَّارِ بِلَا بَابٍ', type: 'riddle', content: 'لِي دَارٌ بِلَا بَابٍ وَلَا نَافِذَةٍ، وَمِنِّي يَخْرُجُ كَائِنٌ حَيٌّ. فَمَا أَنَا؟', solution: 'الْبَيْضَةُ', ageGroup: '6-8', level: 'intermediate', hint: 'الدَّجَاجَةُ تَضَعُنِي' },
  { id: 'pz8', title: 'لُغْزُ الرَّفِيقِ الصَّامِتِ', type: 'riddle', content: 'أَنَا أَتْبَعُكَ أَيْنَمَا ذَهَبْتَ لَكِنَّكَ لَا تَلْمَسُنِي. فَمَنْ أَنَا؟', solution: 'الظِّلُّ', ageGroup: 'all', level: 'beginner', hint: 'أَنَا مَوْجُودٌ بِسَبَبِ الضَّوْءِ' },
  { id: 'pz9',  title: 'لُغْزُ الْأَسَدِ النَّائِمِ',    type: 'riddle', content: 'أَنَا شَيْءٌ يَنَامُ بِعَيْنَيْنِ مَفْتُوحَتَيْنِ وَيَسْتَيْقِظُ بِعَيْنَيْنِ مُغْمَضَتَيْنِ. مَنْ أَنَا؟', solution: 'السَّمَكَةُ', ageGroup: '6-8', level: 'intermediate', hint: 'أَنَا أَعِيشُ فِي الْمَاءِ' },
  { id: 'pz10', title: 'لُغْزُ اللِّسَانِ',              type: 'riddle', content: 'لَيْسَ لِي عِظَامٌ لَكِنِّي أَقْطَعُ كَالسَّيْفِ، وَخَيْرُهُ يُدْخِلُ الْجَنَّةَ وَشَرُّهُ يُؤْذِي. مَنْ أَنَا؟', solution: 'اللِّسَانُ', ageGroup: '9-12', level: 'advanced', hint: 'تَكَلَّمْ بِخَيْرٍ أَوِ اصْمُتْ' },
  { id: 'pz11', title: 'لُغْزُ الرَّقْمِ الْغَرِيبِ',    type: 'logic',  content: 'أَيُّ رَقْمٍ إِذَا ضَرَبْتَهُ فِي أَيِّ عَدَدٍ ظَلَّ نَفْسَهُ؟', solution: 'الصِّفْرُ', ageGroup: '6-8', level: 'intermediate', hint: 'هُوَ لَا شَيْءَ وَكُلُّ شَيْءٍ' },
  { id: 'pz12', title: 'لُغْزُ الْقَمَرِ وَالشَّمْسِ',   type: 'riddle', content: 'أَنَا أُضِيءُ بِاللَّيْلِ وَلَا أُضِيءُ بِنَفْسِي. فَمَنْ أَنَا؟', solution: 'الْقَمَرُ', ageGroup: 'all', level: 'beginner', hint: 'أَسْتَعِيرُ ضَوْءِي مِنَ الشَّمْسِ' },
  { id: 'pz13', title: 'لُغْزُ الصَّدَاقَةِ الْحَقِيقِيَّةِ', type: 'riddle', content: 'كُلَّمَا أَعْطَيْتَ مِنِّي ازْدَدْتَ مِنِّي. فَمَنْ أَنَا؟', solution: 'الْمَحَبَّةُ', ageGroup: 'all', level: 'intermediate', hint: 'تَجِدُنِي بَيْنَ الْأَصْدِقَاءِ وَالْأُسْرَةِ' },

];

// ======= STORE INTERFACE =======
interface StoreActions {
  setCurrentUser: (user: UserProfile | null) => void;
  addUser: (user: UserProfile) => void;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  updateSettings: (updates: Partial<ParentSettings>) => void;
  addStory: (story: Story) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  addQuestion: (q: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  addPuzzle: (p: Puzzle) => void;
  updatePuzzle: (id: string, updates: Partial<Puzzle>) => void;
  deletePuzzle: (id: string) => void;
  toggleTheme: () => void;
  resetToDefault: (keepChildren?: boolean) => void;
  exportData: () => void;
  importData: (data: any) => void;
  addLocalImage: (id: string, file: File) => Promise<string>;
  getLocalImage: (id: string) => string | null;
  deleteLocalImage: (id: string) => void;
  updateLevelProgress: (userId: string, levelId: Level, progress: Partial<LevelProgress>) => void;
  getCurrentLevel: (userId: string) => Level;
  addCustomSound: (name: string, file: File) => Promise<void>;
  deleteSound: (id: string) => void;
  restoreSound: (sound: BackgroundSound) => void;
  addFont: (id: string, name: string, dataUrl: string) => void;
  removeFont: (id: string) => void;
  addStoryCategory: (cat: Omit<StoryCategory, 'id'>) => void;
  updateStoryCategory: (id: string, updates: Partial<StoryCategory>) => void;
  deleteStoryCategory: (id: string) => void;
  scheduledDelete: (type: PendingDelete['type'], id: string, data: any) => string;
  cancelDelete: (pendingId: string) => void;
  commitPendingDeletes: () => void;
}

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      stories: INITIAL_STORIES,
      questions: INITIAL_QUESTIONS,
      puzzles: INITIAL_PUZZLES,
      settings: DEFAULT_SETTINGS,
      progress: {},
      theme: 'light',
      localImages: {},
      levelProgress: {},
      backgroundSounds: BUILT_IN_SOUNDS,
      pendingDeletes: [],
      childrenBackup: [],

      addLocalImage: async (id, file) => {
        const base64 = await fileToBase64(file);
        set(s => ({ localImages: { ...s.localImages, [id]: { id, data: base64, mimeType: file.type, fileName: file.name } } }));
        return base64;
      },
      getLocalImage: (id) => get().localImages[id]?.data || null,
      deleteLocalImage: (id) => set(s => { const { [id]: _, ...rest } = s.localImages; return { localImages: rest }; }),

      setCurrentUser: (user) => set({ currentUser: user }),
      addUser: (user) => set(s => ({ users: [...s.users, { points: 0, achievements: [], playTimeToday: 0, lastActive: new Date().toISOString(), role: 'child', ...user }] })),
      updateUser: (id, updates) => set(s => ({
        users: s.users.map(u => u.id === id ? { ...u, ...updates } : u),
        currentUser: s.currentUser?.id === id ? { ...s.currentUser, ...updates } : s.currentUser
      })),
      deleteUser: (id) => set(s => ({
        users: s.users.filter(u => u.id !== id),
        currentUser: s.currentUser?.id === id ? null : s.currentUser
      })),

      updateSettings: (updates) => set(s => ({ settings: { ...s.settings, ...updates } })),

      addStory: (story) => set(s => ({ stories: [...s.stories, story] })),
      updateStory: (id, updates) => set(s => ({ stories: s.stories.map(x => x.id === id ? { ...x, ...updates } : x) })),
      deleteStory: (id) => set(s => ({ stories: s.stories.filter(x => x.id !== id) })),

      addQuestion: (q) => set(s => ({ questions: [...s.questions, q] })),
      updateQuestion: (id, updates) => set(s => ({ questions: s.questions.map(x => x.id === id ? { ...x, ...updates } : x) })),
      deleteQuestion: (id) => set(s => ({ questions: s.questions.filter(x => x.id !== id) })),

      addPuzzle: (p) => set(s => ({ puzzles: [...s.puzzles, p] })),
      updatePuzzle: (id, updates) => set(s => ({ puzzles: s.puzzles.map(x => x.id === id ? { ...x, ...updates } : x) })),
      deletePuzzle: (id) => set(s => ({ puzzles: s.puzzles.filter(x => x.id !== id) })),

      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      resetToDefault: (keepChildren = false) => {
        const state = get();
        const childrenBackup = keepChildren ? state.users.filter(u => u.role === 'child') : [];
        set({
          stories: INITIAL_STORIES, questions: INITIAL_QUESTIONS, puzzles: INITIAL_PUZZLES,
          settings: DEFAULT_SETTINGS, users: keepChildren ? childrenBackup : [],
          currentUser: null, progress: {}, localImages: {}, levelProgress: {},
          backgroundSounds: BUILT_IN_SOUNDS, pendingDeletes: [],
          childrenBackup: state.users.filter(u => u.role === 'child'),
        });
      },

      exportData: () => {
        const s = get();
        const blob = new Blob([JSON.stringify({ users: s.users, stories: s.stories, questions: s.questions, puzzles: s.puzzles, settings: s.settings, progress: s.progress, levelProgress: s.levelProgress, backgroundSounds: s.backgroundSounds.filter(x => !x.isBuiltIn), childrenBackup: s.childrenBackup }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `gt-sararim-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
      },

      importData: (data) => {
        try {
          if (data.users) set(s => ({ users: data.users }));
          if (data.childrenBackup) set(s => ({ users: [...s.users, ...data.childrenBackup.filter((c: UserProfile) => !s.users.find(u => u.id === c.id))] }));
        } catch { /* ignore */ }
      },

      updateLevelProgress: (userId, levelId, progress) => set(s => ({
        levelProgress: {
          ...s.levelProgress,
          [`${userId}_${levelId}`]: { levelId, completedStories: [], completedPuzzles: [], completedActivities: [], quizScore: 0, isCompleted: false, ...s.levelProgress[`${userId}_${levelId}`], ...progress }
        }
      })),

      getCurrentLevel: (userId) => {
        const user = get().users.find(u => u.id === userId);
        if (!user) return 'beginner';
        for (let i = LEVELS.length - 1; i >= 0; i--) {
          if (user.points >= LEVELS[i].requiredPoints) return LEVELS[i].id;
        }
        return 'beginner';
      },

      addCustomSound: async (name, file) => {
        const data = await fileToBase64(file);
        const id = `sound_custom_${Date.now()}`;
        set(s => ({ backgroundSounds: [...s.backgroundSounds, { id, name, isBuiltIn: false, audioData: data }] }));
      },

      deleteSound: (id) => set(s => ({ backgroundSounds: s.backgroundSounds.filter(x => x.id !== id) })),
      restoreSound: (sound) => set(s => ({ backgroundSounds: s.backgroundSounds.find(x => x.id === sound.id) ? s.backgroundSounds : [...s.backgroundSounds, sound] })),
      // Font stored as localImage entry (large binary safe), only id+name in fontSettings
      addFont: (id, name, dataUrl) => set(s => ({
        localImages: { ...s.localImages, [`font_${id}`]: { data: dataUrl, name } },
        settings: {
          ...s.settings,
          fontSettings: {
            ...s.settings.fontSettings,
            fontFamily: id,
            customFonts: [
              ...(s.settings.fontSettings.customFonts || []).filter(f => f.id !== id),
              { id, name, url: '' }   // url is intentionally empty — data in localImages
            ]
          }
        }
      })),
      removeFont: (id) => set(s => {
        const newFonts = (s.settings.fontSettings.customFonts || []).filter(f => f.id !== id);
        const newFamily = s.settings.fontSettings.fontFamily === id ? 'ubuntu-arabic' : s.settings.fontSettings.fontFamily;
        const { [`font_${id}`]: _, ...restImages } = s.localImages;
        return {
          localImages: restImages,
          settings: { ...s.settings, fontSettings: { ...s.settings.fontSettings, fontFamily: newFamily, customFonts: newFonts } }
        };
      }),

      addStoryCategory: (cat) => set(s => ({
        settings: { ...s.settings, storyCategories: [...s.settings.storyCategories, { ...cat, id: `cat_${Date.now()}` }] }
      })),
      updateStoryCategory: (id, updates) => set(s => ({
        settings: { ...s.settings, storyCategories: s.settings.storyCategories.map(c => c.id === id ? { ...c, ...updates } : c) }
      })),
      deleteStoryCategory: (id) => set(s => ({
        settings: { ...s.settings, storyCategories: s.settings.storyCategories.filter(c => c.id !== id) }
      })),

      scheduledDelete: (type, id, data) => {
        const pendingId = `pending_${Date.now()}`;
        const expiresAt = Date.now() + 10000; // 10 seconds
        set(s => ({ pendingDeletes: [...s.pendingDeletes, { id: pendingId, type, data: { ...data, originalId: id }, expiresAt }] }));
        // Auto-commit after 10s
        setTimeout(() => {
          const state = get();
          const pending = state.pendingDeletes.find(p => p.id === pendingId);
          if (pending) {
            get().commitPendingDeletes();
          }
        }, 10000);
        return pendingId;
      },

      cancelDelete: (pendingId) => set(s => ({ pendingDeletes: s.pendingDeletes.filter(p => p.id !== pendingId) })),

      commitPendingDeletes: () => {
        const state = get();
        const now = Date.now();
        const toDelete = state.pendingDeletes.filter(p => p.expiresAt <= now);
        toDelete.forEach(p => {
          const oid = p.data.originalId;
          if (p.type === 'story') get().deleteStory(oid);
          else if (p.type === 'question') get().deleteQuestion(oid);
          else if (p.type === 'puzzle') get().deletePuzzle(oid);
          else if (p.type === 'user') get().deleteUser(oid);
          else if (p.type === 'sound') get().deleteSound(oid);
          else if (p.type === 'category') get().deleteStoryCategory(oid);
        });
        set(s => ({ pendingDeletes: s.pendingDeletes.filter(p => p.expiresAt > now) }));
      },
    }),
    { name: 'gt-sararim-storage-v5' }
  )
);
