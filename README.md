# FlexForm

ノーコードでフォームを作成し、回答を収集・管理できるWebアプリケーション。

## 特徴

- 🚀 **ノーコード**: ドラッグ&ドロップでフォーム作成
- 📊 **リアルタイム**: 回答の即座収集・管理
- 🎨 **カスタマイズ**: 柔軟なフィールド設定
- 📱 **レスポンシブ**: すべてのデバイスに対応
- 🔒 **バリデーション**: JSON Schemaベースの検証

## 技術スタック

- **フロントエンド**: Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS
- **バックエンド**: Nuxt Nitro Server Routes
- **データベース**: PostgreSQL + Prisma ORM
- **バリデーション**: Ajv (JSON Schema)
- **通知**: Nodemailer (メール)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の設定を追加：

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flexform?schema=public"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# SMTP Settings for email notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Base URL for the application
BASE_URL="http://localhost:3000"
```

### 3. データベースのセットアップ

PostgreSQLデータベースを作成し、マイグレーションを実行：

```bash
# Prismaクライアント生成
npm run db:generate

# データベースにスキーマを適用
npm run db:push

# または、マイグレーションファイルを作成して実行
npm run db:migrate
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で利用できます。

## データベース管理

```bash
# Prisma Studioの起動（データベースGUI）
npm run db:studio

# データベーススキーマの更新
npm run db:push

# マイグレーションの作成・実行
npm run db:migrate
```

## プロジェクト構造

```
FlexForm/
├── pages/                 # Nuxtページ
│   ├── index.vue         # フォーム一覧
│   ├── f/[path].vue      # 公開フォーム表示
│   └── forms/            # フォーム管理
├── server/api/           # APIエンドポイント
│   ├── forms/            # フォームCRUD
│   └── public/forms/     # 公開フォーム用API
├── types/                # TypeScript型定義
├── lib/                  # ユーティリティ
│   ├── prisma.ts         # Prismaクライアント
│   └── validation.ts     # バリデーション
├── prisma/               # データベーススキーマ
└── assets/css/           # スタイル
```

## API エンドポイント

### フォーム管理
- `GET /api/forms` - フォーム一覧取得
- `POST /api/forms` - フォーム作成
- `GET /api/forms/[id]` - フォーム詳細取得
- `GET /api/forms/[id]/submissions` - 回答一覧取得

### 公開フォーム
- `GET /api/public/forms/[path]` - 公開フォーム情報取得
- `POST /api/public/forms/[path]/submit` - 回答送信

## フォーム設計

フォームはJSON Schemaを基盤とした構造で定義され、以下のフィールドタイプをサポート：

- **text**: テキスト入力
- **email**: メールアドレス入力
- **number**: 数値入力
- **date**: 日付入力
- **textarea**: 複数行テキスト
- **select**: セレクトボックス
- **checkbox**: チェックボックス（複数選択）

## ライセンス

MIT License
