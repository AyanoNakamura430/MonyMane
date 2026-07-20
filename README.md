# MonyMane

MonyManeは、ブラウザ上で収入・固定費・変動費・予算を管理する家計簿アプリです。v1.0.0をリリース済みです。

月次・年次の家計集計、固定費・変動費予算の進捗、2階層カテゴリによる変動費内訳、JSONバックアップと復元に対応しています。入力データは利用中のブラウザの`localStorage`へ保存され、現行実装ではサーバーへ送信されません。

## 主な機能

- 月次・年次ダッシュボード
  - 収入、固定費、変動費の実績合計
  - あといくら使えるかの表示
  - 貯金目標差し引き後の自由予算
  - 年間収入・年間固定費からの見積
  - 固定費・変動費予算の残額、使用率、予算超過表示
  - 変動費のグループカテゴリ別・カテゴリ別内訳グラフ
- 登録・編集・削除
  - 収入
  - 固定費
  - 変動費実績
  - グループカテゴリとカテゴリ
  - 月間予算
  - 年間収入と年間固定費
  - 貯金目標
- データ管理
  - backup version 2のJSONエクスポート
  - backup version 1・2のJSONインポート
  - 家計簿関連データの一括削除

## 使用技術

- React 18
- TypeScript / TSX
- Vite 6
- Tailwind CSS 4
- TypeScript 7.0.2（型検査）
- Vitest 4.1.10（データ処理のunit test）
- Recharts
- Lucide React
- Radix UI / shadcn/ui由来のUIコンポーネント群
- ブラウザ`localStorage`
- npm

依存関係の正確なバージョンは`package.json`と`package-lock.json`を参照してください。

## 対応環境

- 最新版のChrome、Edge、Safari
- 最小画面幅: 320px
- パッケージマネージャー: npm
- Node.js: 正式な対応バージョンは未確定

## セットアップ

リポジトリを取得し、依存関係をインストールします。

```bash
npm install
```

開発サーバーを起動します。

```bash
npm run dev
```

## 開発コマンド

現在`package.json`に定義されているコマンドは次のとおりです。

```bash
# 開発サーバー
npm run dev

# 本番ビルド
npm run build

# ビルド結果のローカル確認
npm run preview

# 現行アプリの型検査
npm run typecheck

# unit testの型検査
npm run typecheck:test

# unit testを1回実行
npm run test

# unit testを監視実行
npm run test:watch
```

typecheckは`src/main.tsx`を起点に、現行アプリから参照されるコードだけを対象とします。`vite.config.ts`と未参照コードは対象外です。

unit testはNode環境で実行し、月間予算の重複正規化、version 1からversion 2への移行、backup version 1・2の解析・復元、基本的な月次・年次集計を対象とします。unit testの実行にはNode.js 20以上が必要です。この条件はVitestの実行要件であり、MonyMane全体の正式対応Node.jsバージョンではありません。

lint、format、component test、E2E test、coverageは現時点で未整備です。jsdomとReact Testing Libraryも未導入のため、UI・Hook統合テストは対象外です。

## 使い方

1. ホームで対象月と月次・年次モードを確認します。
2. 「登録・編集」で収入、支出、予算などを登録します。
3. 変動費を分類する場合は、グループカテゴリと、その配下のカテゴリを先に登録します。
4. 月間予算で、対象年月ごとの固定費予算と変動費予算を登録します。
5. ホームで実績、残予算、使用率、変動費内訳を確認します。
6. 必要に応じて設定画面からJSONバックアップを保存します。

## 保存方式

家計簿データはデータ種別ごとにJSONへ変換され、ブラウザの`localStorage`へ保存されます。

- サーバー保存、ユーザーアカウント、自動同期はありません。
- 端末やブラウザを変えてもデータは自動共有されません。
- ブラウザデータの削除、シークレットモードの終了、端末故障などでデータが失われる可能性があります。
- 重要なデータは定期的にJSONエクスポートしてください。
- localStorageのキー、データ型、移行仕様は[`docs/SPEC.md`](./docs/SPEC.md)を参照してください。

## バックアップと復元

設定画面から、現在のデータをJSONファイルとしてエクスポートできます。エクスポート形式はbackup version 2です。

インポートはbackup version 1および2に対応しています。インポート時は確認後、現在の家計簿データがバックアップ内容で上書きされます。複数端末でデータを移動する場合も、エクスポートとインポートを使用してください。

一括削除は家計簿関連のlocalStorageキーだけを対象にします。削除後は、バックアップがない限り復元できません。

## ディレクトリ概要

```text
MonyMane/
├─ src/
│  ├─ main.tsx                 # Reactエントリーポイント
│  ├─ app/
│  │  ├─ App.tsx               # 現行画面・CRUD・バックアップ
│  │  ├─ types.ts              # データ型
│  │  ├─ useBudgetData.ts      # localStorage・移行・集計
│  │  └─ components/           # UI部品と未参照コードを含む
│  ├─ imports/                 # 現行未参照のFigma由来コード
│  └─ styles/                  # Tailwind、テーマ、フォント、全体CSS
├─ docs/
│  ├─ SPEC.md                  # v1.0.0の現行仕様
│  └─ TASKS.md                 # 完了事項と今後の候補
├─ AGENTS.md                   # AIエージェント向け開発ルール
├─ RELEASE_CHECKLIST.md        # リリース時の確認項目
├─ package.json
├─ tsconfig.app.json           # 現行アプリ用の型検査設定
└─ vite.config.ts
```

現行エントリーポイントは`src/main.tsx`から`src/app/App.tsx`です。`src/app/components`と`src/imports`には現行エントリーポイントから参照されていないコードがあり、現行仕様としては扱いません。

## 既知の制約

- URLルーティングはなく、画面切り替えはアプリ内部のstateで管理します。
- データはブラウザのlocalStorageにのみ保存されます。
- localStorage保存失敗時の明示的なユーザー通知はありません。
- JSONインポートは完全なスキーマ検証ではありません。
- lint、format、自動テスト、CIは未整備です。
- `vite.config.ts`と未参照コードは現在のtypecheck対象外です。
- `src/app/App.tsx`に複数の責務が集中しています。
- 未参照コードの調査・整理は未着手です。
- 正式な対応Node.jsバージョンは未確定です。
- ライセンスは未決定です。ライセンスファイルは設定していません。

## 本番URL

TODO: リポジトリ内で本番URLを確認できないため、確定後に記載します。

## 関連ドキュメント

- [v1.0.0仕様](./docs/SPEC.md)
- [タスク一覧](./docs/TASKS.md)
- [リリースチェックリスト](./RELEASE_CHECKLIST.md)
- [AIエージェント向け開発ルール](./AGENTS.md)
