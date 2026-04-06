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

        // Media Galleryを初期化
        initMediaGallery();

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
    
    // Media Gallery初期化関数
    function initMediaGallery() {
        const gallery = document.querySelector('.media-gallery');
        const prevBtn = document.querySelector('.gallery-nav-prev');
        const nextBtn = document.querySelector('.gallery-nav-next');
        const scrollIndicator = document.querySelector('.scroll-thumb');
        const categoryTabs = document.querySelectorAll('.category-tab');
        const mediaCards = document.querySelectorAll('.media-card');
        
        if (!gallery || !prevBtn || !nextBtn) return;
        
        // カード幅とギャップを取得
        const cardWidth = 340;
        const gap = 24;
        const scrollAmount = cardWidth + gap;
        
        // カテゴリーフィルタリング機能
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // アクティブクラスの切り替え
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const selectedCategory = this.getAttribute('data-category');
                
                // カードの表示/非表示
                mediaCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
                
                // ギャラリーのスクロール位置をリセット
                gallery.scrollLeft = 0;
                updateButtonStates();
                updateScrollIndicator();
            });
        });
        
        // スクロール状態をチェックして、ボタンの状態を更新
        function updateButtonStates() {
            const visibleCards = Array.from(mediaCards).filter(card => !card.classList.contains('hidden'));
            const totalWidth = visibleCards.length * (cardWidth + gap) - gap;
            
            // スクロール位置の判定を改善
            const scrollLeft = gallery.scrollLeft;
            const maxScrollLeft = Math.max(0, totalWidth - gallery.clientWidth);
            
            prevBtn.disabled = scrollLeft <= 1; // 1px の余裕を持たせる
            nextBtn.disabled = scrollLeft >= maxScrollLeft - 1 || visibleCards.length === 0; // 1px の余裕を持たせる
            
            // ボタンのスタイルを更新
            prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
        }
        
        // スクロールインジケーターを更新
        function updateScrollIndicator() {
            const visibleCards = Array.from(mediaCards).filter(card => !card.classList.contains('hidden'));
            const totalWidth = visibleCards.length * (cardWidth + gap) - gap;
            const maxScroll = Math.max(totalWidth - gallery.clientWidth, 0);
            
            if (maxScroll > 0 && scrollIndicator) {
                const scrollPercentage = gallery.scrollLeft / maxScroll;
                const thumbPosition = scrollPercentage * (200 - 50); // track width - thumb width
                scrollIndicator.style.left = `${thumbPosition}px`;
            }
        }
        
        // 左へスクロール
        prevBtn.addEventListener('click', () => {
            gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // 右へスクロール
        nextBtn.addEventListener('click', () => {
            gallery.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // スクロールイベントでボタンとインジケーターの状態を更新
        gallery.addEventListener('scroll', () => {
            updateButtonStates();
            updateScrollIndicator();
        });
        
        // 初期状態の設定
        updateButtonStates();
        updateScrollIndicator();
        
        // タッチデバイスでのスワイプサポート
        let startX = 0;
        let scrollStart = 0;
        let isScrolling = false;
        
        gallery.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollStart = gallery.scrollLeft;
            isScrolling = true;
        });
        
        gallery.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const currentX = e.touches[0].pageX;
            const diffX = startX - currentX;
            gallery.scrollLeft = scrollStart + diffX;
        });
        
        gallery.addEventListener('touchend', () => {
            isScrolling = false;
        });
        
        // マウスホイールでの横スクロール
        gallery.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                gallery.scrollBy({
                    left: e.deltaY < 0 ? -scrollAmount : scrollAmount,
                    behavior: 'smooth'
                });
            }
        });
        
        // カードのホバーエフェクト（3D回転）
        const cards = document.querySelectorAll('.media-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
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