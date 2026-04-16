import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Undo2, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '../store/useStore';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ open, title, description, onConfirm, onCancel }: Props) {
  const { verifyParentPassword } = useStore();
  const [step, setStep] = useState<'password' | 'countdown'>('password');
  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setStep('password');
      setPwd('');
      setPwdError('');
      setCountdown(10);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [open]);

  const handlePasswordSubmit = () => {
    if (verifyParentPassword(pwd)) {
      setStep('countdown');
      let c = 10;
      setCountdown(c);
      timerRef.current = setInterval(() => {
        c--;
        setCountdown(c);
        if (c <= 0) {
          clearInterval(timerRef.current!);
          onConfirm();
        }
      }, 1000);
    } else {
      setPwdError('كَلِمَةُ الْمُرُورِ غَيْرُ صَحِيحَةٍ!');
      setPwd('');
    }
  };

  const handleUndo = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onCancel();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onCancel()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white dark:bg-[#222] rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5"
        >
          {step === 'password' ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2D3436] dark:text-white">تَأْكِيدُ الْحَذْفِ</h3>
                  <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">{title}</p>
                </div>
              </div>
              {description && <p className="text-sm text-[#636E72] dark:text-[#A0A0A0] bg-[#F8F9FA] dark:bg-[#333] rounded-2xl p-3">{description}</p>}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2D3436] dark:text-white">كَلِمَةُ مُرُورِ الْوَالِدَيْنِ</label>
                <Input
                  type="password"
                  value={pwd}
                  onChange={e => { setPwd(e.target.value); setPwdError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
                  placeholder="أَدْخِلْ كَلِمَةَ الْمُرُورِ"
                  className="rounded-2xl text-center dark:bg-[#333] dark:border-[#444] dark:text-white"
                  autoFocus
                />
                {pwdError && <p className="text-red-500 text-sm text-center">{pwdError}</p>}
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold" onClick={handlePasswordSubmit}>
                  <Trash2 className="w-4 h-4 ml-2" /> تَأْكِيدُ الْحَذْفِ
                </Button>
                <Button variant="outline" className="flex-1 rounded-2xl dark:border-[#444] dark:text-white" onClick={onCancel}>إِلْغَاءٌ</Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto relative">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#FFE8E8" strokeWidth="8" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#FF6B6B" strokeWidth="8"
                      strokeDasharray={`${213.6}`}
                      strokeDashoffset={`${213.6 * (1 - countdown / 10)}`}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-red-500">{countdown}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2D3436] dark:text-white">جَارٍ الْحَذْفُ...</h3>
                  <p className="text-sm text-[#636E72] dark:text-[#A0A0A0]">سَيُحْذَفُ بَعْدَ {countdown} ثَوَانٍ</p>
                </div>
                <Button
                  className="w-full py-5 bg-[#4CAF50] hover:bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                  onClick={handleUndo}
                >
                  <Undo2 className="w-5 h-5" /> تَرَاجُعٌ - إِلْغَاءُ الْحَذْفِ
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
