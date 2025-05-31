/**
 * Media Gallery横スクロール機能とカテゴリーフィルタリング
 */
document.addEventListener('DOMContentLoaded', function() {
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
            
            // ギャラリーをスクロール位置をリセット
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
        
        if (maxScroll > 0) {
            const scrollPercentage = gallery.scrollLeft / maxScroll;
            const thumbPosition = scrollPercentage * (200 - 50); // track width - thumb width
            if (scrollIndicator) {
                scrollIndicator.style.left = `${thumbPosition}px`;
            }
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
});