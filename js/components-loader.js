// コンポーネントの読み込み（XMLHttpRequestバージョン - CORSエラーを回避）
document.addEventListener('DOMContentLoaded', function() {
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

    // すべてのコンポーネントを同期的に読み込む（XHRを使用）
    components.forEach(component => {
        loadComponentSync(component);
    });

    // コンポーネントの読み込みが完了したので初期化処理を実行
    initializePage();

    // コンポーネントを同期的に読み込む関数（XHRを使用）
    function loadComponentSync(component) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `components/${component.file}`, false); // 同期リクエスト
            xhr.send();
            
            if (xhr.status === 200) {
                const html = xhr.responseText;
                const placeholder = document.getElementById(component.placeholder);
                if (placeholder) {
                    placeholder.outerHTML = html;
                }
            } else {
                console.error(`Failed to load component ${component.file}: ${xhr.status}`);
            }
        } catch (error) {
            console.error(`Error loading component ${component.file}:`, error);
        }
    }

    // ページの初期化処理（コンポーネント読み込み後に実行）
    function initializePage() {
        // main.jsのinit関数を実行
        if (typeof window.init === 'function') {
            window.init();
        }
        
        // AOSアニメーションを初期化
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }
        
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

    // イベントリスナーのセットアップ
    function setupEventListeners() {
        // ナビゲーションリンクのスムーススクロール
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetID = this.getAttribute('href');
                const targetElement = document.querySelector(targetID);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // URLハッシュを更新（ブラウザ履歴に残す）
                    history.pushState(null, null, targetID);
                }
            });
        });

        // ハンバーガーメニューの制御
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
            
            // ナビリンクをクリックしたらメニューを閉じる
            document.querySelectorAll('.nav-links a').forEach(item => {
                item.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }

        // スクロール時のヘッダースタイル変更
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
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