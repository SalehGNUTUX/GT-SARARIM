// src/components/CertificateGenerator.tsx
import React from 'react';
import { Level, LEVELS } from '../types/levels';
import { UserProfile } from '../types';

interface CertificateGeneratorProps {
    user: UserProfile;
    level: Level;
    onClose: () => void;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ user, level, onClose }) => {
    const levelInfo = LEVELS.find(l => l.id === level);

    const generateCertificate = () => {
        const certificateHTML = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
        <meta charset="UTF-8">
        <title>شهادة إنجاز - ${user.name}</title>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        body {
            font-family: 'Cairo', sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .certificate {
            background: white;
            width: 800px;
            padding: 50px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            position: relative;
            border: 10px solid #FFD700;
        }
        .certificate::before {
            content: "★";
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 60px;
            color: #FFD700;
            background: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            line-height: 60px;
        }
        h1 {
            color: #FF6B6B;
            font-size: 36px;
            margin-bottom: 20px;
        }
        .student-name {
            font-size: 48px;
            font-weight: bold;
            color: #4CAF50;
            margin: 20px 0;
            border-bottom: 2px solid #4CAF50;
            display: inline-block;
            padding: 0 20px;
        }
        .level-name {
            font-size: 32px;
            color: ${levelInfo?.color || '#FF9F43'};
            font-weight: bold;
            margin: 20px 0;
        }
        .date {
            margin-top: 40px;
            color: #666;
        }
        .signature {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .seal {
            font-size: 48px;
            opacity: 0.3;
            transform: rotate(-15deg);
        }
        </style>
        </head>
        <body>
        <div class="certificate">
        <h1>🏆 شهادة إنجاز 🏆</h1>
        <p>نحن سعداء بأن نعلن أن</p>
        <div class="student-name">${user.name}</div>
        <p>قد أتم بنجاح مستوى</p>
        <div class="level-name">${levelInfo?.nameAr}</div>
        <p>في برنامج GT-SARARIM التعليمي</p>
        <p>📅 ${new Date().toLocaleDateString('ar-EG')}</p>
        <div class="signature">
        <span>مدير البرنامج</span>
        <span class="seal">✧ GT-SARARIM ✧</span>
        <span>المشرف التربوي</span>
        </div>
        </div>
        </body>
        </html>
        `;

        const blob = new Blob([certificateHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${user.name}-${level}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-[#222] rounded-3xl max-w-md w-full p-8 text-center" onClick={e => e.stopPropagation()}>
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">تهانينا {user.name}!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
        لقد أتممت مستوى <span className="font-bold" style={{ color: levelInfo?.color }}>{levelInfo?.nameAr}</span> بنجاح!
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl mb-6">
        <p className="text-green-600 dark:text-green-400">✨ حصلت على شهادة إنجاز ✨</p>
        </div>
        <div className="flex gap-3">
        <Button onClick={generateCertificate} className="flex-1 bg-[#4CAF50]">
        📄 طباعة الشهادة
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
        إغلاق
        </Button>
        </div>
        </div>
        </div>
    );
};
