// src/data/scholars.ts
export interface MuslimScholar {
    id: string;
    name: string;
    nameAr: string;
    fullName: string;
    birthYear: number;
    deathYear: number;
    era: string;
    fields: string[];
    country: string;
    shortBio: string;
    shortBioWithHarakat: string;
    fullBio: string;
    inventions: string[];
    famousBooks: string[];
    imageUrl: string;
    quotes: string[];
    quizQuestions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
}

export const MUSLIM_SCHOLARS: MuslimScholar[] = [
    {
        id: 'khwarizmi',
        name: 'Al-Khwarizmi',
        nameAr: 'الخوارزمي',
        fullName: 'محمد بن موسى الخوارزمي',
        birthYear: 780,
        deathYear: 850,
        era: 'العباسي',
        fields: ['رياضيات', 'فلك', 'جغرافيا'],
        country: 'العراق',
        shortBio: 'مؤسس علم الجبر وأحد أعظم علماء الرياضيات في التاريخ',
        shortBioWithHarakat: 'مُؤَسِّسُ عِلْمِ الْجَبْرِ وَأَحَدُ أَعْظَمِ عُلَمَاءِ الرِّيَاضِيَّاتِ فِي التَّارِيخِ',
        fullBio: 'محمد بن موسى الخوارزمي عالم رياضيات وفلك وجغرافيا مسلم عاش في بغداد في القرن التاسع الميلادي. يعتبر من أعظم علماء الرياضيات في التاريخ، حيث وضع أسس علم الجبر والمقابلة، وكلمة "الجبر" نفسها مشتقة من عنوان كتابه الشهير "الكتاب المختصر في حساب الجبر والمقابلة". كما أدخل الأرقام الهندية (التي نسميها اليوم الأرقام العربية) إلى العالم الغربي، وطور مفهوم الصفر. كان يعمل في بيت الحكمة ببغداد، حيث ترجم الكتب اليونانية والهندية وأضاف إليها ابتكاراته الخاصة.',
        inventions: ['علم الجبر', 'الخوارزميات', 'الأرقام العربية', 'الصفر'],
        famousBooks: ['الكتاب المختصر في حساب الجبر والمقابلة', 'كتاب صورة الأرض', 'كتاب العمل بالإسطرلاب'],
        imageUrl: '',
        quotes: ['من جد وجد', 'العلم بلا عمل كالشجرة بلا ثمر'],
        quizQuestions: [
            {
                question: 'ما هو أشهر كتاب للخوارزمي؟',
                options: ['القانون في الطب', 'الكتاب المختصر في حساب الجبر والمقابلة', 'الشفاء'],
                correctAnswer: 1
            },
            {
                question: 'ماذا أدخل الخوارزمي إلى الرياضيات؟',
                options: ['الكسر العشري', 'الصفر', 'اللوغاريتمات'],
                correctAnswer: 1
            },
            {
                question: 'أين كان يعمل الخوارزمي؟',
                options: ['بيت الحكمة', 'جامعة الأزهر', 'المدرسة المستنصرية'],
                correctAnswer: 0
            }
        ]
    },
{
    id: 'ibn_sina',
    name: 'Ibn Sina',
    nameAr: 'ابن سينا',
    fullName: 'الحسين بن عبد الله بن سينا',
    birthYear: 980,
    deathYear: 1037,
    era: 'البويهي',
    fields: ['طب', 'فلسفة', 'رياضيات', 'موسيقى'],
    country: 'أوزبكستان (بخارى)',
    shortBio: 'أمير الأطباء وأحد أعظم أطباء التاريخ',
    shortBioWithHarakat: 'أَمِيرُ الْأَطِبَّاءِ وَأَحَدُ أَعْظَمِ أَطِبَّاءِ التَّارِيخِ',
    fullBio: 'أبو علي الحسين بن عبد الله بن سينا، المعروف بابن سينا، عالم وطبيب وفيلسوف مسلم من أصل فارسي، ولد عام 980 ميلادية في بخارى. يعد من أعظم الأطباء في التاريخ، وكتابه "القانون في الطب" ظل المرجع الأساسي في أوروبا لعدة قرون. حفظ القرآن الكريم وعمره 10 سنوات، وتفوق في الطب وعمره 16 سنة. ابتكر فكرة الجراثيم وانتقال الأمراض، ووصف العديد من الأمراض بدقة.',
    inventions: ['القانون في الطب', 'وصف الجراثيم', 'التخدير', 'الفصد'],
    famousBooks: ['القانون في الطب', 'الشفاء', 'النجاة', 'الإشارات والتنبيهات'],
    imageUrl: '',
    quotes: ['الطب علم يبين أحوال بدن الإنسان من حيث الصحة والمرض', 'العلم يرفع بيتاً لا عماد له والجهل يهدم بيت العز والشرف'],
    quizQuestions: [
        {
            question: 'ما اسم أشهر كتاب لابن سينا في الطب؟',
            options: ['الحاوي', 'القانون في الطب', 'التصريف'],
            correctAnswer: 1
        },
        {
            question: 'أين ولد ابن سينا؟',
            options: ['بغداد', 'القاهرة', 'بخارى'],
            correctAnswer: 2
        },
        {
            question: 'ما الفكرة التي ابتكرها ابن سينا؟',
            options: ['الدورة الدموية', 'الجراثيم', 'التخدير'],
            correctAnswer: 1
        }
    ]
},
{
    id: 'ibn_al_haytham',
    name: 'Ibn al-Haytham',
    nameAr: 'ابن الهيثم',
    fullName: 'الحسن بن الهيثم',
    birthYear: 965,
    deathYear: 1040,
    era: 'الفاطمي',
    fields: ['فيزياء', 'بصريات', 'رياضيات', 'فلك'],
    country: 'العراق (البصرة)',
    shortBio: 'أبو البصريات الحديثة ومكتشف قوانين انعكاس الضوء',
    shortBioWithHarakat: 'أَبُو الْبَصَرِيَّاتِ الْحَدِيثَةِ وَمُكْتَشِفُ قَوَانِينِ انْعِكَاسِ الضَّوْءِ',
    fullBio: 'الحسن بن الهيثم عالم عربي مسلم، يعد من أبرز العلماء في مجال البصريات والفيزياء. له إسهامات كبيرة في فهم كيفية عمل العين وانتشار الضوء. كتابه "المناظر" يعتبر من أهم الكتب في تاريخ العلوم. استخدم المنهج العلمي التجريبي قبل العلماء الأوروبيين بقرون.',
    inventions: ['الكاميرا ذات الثقب', 'قوانين انعكاس الضوء', 'العدسات المكبرة'],
    famousBooks: ['كتاب المناظر', 'تحليل المسائل الهندسية', 'ميزان الحكمة'],
    imageUrl: '',
    quotes: ['طلب العلم بالشك يقود إلى اليقين', 'البصيرة أقوى من البصر'],
    quizQuestions: [
        {
            question: 'ما هو أشهر كتاب لابن الهيثم؟',
            options: ['القانون', 'المناظر', 'الشفاء'],
            correctAnswer: 1
        },
        {
            question: 'ماذا اخترع ابن الهيثم؟',
            options: ['التلسكوب', 'الكاميرا ذات الثقب', 'المجهر'],
            correctAnswer: 1
        }
    ]
}
// يمكن إضافة 97 عالماً آخر بنفس الهيكل
];

// للحصول على عالم عشوائي
export const getRandomScholar = (): MuslimScholar => {
    const randomIndex = Math.floor(Math.random() * MUSLIM_SCHOLARS.length);
    return MUSLIM_SCHOLARS[randomIndex];
};

// للحصول على العلماء حسب المجال
export const getScholarsByField = (field: string): MuslimScholar[] => {
    return MUSLIM_SCHOLARS.filter(scholar => scholar.fields.includes(field));
};

// للحصول على العلماء حسب العصر
export const getScholarsByEra = (era: string): MuslimScholar[] => {
    return MUSLIM_SCHOLARS.filter(scholar => scholar.era === era);
};
