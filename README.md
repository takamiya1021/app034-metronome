# 🎵 メトロノーム (App 34)

シンプルで正確なメトロノームアプリ。TDD（テスト駆動開発）で実装された、Web Audio APIを使用した高精度なメトロノームです。

## 🌟 機能

### コア機能
- **BPM設定**: 40〜240 BPMの範囲で1 BPM刻みで設定可能
- **8種類の拍子**: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, 12/8
- **5種類の音色**: クラシック、デジタル、ドラムスティック、ベル、シンセ
- **タップテンポ**: タップしてBPMを自動検出
- **アクセント**: 強拍（1拍目）の強調ON/OFF
- **サブディビジョン**: 4分音符、8分音符、16分音符、3連符

### 高度な機能
- **9種類のプリセット**: Largo、Adagio、Andante、Moderato、Allegro、Presto、ロック、ジャズ、テクノ
- **ビートインジケーター**: 視覚的なリズム表示
- **ローカルストレージ**: 最後の設定を自動保存
- **AI提案機能**: Google AI Studio APIを使用したリズムトレーニング提案とジャンル別BPM提案

## 🚀 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS
- **音声処理**: Web Audio API
- **AI統合**: Google AI Studio API (Gemini)
- **テスト**: Jest + React Testing Library + Playwright
- **開発手法**: TDD (Test-Driven Development)

## 📦 インストール

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ブラウザで開く
# http://localhost:3000
```

## 🧪 テスト

```bash
# ユニットテストを実行
npm test

# テストをウォッチモードで実行
npm run test:watch

# E2Eテストを実行（開発サーバーが起動している必要があります）
npm run test:e2e
```

## 🏗️ ビルド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバーを起動
npm run start
```

## 📝 使い方

### 基本的な使い方

1. **BPMを設定**: スライダーまたは数値入力でBPMを設定
2. **拍子を選択**: ドロップダウンから拍子を選択
3. **音色を選択**: お好みの音色を選択
4. **再生ボタンをクリック**: メトロノームが開始されます

### タップテンポの使い方

1. 「Tap Tempo」ボタンを2回以上タップ
2. タップの間隔から自動的にBPMが計算されます
3. 計算されたBPMが自動的に設定されます

### プリセットの使い方

1. プリセットボタンをクリック
2. そのプリセットの設定（BPM、拍子、音色など）が自動的に適用されます

### AI提案機能の使い方

1. Google AI Studio APIキーを入力して保存
2. 「AI提案を生成」ボタンをクリック
3. 現在の設定に基づいたリズムトレーニング提案とジャンル別BPM提案が生成されます

## 🎯 TDD実装

このプロジェクトはTDD（テスト駆動開発）で実装されています：

- **Phase 0**: テスト環境構築
- **Phase 1**: AudioEngine実装（Web Audio API）
- **Phase 2**: Metronomeロジック実装
- **Phase 3**: TapTempo機能実装
- **Phase 4**: Presets機能実装
- **Phase 5**: Storage & AI統合
- **Phase 6**: UIコンポーネント実装
- **Phase 7**: 統合テスト & 最終調整

各Phaseで **Red → Green → Refactor** サイクルを実施しています。

## 📊 テストカバレッジ

```bash
npm test -- --coverage
```

- AudioEngine: 100%カバレッジ
- Metronome: 100%カバレッジ
- TapTempo: 100%カバレッジ
- Presets: 100%カバレッジ

## 🔧 技術的な特徴

### Web Audio API
- 高精度タイミング制御（±5ms以内）
- AudioContextを使用したスケジューリング
- 複数の音色生成（Oscillator使用）

### パフォーマンス最適化
- スケジューラーの最適化
- 効率的なステート管理
- メモリリークの防止

## 📱 PWA対応（今後の拡張）

- オフライン動作
- インストール可能
- レスポンシブデザイン

## 🤝 コントリビューション

このプロジェクトはApp 34として開発されています。

## 📄 ライセンス

MIT License

## 🙏 謝辞

- Web Audio API: MDN Web Docs
- Next.js: Vercel
- Google AI Studio: Google

---

**作成者**: Claude (AI)
**プロジェクト番号**: App 34
**開発日**: 2025-01-13
