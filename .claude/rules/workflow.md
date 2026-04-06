# Workflow Rules — my_portfolio

## 鉄則: worktree 必須

- セクション実装は必ず `git worktree` で行う
- メインリポジトリは常に `develop/v2` に留める。ブランチ切り替え禁止
- worktree 内で作業し、完了後 `develop/v2` にマージ

## Worktree ロケーション

```
my_portfolio/           ← メインリポジトリ（常に develop/v2）
my_portfolio/worktree/  ← ワークツリー置き場
  ├── feature-hero/
  ├── feature-header/
  └── ...
```

## ディレクトリ命名規則

ブランチ名のスラッシュをハイフンに変換:
- ブランチ: `feature/hero` → ディレクトリ: `feature-hero`
- ブランチ: `feature/header` → ディレクトリ: `feature-header`

## ワークツリーライフサイクル

### 作成

```bash
# メインリポジトリのルートで実行
git worktree add worktree/feature-hero -b feature/hero develop/v2
```

### 作業

```bash
cd worktree/feature-hero/v2
bun install   # 依存関係インストール（初回のみ）
bun run dev   # 開発サーバー起動
```

### クリーンアップ（PRマージ後）

```bash
# メインリポジトリのルートで実行
git worktree remove worktree/feature-hero
git branch -d feature/hero
```

## ブランチ命名規則

```
feature/{section-name}
```

セクション名一覧:
- `feature/hero`
- `feature/header`
- `feature/about`
- `feature/certifications`
- `feature/ai-toolkit`
- `feature/skills`
- `feature/experience`
- `feature/projects`
- `feature/media`
- `feature/contact`
- `feature/footer`

## 開発フロー

1. `git worktree add` でワークツリー作成
2. ワークツリー内で実装
3. コミット & プッシュ
4. `develop/v2` へ PR 作成
5. マージ後、ワークツリー削除 & ブランチ削除

## 注意事項

- `worktree/` ディレクトリは `.gitignore` に追加済み
- 各ワークツリーの `v2/node_modules` は独立。初回 `bun install` が必要
- dev サーバーのポートが被らないよう注意（`--port` オプションで変更可能）
