# MonyMane v1.0.0 仕様

この文書は、v1.0.0タグの現行実装から確認できる仕様を記録します。将来の要望や未実装機能は仕様として確定せず、`TASKS.md`または「未確定事項」に分けて記載します。

## 1. アプリの目的

MonyManeは、個人の収入、固定費、変動費、予算、年間見積、貯金目標をブラウザ上で管理し、月次・年次の家計状況を確認するための家計簿アプリです。

データは利用中のブラウザの`localStorage`に保存されます。現行実装には、サーバーへの保存、ユーザーアカウント、端末間の自動同期はありません。

## 2. 対応環境

- 対象ブラウザ: 最新版のChrome、Edge、Safari
- 最小画面幅: 320px
- パッケージマネージャー: npm
- Node.js: 正式な対応バージョンは未確定

## 3. 現行実装

- エントリーポイント: `src/main.tsx` → `src/app/App.tsx`
- データ型: `src/app/types.ts`
- localStorage、移行、集計: `src/app/useBudgetData.ts`

`src/app/components`および`src/imports`の未参照コードは、この仕様の根拠に含めません。

## 4. 画面と画面遷移

画面はReact stateで切り替えます。URLルーティングは使用していません。

- ホーム: ダッシュボードを表示
- 登録・編集: データ種別ごとの登録フォームと一覧を表示
- 設定: JSONのエクスポート・インポート、全削除を表示

ヘッダーから3画面を切り替えます。ダッシュボードの集計カードや登録ボタンから、対応する登録・編集セクションを開けます。画面状態はURLに反映されず、リロード後の画面復元も実装されていません。

## 5. 月次・年次モード

ホームには月次モードと年次モードがあります。

- 月次モード: 選択中の`YYYY-MM`に属する実績と予算を集計
- 年次モード: 選択中の月の年`YYYY`に属する実績と月間予算を合計
- 対象月を変更すると、内訳グラフの選択中グループは解除

年間の「貯金目標差し引き後の自由予算」では、月間の貯金目標を12倍して差し引きます。

## 6. 実装済み機能

### ホーム

- 今月または今年の残予算表示
- 貯金目標差し引き後の自由予算表示
- 収入、固定費、変動費の実績合計
- 年間収入・年間固定費に基づく月間・年間見積
- 固定費・変動費の予算、実績、残額、使用率
- 予算超過表示
- 変動費のグループカテゴリ別円グラフ
- グループ選択後のカテゴリ別内訳
- 未分類変動費の集計

### 登録・編集

- 収入
- 固定費
- 変動費実績
- グループカテゴリ
- カテゴリ
- 月間予算
- 年間収入
- 年間固定費
- 貯金目標

上記は、貯金目標を除き一覧から編集・削除できます。貯金目標は単一値として保存します。

### 設定

- backup version 2のJSONエクスポート
- backup version 1または2のJSONインポート
- 家計簿関連データの全削除

## 7. データ型

### Income / FixedCost

`id`, `name`, `amount`, `memo?`, `month`, `createdAt`, `updatedAt`

### VariableCost

`id`, `categoryGroupId?`, `categoryId?`, `name`, `amount`, `memo?`, `month`, `createdAt`, `updatedAt`

### CategoryGroup

`id`, `name`, `color?`, `icon?`, `createdAt`, `updatedAt`

### Category

`id`, `groupId`, `name`, `color?`, `icon?`, `memo?`, `createdAt`, `updatedAt`

### VariableCategoryBudget

`id`, `categoryId`, `month?`, `budgetAmount`, `memo?`, `createdAt`, `updatedAt`

現行UIにはカテゴリ別予算を直接登録・編集する画面はありません。このデータは旧形式からの移行およびカテゴリ比較処理で利用されます。

### MonthlyBudget

`yearMonth`, `fixedExpenseBudget`, `variableExpenseBudget`, `createdAt`, `updatedAt`

### AnnualIncome / AnnualCost

`id`, `name`, `amount`, `memo?`, `createdAt`, `updatedAt`

### SavingGoal

`amount`, `updatedAt`

## 8. 入力条件

- 月間予算以外の項目は名称が必須。ただし貯金目標は名称を持たない
- 収入、固定費、変動費、年間収入、年間固定費、貯金目標は1円以上
- 月間の固定費予算・変動費予算は0円以上
- 収入、固定費、変動費は登録日が必須
- カテゴリはグループカテゴリの選択が必須
- グループを選択した変動費は、その配下のカテゴリ選択が必須
- グループを選択しない変動費は、グループ・カテゴリとも未分類として保存可能
- グループカテゴリ名は大文字・小文字を区別せず重複不可
- カテゴリ名は同一グループ内で大文字・小文字を区別せず重複不可
- 月間予算は同一`yearMonth`で重複不可
- 金額入力では数字以外を除去し、表示時に3桁区切りを付ける
- メモとアイコンは任意。空文字は`undefined`として保存

名称やメモの最大長、金額の上限は現行実装から確認できません。

## 9. 集計と計算

### 月次実績

- 収入合計 = 対象月の収入金額の合計
- 固定費合計 = 対象月の固定費金額の合計
- 変動費合計 = 対象月の変動費金額の合計
- 実績残予算 = 収入合計 - 固定費合計 - 変動費合計
- 貯金目標差引後 = 実績残予算 - 貯金目標

対象月の判定には、各実績の`month.slice(0, 7)`を使用します。

### 年次実績

- 選択中の年と`month`の先頭4文字が一致する実績を合計
- 年次実績残予算 = 年間収入実績 - 年間固定費実績 - 年間変動費実績
- 年次貯金目標差引後 = 年次実績残予算 - 貯金目標 × 12

### 見積

- 年間収入見積 = 年間収入の合計
- 年間固定費見積 = 年間固定費の合計
- 月間収入見積 = `Math.floor(年間収入見積 / 12)`
- 月間固定費見積 = `Math.floor(年間固定費見積 / 12)`
- 月間自由予算見積 = `Math.floor((年間収入見積 - 年間固定費見積) / 12)`
- 年間自由予算見積 = 年間収入見積 - 年間固定費見積

### 予算

- 残額 = 予算 - 実績
- 使用率 = `Math.round(実績 / 予算 × 100)`
- 予算が0円以下の場合、使用率は0として計算し、UIでは「予算未設定」「算出不可」と表示
- 使用率が100%を超える場合は「予算オーバー」と超過額を表示
- 年次予算は、対象年の月間予算を合計

## 10. カテゴリの2階層構造

カテゴリは`CategoryGroup`を親、`Category`を子とする2階層です。`Category.groupId`で親を参照します。

変動費は`categoryGroupId`と`categoryId`を任意で保持します。未指定、削除済みID、または有効なカテゴリに解決できない実績は、集計上「未分類」として扱われます。

内訳グラフは最初にグループカテゴリ別の構成比を表示し、グループを選択するとその配下のカテゴリ別内訳へ切り替えます。

## 11. 削除制約

- 配下カテゴリが存在するグループカテゴリは削除不可
- 変動費実績の`categoryGroupId`から参照されているグループカテゴリは削除不可
- 変動費実績の`categoryId`から参照されているカテゴリは削除不可
- その他の項目は確認ダイアログ後に削除
- 月間予算は`yearMonth`を識別子として削除

## 12. localStorage

データ種別ごとに、JSON文字列として別のlocalStorageキーへ保存します。stateの変更後、`useEffect`で保存します。

| データ | キー |
|---|---|
| 収入 | `budget-app-incomes` |
| 固定費 | `budget-app-fixed-costs` |
| 変動費 | `budget-app-variable-costs` |
| グループカテゴリ | `budget-app-category-groups` |
| カテゴリ | `budget-app-categories` |
| 旧カテゴリ | `budget-app-variable-categories` |
| カテゴリ別予算 | `budget-app-variable-category-budgets` |
| 月間予算 | `budget-app-monthly-budgets` |
| 年間収入 | `budget-app-annual-incomes` |
| 年間固定費 | `budget-app-annual-costs` |
| 貯金目標 | `budget-app-saving-goal` |
| データバージョン | `budget-app-data-version` |

localStorageからの読み込みまたはJSON解析に失敗した場合は、データ種別ごとの空値・初期値を使用します。保存に失敗した場合も、画面上のメモリ状態は維持します。

## 13. データバージョンと移行

現行のデータバージョンは`2`です。`budget-app-data-version`が2以上の場合、version 2への移行を再実行しません。

### version 1相当からversion 2への移行

- 旧単一カテゴリを「旧カテゴリ」グループ配下へ移行
- `groupId`がない既存カテゴリにも「旧カテゴリ」のIDを補完
- 同名カテゴリが複数ある場合は`(2)`以降の番号を付ける
- 旧カテゴリの`budgetAmount`を`VariableCategoryBudget`へ移行
- 既存の変動費に`categoryId`があり`categoryGroupId`がない場合、カテゴリの親グループを補完
- 月間予算が空でカテゴリ別予算がある場合、カテゴリ別予算を年月ごとに合算して変動費予算へ移行
- カテゴリ別予算に年月がない場合、移行時の現在月を使用
- 旧移行で作る固定費予算は0円
- 実績の`month`が`YYYY-MM`の場合は`YYYY-MM-01`へ正規化
- 同一月の月間予算が複数ある場合、原則として新しい`updatedAt`を採用。日付を比較できない場合は後に処理した値を採用

移行処理は例外を画面へ伝播させず、起動可能な状態の維持を優先します。

## 14. バックアップJSON

エクスポート形式はversion 2です。

```json
{
  "app": "budget-app",
  "version": 2,
  "exportedAt": "ISO 8601 date-time",
  "data": {
    "incomes": [],
    "fixedCosts": [],
    "variableCosts": [],
    "categoryGroups": [],
    "categories": [],
    "variableCategoryBudgets": [],
    "monthlyBudgets": [],
    "annualIncomes": [],
    "annualCosts": [],
    "savingGoal": {}
  }
}
```

ファイル名は`budget-app-backup-YYYYMMDD-HHmmss.json`です。backup version 1と2を受け入れ、読み込み後はversion 2相当のデータへ正規化します。

## 15. インポートと全削除

### インポート

- JSONとして解析できることを確認
- `app`が`budget-app`であることを確認
- versionが1または2であることを確認
- 必須配列、カテゴリ、貯金目標の最低限の形を確認
- version 1相当のカテゴリ・月間予算を移行
- ユーザーの確認後、現在の家計簿データを上書き
- localStorageとReact stateの両方を更新

型の全フィールドを厳密に検証する完全なスキーマバリデーションではありません。

### 全削除

- 入力欄に「削除」と入力した場合だけ実行可能
- 実行前に確認ダイアログを表示
- `STORAGE_KEYS`に定義された家計簿関連キーを削除
- React stateを初期値へ戻す
- 他用途のlocalStorageキーは削除しない

## 16. エラー時の現行挙動

- 入力エラーはフォーム内に表示し、保存しない
- import対象が不正なJSON、別アプリ用、または必要な構造を満たさない場合はエラーを表示
- import、export、全削除の例外は設定画面にエラーを表示
- localStorage読み込み失敗時はfallbackを使用
- localStorageへの通常保存失敗時はメモリ状態を維持するが、ユーザー通知は行わない
- 削除やimportのキャンセルは設定画面のメッセージとして表示される場合がある

## 17. 既知の制約

- データはブラウザ・オリジン単位のlocalStorageにのみ存在する
- アカウント、サーバー保存、自動同期はない
- ブラウザデータ削除、端末故障、シークレットモード終了などで失われる可能性がある
- 複数端末間の移動はJSONエクスポート・インポートが必要
- URLルーティングがなく、画面状態をURLで共有・復元できない
- localStorage容量超過時に明示的なユーザー通知がない
- importの検証は完全なスキーマ検証ではない
- lint、format、typecheck、自動テスト、CIは未整備
- `App.tsx`に画面・CRUD・バックアップ処理が集中している
- 未参照コードが`src/app/components`と`src/imports`に残っている
- 本番URLはリポジトリ内から確認できない
- ライセンスはリポジトリ内から確認できない

## 18. 未確定事項

- 正式にサポートするNode.jsバージョン
- 本番URL
- ライセンス
- localStorageで想定する最大データ件数・容量
- 名称、メモ、金額の正式な上限
- 未参照コードを削除する時期と判定基準
- カテゴリ別予算を今後も内部互換データとして維持するか、UIへ再導入するか

