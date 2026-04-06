/**
 * Link Preview Generator
 * リンク先ページのOGPメタタグを使用してプレビューカードを生成するライブラリ
 */

class LinkPreviewGenerator {
    constructor() {
        this.previewCache = new Map(); // キャッシュメカニズム
        this.fallbackImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189e5f85fdb%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189e5f85fdb%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9140625%22%20y%3D%22218.3%22%3EPreview%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    }

    /**
     * OGPデータを使用してリンクプレビューを生成
     * @param {Element} mediaCard - プレビューを表示するDOM要素
     */
    async generatePreview(mediaCard) {
        const link = mediaCard.querySelector('.card-action');
        if (!link) return;

        const url = link.getAttribute('href');
        const thumbnailContainer = mediaCard.querySelector('.card-thumbnail');
        
        if (!thumbnailContainer || !url || url === '#') return;

        try {
            // すでに画像があるか確認
            const existingImg = thumbnailContainer.querySelector('img');
            
            // 画像ファイルが存在するかチェック
            if (existingImg) {
                const img = new Image();
                img.onload = () => {
                    // 画像が正常に読み込まれた場合は何もしない
                    return;
                };
                img.onerror = () => {
                    // 画像が404エラーの場合は動的に取得
                    this.processPreview(url, thumbnailContainer);
                };
                img.src = existingImg.src;
            } else {
                this.processPreview(url, thumbnailContainer);
            }
        } catch (error) {
            console.error('Link preview generation failed:', error);
        }
    }

    async processPreview(url, thumbnailContainer) {
        try {
            // キャッシュにあればそれを使用
            if (this.previewCache.has(url)) {
                this.updateThumbnail(thumbnailContainer, this.previewCache.get(url));
                return;
            }

            // ドメインごとに異なる処理
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                this.handleYouTubePreview(url, thumbnailContainer);
            } else if (url.includes('spotify.com')) {
                this.handleSpotifyPreview(url, thumbnailContainer);
            } else if (url.includes('softbank.jp')) {
                this.handleSoftBankPreview(url, thumbnailContainer);
            } else if (url.includes('note.com')) {
                this.handleNotePreview(url, thumbnailContainer);
            } else {
                // 一般的なOGP処理
                this.fetchOgpData(url, thumbnailContainer);
            }
        } catch (error) {
            console.error('Preview generation failed:', error);
        }
    }

    /**
     * YouTubeリンクのプレビュー処理
     * @param {string} url - YouTubeリンクURL
     * @param {Element} container - サムネイルコンテナ要素
     */
    handleYouTubePreview(url, container) {
        let videoId = '';
        
        // 動画IDを抽出
        if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v');
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/playlist')) {
            // プレイリストの場合はデフォルトのプレイリスト画像を使用
            const urlParams = new URLSearchParams(new URL(url).search);
            const listId = urlParams.get('list');
            
            // プレイリストIDに基づいて特定のサムネイルを設定
            let playlistImage = 'https://i.ytimg.com/vi/K_6ZqJTelKY/hqdefault.jpg'; // デフォルト
            
            if (listId === 'PLuiKmtQJC8Im8VYeL4CeuX4VDap0ZahxO') {
                // ソフトバンクビジネスチャンネル - hqdefaultを使用
                playlistImage = 'https://i.ytimg.com/vi/K_6ZqJTelKY/hqdefault.jpg';
            } else if (listId === 'PLdWTmEF6jFdYNfb8YPgt35pH58zKQjFzT') {
                // TECH WORLD
                playlistImage = 'https://i.ytimg.com/vi/7zVhl7wIC3M/hqdefault.jpg';
            }
            
            const previewData = {
                title: 'YouTube Playlist',
                image: playlistImage,
                url: url
            };
            this.updateThumbnail(container, previewData);
            this.previewCache.set(url, previewData);
            return;
        }

        if (videoId) {
            const previewData = {
                title: 'YouTube Video',
                image: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                url: url
            };
            this.updateThumbnail(container, previewData);
            this.previewCache.set(url, previewData);
        }
    }

    /**
     * Spotifyリンクのプレビュー処理
     * @param {string} url - SpotifyリンクURL
     * @param {Element} container - サムネイルコンテナ要素
     */
    async handleSpotifyPreview(url, container) {
        try {
            // Spotify oEmbed APIを使用してポッドキャスト情報を取得
            const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
            
            // CORSの制限があるため、代替方法を使用
            // となりのデータ分析屋さんの画像URLを直接指定
            let podcastImage = '';
            
            if (url.includes('07Im8f3x9q1Bfek0coKcVM')) {
                // となりのデータ分析屋さん のポッドキャストカバー
                podcastImage = 'https://image-cdn-ak.spotifycdn.com/image/ab6772ab000015be6282bd0414fc3755cf92d689';
            } else {
                // デフォルトのSpotifyポッドキャスト画像
                podcastImage = 'https://cdn.spotify.com/images/default-podcast.png';
            }
            
            const previewData = {
                title: 'Spotify Podcast',
                image: podcastImage,
                url: url
            };
            
            this.updateThumbnail(container, previewData);
            this.previewCache.set(url, previewData);
        } catch (error) {
            console.error('Spotify preview failed:', error);
            // エラー時はデフォルト画像を使用
            const previewData = {
                title: 'Spotify Podcast',
                image: this.fallbackImage,
                url: url
            };
            this.updateThumbnail(container, previewData);
            this.previewCache.set(url, previewData);
        }
    }

    /**
     * SoftBankサイトのプレビュー処理
     * @param {string} url - SoftBankサイトURL
     * @param {Element} container - サムネイルコンテナ要素
     */
    handleSoftBankPreview(url, container) {
        let image = '';
        let title = 'SoftBank';
        
        // 特定の記事に応じて画像を設定
        if (url.includes('/recruit/graduate/crosstalk/engineer/')) {
            // エンジニア座談会
            image = 'https://www.softbank.jp/recruit/set/data/graduate/crosstalk/engineer/img/talk1.jpg';
            title = '3年目エンジニア座談会';
        } else if (url.includes('enxross-finalist-react-8thwall')) {
            // enXross React 8thWall記事
            image = 'https://www.softbank.jp/biz/function/dynamicmedia/deliver/dm-aid--3edce39c-0ee6-45c6-95b5-4649e2971325/img-enxross-finalist-react-8thwall-blog-20241215-kv.jpg';
            title = '8th Wall × React実践術';
        } else if (url.includes('articles/202503/o3/')) {
            // o3解説記事
            image = 'https://www.softbank.jp/biz/function/dynamicmedia/deliver/dm-aid--16aa72ed-6559-4681-aeb3-f20193482593/mv-o3-kv-20250305.jpg';
            title = 'o3技術解説';
        } else if (url.includes('me16947-wbn-entry-axross')) {
            // ウェビナー登録ページ
            image = 'https://www.softbank.jp/biz/set/data/top/img/ogp.png';
            title = '生成AI活用ウェビナー';
        } else if (url.includes('/recruit/')) {
            // 採用サイト全般
            image = 'https://www.softbank.jp/recruit/set/common/img/ogp_img.png';
        } else if (url.includes('/biz/')) {
            // ビジネスサイト全般
            image = 'https://www.softbank.jp/biz/set/data/top/img/ogp.png';
        } else {
            // デフォルト
            image = 'https://www.softbank.jp/set/data/top/img/ogp.png';
        }
        
        const previewData = {
            title: title,
            image: image,
            url: url
        };
        
        this.updateThumbnail(container, previewData);
        this.previewCache.set(url, previewData);
    }

    /**
     * Noteのプレビュー処理
     * @param {string} url - NoteのURL
     * @param {Element} container - サムネイルコンテナ要素
     */
    handleNotePreview(url, container) {
        let noteImage = '';
        
        // 特定の記事のOGP画像を設定
        if (url.includes('n8faf0b017d92')) {
            // enXross HACKATHON体験記
            noteImage = 'https://assets.st-note.com/production/uploads/images/150127641/3de7f0411db8c99579ed2d365aa9f201.png';
        } else {
            // デフォルトのnote画像
            noteImage = 'https://assets.st-note.com/production/uploads/images/128867612/rectangle_large_type_2_4dd8ca31cc5cec17b05e17e616bb0aab.png';
        }
        
        const previewData = {
            title: 'note',
            image: noteImage,
            url: url
        };
        this.updateThumbnail(container, previewData);
        this.previewCache.set(url, previewData);
    }

    /**
     * 一般的なWebページのOGP情報を取得
     * @param {string} url - ページURL
     * @param {Element} container - サムネイルコンテナ要素
     */
    async fetchOgpData(url, container) {
        try {
            // CORSの制限により、多くのサイトでは直接アクセスできないため
            // デフォルト画像を使用
            const previewData = {
                title: 'Web Page',
                image: this.fallbackImage,
                url: url
            };
            
            this.updateThumbnail(container, previewData);
            this.previewCache.set(url, previewData);
        } catch (error) {
            console.error('OGP Fetch failed:', error);
        }
    }

    /**
     * サムネイル要素を更新
     * @param {Element} container - サムネイルコンテナ要素
     * @param {Object} previewData - プレビューデータ
     */
    updateThumbnail(container, previewData) {
        // 既存の画像があれば更新、なければ作成
        let img = container.querySelector('img');
        
        if (img) {
            img.src = previewData.image;
            img.alt = previewData.title;
        } else {
            img = document.createElement('img');
            img.src = previewData.image;
            img.alt = previewData.title;
            container.appendChild(img);
        }
        
        // エラーハンドリング
        img.onerror = () => {
            console.error('Failed to load image:', img.src);
            // SoftBankサイトの場合は汎用OGP画像を試す
            if (img.src.includes('softbank.jp')) {
                img.src = 'https://www.softbank.jp/recruit/set/common/img/ogp_img.png';
                img.onerror = () => {
                    img.src = this.fallbackImage;
                };
            } else {
                img.src = this.fallbackImage;
            }
        };
        
        // プレビュー用のオーバーレイクラスを追加
        container.classList.add('link-preview');
    }
}

// グローバル関数として定義（components-loader.jsから呼び出せるようにする）
window.initLinkPreviews = function() {
    const previewGenerator = new LinkPreviewGenerator();
    
    // メディアセクションのカードにプレビューを適用
    const mediaCards = document.querySelectorAll('.media-card');
    mediaCards.forEach(card => {
        previewGenerator.generatePreview(card);
    });
    
    // フィーチャードコンテンツのサムネイルも処理
    const featuredCard = document.querySelector('.featured-card');
    if (featuredCard) {
        const link = featuredCard.querySelector('.featured-link');
        const thumbnailContainer = featuredCard.querySelector('.featured-thumbnail');
        
        if (link && thumbnailContainer) {
            const url = link.getAttribute('href');
            if (url && url.includes('youtube.com/playlist')) {
                // ソフトバンクビジネスチャンネルのロゴ/サムネイル
                const img = thumbnailContainer.querySelector('img');
                if (img) {
                    // SoftBank Business関連の画像を使用
                    img.src = 'https://www.softbank.jp/biz/set/data/top/img/main/mv_hd.png';
                    img.onerror = () => {
                        // フォールバック: YouTubeプレイリストのサムネイル
                        img.src = 'https://i.ytimg.com/vi/K_6ZqJTelKY/hqdefault.jpg';
                        img.onerror = () => {
                            img.src = previewGenerator.fallbackImage;
                        };
                    };
                }
            }
        }
    }
};

// DOMコンテンツロード時にリンクプレビューを初期化
document.addEventListener('DOMContentLoaded', function() {
    // メディアカードが既にDOMにある場合は初期化を実行
    if (document.querySelectorAll('.media-card').length > 0) {
        window.initLinkPreviews();
    }
});