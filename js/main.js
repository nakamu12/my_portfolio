// ポートフォリオサイト メインJavaScript

// グローバルな初期化関数として定義（components-loader.jsから呼び出せるようにする）
window.init = function() {
    // AOSアニメーションライブラリの初期化
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // 実績カードの画像処理とリンク表示制御
    handleAchievementCards();
    // ハンバーガーメニュー制御
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // ナビゲーションリンククリック時にメニューを閉じる
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // スクロール時のヘッダースタイル変更
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // スムーススクロール
    const smoothScroll = (target, duration) => {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const scrollY = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, scrollY);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        // イージング関数
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    // ナビゲーションリンクにスムーススクロール適用
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetID = this.getAttribute('href');
            smoothScroll(targetID, 1000);
        });
    });

    // アニメーション（スクロール時の要素表示）
    const fadeInElements = document.querySelectorAll('.about-content, .skill-item, .certification-item, .timeline-item, .project-item, .media-item');
    
    const fadeInOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.8;
        
        fadeInElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // 初期スタイル設定
    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // スクロールイベントリスナー追加
    window.addEventListener('scroll', fadeInOnScroll);
    
    // 初期ロード時にアニメーション実行
    fadeInOnScroll();
    
    // 実績カードの画像とリンク処理関数
    function handleAchievementCards() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        achievementCards.forEach(card => {
            // 画像処理 - 画像がない場合はトロフィーアイコンを表示
            const mediaContainer = card.querySelector('.achievement-card-media');
            const img = mediaContainer.querySelector('img');
            
            if (img) {
                // 画像の読み込みエラー時の処理
                img.onerror = function() {
                    // カードに no-image クラスを追加
                    card.classList.add('no-image');
                    
                    // 画像要素を削除
                    img.remove();
                    
                    // トロフィーアイコンを作成・追加
                    const iconContainer = document.createElement('div');
                    iconContainer.className = 'achievement-card-icon';
                    
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-trophy';
                    iconContainer.appendChild(icon);
                    
                    mediaContainer.appendChild(iconContainer);
                };
            }
            
            // リンク処理 - href属性が #（空リンク）の場合は非表示
            const link = card.querySelector('.achievement-link');
            if (link && (link.getAttribute('href') === '#' || link.getAttribute('href') === '')) {
                link.style.display = 'none';
            }
        });
    }
};

// DOMContentLoaded時にも初期化を実行
document.addEventListener('DOMContentLoaded', window.init);
