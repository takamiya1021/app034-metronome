# 📝 実装計画書（TDD準拠版）：No.34「メトロノーム」

**作成日**: 2025-01-13
**バージョン**: 1.0
**アプリ番号**: 34

---

## 実装方針

### TDD（テスト駆動開発）の適用
すべてのPhaseで **Red → Green → Refactor** サイクルを厳守します。

```
Red（失敗）: テストを先に書き、失敗することを確認
Green（成功）: テストを通す最小限のコードを実装
Refactor（改善）: テストが通った状態でコードを改善
```

### 実装の流れ
1. **Phase 0**: テスト環境構築
2. **Phase 1-7**: 機能実装（各Phase内でTDDサイクル）
3. **Phase 8**: 統合テスト・E2Eテスト・リファクタリング

---

## Phase 0: テスト環境構築（予定工数: 2時間）

### 0-1. Next.js 14プロジェクトセットアップ（Red）
【 】プロジェクト作成前のテスト失敗確認
```bash
npx create-next-app@14 app034-metronome --typescript --tailwind --app
cd app034-metronome
```

### 0-2. テストライブラリインストール（Green）
【 】Jest + React Testing Library設定
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
npm install --save-dev @testing-library/user-event
```

【 】Playwright E2Eテストセットアップ
```bash
npm install --save-dev @playwright/test
npx playwright install
```

【 】Jest設定ファイル作成
- `jest.config.js`
- `jest.setup.js`

### 0-3. Web Audio API用テストモック設定（Refactor）
【 】AudioContext モック実装
- `__mocks__/audioContext.ts` 作成
- Web Audio API全体のモック定義
- タイミング精度テスト用のモック

【 】テスト実行確認
```bash
npm run test
```

**完了条件**:
- ✅ テストが実行できる環境が整っている
- ✅ Web Audio APIのモックが正しく動作

---

## Phase 1: Web Audio APIエンジン実装（予定工数: 8時間）

### 1-1. AudioEngineテスト作成（Red）
【 】`lib/audioEngine.test.ts` 作成
- AudioContextの初期化テスト
- `playClick` メソッドの動作テスト
- アクセント音の周波数テスト（1000Hz vs 800Hz）
- 音量制御のテスト（アクセント1.0 vs 通常0.7）
- 音色切り替えテスト（classic, digital, drumstick, bell, synth）

**テスト例**:
```typescript
describe('AudioEngine', () => {
  it('should create AudioContext on initialization', () => {
    const engine = new AudioEngine();
    expect(engine.audioContext).toBeDefined();
  });

  it('should play accent click at 1000Hz', () => {
    const engine = new AudioEngine();
    const mockTime = 0;
    engine.playClick(mockTime, true);
    // モックを使って周波数が1000Hzであることを確認
  });
});
```

### 1-2. AudioEngine実装（Green）
【 】`lib/audioEngine.ts` 実装
- AudioContextの初期化
- GainNodeの作成と接続
- `playClick` メソッド実装
- `playCustomClick` メソッド実装
  - `playWoodClick` （クラシック音）
  - `playDigitalClick` （デジタル音）
  - `playDrumstickClick` （ドラムスティック）
  - `playBellClick` （ベル）
  - `playSynthClick` （シンセ）
- `resume` メソッド（自動再生ポリシー対応）
- `dispose` メソッド（クリーンアップ）

**完了条件**:
- ✅ すべてのテストがパス
- ✅ 各音色が正しい周波数・音量で再生される

### 1-3. AudioEngineリファクタリング（Refactor）
【 】コードの整理
- 音色生成ロジックの共通化
- マジックナンバーの定数化（周波数、音量、持続時間）
- エラーハンドリングの追加

【 】テスト再実行
```bash
npm run test -- lib/audioEngine.test.ts
```

**完了条件**:
- ✅ テストが引き続きすべてパス
- ✅ コードの可読性が向上

---

## Phase 2: メトロノームロジック実装（予定工数: 10時間）

### 2-1. Metronomeクラステスト作成（Red）
【 】`lib/metronome.test.ts` 作成
- Metronomeインスタンスの初期化テスト
- `start` / `stop` メソッドの動作テスト
- BPMに基づくタイミング精度テスト（±5ms以内）
- 拍子設定のテスト（2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, 12/8）
- アクセント（強拍）のテスト
- サブディビジョンのテスト（4分音符、8分音符、16分音符、3連符）
- スケジューラーのテスト

**テスト例**:
```typescript
describe('Metronome', () => {
  it('should initialize with default config', () => {
    const metronome = new Metronome({
      bpm: 120,
      timeSignature: { beats: 4, noteValue: 4 },
      soundType: 'classic',
      accentEnabled: true,
      subdivision: 'quarter',
    });
    expect(metronome.bpm).toBe(120);
  });

  it('should schedule beats with correct timing', () => {
    // タイミング精度のテスト（±5ms）
  });
});
```

### 2-2. Metronome実装（Green）
【 】`lib/metronome.ts` 実装
- Metronomeクラスの基本構造
- `start` メソッド（再生開始）
- `stop` メソッド（停止）
- `scheduler` メソッド（スケジューリングループ）
- `scheduleNote` メソッド（ノートのスケジューリング）
- `nextNote` メソッド（次の拍へ進む）
- `scheduleSubdivisions` メソッド（サブディビジョン処理）
- `getSubdivisionCount` メソッド（サブディビジョン数計算）
- BPM設定メソッド（`setBPM`）
- 拍子設定メソッド（`setTimeSignature`）
- 音色設定メソッド（`setSoundType`）
- アクセント設定メソッド（`setAccent`）
- サブディビジョン設定メソッド（`setSubdivision`）

**完了条件**:
- ✅ すべてのテストがパス
- ✅ タイミング精度が±5ms以内

### 2-3. Metronomeリファクタリング（Refactor）
【 】スケジューラーロジックの最適化
- lookahead時間の調整
- scheduleAheadTimeの最適化
- CPU使用率の削減

【 】テスト再実行
```bash
npm run test -- lib/metronome.test.ts
```

**完了条件**:
- ✅ テストが引き続きすべてパス
- ✅ パフォーマンスが向上

---

## Phase 3: タップテンポ機能実装（予定工数: 4時間）

### 3-1. TapTempoテスト作成（Red）
【 】`lib/tapTempo.test.ts` 作成
- タップ回数による動作テスト（2回未満 → null）
- BPM計算精度テスト（3回以上タップ）
- 古いタップの削除テスト（3秒以上前）
- リセット機能のテスト

**テスト例**:
```typescript
describe('TapTempo', () => {
  it('should return null for less than 2 taps', () => {
    const tapTempo = new TapTempo();
    tapTempo.tap();
    expect(tapTempo.tap()).toBeNull();
  });

  it('should calculate BPM from 3 taps', () => {
    const tapTempo = new TapTempo();
    // 120 BPMでタップをシミュレート（500ms間隔）
  });
});
```

### 3-2. TapTempo実装（Green）
【 】`lib/tapTempo.ts` 実装
- TapTempoクラスの基本構造
- `tap` メソッド（タップ記録 + BPM計算）
- `reset` メソッド（リセット）
- 古いタップの自動削除ロジック
- BPM平均計算ロジック

**完了条件**:
- ✅ すべてのテストがパス
- ✅ 3回以上のタップでBPMが正確に検出される

### 3-3. TapTempoリファクタリング（Refactor）
【 】コードの整理
- BPM計算ロジックの最適化
- マジックナンバーの定数化（3秒、最大タップ数）

【 】テスト再実行
```bash
npm run test -- lib/tapTempo.test.ts
```

**完了条件**:
- ✅ テストが引き続きすべてパス
- ✅ コードの可読性が向上

---

## Phase 4: プリセット機能実装（予定工数: 4時間）

### 4-1. プリセット管理テスト作成（Red）
【 】`lib/presets.test.ts` 作成
- 組み込みプリセットのテスト（Largo, Adagio, Andante, Moderato, Allegro, Presto, ロック, ジャズ, テクノ）
- ユーザープリセット追加のテスト
- プリセット削除のテスト
- プリセット読み込みのテスト

**テスト例**:
```typescript
describe('Presets', () => {
  it('should have built-in presets', () => {
    expect(BUILT_IN_PRESETS.length).toBeGreaterThan(0);
  });

  it('should add user preset', () => {
    const preset: MetronomePreset = {
      id: 'my-preset',
      name: 'My Preset',
      bpm: 140,
      timeSignature: { beats: 4, noteValue: 4 },
      soundType: 'digital',
      subdivision: 'eighth',
      accentEnabled: true,
      isBuiltIn: false,
    };
    // プリセット追加のテスト
  });
});
```

### 4-2. プリセット実装（Green）
【 】`lib/presets.ts` 実装
- `MetronomePreset` インターフェース定義
- `BUILT_IN_PRESETS` 定数（9種類のプリセット）
- プリセット管理関数
  - `addUserPreset` （ユーザープリセット追加）
  - `deleteUserPreset` （削除）
  - `loadPreset` （読み込み）
  - `getAllPresets` （全プリセット取得）

**完了条件**:
- ✅ すべてのテストがパス
- ✅ 組み込みプリセットが9種類定義されている
- ✅ ユーザープリセットの追加・削除が正しく動作

### 4-3. プリセットリファクタリング（Refactor）
【 】コードの整理
- プリセットデータの最適化
- プリセット管理ロジックの改善

【 】テスト再実行
```bash
npm run test -- lib/presets.test.ts
```

**完了条件**:
- ✅ テストが引き続きすべてパス
- ✅ コードの可読性が向上

---

## Phase 5: UIコンポーネント実装（予定工数: 12時間）

### 5-1. コンポーネントテスト作成（Red）

【 】`components/TempoSlider.test.tsx` 作成
- スライダーの初期値テスト
- 値変更時のコールバックテスト
- 範囲制限テスト（40〜240 BPM）

【 】`components/TapTempo.test.tsx` 作成
- ボタンクリック時の動作テスト
- BPM検出後の値反映テスト

【 】`components/TimeSignature.test.tsx` 作成
- 拍子選択のテスト（8種類）
- 選択変更時のコールバックテスト

【 】`components/SoundSelector.test.tsx` 作成
- 音色選択のテスト（5種類）
- 選択変更時のコールバックテスト

【 】`components/AccentToggle.test.tsx` 作成
- トグル状態のテスト（ON/OFF）

【 】`components/SubdivisionSelector.test.tsx` 作成
- サブディビジョン選択のテスト（4種類）

【 】`components/PendulumAnimation.test.tsx` 作成
- アニメーションの動作テスト
- BPMに応じた速度変化のテスト

【 】`components/BeatIndicator.test.tsx` 作成
- ビート表示のテスト
- アクティブビートのハイライトテスト

【 】`components/MetronomeControls.test.tsx` 作成
- 再生/停止ボタンのテスト
- 状態変化のテスト

【 】`components/PresetManager.test.tsx` 作成
- プリセット一覧表示のテスト
- プリセット選択のテスト
- 新規プリセット作成のテスト

### 5-2. コンポーネント実装（Green）

【 】`components/TempoSlider.tsx` 実装
- スライダーUI
- BPM表示
- 数値入力フィールド

【 】`components/TapTempo.tsx` 実装
- タップボタンUI
- タップ回数表示
- BPM検出表示

【 】`components/TimeSignature.tsx` 実装
- 拍子選択ドロップダウン
- 8種類の拍子オプション

【 】`components/SoundSelector.tsx` 実装
- 音色選択ドロップダウン
- 5種類の音色オプション

【 】`components/AccentToggle.tsx` 実装
- チェックボックスUI
- アクセントON/OFF切り替え

【 】`components/SubdivisionSelector.tsx` 実装
- サブディビジョン選択ドロップダウン
- 4種類のオプション（4分音符、8分音符、16分音符、3連符）

【 】`components/PendulumAnimation.tsx` 実装
- Framer Motionによる振り子アニメーション
- BPMに連動した速度調整
- 再生/停止状態の反映

【 】`components/BeatIndicator.tsx` 実装
- ビートインジケーター（円形）
- 強拍の色分け（オレンジ vs 青）
- アクティブビートのハイライト

【 】`components/MetronomeControls.tsx` 実装
- 再生/停止ボタン
- アイコン表示（▶ / ⏸）

【 】`components/PresetManager.tsx` 実装
- プリセット一覧表示
- プリセット選択ボタン
- 新規プリセット作成ダイアログ

**完了条件**:
- ✅ すべてのコンポーネントテストがパス
- ✅ UIが要件通りに動作

### 5-3. UIコンポーネントリファクタリング（Refactor）

【 】共通スタイルの抽出
- ボタンスタイルの統一
- カラーパレットの定数化

【 】コンポーネント間の重複コード削除

【 】アクセシビリティの改善
- ARIA属性の追加
- キーボード操作対応

【 】テスト再実行
```bash
npm run test -- components/
```

**完了条件**:
- ✅ テストが引き続きすべてパス
- ✅ コードの保守性が向上
- ✅ アクセシビリティが改善

---

## Phase 6: カスタムフック実装（予定工数: 6時間）

### 6-1. カスタムフックテスト作成（Red）

【 】`hooks/useMetronome.test.ts` 作成
- メトロノームの初期化テスト
- start/stop機能のテスト
- BPM変更のテスト
- 拍子変更のテスト

【 】`hooks/useAudioEngine.test.ts` 作成
- AudioEngineの初期化テスト
- クリーンアップのテスト

【 】`hooks/useTapTempo.test.ts` 作成
- タップ機能のテスト
- BPM検出のテスト
- リセット機能のテスト

### 6-2. カスタムフック実装（Green）

【 】`hooks/useMetronome.ts` 実装
- Metronomeインスタンスの管理
- start/stop/pause機能
- 設定変更のハンドラー
- 現在のビート状態の管理

【 】`hooks/useAudioEngine.ts` 実装
- AudioEngineインスタンスの管理
- クリーンアップ処理（useEffect）

【 】`hooks/useTapTempo.ts` 実装
- TapTempoインスタンスの管理
- タップハンドラー
- BPM検出結果の状態管理

**完了条件**:
- ✅ すべてのフックテストがパス
- ✅ フックが正しく動作

### 6-3. カスタムフックリファクタリング（Refactor）

【 】フック間の依存関係の最適化
【 】メモリリークの防止（クリーンアップ）
【 】パフォーマンスの最適化（useMemo, useCallback）

【 】テスト再実行
```bash
npm run test -- hooks/
```

**完了条件**:
- ✅ テストが引き続きすべてパス
- ✅ パフォーマンスが向上

---

## Phase 7: AI統合とローカルストレージ（予定工数: 6時間）

### 7-1. AI統合・ストレージテスト作成（Red）

【 】`lib/aiService.test.ts` 作成
- Google AI API呼び出しテスト
- リズムトレーニング提案生成テスト
- ジャンル別BPM提案生成テスト
- エラーハンドリングテスト

【 】`lib/storage.test.ts` 作成
- APIキー保存・読み込みテスト
- 最後の設定保存・読み込みテスト
- プリセット保存・読み込みテスト

【 】`hooks/useAIGeneration.test.ts` 作成
- AI生成トリガーのテスト
- ローディング状態のテスト
- エラー状態のテスト

【 】`components/AIContentSection.test.tsx` 作成
- AI生成コンテンツ表示のテスト
- ローディング表示のテスト

【 】`components/GenerateButton.test.tsx` 作成
- ボタンクリック時の動作テスト
- APIキー未設定時の動作テスト

### 7-2. AI統合・ストレージ実装（Green）

【 】`lib/aiService.ts` 実装（31〜33番と共通パターン）
- Google AI API統合
- `generateRhythmTraining` 関数（リズムトレーニング提案）
- `generateGenreBPM` 関数（ジャンル別BPM提案）
- エラーハンドリング

【 】`lib/storage.ts` 実装（31〜33番と共通パターン）
- ローカルストレージのラッパー関数
- `saveAPIKey` / `loadAPIKey`
- `saveLastConfig` / `loadLastConfig`
- `savePresets` / `loadPresets`

【 】`hooks/useAIGeneration.ts` 実装（31〜33番と共通パターン）
- AI生成処理のカスタムフック
- ローディング・エラー状態管理
- 生成結果の状態管理

【 】`components/AIContentSection.tsx` 実装
- AI生成コンテンツ表示UI
- ローディング表示
- エラー表示

【 】`components/GenerateButton.tsx` 実装
- AI生成ボタンUI
- APIキー未設定時の警告表示

**完了条件**:
- ✅ すべてのテストがパス
- ✅ AI生成が正しく動作
- ✅ ローカルストレージが正しく動作

### 7-3. AI統合・ストレージリファクタリング（Refactor）

【 】AIプロンプトの最適化
【 】エラーメッセージの改善
【 】ローディングUXの改善

【 】テスト再実行
```bash
npm run test -- lib/aiService.test.ts lib/storage.test.ts
npm run test -- hooks/useAIGeneration.test.ts
npm run test -- components/AIContentSection.test.tsx components/GenerateButton.test.tsx
```

**完了条件**:
- ✅ テストが引き続きすべてパス
- ✅ UXが改善

---

## Phase 8: 統合テスト・PWA対応・リファクタリング（予定工数: 8時間）

### 8-1. E2Eテスト作成（Red）

【 】`e2e/metronome-basic.spec.ts` 作成
- メトロノーム基本動作
  - BPM設定 → 再生 → 停止の流れ
  - スライダーによるBPM変更
  - 数値入力によるBPM変更
- 拍子変更
  - 8種類の拍子すべてのテスト
- 音色変更
  - 5種類の音色すべてのテスト
- アクセントON/OFF
- サブディビジョン変更

【 】`e2e/tap-tempo.spec.ts` 作成
- タップテンポ機能
  - 3回以上タップでBPM検出
  - 検出したBPMが自動設定される
  - リセット機能

【 】`e2e/presets.spec.ts` 作成
- プリセット機能
  - 組み込みプリセットの読み込み
  - ユーザープリセットの作成
  - ユーザープリセットの削除
  - プリセット適用時の設定反映

【 】`e2e/ai-generation.spec.ts` 作成
- AI生成機能
  - リズムトレーニング提案生成
  - ジャンル別BPM提案生成
  - APIキー未設定時のエラー表示
  - ローディング表示

【 】`e2e/storage.spec.ts` 作成
- ローカルストレージ
  - 最後の設定の保存・復元
  - ページリロード後の設定維持

### 8-2. E2Eテスト実装（Green）

【 】Playwrightテスト実装
- 各テストシナリオの実装
- スクリーンショット撮影
- タイミング精度の検証（可能な範囲で）

【 】E2Eテスト実行
```bash
npx playwright test
```

**完了条件**:
- ✅ すべてのE2Eテストがパス
- ✅ 主要なユーザーフローが正しく動作

### 8-3. E2Eテストのリファクタリング（Refactor）

【 】テストコードの重複削除
- 共通セットアップの抽出
- 共通アサーションの関数化

【 】Page Objectパターンの適用
- `pages/MetronomePage.ts` 作成
- ページ操作のカプセル化
- セレクタの一元管理

【 】ヘルパー関数の抽出
- `helpers/metronome.ts` 作成
- 繰り返し処理の関数化
- 待機処理の共通化

【 】テスト可読性の向上
- テスト名の改善
- コメントの追加
- Given-When-Then形式の適用

【 】E2Eテスト再実行
```bash
npx playwright test
```

**完了条件**:
- ✅ テストが引き続きすべてパス
- ✅ テストコードの保守性が向上
- ✅ 新しいテストの追加が容易になった

### 8-4. PWA対応（Refactor）

【 】next-pwaインストール・設定
```bash
npm install next-pwa
```

【 】`next.config.js` 設定
- Service Worker有効化
- オフライン対応設定

【 】`manifest.json` 作成
- アプリ名、説明
- アイコン設定
- テーマカラー

【 】アイコン画像作成
- 192x192, 512x512サイズ

【 】PWA動作確認
- インストール可能性
- オフライン動作（メトロノーム機能）

**完了条件**:
- ✅ PWAとしてインストール可能
- ✅ メトロノーム機能がオフラインで動作

### 8-5. パフォーマンス最適化（Refactor）

【 】音声タイミング精度の最適化
- スケジューリング時間の調整
- lookahead値の最適化

【 】アニメーションの最適化
- requestAnimationFrame使用確認
- will-change CSS適用

【 】バンドルサイズの最適化
- 不要なインポート削除
- コード分割（dynamic import）

【 】パフォーマンス測定
```bash
npm run build
npm run start
# Lighthouse実行
```

**完了条件**:
- ✅ タイミング精度が±5ms以内
- ✅ アニメーションが60fps維持
- ✅ Lighthouseスコア90以上

### 8-6. コードレビュー・最終リファクタリング（Refactor）

【 】全体コードレビュー
- 命名規則の統一
- コメントの追加・修正
- 型定義の最適化

【 】デザイン仕様の最終確認
- 色使い（ダークグレー・ブラック、青・緑系、オレンジ・赤系）
- アニメーションの滑らかさ
- レスポンシブデザイン

【 】アクセシビリティ最終確認
- ARIA属性の完全性
- キーボード操作の網羅性
- スクリーンリーダー対応

【 】全テスト実行
```bash
npm run test
npm run test:e2e
```

**完了条件**:
- ✅ すべてのテストがパス
- ✅ コードカバレッジ80%以上
- ✅ デザイン要件を満たしている
- ✅ アクセシビリティ基準を満たしている

### 8-7. ドキュメント整備（完了）

【 】README.md作成
- アプリ概要
- 機能一覧
- インストール手順
- 使い方
- 開発方法

【 】コードコメント最終確認
- 複雑なロジックの説明
- Web Audio APIの使い方の説明

【 】デプロイ手順書作成（該当する場合）

**完了条件**:
- ✅ ドキュメントが完全
- ✅ 第三者が理解できる内容

---

## 全体の完了条件

### 機能面
- ✅ BPM 40〜240の範囲で設定可能
- ✅ 8種類の拍子すべてに対応
- ✅ 5種類の音色すべてが正しく動作
- ✅ タップテンポが正確に動作（3回以上タップでBPM検出）
- ✅ アクセント（強拍）が正しく動作
- ✅ サブディビジョン（4種類）が正しく動作
- ✅ 振り子アニメーションがBPMに連動
- ✅ ビートインジケーターが正確に動作
- ✅ プリセット機能（組み込み9種類 + ユーザー作成）が動作
- ✅ AI生成機能（リズムトレーニング、ジャンル別BPM）が動作
- ✅ ローカルストレージが正しく動作

### 品質面
- ✅ すべてのユニットテストがパス
- ✅ すべてのE2Eテストがパス
- ✅ コードカバレッジ80%以上
- ✅ タイミング精度±5ms以内
- ✅ PWAとしてインストール可能
- ✅ メトロノーム機能がオフラインで動作
- ✅ Lighthouseスコア90以上

### ドキュメント面
- ✅ README.mdが完全
- ✅ コードコメントが適切
- ✅ 要件定義書との整合性確認
- ✅ 技術設計書との整合性確認

---

## リスク管理

### 技術リスク

| リスク | 対策 | 担当Phase |
|--------|------|-----------|
| Web Audio APIのブラウザ互換性 | 複数ブラウザでテスト、ポリフィル検討 | Phase 1, 8 |
| タイミング精度の確保（±5ms） | スケジューリング最適化、高精度タイマー使用 | Phase 2, 8 |
| バックグラウンド動作の制限 | PWA Service Worker活用、フォアグラウンド維持 | Phase 8 |
| AI生成の遅延 | ローディング表示、タイムアウト設定 | Phase 7 |

### スケジュールリスク

| リスク | 対策 | 担当Phase |
|--------|------|-----------|
| Web Audio APIの学習コスト | 事前調査、公式ドキュメント参照 | Phase 1 |
| タイミング精度調整の時間 | Phase 2に十分な時間確保 | Phase 2 |
| E2Eテストの複雑性 | Page Objectパターン適用、段階的実装 | Phase 8 |

---

## 参考資料

### Web Audio API
- [MDN Web Audio API](https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API)
- [Web Audio API Timing](https://www.html5rocks.com/en/tutorials/audio/scheduling/)

### TDD
- [Jest公式ドキュメント](https://jestjs.io/ja/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)

### Next.js 14
- [Next.js App Router](https://nextjs.org/docs/app)
- [next-pwa](https://www.npmjs.com/package/next-pwa)

---

**作成者**: クロ
**レビュー待ち**: あおいさん
**次ステップ**: 実装開始
