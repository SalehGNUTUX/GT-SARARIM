// src/types/levels.ts
export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface LevelInfo {
    id: Level;
    name: string;
    nameAr: string;
    description: string;
    requiredPoints: number;
    icon: string;
    color: string;
}

export interface LevelProgress {
    levelId: Level;
    completedStories: string[];
    completedPuzzles: string[];
    completedActivities: string[];
    quizScore: number;
    isCompleted: boolean;
    completedAt?: string;
    certificateUrl?: string;
}

export const LEVELS: LevelInfo[] = [
    {
        id: 'beginner',
        name: 'Beginner',
        nameAr: 'تمهيدي',
        description: 'للأطفال من 4-6 سنوات',
        requiredPoints: 0,
        icon: '🌱',
        color: '#4CAF50'
    },
{
    id: 'intermediate',
    name: 'Intermediate',
    nameAr: 'مبتدئ',
    description: 'للأطفال من 6-8 سنوات',
    requiredPoints: 500,
    icon: '📚',
    color: '#FF9F43'
},
{
    id: 'advanced',
    name: 'Advanced',
    nameAr: 'متوسط',
    description: 'للأطفال من 8-10 سنوات',
    requiredPoints: 1500,
    icon: '⭐',
    color: '#54A0FF'
},
{
    id: 'expert',
    name: 'Expert',
    nameAr: 'متقدم',
    description: 'للأطفال من 10-12 سنوات',
    requiredPoints: 3000,
    icon: '🏆',
    color: '#FF6B6B'
}
];
