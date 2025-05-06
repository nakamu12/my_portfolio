/**
 * Link Preview Generator
 * リンク先ページのOGPメタタグを使用してプレビューカードを生成するライブラリ
 */

class LinkPreviewGenerator {
    constructor() {
        this.previewCache = new Map(); // キャッシュメカニズム
        this.proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORSプロキシ
        this.fallbackImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189e5f85fdb%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189e5f85fdb%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9140625%22%20y%3D%22218.3%22%3EPreview%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    }

    /**
     * OGPデータを使用してリンクプレビューを生成
     * @param {Element} mediaItem - プレビューを表示するDOM要素
     */
    async generatePreview(mediaItem) {
        const link = mediaItem.querySelector('a');
        if (!link) return;

        const url = link.getAttribute('href');
        const thumbnailContainer = mediaItem.querySelector('.media-thumbnail');
        
        if (!thumbnailContainer || !url || url === '#') return;

        try {
            // すでに独自に設定された画像があるか確認
            const existingImg = thumbnailContainer.querySelector('img');
            const hasCustomImage = existingImg && !existingImg.src.includes('assets/images/');
            
            // 独自設定の画像があれば処理をスキップ
            if (hasCustomImage) return;

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
            } else {
                // 一般的なOGP処理
                this.fetchOgpData(url, thumbnailContainer);
            }
        } catch (error) {
            console.error('Link preview generation failed:', error);
            // エラー時はデフォルト画像を維持
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
            const urlParams = new URLSearchParams(new URL(url).search);
            const listId = urlParams.get('list');
            // プレイリストの場合はプレイリストのサムネイルURLを使用
            const previewData = {
                title: 'YouTube Playlist',
                image: `https://i.ytimg.com/vi/default/hqdefault.jpg`,
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
    handleSpotifyPreview(url, container) {
        // Spotifyはデフォルトイメージを使用
        const previewData = {
            title: 'Spotify Podcast',
            image: 'https://cdn-profiles.tunein.com/p1341330/images/logog.png',
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
            // 同一生成元ポリシーを回避するためにプロキシを使用
            // 注: 実際の運用では、サーバーサイドプロキシやAPIキーが必要な専用サービスが推奨されます
            const response = await fetch(this.proxyUrl + url, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // OGPデータを抽出
            const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
            const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
            const title = ogTitle || doc.querySelector('title')?.textContent || 'Web Page';
            
            const previewData = {
                title: title,
                image: ogImage || this.fallbackImage,
                url: url
            };
            
            this.updateThumbnail(container, previewData);
            this.previewCache.set(url, previewData);
        } catch (error) {
            console.error('OGP Fetch failed:', error);
            // エラー時はフォールバック画像を設定
            const previewData = {
                title: 'Web Page',
                image: this.fallbackImage,
                url: url
            };
            this.updateThumbnail(container, previewData);
            this.previewCache.set(url, previewData);
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
            // data属性に元の画像パスを保存（元に戻せるように）
            if (!img.hasAttribute('data-original-src')) {
                img.setAttribute('data-original-src', img.src);
            }
            img.src = previewData.image;
            img.alt = previewData.title;
        } else {
            img = document.createElement('img');
            img.src = previewData.image;
            img.alt = previewData.title;
            container.appendChild(img);
        }
        
        // プレビュー用のオーバーレイクラスを追加
        container.classList.add('link-preview');
    }
}

// グローバル関数として定義（components-loader.jsから呼び出せるようにする）
window.initLinkPreviews = function() {
    const previewGenerator = new LinkPreviewGenerator();
    
    // メディアセクションのアイテムにプレビューを適用
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach(item => {
        previewGenerator.generatePreview(item);
    });
};

// DOMコンテンツロード時にリンクプレビューを初期化
document.addEventListener('DOMContentLoaded', function() {
    // メディアアイテムが既にDOMにある場合は初期化を実行
    if (document.querySelectorAll('.media-item').length > 0) {
        window.initLinkPreviews();
    }
});
