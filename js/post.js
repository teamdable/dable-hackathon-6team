// Post Detail Page JavaScript

class PostDetail {
    constructor() {
        this.postId = this.getPostIdFromURL();
        this.postData = null;
        this.allPosts = [];
        this.init();
    }

    async init() {
        await this.loadPostData();
        if (this.postData) {
            this.renderPost();
            await this.loadMarkdownContent();
            this.renderRelatedPosts();
        } else {
            this.showError();
        }
    }

    // URL에서 포스트 ID 가져오기
    getPostIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
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
    async loadPostData() {
        try {
            // 파일 목록 가져오기
            const filesResponse = await fetch('data/files.json');
            const filesData = await filesResponse.json();
            
            // posts와 collections 모두 로드
            const postFiles = filesData.posts || [];
            const collectionFiles = filesData.collections || [];
            
            // posts 로드
            const posts = await Promise.all(
                postFiles.map(async (filename) => {
                    try {
                        const response = await fetch(`posts/${filename}`);
                        const content = await response.text();
                        const frontmatter = this.parseFrontmatter(content);
                        
                        if (!frontmatter) return null;
                        
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
                            content: `posts/${filename}`,
                            type: 'post'
                        };
                    } catch (error) {
                        console.error(`Error loading ${filename}:`, error);
                        return null;
                    }
                })
            );
            
            // collections 로드
            const collections = await Promise.all(
                collectionFiles.map(async (filename) => {
                    try {
                        const response = await fetch(`collections/${filename}`);
                        const content = await response.text();
                        const frontmatter = this.parseFrontmatter(content);
                        
                        if (!frontmatter) return null;
                        
                        const id = filename.replace('.md', '');
                        
                        return {
                            id,
                            title: frontmatter.title,
                            date: frontmatter.date,
                            type: 'collection',
                            image: frontmatter.image,
                            excerpt: frontmatter.excerpt,
                            related_posts: frontmatter.related_posts,
                            content: `collections/${filename}`,
                            category: '컬렉션'
                        };
                    } catch (error) {
                        console.error(`Error loading ${filename}:`, error);
                        return null;
                    }
                })
            );
            
            // 모든 포스트 합치기
            this.allPosts = [...posts, ...collections]
                .filter(post => post !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // 현재 포스트 찾기
            this.postData = this.allPosts.find(post => post.id === this.postId);
        } catch (error) {
            console.error('포스트 데이터를 불러오는 중 오류가 발생했습니다:', error);
        }
    }

    // 포스트 메타데이터 렌더링
    renderPost() {
        const { title, date, category, image, venue, period, excerpt, tags, type } = this.postData;

        // 제목과 기본 정보
        document.getElementById('post-title').textContent = title;
        document.getElementById('post-excerpt').textContent = excerpt;
        document.getElementById('post-category').textContent = category;
        document.getElementById('post-date').textContent = this.formatDate(date);

        // 공연 정보 (컬렉션이 아닐 때만 표시)
        const performanceInfo = document.querySelector('.performance-info');
        if (type === 'collection') {
            // 컬렉션일 경우 공연 정보 숨기기
            if (performanceInfo) performanceInfo.style.display = 'none';
        } else {
            // 일반 포스트일 경우 공연 정보 표시
            if (performanceInfo) performanceInfo.style.display = 'flex';
            if (venue) document.getElementById('post-venue').textContent = venue;
            if (period) document.getElementById('post-period').textContent = period;
        }

        // 이미지
        const imageElement = document.getElementById('post-image');
        if (image) {
            imageElement.src = image;
            imageElement.alt = title;
        } else {
            imageElement.src = 'images/posts/default.jpg';
            imageElement.alt = '기본 이미지';
        }

        // 태그
        if (tags && tags.length > 0) {
            const tagsContainer = document.getElementById('post-tags');
            tagsContainer.innerHTML = tags.map(tag => 
                `<span class="tag">#${tag}</span>`
            ).join('');
        }

        // 페이지 제목 업데이트
        document.title = `${title} - StageX`;
    }

    // 마크다운 컨텐츠 로드 및 렌더링
    async loadMarkdownContent() {
        const { content } = this.postData;
        
        if (!content) {
            document.getElementById('post-content').innerHTML = 
                '<p>컨텐츠를 불러올 수 없습니다.</p>';
            return;
        }

        try {
            const response = await fetch(content);
            let markdown = await response.text();
            
            // YAML Front Matter 제거
            markdown = this.removeFrontMatter(markdown);
            
            // 마크다운을 HTML로 변환
            const html = marked.parse(markdown);
            document.getElementById('post-content').innerHTML = html;
        } catch (error) {
            console.error('마크다운 컨텐츠를 불러오는 중 오류가 발생했습니다:', error);
            document.getElementById('post-content').innerHTML = 
                '<p>컨텐츠를 불러올 수 없습니다.</p>';
        }
    }

    // YAML Front Matter 제거
    removeFrontMatter(markdown) {
        const frontMatterRegex = /^---\n[\s\S]*?\n---\n/;
        return markdown.replace(frontMatterRegex, '');
    }

    // 관련 포스트 렌더링
    renderRelatedPosts() {
        const relatedPostsContainer = document.getElementById('related-posts');
        
        // 같은 카테고리의 다른 포스트 찾기 (최대 3개)
        const relatedPosts = this.allPosts
            .filter(post => 
                post.id !== this.postId && 
                post.category === this.postData.category
            )
            .slice(0, 3);

        if (relatedPosts.length === 0) {
            relatedPostsContainer.innerHTML = '<p>관련 공연이 없습니다.</p>';
            return;
        }

        relatedPostsContainer.innerHTML = relatedPosts.map(post => `
            <a href="post.html?id=${post.id}" class="related-post-card">
                <div class="related-post-image">
                    <img src="${post.image || 'images/posts/default.jpg'}" 
                         alt="${post.title}" loading="lazy">
                </div>
                <div class="related-post-content">
                    <h3 class="related-post-title">${post.title}</h3>
                    <span class="related-post-category">${post.category}</span>
                </div>
            </a>
        `).join('');
    }

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ko-KR', options);
    }

    // 에러 표시
    showError() {
        document.querySelector('.post-main').innerHTML = `
            <div class="container-narrow" style="text-align: center; padding: 80px 20px;">
                <h1 style="font-size: 48px; margin-bottom: 16px;">😢</h1>
                <h2 style="margin-bottom: 16px;">포스트를 찾을 수 없습니다</h2>
                <p style="color: #666; margin-bottom: 32px;">
                    요청하신 공연 정보를 찾을 수 없습니다.
                </p>
                <a href="index.html" style="
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: var(--primary-color);
                    color: white;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                ">홈으로 돌아가기</a>
            </div>
        `;
    }
}

// 공유 기능
function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.getElementById('post-title').textContent);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('링크가 복사되었습니다!');
    }).catch(err => {
        console.error('링크 복사 실패:', err);
        alert('링크 복사에 실패했습니다.');
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new PostDetail();
});

