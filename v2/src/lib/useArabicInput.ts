/**
 * useArabicInput — حل مشكلة الإدخال العربي على Android
 *
 * المشكلة: React controlled inputs + Android IME (لوحة مفاتيح عربية)
 * تُطلق حدث onChange مع نص جزئي أثناء التركيب (composition) مما يقطع الكلمة.
 *
 * الحل: استخدام input غير متحكم به (uncontrolled) مع ref،
 * وقراءة القيمة فقط عند الإرسال أو بعد اكتمال التركيب.
 */

import { useRef, useCallback } from 'react';

export function useArabicInput(initialValue = '') {
  const inputRef = useRef<HTMLInputElement>(null);
  const composingRef = useRef(false);

  // استدعِ هذه الدالة لقراءة القيمة الحالية
  const getValue = useCallback(() => {
    return inputRef.current?.value ?? '';
  }, []);

  // امسح حقل الإدخال
  const clear = useCallback(() => {
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  // عيّن قيمة في حقل الإدخال
  const setValue = useCallback((val: string) => {
    if (inputRef.current) inputRef.current.value = val;
  }, []);

  const inputProps = {
    ref: inputRef,
    defaultValue: initialValue,
    // لا نستخدم value={...} لأن ذلك يسبب تقطيع النص العربي على Android
    onCompositionStart: () => { composingRef.current = true; },
    onCompositionEnd: () => { composingRef.current = false; },
  };

  return { inputRef, inputProps, getValue, clear, setValue };
}
