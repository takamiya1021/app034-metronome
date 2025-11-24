'use client';

import { useState, useEffect, useCallback } from 'react';
import { Metronome } from '@/lib/metronome';
import { TapTempo } from '@/lib/tapTempo';
import { BUILT_IN_PRESETS } from '@/lib/presets';
import { loadLastConfig, saveLastConfig, loadAPIKey, saveAPIKey } from '@/lib/storage';
import { generateRhythmTraining, generateGenreBPM } from '@/lib/aiService';
import type { MetronomeConfig, SoundType, Subdivision, TimeSignature } from '@/types/metronome';

// Available options
const TIME_SIGNATURES: { label: string; value: TimeSignature }[] = [
  { label: '2/4', value: { beats: 2, noteValue: 4 } },
  { label: '3/4', value: { beats: 3, noteValue: 4 } },
  { label: '4/4', value: { beats: 4, noteValue: 4 } },
  { label: '5/4', value: { beats: 5, noteValue: 4 } },
  { label: '6/8', value: { beats: 6, noteValue: 8 } },
  { label: '7/8', value: { beats: 7, noteValue: 8 } },
  { label: '9/8', value: { beats: 9, noteValue: 8 } },
  { label: '12/8', value: { beats: 12, noteValue: 8 } },
];

const SOUND_TYPES: { label: string; value: SoundType }[] = [
  { label: 'クラシック', value: 'classic' },
  { label: 'デジタル', value: 'digital' },
  { label: 'ドラムスティック', value: 'drumstick' },
  { label: 'ベル', value: 'bell' },
  { label: 'シンセ', value: 'synth' },
];

const SUBDIVISIONS: { label: string; value: Subdivision }[] = [
  { label: '4分音符', value: 'quarter' },
  { label: '8分音符', value: 'eighth' },
  { label: '16分音符', value: 'sixteenth' },
  { label: '3連符', value: 'triplet' },
];

export default function Home() {
  // Load initial config
  const getInitialConfig = (): MetronomeConfig => {
    const saved = loadLastConfig();
    return saved || {
      bpm: 120,
      timeSignature: { beats: 4, noteValue: 4 },
      soundType: 'classic',
      accentEnabled: true,
      subdivision: 'quarter',
    };
  };

  const [config, setConfig] = useState<MetronomeConfig>(getInitialConfig);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [metronome, setMetronome] = useState<Metronome | null>(null);
  const [tapTempo] = useState(() => new TapTempo());
  const [volume, setVolume] = useState(1.0); // Default volume 100%
  const [apiKey, setApiKey] = useState('');
  const [aiContent, setAiContent] = useState({ rhythm: '', genre: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize metronome
  useEffect(() => {
    const m = new Metronome(config);
    setMetronome(m);

    // Load API key
    const savedApiKey = loadAPIKey();
    if (savedApiKey) setApiKey(savedApiKey);

    return () => {
      m.stop();
      m.dispose();
    };
  }, []);

  // Update config when changed
  useEffect(() => {
    if (metronome) {
      metronome.setBPM(config.bpm);
      metronome.setTimeSignature(config.timeSignature);
      metronome.setSoundType(config.soundType);
      metronome.setAccent(config.accentEnabled);
      metronome.setSubdivision(config.subdivision);
      saveLastConfig(config);
    }
  }, [config, metronome]);

  // Update volume when changed
  useEffect(() => {
    if (metronome) {
      metronome.setVolume(volume);
    }
  }, [volume, metronome]);

  // Track current beat
  useEffect(() => {
    if (!isPlaying || !metronome) return;

    const interval = setInterval(() => {
      setCurrentBeat(metronome.getCurrentBeat());
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, metronome]);

  const handlePlayStop = () => {
    if (!metronome) return;

    if (isPlaying) {
      metronome.stop();
      setIsPlaying(false);
    } else {
      metronome.start();
      setIsPlaying(true);
    }
  };

  const handleTapTempo = () => {
    const bpm = tapTempo.tap();
    if (bpm) {
      setConfig((prev) => ({ ...prev, bpm }));
    }
  };

  const handlePresetClick = (presetId: string) => {
    const preset = BUILT_IN_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setConfig({
        bpm: preset.bpm,
        timeSignature: preset.timeSignature,
        soundType: preset.soundType,
        accentEnabled: preset.accentEnabled,
        subdivision: preset.subdivision,
      });
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const [rhythm, genre] = await Promise.all([
        generateRhythmTraining({
          apiKey,
          bpm: config.bpm,
          timeSignature: `${config.timeSignature.beats}/${config.timeSignature.noteValue}`,
          soundType: config.soundType,
          subdivision: config.subdivision,
        }),
        generateGenreBPM({
          apiKey,
          bpm: config.bpm,
          timeSignature: `${config.timeSignature.beats}/${config.timeSignature.noteValue}`,
          soundType: config.soundType,
          subdivision: config.subdivision,
        }),
      ]);

      setAiContent({ rhythm, genre });
    } catch (error) {
      alert('AI生成に失敗しました。APIキーを確認してください。');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    saveAPIKey(value); // Auto-save on change
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8">🎵 メトロノーム</h1>

        {/* BPM Display and Pendulum Area */}
        <div className="bg-gray-800 rounded-lg p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* BPM Display */}
            <div className="text-center">
              <div className="text-7xl font-bold mb-2">{config.bpm}</div>
              <div className="text-gray-400 text-xl">BPM</div>
            </div>

            {/* Visual Metronome Pendulum */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Base */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-gradient-to-b from-amber-700 to-amber-900 rounded-sm"></div>

                {/* Scale marks */}
                <div className="absolute top-8 left-4 w-1 h-12 bg-gray-600 -rotate-45 origin-bottom"></div>
                <div className="absolute top-8 right-4 w-1 h-12 bg-gray-600 rotate-45 origin-bottom"></div>

                {/* Pendulum rod */}
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 origin-bottom transition-transform duration-200 ease-in-out"
                  style={{
                    transform: `translateX(-50%) rotate(${isPlaying
                      ? (currentBeat % 2 === 0 ? -30 : 30)
                      : 0
                      }deg)`,
                    transitionDuration: isPlaying ? `${60 / config.bpm}s` : '0.2s',
                  }}
                >
                  <div className="w-2 h-32 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full"></div>
                  {/* Pendulum weight */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-12 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-full"></div>
                </div>

                {/* Center pivot */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full z-10"></div>
              </div>
            </div>
          </div>

          {/* BPM Slider */}
          <div className="mb-4">
            <input
              type="range"
              min="40"
              max="240"
              value={config.bpm}
              onChange={(e) => setConfig({ ...config, bpm: Number(e.target.value) })}
              className="w-full h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>40</span>
              <span>240</span>
            </div>
          </div>

          {/* BPM Input and Tap Tempo */}
          <div className="flex gap-4 mb-4">
            <input
              type="number"
              min="40"
              max="240"
              value={config.bpm}
              onChange={(e) => setConfig({ ...config, bpm: Number(e.target.value) })}
              className="flex-1 bg-gray-700 rounded px-4 py-2 text-center"
              placeholder="BPM値"
            />
            <button
              onClick={handleTapTempo}
              disabled={isPlaying}
              className={`px-6 py-2 rounded font-semibold transition-colors ${isPlaying
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              title={isPlaying ? 'メトロノーム停止中のみ使用可能' : 'タップしてBPMを検出'}
            >
              Tap Tempo
            </button>
          </div>

          {/* Beat Indicator */}
          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: config.timeSignature.beats }).map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-full transition-all ${i === 0 ? 'bg-orange-500' : 'bg-blue-500'
                  } ${isPlaying && currentBeat === i ? 'opacity-100 scale-110' : 'opacity-30 scale-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          {/* Volume Control */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">音量: {Math.round(volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Time Signature */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">拍子</label>
              <select
                value={`${config.timeSignature.beats}/${config.timeSignature.noteValue}`}
                onChange={(e) => {
                  const sig = TIME_SIGNATURES.find((s) => `${s.value.beats}/${s.value.noteValue}` === e.target.value);
                  if (sig) setConfig({ ...config, timeSignature: sig.value });
                }}
                className="w-full bg-gray-700 rounded px-4 py-2"
              >
                {TIME_SIGNATURES.map((sig) => (
                  <option key={sig.label} value={`${sig.value.beats}/${sig.value.noteValue}`}>
                    {sig.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">音色</label>
              <select
                value={config.soundType}
                onChange={(e) => setConfig({ ...config, soundType: e.target.value as SoundType })}
                className="w-full bg-gray-700 rounded px-4 py-2"
              >
                {SOUND_TYPES.map((sound) => (
                  <option key={sound.value} value={sound.value}>
                    {sound.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            {/* Accent Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.accentEnabled}
                onChange={(e) => setConfig({ ...config, accentEnabled: e.target.checked })}
                className="w-5 h-5"
              />
              <span>アクセント</span>
            </label>

            {/* Subdivision */}
            <div className="flex-1">
              <select
                value={config.subdivision}
                onChange={(e) => setConfig({ ...config, subdivision: e.target.value as Subdivision })}
                className="w-full bg-gray-700 rounded px-4 py-2"
              >
                {SUBDIVISIONS.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Play/Stop Button */}
          <button
            onClick={handlePlayStop}
            className={`w-full py-4 rounded-full text-xl font-bold transition-colors ${isPlaying
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {isPlaying ? '⏸ 停止' : '▶ 再生'}
          </button>
        </div>

        {/* Presets */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">プリセット</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {BUILT_IN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset.id)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* AI Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">✨ AI提案</h2>

          {/* Warning if API key is not set */}
          {!apiKey && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 rounded px-4 py-3 mb-4">
              <p className="text-sm">
                ⚠️ APIキーを設定していない場合、提案はデフォルトの内容です
              </p>
            </div>
          )}

          {/* API Key Input */}
          <div className="mb-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Google AI Studio APIキー（自動保存）"
              className="w-full bg-gray-700 rounded px-4 py-2"
            />
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded font-semibold mb-4"
          >
            {isGenerating ? '生成中...' : 'AI提案を生成'}
          </button>

          {/* AI Content */}
          {(aiContent.rhythm || aiContent.genre) && (
            <div className="space-y-4">
              {aiContent.rhythm && (
                <div className="bg-gray-700 rounded p-4">
                  <h3 className="font-semibold mb-2">🎯 リズムトレーニング</h3>
                  <p className="text-sm text-gray-300">{aiContent.rhythm}</p>
                </div>
              )}
              {aiContent.genre && (
                <div className="bg-gray-700 rounded p-4">
                  <h3 className="font-semibold mb-2">🎼 ジャンル別BPM提案</h3>
                  <p className="text-sm text-gray-300">{aiContent.genre}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
