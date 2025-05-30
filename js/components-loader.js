// コンポーネントの読み込み（モダンfetch APIバージョン）
document.addEventListener('DOMContentLoaded', async function() {
    const components = [
        { file: 'header.html', placeholder: 'header-placeholder' },
        { file: 'hero.html', placeholder: 'hero-placeholder' },
        { file: 'about.html', placeholder: 'about-placeholder' },
        { file: 'skills.html', placeholder: 'skills-placeholder' },
        { file: 'experience.html', placeholder: 'experience-placeholder' },
        { file: 'projects.html', placeholder: 'projects-placeholder' },
        { file: 'media.html', placeholder: 'media-placeholder' },
        { file: 'contact.html', placeholder: 'contact-placeholder' },
        { file: 'footer.html', placeholder: 'footer-placeholder' }
    ];

    // すべてのコンポーネントを並列で読み込む
    await loadAllComponents(components);

    // コンポーネントの読み込みが完了したので初期化処理を実行
    initializePage();

    // すべてのコンポーネントを並列で読み込む関数
    async function loadAllComponents(components) {
        const promises = components.map(component => loadComponent(component));
        await Promise.all(promises);
    }

    // 単一のコンポーネントを読み込む関数
    async function loadComponent(component) {
        try {
            const response = await fetch(`components/${component.file}`);
            
            if (response.ok) {
                const html = await response.text();
                const placeholder = document.getElementById(component.placeholder);
                if (placeholder) {
                    placeholder.outerHTML = html;
                }
            } else {
                console.error(`Failed to load component ${component.file}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error loading component ${component.file}:`, error);
            // フォールバックUIを表示
            const placeholder = document.getElementById(component.placeholder);
            if (placeholder) {
                placeholder.innerHTML = `<div class="error-message">コンポーネントの読み込みに失敗しました: ${component.file}</div>`;
            }
        }
    }

    // ページの初期化処理（コンポーネント読み込み後に実行）
    function initializePage() {
        // main.jsのinit関数を実行
        if (typeof window.init === 'function') {
            window.init();
        }
        
        // AOSアニメーションの初期化はmain.jsに一元化済み
        
        // Hero Animation を初期化
        if (typeof window.initHeroAnimation === 'function') {
            window.initHeroAnimation();
        }
        
        // Link Previewを初期化
        if (typeof window.initLinkPreviews === 'function') {
            window.initLinkPreviews();
        }

        // ページロード後にスムーススクロールなどの機能をセットアップ
        setupEventListeners();
    }

    // イベントリスナーのセットアップ（重複するコードはmain.jsに統合）
    function setupEventListeners() {
        // URLハッシュ更新時のスムーススクロール設定のみここで行う
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                // デフォルトの動作は阻止しない（main.jsのスムーススクロールが処理）
                // URLハッシュの更新のみ行う
                const targetID = this.getAttribute('href');
                if (targetID && targetID !== '#') {
                    setTimeout(() => {
                        history.pushState(null, null, targetID);
                    }, 100);
                }
            });
        });
    }
});

// ブラウザの戻る/進むボタンでの動作を確保
window.addEventListener('popstate', function() {
    const hash = window.location.hash;
    if (hash) {
        const element = document.querySelector(hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
});