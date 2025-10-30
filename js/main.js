// PerformancePulse - Main JavaScript

// 포스트 데이터 로드 및 렌더링
class PerformanceBlog {
    constructor() {
        this.posts = [];
        this.collections = [];
        this.init();
    }

    async init() {
        await this.loadPosts();
        this.renderFeaturedPosts();
        this.renderArticles();
        this.setupEventListeners();
    }

    // 포스트 데이터 로드
    async loadPosts() {
        try {
            const response = await fetch('data/posts.json');
            const data = await response.json();
            this.posts = data.posts || [];
            this.collections = data.collections || [];
        } catch (error) {
            console.log('포스트 데이터를 불러오는 중 오류가 발생했습니다:', error);
            // 기본 데이터 사용
            this.loadDefaultData();
        }
    }

    // 기본 데이터 로드 (JSON 파일이 없을 경우)
    loadDefaultData() {
        this.posts = [
            {
                id: 'post-1',
                title: '연말 추천 공연',
                category: '뮤지컬',
                date: '2025-10-01',
                image: 'images/posts/featured-1.jpg',
                excerpt: '올해를 마무리하며 꼭 봐야 할 최고의 공연들을 소개합니다.',
                featured: true
            },
            {
                id: 'post-2',
                title: '대학로 데이트 추천 공연',
                category: '연극',
                date: '2025-10-05',
                image: 'images/posts/featured-2.jpg',
                excerpt: '연인과 함께 보기 좋은 대학로 공연 TOP 5를 확인해보세요.',
                featured: true
            }
        ];
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 검색 버튼
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        // 포스트 카드 클릭
        document.querySelectorAll('.featured-post, .article-card').forEach(card => {
            card.addEventListener('click', (e) => this.handlePostClick(e));
        });

        // 스크롤 애니메이션
        this.setupScrollAnimations();
    }

    // 검색 처리
    handleSearch() {
        const searchTerm = prompt('검색어를 입력하세요:');
        if (searchTerm) {
            console.log('검색:', searchTerm);
            // 실제 검색 기능 구현
            this.searchPosts(searchTerm);
        }
    }

    // 포스트 검색
    searchPosts(term) {
        const results = this.posts.filter(post => 
            post.title.toLowerCase().includes(term.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(term.toLowerCase())
        );
        console.log('검색 결과:', results);
        // 검색 결과 표시 로직 추가 가능
    }

    // 포스트 클릭 처리
    handlePostClick(e) {
        const card = e.currentTarget;
        const title = card.querySelector('.post-title, .article-title')?.textContent;
        console.log('클릭한 포스트:', title);
        // 상세 페이지로 이동하는 로직 추가 가능
        // window.location.href = `post.html?id=${postId}`;
    }

    // 스크롤 애니메이션
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // 애니메이션 대상 요소들
        document.querySelectorAll('.featured-post, .article-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // 포스트 렌더링 (동적 생성 시 사용)
    renderPost(post, container) {
        const postElement = document.createElement('article');
        postElement.className = 'article-card';
        postElement.innerHTML = `
            <div class="article-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </div>
            <div class="article-content">
                <h3 class="article-title">${post.title}</h3>
                <span class="article-category">${post.category}</span>
                <span class="article-date">${this.formatDate(post.date)}</span>
            </div>
        `;
        postElement.addEventListener('click', () => {
            window.location.href = `post.html?id=${post.id}`;
        });
        container.appendChild(postElement);
    }

    // Featured 포스트 렌더링
    renderFeaturedPosts() {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;

        const featuredPosts = this.posts.filter(post => post.featured).slice(0, 3);
        
        featuredGrid.innerHTML = featuredPosts.map((post, index) => {
            const isLarge = index === 0;
            return `
                <article class="featured-post ${isLarge ? 'featured-post-large' : ''}" data-post-id="${post.id}">
                    <div class="post-image">
                        <img src="${post.image || 'images/posts/default.jpg'}" alt="${post.title}" loading="lazy">
                    </div>
                    <div class="post-content">
                        <span class="post-category">${post.category}</span>
                        <h2 class="post-title">${post.title}</h2>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <div class="post-meta">
                            <span class="post-date">${this.formatDate(post.date)}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // 클릭 이벤트 추가
        featuredGrid.querySelectorAll('.featured-post').forEach(card => {
            card.addEventListener('click', () => {
                const postId = card.dataset.postId;
                window.location.href = `post.html?id=${postId}`;
            });
        });
    }

    // 추천 아티클 렌더링
    renderArticles() {
        const articlesGrid = document.getElementById('articles-grid');
        if (!articlesGrid) return;

        const articles = this.posts.slice(0, 8);
        
        articles.forEach(post => {
            this.renderPost(post, articlesGrid);
        });
    }

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ko-KR', options);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const blog = new PerformanceBlog();
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

