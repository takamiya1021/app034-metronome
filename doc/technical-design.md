# 🛠️ 技術設計書：No.34「メトロノーム」

**作成日**: 2025-01-13
**バージョン**: 1.0
**アプリ番号**: 34

---

## 1. 技術スタック

### 1.1 推奨構成
- **フレームワーク**: Next.js 14.x（App Router）
- **言語**: TypeScript 5.x
- **UI**: React 18.x
- **スタイリング**: Tailwind CSS v3
- **アニメーション**: Framer Motion
- **PWA**: next-pwa
- **AI API**: Google AI Studio (Gemini API)
- **音声処理**: Web Audio API
- **状態管理**: React Context API
- **ローカルストレージ**: Web Storage API

### 1.2 開発ツール
- **リンター**: ESLint 8.x
- **フォーマッター**: Prettier
- **パッケージマネージャー**: npm または pnpm

---

## 2. アーキテクチャ設計

### 2.1 コンポーネント構成

```
app/
├── layout.tsx                  // ルートレイアウト（PWA設定含む）
├── page.tsx                    // メインページ
├── components/
│   ├── MetronomeControls.tsx   // 再生/停止ボタン
│   ├── TempoSlider.tsx         // BPMスライダー
│   ├── TapTempo.tsx            // タップテンポボタン
│   ├── TimeSignature.tsx       // 拍子選択
│   ├── SoundSelector.tsx       // 音色選択
│   ├── AccentToggle.tsx        // アクセントON/OFF
│   ├── SubdivisionSelector.tsx // サブディビジョン選択
│   ├── PendulumAnimation.tsx   // 振り子アニメーション
│   ├── BeatIndicator.tsx       // 点滅表示
│   ├── PresetManager.tsx       // プリセット管理
│   ├── AIContentSection.tsx    // AI生成コンテンツ表示（共通）
│   └── GenerateButton.tsx      // AI生成ボタン（共通）
├── lib/
│   ├── audioEngine.ts          // Web Audio API制御
│   ├── metronome.ts            // メトロノームロジック
│   ├── tapTempo.ts             // タップテンポ検出
│   ├── presets.ts              // プリセットデータ
│   ├── aiService.ts            // Google AI Studio API統合（共通）
│   └── storage.ts              // ローカルストレージ管理（共通）
├── hooks/
│   ├── useMetronome.ts         // メトロノームカスタムフック
│   ├── useAudioEngine.ts       // 音声エンジンカスタムフック
│   ├── useTapTempo.ts          // タップテンポカスタムフック
│   └── useAIGeneration.ts      // AI生成カスタムフック（共通）
└── types/
    └── metronome.ts            // 型定義
```

### 2.2 データフロー

```
[TempoSlider] + [TapTempo]
    ↓ BPM変更
[useMetronome] → [useAudioEngine] → Web Audio API → 音声出力
    ↓
[PendulumAnimation] + [BeatIndicator]

[GenerateButton]
    ↓ クリック
[useAIGeneration] → Google AI API → [AIContentSection]
```

---

## 3. Web Audio API設計

### 3.1 音声エンジン実装

```typescript
// lib/audioEngine.ts

export class AudioEngine {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode;
  private nextNoteTime: number = 0;
  private scheduleAheadTime: number = 0.1; // 100ms先までスケジュール
  private timerID: number | null = null;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  /**
   * メトロノーム音を生成
   */
  playClick(time: number, isAccent: boolean = false) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    // 音色設定（周波数）
    osc.frequency.value = isAccent ? 1000 : 800; // アクセントは高い音

    // 音量設定
    gain.gain.value = isAccent ? 1.0 : 0.7;
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    // 再生
    osc.start(time);
    osc.stop(time + 0.05);
  }

  /**
   * カスタム音色（クラシック、デジタル等）
   */
  playCustomClick(
    time: number,
    soundType: SoundType,
    isAccent: boolean = false
  ) {
    switch (soundType) {
      case 'classic':
        this.playWoodClick(time, isAccent);
        break;
      case 'digital':
        this.playDigitalClick(time, isAccent);
        break;
      case 'drumstick':
        this.playDrumstickClick(time, isAccent);
        break;
      case 'bell':
        this.playBellClick(time, isAccent);
        break;
      case 'synth':
        this.playSynthClick(time, isAccent);
        break;
    }
  }

  private playWoodClick(time: number, isAccent: boolean) {
    // 木製クリック音（短いノイズ + トーン）
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = isAccent ? 1200 : 900;

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    gain.gain.value = isAccent ? 1.0 : 0.6;
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  private playDigitalClick(time: number, isAccent: boolean) {
    // デジタル音（鋭いトーン）
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'square';
    osc.frequency.value = isAccent ? 1500 : 1200;

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    gain.gain.value = isAccent ? 0.8 : 0.5;
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.start(time);
    osc.stop(time + 0.02);
  }

  // ... 他の音色実装

  /**
   * AudioContextのレジューム（ブラウザの自動再生ポリシー対応）
   */
  async resume() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * クリーンアップ
   */
  dispose() {
    if (this.timerID) {
      clearTimeout(this.timerID);
    }
    this.audioContext.close();
  }
}
```

### 3.2 メトロノームロジック

```typescript
// lib/metronome.ts

export class Metronome {
  private audioEngine: AudioEngine;
  private bpm: number;
  private timeSignature: TimeSignature;
  private soundType: SoundType;
  private accentEnabled: boolean;
  private subdivision: Subdivision;
  private isPlaying: boolean = false;
  private currentBeat: number = 0;
  private nextNoteTime: number = 0;
  private scheduleAheadTime: number = 0.1;
  private lookahead: number = 25.0; // ms
  private timerID: number | null = null;

  constructor(config: MetronomeConfig) {
    this.audioEngine = new AudioEngine();
    this.bpm = config.bpm;
    this.timeSignature = config.timeSignature;
    this.soundType = config.soundType;
    this.accentEnabled = config.accentEnabled;
    this.subdivision = config.subdivision;
  }

  start() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.audioEngine.audioContext.currentTime;
    this.scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  private scheduler() {
    // 次のノートまでスケジューリング
    while (
      this.nextNoteTime <
      this.audioEngine.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.nextNote();
    }

    // 再帰呼び出し
    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => {
        this.scheduler();
      }, this.lookahead);
    }
  }

  private scheduleNote(beatNumber: number, time: number) {
    // アクセント判定（1拍目）
    const isAccent = this.accentEnabled && beatNumber % this.timeSignature.beats === 0;

    // 音を再生
    this.audioEngine.playCustomClick(time, this.soundType, isAccent);

    // サブディビジョンの処理
    if (this.subdivision !== 'quarter') {
      this.scheduleSubdivisions(time);
    }
  }

  private scheduleSubdivisions(time: number) {
    const subdivisionCount = this.getSubdivisionCount();
    const subdivisionInterval = (60.0 / this.bpm) / subdivisionCount;

    for (let i = 1; i < subdivisionCount; i++) {
      const subdivisionTime = time + subdivisionInterval * i;
      this.audioEngine.playCustomClick(subdivisionTime, this.soundType, false);
    }
  }

  private getSubdivisionCount(): number {
    switch (this.subdivision) {
      case 'eighth':
        return 2;
      case 'sixteenth':
        return 4;
      case 'triplet':
        return 3;
      default:
        return 1;
    }
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;

    this.currentBeat++;
    if (this.currentBeat >= this.timeSignature.beats) {
      this.currentBeat = 0;
    }
  }

  setBPM(bpm: number) {
    this.bpm = bpm;
  }

  setTimeSignature(timeSignature: TimeSignature) {
    this.timeSignature = timeSignature;
  }

  setSoundType(soundType: SoundType) {
    this.soundType = soundType;
  }

  setAccent(enabled: boolean) {
    this.accentEnabled = enabled;
  }

  setSubdivision(subdivision: Subdivision) {
    this.subdivision = subdivision;
  }
}
```

### 3.3 タップテンポ検出

```typescript
// lib/tapTempo.ts

export class TapTempo {
  private tapTimes: number[] = [];
  private maxTaps: number = 4; // 平均を取るタップ数

  tap(): number | null {
    const now = Date.now();
    this.tapTimes.push(now);

    // 古いタップを削除（3秒以上前）
    this.tapTimes = this.tapTimes.filter(time => now - time < 3000);

    if (this.tapTimes.length < 2) {
      return null; // 最低2回必要
    }

    // BPM計算
    const intervals: number[] = [];
    for (let i = 1; i < this.tapTimes.length; i++) {
      intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
    }

    const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    const bpm = Math.round(60000 / averageInterval);

    return bpm;
  }

  reset() {
    this.tapTimes = [];
  }
}
```

---

## 4. アニメーション設計

### 4.1 振り子アニメーション

```typescript
// components/PendulumAnimation.tsx
import { motion } from 'framer-motion';

export function PendulumAnimation({ bpm, isPlaying }: Props) {
  const swingDuration = 60 / bpm; // 1拍の長さ（秒）

  return (
    <div className="relative h-64 flex justify-center">
      {/* 支点 */}
      <div className="absolute top-0 w-4 h-4 bg-gray-800 rounded-full" />

      {/* 振り子 */}
      <motion.div
        className="absolute top-2 origin-top"
        animate={
          isPlaying
            ? {
                rotate: [-30, 30, -30],
              }
            : { rotate: 0 }
        }
        transition={{
          duration: swingDuration,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* 棒 */}
        <div className="w-1 h-48 bg-gray-700" />
        {/* おもり */}
        <div className="w-8 h-8 bg-blue-500 rounded-full -ml-4" />
      </motion.div>
    </div>
  );
}
```

### 4.2 ビートインジケーター（点滅）

```typescript
// components/BeatIndicator.tsx
export function BeatIndicator({ currentBeat, totalBeats, isPlaying }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: totalBeats }).map((_, index) => (
        <motion.div
          key={index}
          className={`w-12 h-12 rounded-full ${
            index === 0 ? 'bg-orange-500' : 'bg-blue-500'
          }`}
          animate={{
            opacity: isPlaying && currentBeat === index ? 1 : 0.3,
            scale: isPlaying && currentBeat === index ? 1.2 : 1,
          }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  );
}
```

---

## 5. プリセット設計

### 5.1 プリセットデータ構造

```typescript
// lib/presets.ts

export interface MetronomePreset {
  id: string;
  name: string;
  bpm: number;
  timeSignature: TimeSignature;
  soundType: SoundType;
  subdivision: Subdivision;
  accentEnabled: boolean;
  isBuiltIn: boolean; // 組み込みプリセットかユーザー作成か
}

export const BUILT_IN_PRESETS: MetronomePreset[] = [
  {
    id: 'largo',
    name: 'Largo',
    bpm: 50,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    subdivision: 'quarter',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'adagio',
    name: 'Adagio',
    bpm: 70,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    subdivision: 'quarter',
    accentEnabled: true,
    isBuiltIn: true,
  },
  // ... 他のプリセット
  {
    id: 'rock',
    name: 'ロック',
    bpm: 130,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'drumstick',
    subdivision: 'eighth',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'jazz',
    name: 'ジャズ',
    bpm: 120,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'bell',
    subdivision: 'triplet',
    accentEnabled: false,
    isBuiltIn: true,
  },
];
```

---

## 6. Google AI Studio API統合

### 6.1 プロンプト設計

#### 6.1.1 リズムトレーニング提案
```
あなたはリズムトレーニングの専門家です。
現在のBPM ${bpm}、拍子 ${timeSignature} で練習している人に向けて、
効果的なリズムトレーニングメニューを150文字程度で提案してください。
段階的なテンポアップの方法も含めてください。
```

#### 6.1.2 ジャンル別BPM提案
```
あなたは音楽プロデューサーです。
${genre}（ジャンル）に適したBPMと、
そのジャンル特有のリズムパターンを100文字程度で提案してください。
```

---

## 7. データモデル設計

### 7.1 型定義

```typescript
// types/metronome.ts

export interface TimeSignature {
  beats: number;        // 分子（拍数）
  noteValue: number;    // 分母（音符の種類）
}

export type SoundType = 'classic' | 'digital' | 'drumstick' | 'bell' | 'synth';

export type Subdivision = 'quarter' | 'eighth' | 'sixteenth' | 'triplet';

export interface MetronomeConfig {
  bpm: number;
  timeSignature: TimeSignature;
  soundType: SoundType;
  accentEnabled: boolean;
  subdivision: Subdivision;
}

export interface MetronomeState extends MetronomeConfig {
  isPlaying: boolean;
  currentBeat: number;
}

export interface AIContent {
  rhythmTraining: string;      // リズムトレーニング提案
  genreBPM: string;            // ジャンル別BPM提案
  generatedAt: Date;
}
```

### 7.2 ローカルストレージ構造

```typescript
const STORAGE_KEYS = {
  API_KEY: 'metronome-app-api-key',
  LAST_CONFIG: 'metronome-last-config',
  PRESETS: 'metronome-presets',
};
```

---

## 8. PWA設定

### 8.1 manifest.json
```json
{
  "name": "メトロノーム",
  "short_name": "Metronome",
  "description": "シンプルで正確なメトロノームアプリ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 9. パフォーマンス最適化

### 9.1 音声最適化
- AudioContextの再利用
- スケジューリングの最適化（±5ms精度）
- 不要なノードの解放

### 9.2 アニメーション最適化
- requestAnimationFrame使用
- Framer Motionの最適化設定
- will-change CSS使用

---

## 10. テスト戦略

### 10.1 単体テスト
- メトロノームロジック（BPM精度）
- タップテンポ検出
- プリセット管理

### 10.2 統合テスト
- コンポーネント連携
- ローカルストレージ操作

### 10.3 E2Eテスト
- BPM設定 → 再生 → 停止の流れ
- タップテンポ検出
- AI生成フロー

---

## 11. 次ステップ

1. ✅ 技術設計書レビュー・承認
2. ⬜ 実装計画書作成（TDD準拠版）
3. ⬜ 開発環境セットアップ
4. ⬜ 実装開始（Claude Code on the Web）

---

**作成者**: クロ
**レビュー待ち**: あおいさん
