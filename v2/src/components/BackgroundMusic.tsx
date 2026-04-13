import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

// ── Singleton AudioContext that survives component re-mounts ──
let _ctx: AudioContext | null = null;
let _player: { stop: () => void } | null = null;
let _currentId = '';
let _currentVol = 0.5;

function getCtx(): AudioContext | null {
  if (_ctx && _ctx.state !== 'closed') {
    // Resume if suspended (browser autoplay policy)
    if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
    return _ctx;
  }
  try {
    _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return _ctx;
  } catch { return null; }
}

// Resume AudioContext on any user gesture (fixes autoplay policy warning)
if (typeof window !== 'undefined') {
  const resumeCtx = () => { if (_ctx?.state === 'suspended') _ctx.resume().catch(() => {}); };
  ['click','touchstart','keydown','pointerdown'].forEach(evt =>
    window.addEventListener(evt, resumeCtx, { once: false, passive: true })
  );
}

function makeNoise(ctx: AudioContext) {
  const sz = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  return src;
}

function playStreamBirds(ctx: AudioContext, vol: number) {
  const master = ctx.createGain(); master.gain.value = vol * 0.6; master.connect(ctx.destination);
  let active = true;
  const noise = makeNoise(ctx);
  const bp1 = ctx.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 800; bp1.Q.value = 0.3;
  const bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 1600; bp2.Q.value = 0.2;
  const gStream = ctx.createGain(); gStream.gain.value = 0.12;
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.3;
  const lfoG = ctx.createGain(); lfoG.gain.value = 0.03;
  lfo.connect(lfoG); lfoG.connect(gStream.gain); lfo.start();
  noise.connect(bp1); noise.connect(bp2); bp1.connect(gStream); bp2.connect(gStream); gStream.connect(master);
  noise.start();
  const birdSongs = [
    () => { for(let r=0;r<3+Math.floor(Math.random()*3);r++){const o=ctx.createOscillator();const g=ctx.createGain();o.type='sine';o.connect(g);g.connect(master);const t=ctx.currentTime+r*.13;const f=2200+Math.random()*800;o.frequency.setValueAtTime(f,t);o.frequency.linearRampToValueAtTime(f*1.15,t+.07);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.1*vol,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.start(t);o.stop(t+.14);}},
    () => {const o=ctx.createOscillator();const g=ctx.createGain();o.type='sine';o.connect(g);g.connect(master);const base=900+Math.random()*500;o.frequency.setValueAtTime(base,ctx.currentTime);o.frequency.linearRampToValueAtTime(base*1.5,ctx.currentTime+.25);o.frequency.linearRampToValueAtTime(base*.9,ctx.currentTime+.55);g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(.08*vol,ctx.currentTime+.05);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.65);o.start();o.stop(ctx.currentTime+.7);},
    () => {[0,.18,.36,.52].forEach((off,i)=>{const o=ctx.createOscillator();const g=ctx.createGain();o.type='triangle';o.frequency.value=1800-i*150;o.connect(g);g.connect(master);const t=ctx.currentTime+off;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07*vol,t+.04);g.gain.exponentialRampToValueAtTime(.001,t+.17);o.start(t);o.stop(t+.2);});}
  ];
  const sing = () => { if(!active||ctx.state==='closed')return; birdSongs[Math.floor(Math.random()*3)](); if(active) setTimeout(sing,1200+Math.random()*3800); };
  setTimeout(sing, 600);
  return { stop: () => { active=false; try{noise.stop();lfo.stop();}catch{} master.disconnect(); } };
}

function playRain(ctx: AudioContext, vol: number) {
  const master = ctx.createGain(); master.gain.value = vol*.6; master.connect(ctx.destination);
  const noise = makeNoise(ctx);
  const hi = ctx.createBiquadFilter(); hi.type='highpass'; hi.frequency.value=400;
  const lo = ctx.createBiquadFilter(); lo.type='lowpass'; lo.frequency.value=5000;
  const g = ctx.createGain(); g.gain.value=.2;
  noise.connect(hi); hi.connect(lo); lo.connect(g); g.connect(master); noise.start();
  return { stop: () => { try{noise.stop();}catch{} master.disconnect(); } };
}

function playNature(ctx: AudioContext, vol: number) {
  const master = ctx.createGain(); master.gain.value = vol*.5; master.connect(ctx.destination);
  const noise = makeNoise(ctx);
  const f = ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=500; f.Q.value=.3;
  const g = ctx.createGain(); g.gain.value=.07;
  noise.connect(f); f.connect(g); g.connect(master); noise.start();
  return { stop: () => { try{noise.stop();}catch{} master.disconnect(); } };
}

function playCalm(ctx: AudioContext, vol: number) {
  const master = ctx.createGain(); master.gain.value = vol*.3; master.connect(ctx.destination);
  const notes = [261.63,293.66,329.63,349.23,392.00,440.00,493.88];
  let active=true; let step=0;
  const play = () => { if(!active||ctx.state==='closed')return; const o=ctx.createOscillator();const g=ctx.createGain();o.type='triangle';o.frequency.value=notes[step%notes.length];g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(.5,ctx.currentTime+.06);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+1);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+1);step++;if(active)setTimeout(play,750); };
  play();
  return { stop: () => { active=false; master.disconnect(); } };
}

function startGlobalSound(soundId: string, vol: number, sounds: any[]) {
  if (_currentId === soundId && _currentVol === vol && _player) return; // already playing same
  if (_player) { _player.stop(); _player = null; }
  _currentId = soundId; _currentVol = vol;
  const ctx = getCtx(); if (!ctx) return;
  const sound = sounds.find((s: any) => s.id === soundId);
  if (!sound) return;
  const v = Math.max(0, Math.min(1, vol / 100));
  if (sound.isBuiltIn) {
    if      (sound.synthType === 'stream_birds') _player = playStreamBirds(ctx, v);
    else if (sound.synthType === 'rain')         _player = playRain(ctx, v);
    else if (sound.synthType === 'nature')       _player = playNature(ctx, v);
    else if (sound.synthType === 'calm')         _player = playCalm(ctx, v);
  } else if (sound.audioData) {
    const base64 = sound.audioData.split(',')[1]; if (!base64) return;
    const bin = atob(base64); const bytes = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    ctx.decodeAudioData(bytes.buffer).then(decoded => {
      const src=ctx.createBufferSource(); const g=ctx.createGain();
      g.gain.value=v; src.buffer=decoded; src.loop=true;
      src.connect(g); g.connect(ctx.destination); src.start();
      _player={stop:()=>{try{src.stop();}catch{} g.disconnect();}};
    }).catch(()=>{});
  }
}

function stopGlobalSound() {
  if (_player) { _player.stop(); _player = null; }
  _currentId = '';
}

export function BackgroundMusic() {
  const { settings, backgroundSounds } = useStore();
  const { soundEnabled, backgroundSoundId, soundVolume } = settings;

  useEffect(() => {
    if (soundEnabled && backgroundSoundId) {
      // Small delay to ensure we're in a user-gesture context or AudioContext was already created
      const t = setTimeout(() => {
        startGlobalSound(backgroundSoundId, soundVolume, backgroundSounds || []);
      }, 100);
      return () => clearTimeout(t);
    } else {
      stopGlobalSound();
    }
    // Do NOT return stopGlobalSound here — persist across re-mounts
  }, [soundEnabled, backgroundSoundId, soundVolume]);

  return null;
}

// Export for child sound controls
export { startGlobalSound, stopGlobalSound, _player };
