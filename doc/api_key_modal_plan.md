# APIキー設定モーダル化 実装計画

## 📝 概要
現在、APIキー入力フィールドが常時表示されているため、一度設定したら邪魔になる。
モーダル式に変更して、必要な時だけ設定画面を開けるようにする。

## 🎯 目標
- APIキー設定をモーダル化
- 設定ボタンを追加（歯車アイコン等）
- モーダル内でAPIキー設定・保存
- 設定済みの場合は簡潔に表示

## 🎨 UI設計

### モーダルを開くボタン
- **配置**: AI提案セクションのタイトル横に歯車アイコン⚙️ボタン
- **スタイル**: 小さめのアイコンボタン、hover時に回転アニメーション

### モーダルUI
- **背景**: 半透明のオーバーレイ（backdrop）
- **コンテンツ**:
  - タイトル「API設定」
  - APIキー入力フィールド（password type）
  - 現在の状態表示（設定済み/未設定）
  - 保存ボタン
  - 閉じるボタン（×）
- **アニメーション**: フェードイン、スケールアップ（Framer Motion使用）

### APIキー状態表示
- **未設定時**: 警告メッセージ表示 + 設定ボタン強調
- **設定済み時**: ✓ マーク表示のみ

## 🔧 実装の詳細

### 変更ファイル
- [app/page.tsx](file:///home/ustar-wsl-2-2/projects/100apps/app034-metronome/app/page.tsx) - モーダル追加、UI変更

### 実装内容

#### 1. State追加
```typescript
const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
```

#### 2. モーダルコンポーネント
```typescript
{isSettingsModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
    >
      {/* モーダル内容 */}
    </motion.div>
  </div>
)}
```

#### 3. 設定ボタン（AI提案セクションヘッダー）
```typescript
<div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-semibold">✨ AI提案</h2>
  <button
    onClick={() => setIsSettingsModalOpen(true)}
    className="text-gray-400 hover:text-white transition-colors"
  >
    ⚙️
  </button>
</div>
```

#### 4. APIキー状態表示
```typescript
{apiKey ? (
  <div className="text-green-400 text-sm mb-2">
    ✓ APIキー設定済み
  </div>
) : (
  <div className="bg-red-900/30 border border-red-500 text-red-200 rounded px-4 py-3 mb-4">
    <p className="text-sm">
      ⚠️ APIキーを設定していない場合、提案はデフォルトの内容です
    </p>
  </div>
)}
```

## ✅ 検証計画

1. **モーダル開閉動作**: 設定ボタンクリックでモーダルが開く/閉じる
2. **APIキー保存**: モーダル内でAPIキーを入力・保存し、localStorageに保存される
3. **状態表示**: APIキー設定済み/未設定の表示が正しく切り替わる
4. **レスポンシブ**: モバイル・タブレットでも正しく表示される
5. **アニメーション**: スムーズなフェードイン・アウト

## 🎭 デザイン要件

- **美しいモーダル**: グラスモーフィズム風のデザイン
- **スムーズなアニメーション**: Framer Motionで滑らかな動き
- **アクセシビリティ**: Escキーで閉じる、背景クリックで閉じる
- **premium感**: 高級感のあるデザイン
