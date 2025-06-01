// コンポーネントの読み込み（CSVデータとHTMLテンプレートを組み合わせる）
document.addEventListener('DOMContentLoaded', async function() {
    // CSV データファイルのパス
    const csvFiles = {
        skills: 'data/skills.csv',
        certifications: 'data/certifications.csv',
        timeline: 'data/experience-timeline.csv',
        achievements: 'data/achievements.csv',
        projects: 'data/projects.csv',
        media: 'data/media.csv',
        profile: 'data/profile.csv',
        socialLinks: 'data/social-links.csv',
        mbtiTraits: 'data/mbti-traits.csv',
        strengths: 'data/strengths.csv',
        socialPlatforms: 'data/social-platforms.csv'
    };

    // CSVデータをロード
    let csvData = {};
    try {
        csvData = await CSVLoader.loadMultiple(csvFiles);
        window.portfolioData = csvData; // グローバルに保存
    } catch (error) {
        console.error('Failed to load CSV data:', error);
    }

    const components = [
        { file: 'header.html', placeholder: 'header-placeholder' },
        { file: 'hero.html', placeholder: 'hero-placeholder' },
        { file: 'about.html', placeholder: 'about-placeholder', data: csvData },
        { file: 'skills.html', placeholder: 'skills-placeholder', data: csvData },
        { file: 'experience.html', placeholder: 'experience-placeholder', data: csvData },
        { file: 'projects.html', placeholder: 'projects-placeholder', data: csvData },
        { file: 'media.html', placeholder: 'media-placeholder', data: csvData },
        { file: 'contact.html', placeholder: 'contact-placeholder', data: csvData },
        { file: 'footer.html', placeholder: 'footer-placeholder', data: csvData }
    ];

    // すべてのコンポーネントを読み込む
    for (const component of components) {
        await loadComponent(component);
    }

    // コンポーネントの読み込みが完了したので初期化処理を実行
    initializePage();

    // コンポーネントを読み込む関数
    async function loadComponent(component) {
        try {
            const response = await fetch(`components/${component.file}`);
            if (!response.ok) throw new Error(`Failed to load ${component.file}`);
            
            let html = await response.text();
            
            // データが利用可能な場合は、HTMLを動的に生成
            if (component.data) {
                html = await processTemplate(html, component.data, component.file);
            }
            
            const placeholder = document.getElementById(component.placeholder);
            if (placeholder) {
                placeholder.outerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading component ${component.file}:`, error);
        }
    }

    // テンプレート処理関数
    async function processTemplate(html, data, filename) {
        // 各コンポーネントごとに処理を分岐
        switch(filename) {
            case 'skills.html':
                return processSkillsTemplate(html, data);
            case 'experience.html':
                return processExperienceTemplate(html, data);
            case 'projects.html':
                return processProjectsTemplate(html, data);
            case 'media.html':
                return processMediaTemplate(html, data);
            case 'about.html':
                return processAboutTemplate(html, data);
            case 'contact.html':
                return processContactTemplate(html, data);
            case 'footer.html':
                return processFooterTemplate(html, data);
            default:
                return html;
        }
    }

    // Skills テンプレート処理
    function processSkillsTemplate(html, data) {
        // パーサーを作成
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // スキルカテゴリーごとにグループ化
        const skillsByCategory = {};
        data.skills.forEach(skill => {
            if (!skillsByCategory[skill.category]) {
                skillsByCategory[skill.category] = [];
            }
            skillsByCategory[skill.category].push(skill);
        });

        // スキルセクションを動的に生成
        const skillsContainer = doc.querySelector('.skills-container');
        skillsContainer.innerHTML = '';

        Object.entries(skillsByCategory).forEach(([category, skills]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skills-category';
            categoryDiv.setAttribute('data-aos', 'fade-up');
            
            categoryDiv.innerHTML = `
                <h3>${category}</h3>
                <div class="skill-items">
                    ${skills.map(skill => `
                        <div class="skill-item" ${skill.delay ? `data-aos="zoom-in" data-aos-delay="${skill.delay}"` : ''}>
                            <div class="skill-icon ${skill.custom_class}">
                                ${skill.icon_type === 'fontawesome' 
                                    ? `<i class="${skill.icon_class}"></i>` 
                                    : skill.icon_class}
                            </div>
                            <p>${skill.name}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            
            skillsContainer.appendChild(categoryDiv);
        });

        // 資格セクションを動的に生成
        const certificationItems = doc.querySelector('.certification-items');
        certificationItems.innerHTML = data.certifications.map(cert => `
            <div class="certification-item">
                <div class="certification-logo">
                    <img src="${cert.logo_path}" alt="${cert.name}">
                </div>
                <div class="certification-info">
                    <h4>${cert.name}</h4>
                    <p>${cert.date}</p>
                </div>
            </div>
        `).join('');

        return doc.documentElement.outerHTML;
    }

    // Experience テンプレート処理
    function processExperienceTemplate(html, data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // タイムラインを動的に生成
        const timelineItems = doc.querySelector('.timeline-items');
        timelineItems.innerHTML = data.timeline.map(item => `
            <div class="timeline-item ${item.type}" data-aos="fade-up" data-aos-delay="${item.delay}">
                <div class="timeline-dot"></div>
                <div class="timeline-date">${item.date_range}</div>
                <div class="timeline-content">
                    <span class="timeline-category">${item.category}</span>
                    <h4>${item.institution}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');

        // 実績を動的に生成
        const achievementsGrid = doc.querySelector('.achievements-grid');
        achievementsGrid.innerHTML = data.achievements.map(achievement => `
            <div class="achievement-card ${achievement.has_image === 'false' ? 'no-image' : ''}" data-aos="fade-up" data-aos-delay="${achievement.delay}">
                <div class="achievement-card-media">
                    ${achievement.has_image === 'true' 
                        ? `<img src="${achievement.image_path}" alt="${achievement.title}">` 
                        : `<div class="achievement-card-icon"><i class="${achievement.icon}"></i></div>`}
                    <div class="achievement-badge">${achievement.category}</div>
                </div>
                <div class="achievement-card-content">
                    <div class="achievement-date"><i class="far fa-calendar-alt"></i> ${achievement.date}</div>
                    <h4 class="achievement-title">${achievement.title}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                    <a href="${achievement.link_url}" class="achievement-link">詳細を見る <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        `).join('');

        return doc.documentElement.outerHTML;
    }

    // Projects テンプレート処理
    function processProjectsTemplate(html, data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const projectItems = doc.querySelector('.project-items');
        projectItems.innerHTML = data.projects.map(project => {
            const techArray = project.technologies.split(',');
            return `
                <div class="project-item" data-aos="fade-up" data-aos-delay="${project.delay}">
                    <div class="project-image" data-aos="zoom-in" data-aos-delay="${project.delay}">
                        <img src="${project.image_path}" alt="${project.title}">
                    </div>
                    <div class="project-content">
                        <h3 data-aos="fade-right" data-aos-delay="${parseInt(project.delay) + 100}">${project.title}</h3>
                        <p data-aos="fade-right" data-aos-delay="${parseInt(project.delay) + 150}">${project.description}</p>
                        <div class="project-tech" data-aos="fade-right" data-aos-delay="${parseInt(project.delay) + 200}">
                            ${techArray.map(tech => `<span>${tech.trim()}</span>`).join('')}
                        </div>
                        <div class="project-links" data-aos="fade-right" data-aos-delay="${parseInt(project.delay) + 250}">
                            <a href="${project.website_url}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> サイトを見る</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return doc.documentElement.outerHTML;
    }

    // Media テンプレート処理
    function processMediaTemplate(html, data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // カテゴリー別のカウントを計算
        const categoryCounts = {
            all: data.media.length,
            youtube: data.media.filter(item => item.category === 'youtube').length,
            article: data.media.filter(item => item.category === 'article').length,
            podcast: data.media.filter(item => item.category === 'podcast').length,
            presentation: data.media.filter(item => item.category === 'presentation').length
        };

        // カテゴリータブのカウントを更新
        doc.querySelectorAll('.category-tab').forEach(tab => {
            const category = tab.getAttribute('data-category');
            const countSpan = tab.querySelector('.count');
            if (countSpan && categoryCounts[category] !== undefined) {
                countSpan.textContent = categoryCounts[category];
            }
        });

        // メディアギャラリーを動的に生成
        const mediaGallery = doc.querySelector('.media-gallery');
        const categoryItems = data.media.map(item => `
            <div class="media-card ${item.category}-card" data-category="${item.category}">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-header">
                            <i class="${item.header_icon}"></i>
                            <span>${item.type}</span>
                        </div>
                        <div class="card-thumbnail">
                            <img src="${item.image_path}" alt="${item.title}">
                            <div class="overlay-icon"><i class="${item.overlay_icon}"></i></div>
                        </div>
                        <div class="card-content">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="card-back-content">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            <div class="card-stats">
                                <div class="stat">
                                    <i class="${item.stats_1_icon}"></i>
                                    <span>${item.stats_1_text}</span>
                                </div>
                                <div class="stat">
                                    <i class="${item.stats_2_icon}"></i>
                                    <span>${item.stats_2_text}</span>
                                </div>
                            </div>
                            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="card-action">
                                <span>${item.category === 'youtube' || item.category === 'podcast' ? '視聴する' : item.category === 'article' ? '読む' : '詳細を見る'}</span>
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // 既存のアイテムの後に挿入
        const existingItems = mediaGallery.innerHTML;
        mediaGallery.innerHTML = categoryItems;

        // ソーシャルプラットフォームを動的に生成
        const socialPlatforms = doc.querySelector('.social-platforms');
        socialPlatforms.innerHTML = data.socialPlatforms.map(platform => `
            <a href="${platform.url}" target="_blank" rel="noopener noreferrer" class="social-platform ${platform.platform.toLowerCase()}-platform">
                <div class="platform-icon">
                    <i class="${platform.icon_class}"></i>
                </div>
                <div class="platform-info">
                    <h4>${platform.platform}</h4>
                    <p>${platform.description}</p>
                    <span class="platform-stats">${platform.stats}</span>
                </div>
                <div class="platform-arrow">
                    <i class="fas fa-external-link-alt"></i>
                </div>
            </a>
        `).join('');

        return doc.documentElement.outerHTML;
    }

    // About テンプレート処理
    function processAboutTemplate(html, data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // プロフィール情報を更新
        const profile = data.profile[0];
        doc.querySelector('.profile-name').textContent = profile.name;
        doc.querySelector('.attribute-value').textContent = profile.job_title;
        
        const attributes = doc.querySelectorAll('.attribute');
        attributes[1].querySelector('.attribute-value').textContent = profile.birth_date;
        attributes[2].querySelector('.attribute-value').textContent = profile.location;
        attributes[3].querySelector('.attribute-value').textContent = profile.hobbies;

        // 自己紹介を更新
        doc.querySelector('.bio-text').textContent = profile.bio_text;

        // ソーシャルリンクを更新
        const socialLinksDiv = doc.querySelector('.social-links');
        socialLinksDiv.innerHTML = data.socialLinks.slice(0, 3).map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.title}">
                <i class="${link.icon_class}"></i>
            </a>
        `).join('');

        // MBTI情報を更新
        doc.querySelector('.mbti-letters').textContent = profile.mbti_type;
        doc.querySelector('.mbti-title').textContent = profile.mbti_title;

        // MBTIトレイトを更新
        const mbtiTraitsDiv = doc.querySelector('.mbti-traits');
        mbtiTraitsDiv.innerHTML = data.mbtiTraits.map(trait => `
            <div class="mbti-trait">
                <span class="trait-letter">${trait.trait_letter}</span>
                <div class="trait-bar">
                    <div class="trait-fill" style="width: ${trait.trait_percent}%"></div>
                </div>
                <span class="trait-percent">${trait.trait_percent}%</span>
                <span class="trait-name">${trait.trait_name}</span>
            </div>
        `).join('');

        // ストレングスファインダーを更新
        const strengthsContainer = doc.querySelector('.strengths-container');
        strengthsContainer.innerHTML = data.strengths.map(strength => `
            <div class="strength-item">
                <div class="strength-tag">${strength.strength_jp}(${strength.strength_en})</div>
                <div class="strength-desc">${strength.description}</div>
            </div>
        `).join('');

        return doc.documentElement.outerHTML;
    }

    // Contact テンプレート処理
    function processContactTemplate(html, data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // ソーシャルリンクを動的に生成
        const socialLinks = doc.querySelector('.social-links');
        if (socialLinks) {
            socialLinks.innerHTML = data.socialLinks.slice(0, 3).map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${link.title}">
                    <i class="${link.icon_class}"></i>
                </a>
            `).join('');
        }

        return doc.documentElement.outerHTML;
    }

    // Footer テンプレート処理
    function processFooterTemplate(html, data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // フッターのソーシャルリンクを動的に生成
        const footerSocial = doc.querySelector('.footer-social');
        if (footerSocial) {
            footerSocial.innerHTML = data.socialLinks.slice(0, 3).map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.title}">
                    <i class="${link.icon_class}"></i>
                </a>
            `).join('');
        }

        return doc.documentElement.outerHTML;
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