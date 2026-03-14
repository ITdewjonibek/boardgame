/**
 * Sound System for Game Hub
 */

class SoundManager {
  constructor() {
    this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    this.audioContext = null;
    this.init();
  }

  init() {
    const soundBtn = document.getElementById('sound-btn');
    const soundIcon = document.getElementById('sound-icon');
    
    if (soundBtn) {
      soundBtn.classList.toggle('muted', !this.soundEnabled);
      soundBtn.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('soundEnabled', this.soundEnabled);
    
    const soundBtn = document.getElementById('sound-btn');
    const soundIcon = document.getElementById('sound-icon');
    
    soundBtn.classList.toggle('muted', !this.soundEnabled);
    soundIcon.textContent = this.soundEnabled ? '🔊' : '🔇';
  }

  playTone(frequency = 440, duration = 100, type = 'sine') {
    if (!this.soundEnabled) return;
    
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = this.audioContext;
      const now = ctx.currentTime;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
      
      oscillator.start(now);
      oscillator.stop(now + duration / 1000);
    } catch (e) {
      console.log('Audio context error:', e);
    }
  }

  playClick() {
    this.playTone(800, 80, 'square');
  }

  playSuccess() {
    this.playTone(600, 100, 'sine');
    setTimeout(() => this.playTone(800, 100, 'sine'), 100);
  }

  playGameOver() {
    this.playTone(400, 200, 'sine');
  }

  playCollision() {
    this.playTone(200, 150, 'square');
  }

  playPowerUp() {
    this.playTone(1000, 50, 'sine');
    setTimeout(() => this.playTone(1200, 50, 'sine'), 50);
    setTimeout(() => this.playTone(1400, 100, 'sine'), 100);
  }
}

const soundManager = new SoundManager();
