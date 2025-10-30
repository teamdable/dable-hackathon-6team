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
        await this.loadCollections();
        this.renderFeaturedPosts();
        this.renderArticles();
        this.setupEventListeners();
    }

    // Markdown 파일에서 frontmatter 추출
    parseFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = content.match(frontmatterRegex);
        
        if (!match) return null;
        
        const frontmatter = {};
        const lines = match[1].split('\n');
        
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) return;
            
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // 따옴표 제거
            value = value.replace(/^["']|["']$/g, '');
            
            // 배열 처리
            if (value.startsWith('[') && value.endsWith(']')) {
                value = JSON.parse(value);
            }
            
            frontmatter[key] = value;
        });
        
        return frontmatter;
    }

    // 포스트 데이터 로드
    async loadPosts() {
        try {
            // 파일 목록 가져오기
            const filesResponse = await fetch('data/files.json');
            const filesData = await filesResponse.json();
            const postFiles = filesData.posts || [];
            
            this.posts = await Promise.all(
                postFiles.map(async (filename) => {
                    try {
                        const response = await fetch(`posts/${filename}`);
                        const content = await response.text();
                        const frontmatter = this.parseFrontmatter(content);
                        
                        if (!frontmatter) return null;
                        
                        // 파일명에서 ID 생성
                        const id = filename.replace('.md', '');
                        
                        return {
                            id,
                            title: frontmatter.title,
                            date: frontmatter.date,
                            category: frontmatter.category,
                            image: frontmatter.image,
                            venue: frontmatter.venue,
                            period: frontmatter.period,
                            excerpt: frontmatter.excerpt,
                            tags: frontmatter.tags,
                            content: `posts/${filename}`
                        };
                    } catch (error) {
                        console.error(`Error loading ${filename}:`, error);
                        return null;
                    }
                })
            );
            
            // null 값 제거 및 날짜순 정렬
            this.posts = this.posts
                .filter(post => post !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
        } catch (error) {
            console.log('포스트 데이터를 불러오는 중 오류가 발생했습니다:', error);
            this.posts = [];
        }
    }

    // 컬렉션 데이터 로드
    async loadCollections() {
        try {
            // 파일 목록 가져오기
            const filesResponse = await fetch('data/files.json');
            const filesData = await filesResponse.json();
            const collectionFiles = filesData.collections || [];
            
            this.collections = await Promise.all(
                collectionFiles.map(async (filename) => {
                    try {
                        const response = await fetch(`collections/${filename}`);
                        const content = await response.text();
                        const frontmatter = this.parseFrontmatter(content);
                        
                        if (!frontmatter) return null;
                        
                        // 파일명에서 ID 생성
                        const id = filename.replace('.md', '');
                        
                        return {
                            id,
                            title: frontmatter.title,
                            date: frontmatter.date,
                            type: frontmatter.type,
                            image: frontmatter.image,
                            excerpt: frontmatter.excerpt,
                            related_posts: frontmatter.related_posts,
                            content: `collections/${filename}`
                        };
                    } catch (error) {
                        console.error(`Error loading ${filename}:`, error);
                        return null;
                    }
                })
            );
            
            // null 값 제거 및 날짜순 정렬
            this.collections = this.collections
                .filter(collection => collection !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
        } catch (error) {
            console.log('컬렉션 데이터를 불러오는 중 오류가 발생했습니다:', error);
            this.collections = [];
        }
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

    // Featured 컬렉션 렌더링
    renderFeaturedPosts() {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;

        // collections를 최신순으로 정렬하여 상위 3개 표시
        const featuredCollections = this.collections.slice(0, 3);
        
        featuredGrid.innerHTML = featuredCollections.map((collection, index) => {
            const isLarge = index === 0;
            return `
                <article class="featured-post ${isLarge ? 'featured-post-large' : ''}" data-post-id="${collection.id}">
                    <div class="post-image">
                        <img src="${collection.image || 'images/collections/default.jpg'}" alt="${collection.title}" loading="lazy">
                    </div>
                    <div class="post-content">
                        <span class="post-category">컬렉션</span>
                        <h2 class="post-title">${collection.title}</h2>
                        <p class="post-excerpt">${collection.excerpt}</p>
                        <div class="post-meta">
                            <span class="post-date">${this.formatDate(collection.date)}</span>
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

