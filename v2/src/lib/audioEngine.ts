/**
 * محرك الصوت - يولّد أصوات بيئية بالكامل عبر Web Audio API
 * لا يحتاج لملفات صوتية خارجية - يعمل بالكامل دون إنترنت
 */

export type SoundType = 'rain' | 'birds' | 'ocean' | 'wind' | 'nature' | 'silence';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private currentType: SoundType = 'silence';
  private volume: number = 50;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private createMaster(ctx: AudioContext): GainNode {
    if (this.masterGain) {
      this.masterGain.disconnect();
    }
    const g = ctx.createGain();
    g.gain.value = this.volume / 100;
    g.connect(ctx.destination);
    this.masterGain = g;
    return g;
  }

  private stopAll() {
    this.activeNodes.forEach(n => {
      try { (n as OscillatorNode | AudioBufferSourceNode).stop?.(); } catch {}
      try { n.disconnect(); } catch {}
    });
    this.activeNodes = [];
  }

  private createNoise(ctx: AudioContext): AudioBufferSourceNode {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise via Voss-McCartney algorithm
      b0 = 0.99886*b0 + white*0.0555179;
      b1 = 0.99332*b1 + white*0.0750759;
      b2 = 0.96900*b2 + white*0.1538520;
      b3 = 0.86650*b3 + white*0.3104856;
      b4 = 0.55000*b4 + white*0.5329522;
      b5 = -0.7616*b5 - white*0.0168980;
      data[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  private playRain(ctx: AudioContext, master: GainNode) {
    const noise = this.createNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.8;

    // LFO for slight variation
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    noise.start();

    this.activeNodes.push(noise, filter, gain, lfo, lfoGain);
  }

  private playOcean(ctx: AudioContext, master: GainNode) {
    const noise = this.createNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 300;
    filter.Q.value = 0.3;

    // Slow wave LFO
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.4;
    lfo.connect(lfoGain);

    const masterGainNode = ctx.createGain();
    masterGainNode.gain.value = 0.7;
    lfoGain.connect(masterGainNode.gain);
    lfo.start();

    noise.connect(filter);
    filter.connect(masterGainNode);
    masterGainNode.connect(master);
    noise.start();

    this.activeNodes.push(noise, filter, masterGainNode, lfo, lfoGain);
  }

  private playWind(ctx: AudioContext, master: GainNode) {
    const noise = this.createNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 2000;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 600;
    lfo.connect(lfoGain);
    lfoGain.connect(filter2.frequency);
    lfo.start();

    const gain = ctx.createGain();
    gain.gain.value = 0.5;

    noise.connect(filter);
    filter.connect(filter2);
    filter2.connect(gain);
    gain.connect(master);
    noise.start();

    this.activeNodes.push(noise, filter, filter2, gain, lfo, lfoGain);
  }

  private playBird(ctx: AudioContext, master: GainNode, freq: number, delay: number, interval: number) {
    const schedule = () => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime + delay);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.2);
      // frequency chirp
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      osc.frequency.linearRampToValueAtTime(freq * 1.3, ctx.currentTime + delay + 0.1);
      osc.frequency.linearRampToValueAtTime(freq * 0.9, ctx.currentTime + delay + 0.2);

      osc.connect(g);
      g.connect(master);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.25);
      this.activeNodes.push(osc, g);
    };

    schedule();
    const id = setInterval(schedule, interval * 1000);
    // Store interval for cleanup (hack: store as a special node-like object)
    this.activeNodes.push({ disconnect: () => clearInterval(id) } as any);
  }

  private playBirds(ctx: AudioContext, master: GainNode) {
    // Soft background noise (forest ambience)
    const noise = this.createNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 2;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();
    this.activeNodes.push(noise, filter, noiseGain);

    // Bird chirps
    this.playBird(ctx, master, 2000, 0.5, 3.2);
    this.playBird(ctx, master, 2400, 1.8, 4.7);
    this.playBird(ctx, master, 1800, 3.1, 5.5);
    this.playBird(ctx, master, 2600, 2.3, 6.1);
  }

  private playNature(ctx: AudioContext, master: GainNode) {
    // Combine rain + birds at lower volumes
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.4;
    rainGain.connect(master);
    this.playRain(ctx, rainGain);

    const birdGain = ctx.createGain();
    birdGain.gain.value = 0.6;
    birdGain.connect(master);
    this.playBirds(ctx, birdGain);
  }

  play(type: SoundType, volume: number) {
    this.stopAll();
    this.volume = volume;
    this.currentType = type;

    if (type === 'silence') return;

    const ctx = this.getContext();
    const master = this.createMaster(ctx);

    switch (type) {
      case 'rain':    this.playRain(ctx, master); break;
      case 'ocean':   this.playOcean(ctx, master); break;
      case 'wind':    this.playWind(ctx, master); break;
      case 'birds':   this.playBirds(ctx, master); break;
      case 'nature':  this.playNature(ctx, master); break;
    }
  }

  stop() {
    this.stopAll();
    this.currentType = 'silence';
  }

  setVolume(vol: number) {
    this.volume = vol;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(vol / 100, this.getContext().currentTime, 0.1);
    }
  }

  getCurrentType() { return this.currentType; }
}

export const audioEngine = new AudioEngine();
