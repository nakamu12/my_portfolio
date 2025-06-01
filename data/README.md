# CSVデータ管理ガイド

このディレクトリには、ポートフォリオサイトの動的コンテンツを管理するためのCSVファイルが含まれています。

## CSVファイル一覧

### 1. **skills.csv**
技術スキルを管理するファイル
- `category`: スキルカテゴリ（フロントエンド、バックエンド、システム/DevOps、言語/ツール）
- `name`: スキル名
- `icon_type`: アイコンタイプ（fontawesome または text）
- `icon_class`: FontAwesomeクラスまたはテキストアイコン
- `custom_class`: カスタムCSSクラス
- `delay`: アニメーション遅延（オプション）

### 2. **certifications.csv**
資格・認定を管理するファイル
- `name`: 資格名
- `date`: 取得日
- `logo_path`: ロゴ画像パス

### 3. **experience-timeline.csv**
経歴タイムラインを管理するファイル
- `date_range`: 期間
- `category`: カテゴリ（学歴、職歴、副業）
- `type`: タイプ（education, work）
- `institution`: 機関名
- `description`: 説明
- `delay`: アニメーション遅延

### 4. **achievements.csv**
実績を管理するファイル
- `date`: 日付
- `title`: タイトル
- `description`: 説明
- `category`: カテゴリ
- `link_url`: リンクURL
- `image_path`: 画像パス（オプション）
- `has_image`: 画像有無（true/false）
- `icon`: アイコンクラス（画像がない場合）
- `delay`: アニメーション遅延

### 5. **projects.csv**
プロジェクトを管理するファイル
- `title`: プロジェクト名
- `description`: 説明
- `technologies`: 使用技術（カンマ区切り）
- `website_url`: ウェブサイトURL
- `image_path`: 画像パス
- `delay`: アニメーション遅延

### 6. **media.csv**
メディア出演・記事を管理するファイル
- `category`: カテゴリ（youtube, article, podcast, presentation）
- `title`: タイトル
- `description`: 説明
- `type`: タイプ表示名
- `url`: リンクURL
- `image_path`: サムネイル画像パス
- `stats_1_icon`: 統計1のアイコン
- `stats_1_text`: 統計1のテキスト
- `stats_2_icon`: 統計2のアイコン
- `stats_2_text`: 統計2のテキスト
- `overlay_icon`: オーバーレイアイコン
- `header_icon`: ヘッダーアイコン

### 7. **profile.csv**
プロフィール情報を管理するファイル
- `name`: 名前
- `job_title`: 職種
- `birth_date`: 生年月日
- `location`: 出身地
- `hobbies`: 趣味
- `bio_text`: 自己紹介文
- `mbti_type`: MBTIタイプ
- `mbti_title`: MBTIタイトル

### 8. **social-links.csv**
ソーシャルリンクを管理するファイル
- `platform`: プラットフォーム名
- `url`: URL
- `icon_class`: アイコンクラス
- `title`: タイトル

### 9. **mbti-traits.csv**
MBTI特性を管理するファイル
- `trait_letter`: 特性文字
- `trait_percent`: パーセンテージ
- `trait_name`: 特性名

### 10. **strengths.csv**
ストレングスファインダーを管理するファイル
- `strength_jp`: 日本語名
- `strength_en`: 英語名
- `description`: 説明

### 11. **social-platforms.csv**
フォローミーセクションのプラットフォームを管理するファイル
- `platform`: プラットフォーム名
- `url`: URL
- `description`: 説明
- `stats`: 統計情報
- `icon_class`: アイコンクラス

## 使用方法

1. 各CSVファイルを編集してコンテンツを追加・更新・削除
2. ブラウザをリロードすると自動的に新しいコンテンツが反映される
3. CSVの文字コードはUTF-8を使用すること
4. カンマを含む値は二重引用符で囲むこと

## 注意事項

- CSVファイルの構造（ヘッダー行）は変更しないでください
- 画像パスは`assets/images/`から始まる相対パスで指定
- 日付形式は統一すること（例: 2025年1月、2025年1月1日）
- URLは完全なURLを指定（https://から始まる）