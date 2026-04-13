/**
 * @license SPDX-License-Identifier: Apache-2.0
 * GT-SARARIM - Unified Types
 */

export type AgeGroup = '4-6' | '6-8' | '9-12' | 'all';
export type UserRole = 'guest' | 'child' | 'parent';
export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  ageGroup: AgeGroup;
  avatar?: string;
  grade?: string;
  points: number;
  achievements: string[];
  playTimeToday: number;
  lastActive: string;
  password?: string;
  dailyTimeLimit?: number;
  customTimeLimitEnabled?: boolean;
}

export interface StoryCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  image?: string;
  category: string;
  ageGroup: AgeGroup;
  level?: Level;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  textWithHarakat?: string;
  image: string;
  ageGroup: AgeGroup;
  level?: Level;
  category: string;
  exercises: StoryQuestion[];
}

export interface StoryQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  type: 'riddle' | 'logic' | 'memory';
  content: string;
  solution: string;
  ageGroup: AgeGroup;
  level?: Level;
  hint?: string;
  image?: string;
}

export interface BackgroundSound {
  id: string;
  name: string;
  isBuiltIn: boolean;
  audioData?: string;
  synthType?: 'nature' | 'rain' | 'quran_tones' | 'calm';
}

export interface CustomFont {
  id: string;
  name: string;
  url: string; // base64 data URL
}

export interface FontSettings {
  fontFamily: string; // 'ubuntu-arabic' | 'noto-arabic' | custom font id
  customFonts?: CustomFont[];
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

export interface ParentSettings {
  dailyTimeLimit: number;
  lockedSections: string[];
  pin: string;
  parentName: string;
  parentPassword: string;
  securityQuestion?: SecurityQuestion;
  backgroundSoundId?: string;
  soundVolume: number;
  soundEnabled: boolean;
  fontSettings: FontSettings;
  storyCategories: StoryCategory[];
  parentAvatar?: string; // localImage id
}

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
}

export interface LocalImage {
  id: string;
  data: string;
  mimeType: string;
  fileName: string;
}

export interface PendingDelete {
  id: string;
  type: 'story' | 'question' | 'puzzle' | 'user' | 'sound' | 'category';
  data: any;
  expiresAt: number;
}

export interface AppState {
  currentUser: UserProfile | null;
  users: UserProfile[];
  stories: Story[];
  questions: Question[];
  puzzles: Puzzle[];
  settings: ParentSettings;
  progress: Record<string, any>;
  theme: 'light' | 'dark';
  localImages: Record<string, LocalImage>;
  levelProgress: Record<string, LevelProgress>;
  backgroundSounds: BackgroundSound[];
  pendingDeletes: PendingDelete[];
  childrenBackup: UserProfile[];
}
