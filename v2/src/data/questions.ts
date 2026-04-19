import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [

  // ======== التمهيدي (4-6 سنوات) ========
  { id:'q_beg_r1', level:'beginner', ageGroup:'4-6', category:'دِينٌ', text:'مَا اسْمُ كِتَابِنَا الْمُقَدَّسِ؟', option1:'الْقُرْآنُ الْكَرِيمُ', option2:'الْإِنْجِيلُ', option3:'التَّوْرَاةُ', option4:'الزَّبُورُ' },
  { id:'q_beg_r2', level:'beginner', ageGroup:'4-6', category:'دِينٌ', text:'كَمْ يَوْمًا خَلَقَ اللَّهُ السَّمَاوَاتِ وَالْأَرْضَ؟', option1:'سِتَّةَ أَيَّامٍ', option2:'سَبْعَةَ أَيَّامٍ', option3:'عَشَرَةَ أَيَّامٍ', option4:'يَوْمًا وَاحِدًا' },
  { id:'q_beg_r3', level:'beginner', ageGroup:'4-6', category:'دِينٌ', text:'مَاذَا نَقُولُ لِلتَّحِيَّةِ؟', option1:'السَّلَامُ عَلَيْكُمْ', option2:'صَبَاحُ الْخَيْرِ', option3:'مَرْحَبًا', option4:'أَهْلًا' },
  { id:'q_beg_r4', level:'beginner', ageGroup:'4-6', category:'أَخْلَاقٌ', text:'مَاذَا نَقُولُ قَبْلَ الْأَكْلِ؟', option1:'بِسْمِ اللَّهِ', option2:'شُكْرًا', option3:'أُرِيدُ أَنْ آكُلَ', option4:'الطَّعَامُ لَذِيذٌ' },
  { id:'q_beg_r5', level:'beginner', ageGroup:'4-6', category:'أَخْلَاقٌ', text:'مَاذَا نَقُولُ بَعْدَ الْأَكْلِ؟', option1:'الْحَمْدُ لِلَّهِ', option2:'شَبِعْتُ', option3:'بِسْمِ اللَّهِ', option4:'أُرِيدُ الْمَزِيدَ' },
  { id:'q_beg_e1', level:'beginner', ageGroup:'4-6', category:'عُلُومٌ', text:'أَيُّ حَيَوَانٍ يَعِيشُ فِي الْمَاءِ؟', option1:'السَّمَكَةُ', option2:'الْأَسَدُ', option3:'الْفَرَسُ', option4:'الْفِيلُ' },
  { id:'q_beg_e2', level:'beginner', ageGroup:'4-6', category:'عُلُومٌ', text:'مَاذَا تُعْطِينَا الْبَقَرَةُ؟', option1:'الْحَلِيبَ', option2:'الْبَيْضَ', option3:'الصُّوفَ', option4:'الْعَسَلَ' },
  { id:'q_beg_e3', level:'beginner', ageGroup:'4-6', category:'عُلُومٌ', text:'مَا لَوْنُ السَّمَاءِ فِي النَّهَارِ؟', option1:'أَزْرَقُ', option2:'أَحْمَرُ', option3:'أَصْفَرُ', option4:'أَخْضَرُ' },
  { id:'q_beg_m1', level:'beginner', ageGroup:'4-6', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 2 + 2؟', option1:'4', option2:'3', option3:'5', option4:'6' },
  { id:'q_beg_m2', level:'beginner', ageGroup:'4-6', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 5 - 2؟', option1:'3', option2:'2', option3:'4', option4:'7' },
  { id:'q_beg_m3', level:'beginner', ageGroup:'4-6', category:'رِيَاضِيَّاتٌ', text:'كَمْ يَوْمًا فِي الْأُسْبُوعِ؟', option1:'سَبْعَةٌ', option2:'خَمْسَةٌ', option3:'سِتَّةٌ', option4:'ثَمَانِيَةٌ' },
  { id:'q_beg_a1', level:'beginner', ageGroup:'4-6', category:'لُغَةٌ عَرَبِيَّةٌ', text:'مَا هُوَ الْحَرْفُ الْأَوَّلُ فِي الْأَبْجَدِيَّةِ؟', option1:'الْأَلِفُ', option2:'الْبَاءُ', option3:'التَّاءُ', option4:'الثَّاءُ' },
  { id:'q_beg_a2', level:'beginner', ageGroup:'4-6', category:'لُغَةٌ عَرَبِيَّةٌ', text:'مَا هُوَ الْحَرْفُ الْأَخِيرُ؟', option1:'الْيَاءُ', option2:'الْوَاوُ', option3:'النُّونُ', option4:'الْهَاءُ' },
  { id:'q_beg_a3', level:'beginner', ageGroup:'4-6', category:'أَخْلَاقٌ', text:'مَاذَا تَقُولُ عِنْدَمَا يَعْطِسُ شَخْصٌ؟', option1:'يَرْحَمُكَ اللَّهُ', option2:'شُكْرًا', option3:'مَرْحَبًا', option4:'أَهْلًا' },

  // ======== المبتدئ (6-8 سنوات) ========
  { id:'q_int_r1', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'كَمْ عَدَدُ أَرْكَانِ الْإِسْلَامِ؟', option1:'خَمْسَةٌ', option2:'سِتَّةٌ', option3:'أَرْبَعَةٌ', option4:'سَبْعَةٌ' },
  { id:'q_int_r2', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'مَا هُوَ الرُّكْنُ الثَّانِي مِنْ أَرْكَانِ الْإِسْلَامِ؟', option1:'الصَّلَاةُ', option2:'الصَّوْمُ', option3:'الزَّكَاةُ', option4:'الْحَجُّ' },
  { id:'q_int_r3', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'كَمْ عَدَدُ رَكَعَاتِ صَلَاةِ الظُّهْرِ؟', option1:'أَرْبَعٌ', option2:'ثَلَاثٌ', option3:'اثْنَتَانِ', option4:'خَمْسٌ' },
  { id:'q_int_r4', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'مَا هُوَ شَهْرُ الصِّيَامِ؟', option1:'رَمَضَانُ', option2:'رَجَبٌ', option3:'مُحَرَّمٌ', option4:'شَعْبَانُ' },
  { id:'q_int_r5', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'مَنْ هُوَ أَوَّلُ الْأَنْبِيَاءِ؟', option1:'آدَمُ عَلَيْهِ السَّلَامُ', option2:'نُوحٌ عَلَيْهِ السَّلَامُ', option3:'إِبْرَاهِيمُ عَلَيْهِ السَّلَامُ', option4:'مُوسَى عَلَيْهِ السَّلَامُ' },
  { id:'q_int_r6', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'إِلَى أَيِّ مَدِينَةٍ هَاجَرَ النَّبِيُّ ﷺ؟', option1:'الْمَدِينَةُ الْمُنَوَّرَةُ', option2:'الطَّائِفُ', option3:'مَكَّةُ الْمُكَرَّمَةُ', option4:'جُدَّةُ' },
  { id:'q_int_e1', level:'intermediate', ageGroup:'6-8', category:'عُلُومٌ', text:'مَا هُوَ أَسْرَعُ حَيَوَانٍ بَرِّيٍّ؟', option1:'الْفَهْدُ', option2:'الْأَسَدُ', option3:'الْغَزَالُ', option4:'الْحِصَانُ' },
  { id:'q_int_e2', level:'intermediate', ageGroup:'6-8', category:'عُلُومٌ', text:'مَا هُوَ الْجُزْءُ الَّذِي يَمْتَصُّ الْمَاءَ فِي النَّبَاتِ؟', option1:'الْجُذُورُ', option2:'الْأَوْرَاقُ', option3:'الْأَزْهَارُ', option4:'السَّاقُ' },
  { id:'q_int_e3', level:'intermediate', ageGroup:'6-8', category:'عُلُومٌ', text:'مَا هُوَ الْكَوْكَبُ الَّذِي نَعِيشُ عَلَيْهِ؟', option1:'الْأَرْضُ', option2:'الْمِرِّيخُ', option3:'الْمُشْتَرِي', option4:'زُحَلُ' },
  { id:'q_int_m1', level:'intermediate', ageGroup:'6-8', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 5 + 7؟', option1:'12', option2:'11', option3:'13', option4:'10' },
  { id:'q_int_m2', level:'intermediate', ageGroup:'6-8', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 4 × 3؟', option1:'12', option2:'10', option3:'14', option4:'9' },
  { id:'q_int_m3', level:'intermediate', ageGroup:'6-8', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 15 - 8؟', option1:'7', option2:'8', option3:'6', option4:'9' },
  { id:'q_int_g1', level:'intermediate', ageGroup:'6-8', category:'هَنْدَسَةٌ', text:'كَمْ عَدَدُ أَضْلَاعِ الْمُثَلَّثِ؟', option1:'ثَلَاثَةٌ', option2:'أَرْبَعَةٌ', option3:'خَمْسَةٌ', option4:'سِتَّةٌ' },
  { id:'q_int_g2', level:'intermediate', ageGroup:'6-8', category:'هَنْدَسَةٌ', text:'أَيُّ الْأَشْكَالِ لَيْسَ لَهُ زَوَايَا؟', option1:'الدَّائِرَةُ', option2:'الْمُرَبَّعُ', option3:'الْمُثَلَّثُ', option4:'الْمُسْتَطِيلُ' },
  { id:'q_int_a1', level:'intermediate', ageGroup:'6-8', category:'لُغَةٌ عَرَبِيَّةٌ', text:'مَا جَمْعُ كَلِمَةِ "قَلَمٌ"؟', option1:'أَقْلَامٌ', option2:'قَلَمَاتٌ', option3:'الْقُلُومُ', option4:'قَلَمَيْنِ' },
  { id:'q_int_a2', level:'intermediate', ageGroup:'6-8', category:'لُغَةٌ عَرَبِيَّةٌ', text:'مَا ضِدُّ كَلِمَةِ "سَعِيدٌ"؟', option1:'حَزِينٌ', option2:'فَرِحٌ', option3:'مَسْرُورٌ', option4:'بَهِيجٌ' },

  // ======== المتوسط (8-10 سنوات) ========
  { id:'q_adv_r1', level:'advanced', ageGroup:'9-12', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'فِي أَيِّ مَدِينَةٍ وُلِدَ النَّبِيُّ ﷺ؟', option1:'مَكَّةُ الْمُكَرَّمَةُ', option2:'الْمَدِينَةُ الْمُنَوَّرَةُ', option3:'الطَّائِفُ', option4:'جُدَّةُ' },
  { id:'q_adv_r2', level:'advanced', ageGroup:'9-12', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'كَمْ سَنَةً عَاشَ النَّبِيُّ ﷺ؟', option1:'ثَلَاثٌ وَسِتُّونَ', option2:'خَمْسُونَ', option3:'سَبْعُونَ', option4:'خَمْسٌ وَخَمْسُونَ' },
  { id:'q_adv_r3', level:'advanced', ageGroup:'9-12', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'مَنْ هُوَ أَوَّلُ الْخُلَفَاءِ الرَّاشِدِينَ؟', option1:'أَبُو بَكْرٍ الصِّدِّيقُ', option2:'عُمَرُ بْنُ الْخَطَّابِ', option3:'عُثْمَانُ بْنُ عَفَّانَ', option4:'عَلِيُّ بْنُ أَبِي طَالِبٍ' },
  { id:'q_adv_s1', level:'advanced', ageGroup:'9-12', category:'عُلُومٌ', text:'كَمْ عَدَدُ كَوَاكِبِ الْمَجْمُوعَةِ الشَّمْسِيَّةِ؟', option1:'ثَمَانِيَةٌ', option2:'سَبْعَةٌ', option3:'تِسْعَةٌ', option4:'عَشَرَةٌ' },
  { id:'q_adv_s2', level:'advanced', ageGroup:'9-12', category:'عُلُومٌ', text:'مَا أَكْبَرُ كَوْكَبٍ فِي مَجْمُوعَتِنَا الشَّمْسِيَّةِ؟', option1:'الْمُشْتَرِي', option2:'زُحَلُ', option3:'أُورَانُوسُ', option4:'نِبْتُونُ' },
  { id:'q_adv_s3', level:'advanced', ageGroup:'9-12', category:'عُلُومٌ', text:'مِمَّ يَتَكَوَّنُ الْهَوَاءُ بِشَكْلٍ رَئِيسِيٍّ؟', option1:'النِّيتْرُوجِينُ وَالْأُوكْسِجِينُ', option2:'الْأُوكْسِجِينُ وَحْدَهُ', option3:'ثَانِي أُكْسِيدِ الْكَرْبُونِ', option4:'الْهِيدْرُوجِينُ' },
  { id:'q_adv_s4', level:'advanced', ageGroup:'9-12', category:'عُلُومٌ', text:'مَا عَدَدُ الْكُرُومُوسُومَاتِ فِي الْخَلِيَّةِ الْبَشَرِيَّةِ؟', option1:'46', option2:'23', option3:'48', option4:'44' },
  { id:'q_adv_m1', level:'advanced', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 7 × 8؟', option1:'56', option2:'54', option3:'64', option4:'48' },
  { id:'q_adv_m2', level:'advanced', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 144 ÷ 12؟', option1:'12', option2:'11', option3:'13', option4:'14' },
  { id:'q_adv_m3', level:'advanced', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 3³؟', option1:'27', option2:'9', option3:'18', option4:'36' },
  { id:'q_adv_a1', level:'advanced', ageGroup:'9-12', category:'لُغَةٌ عَرَبِيَّةٌ', text:'مَا جَمْعُ "كِتَابٌ"؟', option1:'كُتُبٌ', option2:'كِتَابَاتٌ', option3:'أَكَاتِيبُ', option4:'كِتَابَانِ' },
  { id:'q_adv_a2', level:'advanced', ageGroup:'9-12', category:'لُغَةٌ عَرَبِيَّةٌ', text:'كَمْ حَرْفًا فِي اللُّغَةِ الْعَرَبِيَّةِ؟', option1:'ثَمَانِيَةٌ وَعِشْرُونَ', option2:'سِتَّةٌ وَعِشْرُونَ', option3:'ثَلَاثُونَ', option4:'أَرْبَعٌ وَعِشْرُونَ' },
  { id:'q_adv_g1', level:'advanced', ageGroup:'9-12', category:'هَنْدَسَةٌ', text:'مَجْمُوعُ زَوَايَا الْمُثَلَّثِ يُسَاوِي؟', option1:'180 دَرَجَةً', option2:'90 دَرَجَةً', option3:'270 دَرَجَةً', option4:'360 دَرَجَةً' },

  // ======== المتقدم (10-12 سنة) ========
  { id:'q_exp_r1', level:'expert', ageGroup:'9-12', category:'عُلَمَاءُ الْمُسْلِمِينَ', text:'مَنْ وَضَعَ أُسُسَ عِلْمِ الْجَبْرِ؟', option1:'الْخَوَارِزْمِيُّ', option2:'ابْنُ سِينَا', option3:'ابْنُ الْهَيْثَمِ', option4:'ابْنُ رُشْدٍ' },
  { id:'q_exp_r2', level:'expert', ageGroup:'9-12', category:'عُلَمَاءُ الْمُسْلِمِينَ', text:'مَنْ أَثْبَتَ أَنَّ الرُّؤْيَةَ بِالضَّوْءِ الدَّاخِلِ لِلْعَيْنِ لَا الصَّادِرِ مِنْهَا؟', option1:'ابْنُ الْهَيْثَمِ', option2:'الْخَوَارِزْمِيُّ', option3:'ابْنُ سِينَا', option4:'الْبِيرُونِيُّ' },
  { id:'q_exp_r3', level:'expert', ageGroup:'9-12', category:'عُلَمَاءُ الْمُسْلِمِينَ', text:'مَنْ أَلَّفَ "الْقَانُونُ فِي الطِّبِّ"؟', option1:'ابْنُ سِينَا', option2:'الرَّازِيُّ', option3:'ابْنُ الْهَيْثَمِ', option4:'الْخَوَارِزْمِيُّ' },
  { id:'q_exp_r4', level:'expert', ageGroup:'9-12', category:'عُلَمَاءُ الْمُسْلِمِينَ', text:'مَنْ حَسَبَ مُحِيطَ الْأَرْضِ بِدِقَّةٍ مُذْهِلَةٍ فِي الْقَرْنِ الْعَاشِرِ؟', option1:'الْبِيرُونِيُّ', option2:'ابْنُ الْهَيْثَمِ', option3:'الْخَوَارِزْمِيُّ', option4:'ابْنُ سِينَا' },
  { id:'q_exp_s1', level:'expert', ageGroup:'9-12', category:'عُلُومٌ مُتَقَدِّمَةٌ', text:'مَا سُرْعَةُ الضَّوْءِ تَقْرِيبًا؟', option1:'300,000 كِيلُومِتْرٍ / ثَانِيَةً', option2:'150,000 كِيلُومِتْرٍ / ثَانِيَةً', option3:'30,000 كِيلُومِتْرٍ / ثَانِيَةً', option4:'3,000,000 كِيلُومِتْرٍ / ثَانِيَةً' },
  { id:'q_exp_s2', level:'expert', ageGroup:'9-12', category:'عُلُومٌ مُتَقَدِّمَةٌ', text:'مَا الْمَسَافَةُ التَّقْرِيبِيَّةُ مِنَ الْأَرْضِ إِلَى الشَّمْسِ؟', option1:'150 مِلْيُونِ كِيلُومِتْرٍ', option2:'15 مِلْيُونِ كِيلُومِتْرٍ', option3:'380,000 كِيلُومِتْرٍ', option4:'1.5 مِلْيَارِ كِيلُومِتْرٍ' },
  { id:'q_exp_s3', level:'expert', ageGroup:'9-12', category:'عُلُومٌ مُتَقَدِّمَةٌ', text:'مَا عَدَدُ قَوَانِينِ نِيُوتُنْ لِلْحَرَكَةِ؟', option1:'ثَلَاثَةٌ', option2:'أَرْبَعَةٌ', option3:'اثْنَانِ', option4:'خَمْسَةٌ' },
  { id:'q_exp_m1', level:'expert', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ مُتَقَدِّمَةٌ', text:'مَا نَاتِجُ 12 × 13؟', option1:'156', option2:'144', option3:'169', option4:'132' },
  { id:'q_exp_m2', level:'expert', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ مُتَقَدِّمَةٌ', text:'مَا الْعَدَدُ الْأَوَّلِيُّ بَيْنَ 10 وَ20؟', option1:'11', option2:'12', option3:'14', option4:'15' },
  { id:'q_exp_m3', level:'expert', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ مُتَقَدِّمَةٌ', text:'مَا قِيمَةُ س فِي: س + 15 = 34؟', option1:'19', option2:'21', option3:'17', option4:'49' },
  { id:'q_exp_h1', level:'expert', ageGroup:'9-12', category:'جُغْرَافِيَا', text:'مَا عَاصِمَةُ الْمَمْلَكَةِ الْعَرَبِيَّةِ السُّعُودِيَّةِ؟', option1:'الرِّيَاضُ', option2:'جُدَّةُ', option3:'مَكَّةُ الْمُكَرَّمَةُ', option4:'الدَّمَّامُ' },
  { id:'q_exp_h2', level:'expert', ageGroup:'9-12', category:'جُغْرَافِيَا', text:'مَا أَطْوَلُ نَهْرٍ فِي الْعَالَمِ؟', option1:'النِّيلُ', option2:'الْأَمَازُونُ', option3:'الْمِسِيسِيبِيُّ', option4:'الْيَانْغِتْسِي' },
  { id:'q_exp_h3', level:'expert', ageGroup:'9-12', category:'جُغْرَافِيَا', text:'فِي أَيِّ قَارَّةٍ تَقَعُ الْجَزِيرَةُ الْعَرَبِيَّةُ؟', option1:'آسِيَا', option2:'أَفْرِيقِيَا', option3:'أُورُوبَّا', option4:'أُسْتُرَالِيَا' },

  // ======== أسئلة إضافية - التمهيدي (4-6) ========
  { id:'q_beg_r6', level:'beginner', ageGroup:'4-6', category:'دِينٌ', text:'كَمْ عَدَدُ الصَّلَوَاتِ فِي الْيَوْمِ؟', option1:'خَمْسٌ', option2:'ثَلَاثٌ', option3:'أَرْبَعٌ', option4:'سِتٌّ' },
  { id:'q_beg_r7', level:'beginner', ageGroup:'4-6', category:'دِينٌ', text:'مَاذَا نَقُولُ عِنْدَ الْعُطَاسِ؟', option1:'الْحَمْدُ لِلَّهِ', option2:'بِسْمِ اللَّهِ', option3:'اَللَّهُ أَكْبَرُ', option4:'السَّلَامُ عَلَيْكُمْ' },
  { id:'q_beg_e4', level:'beginner', ageGroup:'4-6', category:'عُلُومٌ', text:'أَيُّ حَيَوَانٍ لَهُ خُرْطُومٌ طَوِيلٌ؟', option1:'الْفِيلُ', option2:'الزَّرَافَةُ', option3:'الْأَسَدُ', option4:'الْحِصَانُ' },
  { id:'q_beg_e5', level:'beginner', ageGroup:'4-6', category:'عُلُومٌ', text:'مَا الَّذِي يَمُرُّ كُلَّ لَيْلَةٍ وَيُضِيءُ السَّمَاءَ؟', option1:'الْقَمَرُ', option2:'الشَّمْسُ', option3:'النُّجُومُ فَقَطْ', option4:'السَّحَابُ' },
  { id:'q_beg_m4', level:'beginner', ageGroup:'4-6', category:'رِيَاضِيَّاتٌ', text:'كَمِ الرَّقْمُ الَّذِي يَأْتِي بَعْدَ 9؟', option1:'10', option2:'11', option3:'8', option4:'7' },
  { id:'q_beg_a4', level:'beginner', ageGroup:'4-6', category:'لُغَةٌ عَرَبِيَّةٌ', text:'مَا هُوَ جَمْعُ "كِتَابٌ" لِلصَّغِيرِ؟', option1:'كُتُبٌ', option2:'كِتَابَاتٌ', option3:'الْكَتَبَةُ', option4:'كِتَابَيْنِ' },

  // ======== أسئلة إضافية - المبتدئ (6-8) ========
  { id:'q_int_r7', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'مَاذَا نُسَمِّي الصَّلَاةَ الَّتِي تُؤَدَّى عِنْدَ الْغُرُوبِ؟', option1:'صَلَاةُ الْمَغْرِبِ', option2:'صَلَاةُ الْعَصْرِ', option3:'صَلَاةُ الْعِشَاءِ', option4:'صَلَاةُ الظُّهْرِ' },
  { id:'q_int_r8', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'كَمْ مَرَّةً يَحُجُّ الْمُسْلِمُ فِي حَيَاتِهِ إِذَا اسْتَطَاعَ؟', option1:'مَرَّةً وَاحِدَةً', option2:'مَرَّتَيْنِ', option3:'كُلَّ سَنَةٍ', option4:'ثَلَاثَ مَرَّاتٍ' },
  { id:'q_int_e4', level:'intermediate', ageGroup:'6-8', category:'عُلُومٌ', text:'مَا أَكْبَرُ حَيَوَانٍ بَرِّيٍّ فِي الْعَالَمِ؟', option1:'الْفِيلُ', option2:'الزَّرَافَةُ', option3:'وَحِيدُ الْقَرْنِ', option4:'الدُّبُّ الْقُطْبِيُّ' },
  { id:'q_int_e5', level:'intermediate', ageGroup:'6-8', category:'عُلُومٌ', text:'مَا الْغَازُ الضَّرُورِيُّ لِتَنَفُّسِ الْإِنْسَانِ؟', option1:'الْأُوكْسِجِينُ', option2:'النِّيتْرُوجِينُ', option3:'ثَانِي أُكْسِيدِ الْكَرْبُونِ', option4:'الْهِيدْرُوجِينُ' },
  { id:'q_int_m4', level:'intermediate', ageGroup:'6-8', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 6 × 7؟', option1:'42', option2:'36', option3:'48', option4:'35' },
  { id:'q_int_h1', level:'intermediate', ageGroup:'6-8', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'إِلَى أَيِّ مَكَانٍ هَاجَرَ بَعْضُ الصَّحَابَةِ أَوَّلًا قَبْلَ الْمَدِينَةِ؟', option1:'الْحَبَشَةُ', option2:'الشَّامُ', option3:'مِصْرُ', option4:'الْعِرَاقُ' },

  // ======== أسئلة إضافية - المتوسط (9-12) ========
  { id:'q_adv_r4', level:'advanced', ageGroup:'9-12', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'مَا اسْمُ زَوْجَةِ النَّبِيِّ ﷺ الْأُولَى؟', option1:'خَدِيجَةُ بِنْتُ خُوَيْلِدٍ', option2:'عَائِشَةُ', option3:'فَاطِمَةُ', option4:'أُمُّ سَلَمَةَ' },
  { id:'q_adv_r5', level:'advanced', ageGroup:'9-12', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'مَتَى وُلِدَ النَّبِيُّ ﷺ؟', option1:'عَامُ الْفِيلِ', option2:'عَامُ الْهِجْرَةِ', option3:'قَبْلَ الْبَعْثَةِ بِعَشْرِ سَنَوَاتٍ', option4:'عَامَ 600 مِيلَادِيَّةً' },
  { id:'q_adv_s5', level:'advanced', ageGroup:'9-12', category:'عُلُومٌ', text:'مَا أَقْرَبُ نَجْمٍ إِلَى الْأَرْضِ بَعْدَ الشَّمْسِ؟', option1:'بروكسيما سنتوري', option2:'سيريوس', option3:'بيتلجوس', option4:'ڤيغا' },
  { id:'q_adv_m4', level:'advanced', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ', text:'كَمْ مِنَ الزَّوَايَا فِي الْمُرَبَّعِ؟', option1:'أَرْبَعٌ قَائِمَةٌ', option2:'ثَلَاثٌ', option3:'سِتٌّ', option4:'اثْنَتَانِ فَقَطْ' },

  // ======== أسئلة إضافية - المتقدم (9-12) ========
  { id:'q_exp_r5', level:'expert', ageGroup:'9-12', category:'عُلَمَاءُ الْمُسْلِمِينَ', text:'مَا كِتَابُ ابْنِ خَلْدُونَ الشَّهِيرُ؟', option1:'الْمُقَدِّمَةُ', option2:'الْقَانُونُ فِي الطِّبِّ', option3:'كِتَابُ الْمَنَاظِرِ', option4:'الرِّسَالَةُ' },
  { id:'q_exp_r6', level:'expert', ageGroup:'9-12', category:'عُلَمَاءُ الْمُسْلِمِينَ', text:'مَنِ اكْتَشَفَ الدَّوَرَانُ الدَّمَوِيُّ الرِّئَوِيُّ قَبْلَ هَارْفِي بِقُرُونٍ؟', option1:'ابْنُ النَّفِيسِ', option2:'ابْنُ سِينَا', option3:'الرَّازِيُّ', option4:'الزَّهْرَاوِيُّ' },
  { id:'q_exp_s4', level:'expert', ageGroup:'9-12', category:'عُلُومٌ مُتَقَدِّمَةٌ', text:'مَا وَحْدَةُ قِيَاسِ الطَّاقَةِ؟', option1:'الْجُولُ', option2:'الْوَاطُ', option3:'الْنِّيُوتُنُ', option4:'الْأَمِبيرُ' },
  { id:'q_exp_h4', level:'expert', ageGroup:'9-12', category:'جُغْرَافِيَا', text:'مَا أَعْمَقُ بُحَيْرَةٍ فِي الْعَالَمِ؟', option1:'بُحَيْرَةُ بَايْكَالَ', option2:'بُحَيْرَةُ سُبِيرِيُورَ', option3:'بُحَيْرَةُ تِيتِيكَاكَا', option4:'بُحَيْرَةُ فِيكْتُورِيَا' },
  { id:'q_exp_m4', level:'expert', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ مُتَقَدِّمَةٌ', text:'مَا قِيمَةُ π (بَاي) التَّقْرِيبِيَّةُ؟', option1:'3.14', option2:'2.71', option3:'1.41', option4:'1.73' },

  // ======== أسئلة إضافية - التمهيدي (4-6) ========
  { id:'q_beg_r8', level:'beginner', ageGroup:'4-6', category:'دِينٌ', text:'أَيُّ سُورَةٍ نَقْرَؤُهَا فِي كُلِّ رَكْعَةٍ مِنَ الصَّلَاةِ؟', option1:'سُورَةُ الْفَاتِحَةِ', option2:'سُورَةُ الْإِخْلَاصِ', option3:'سُورَةُ الْبَقَرَةِ', option4:'سُورَةُ الْكَوْثَرِ' },
  { id:'q_beg_e6', level:'beginner', ageGroup:'4-6', category:'عُلُومٌ', text:'مَاذَا يُعْطِينَا النَّحْلُ؟', option1:'الْعَسَلَ', option2:'الْحَلِيبَ', option3:'الْبَيْضَ', option4:'الصُّوفَ' },
  { id:'q_beg_m5', level:'beginner', ageGroup:'4-6', category:'رِيَاضِيَّاتٌ', text:'كَمِ الشَّهْرُ الَّذِي يَأْتِي بَعْدَ يَنَايِرَ؟', option1:'فِبْرَايِرَ', option2:'مَارِسَ', option3:'أَبْرِيلَ', option4:'مَايُو' },
  { id:'q_beg_a5', level:'beginner', ageGroup:'4-6', category:'أَخْلَاقٌ', text:'مَاذَا نَقُولُ حِينَ يُعْطِينَا أَحَدٌ شَيْئًا؟', option1:'شُكْرًا جَزِيلًا', option2:'أَعْطِنِي الْمَزِيدَ', option3:'لَا أُرِيدُ', option4:'هَذَا لِي' },

  // ======== أسئلة إضافية - المبتدئ (6-8) ========
  { id:'q_int_r9', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'مَا عَدَدُ رَكَعَاتِ صَلَاةِ الْفَجْرِ؟', option1:'اثْنَتَانِ', option2:'ثَلَاثٌ', option3:'أَرْبَعٌ', option4:'وَاحِدَةٌ' },
  { id:'q_int_r10', level:'intermediate', ageGroup:'6-8', category:'دِينٌ', text:'مَنِ اشْتَرَى بِلَالَ بْنَ رَبَاحٍ وَأَعْتَقَهُ؟', option1:'أَبُو بَكْرٍ الصِّدِّيقُ', option2:'عُمَرُ بْنُ الْخَطَّابِ', option3:'عُثْمَانُ بْنُ عَفَّانَ', option4:'سَعْدُ بْنُ أَبِي وَقَّاصٍ' },
  { id:'q_int_e6', level:'intermediate', ageGroup:'6-8', category:'عُلُومٌ', text:'مَا الَّذِي تَصْنَعُهُ النَّبَاتَاتُ بِضَوْءِ الشَّمْسِ؟', option1:'تَصْنَعُ غِذَاءَهَا', option2:'تَنَامُ', option3:'تَتَكَاثَرُ', option4:'تَسْقُطُ أَوْرَاقُهَا' },
  { id:'q_int_m5', level:'intermediate', ageGroup:'6-8', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 9 × 9؟', option1:'81', option2:'72', option3:'90', option4:'64' },
  { id:'q_int_h2', level:'intermediate', ageGroup:'6-8', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'فِي أَيِّ سَنَةٍ هِجْرِيَّةٍ كَانَتْ غَزْوَةُ بَدْرٍ؟', option1:'السَّنَةُ الثَّانِيَةُ', option2:'السَّنَةُ الْأُولَى', option3:'السَّنَةُ الثَّالِثَةُ', option4:'السَّنَةُ الرَّابِعَةُ' },

  // ======== أسئلة إضافية - المتوسط (9-12) ========
  { id:'q_adv_r6', level:'advanced', ageGroup:'9-12', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'مَنْ هُوَ ثَالِثُ الْخُلَفَاءِ الرَّاشِدِينَ؟', option1:'عُثْمَانُ بْنُ عَفَّانَ', option2:'عُمَرُ بْنُ الْخَطَّابِ', option3:'عَلِيُّ بْنُ أَبِي طَالِبٍ', option4:'أَبُو بَكْرٍ الصِّدِّيقُ' },
  { id:'q_adv_r7', level:'advanced', ageGroup:'9-12', category:'تَارِيخٌ إِسْلَامِيٌّ', text:'مَتَى كَانَ فَتْحُ مَكَّةَ الْمُكَرَّمَةِ؟', option1:'السَّنَةُ الثَّامِنَةُ مِنَ الْهِجْرَةِ', option2:'السَّنَةُ الثَّانِيَةُ مِنَ الْهِجْرَةِ', option3:'السَّنَةُ الْعَاشِرَةُ مِنَ الْهِجْرَةِ', option4:'السَّنَةُ الرَّابِعَةُ مِنَ الْهِجْرَةِ' },
  { id:'q_adv_s6', level:'advanced', ageGroup:'9-12', category:'عُلُومٌ', text:'مَا أَصْغَرُ وَحْدَةٍ حَيَّةٍ فِي الْكَائِنَاتِ؟', option1:'الْخَلِيَّةُ', option2:'الذَّرَّةُ', option3:'الْجِينُ', option4:'الْبَكْتِيرْيَا' },
  { id:'q_adv_m5', level:'advanced', ageGroup:'9-12', category:'رِيَاضِيَّاتٌ', text:'مَا نَاتِجُ 11 × 11؟', option1:'121', option2:'111', option3:'131', option4:'144' },

  // ======== أسئلة إضافية - المتقدم (9-12) ========
  { id:'q_exp_r7', level:'expert', ageGroup:'9-12', category:'عُلَمَاءُ الْمُسْلِمِينَ', text:'مَنْ أَسَّسَتْ أَقْدَمَ جَامِعَةٍ فِي الْعَالَمِ؟', option1:'فَاطِمَةُ الْفِهْرِيَّةُ', option2:'عَائِشَةُ بِنْتُ أَبِي بَكْرٍ', option3:'خَدِيجَةُ بِنْتُ خُوَيْلِدٍ', option4:'مَرْيَمُ بِنْتُ عِمْرَانَ' },
  { id:'q_exp_r8', level:'expert', ageGroup:'9-12', category:'عُلَمَاءُ الْمُسْلِمِينَ', text:'مَنْ أَوَّلُ مَنْ مَيَّزَ بَيْنَ الْجُدَرِيِّ وَالْحَصْبَةِ؟', option1:'الرَّازِيُّ', option2:'ابْنُ سِينَا', option3:'ابْنُ النَّفِيسِ', option4:'الزَّهْرَاوِيُّ' },
  { id:'q_exp_h5', level:'expert', ageGroup:'9-12', category:'جُغْرَافِيَا', text:'فِي أَيِّ مَدِينَةٍ تَقَعُ جَامِعَةُ الْقَرَوِيِّينَ أَقْدَمُ جَامِعَةٍ فِي الْعَالَمِ؟', option1:'فَاسٍ', option2:'الْقَاهِرَةِ', option3:'بَغْدَادَ', option4:'تُونُسَ' },
  { id:'q_exp_s5', level:'expert', ageGroup:'9-12', category:'عُلُومٌ مُتَقَدِّمَةٌ', text:'مَا الْعُنْصُرُ الْأَكْثَرُ انْتِشَارًا فِي الْغِلَافِ الْجَوِّيِّ لِلْأَرْضِ؟', option1:'النِّيتْرُوجِينُ', option2:'الْأُوكْسِجِينُ', option3:'الْأَرْغُونُ', option4:'ثَانِي أُكْسِيدِ الْكَرْبُونِ' },
];
