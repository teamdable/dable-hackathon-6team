#!/usr/bin/env node

/**
 * 포스트와 컬렉션 디렉토리를 스캔하여 files.json을 자동 생성하는 스크립트
 * 
 * 사용법:
 *   node scripts/generate-files-list.js
 */

const fs = require('fs');
const path = require('path');

// 프로젝트 루트 디렉토리
const rootDir = path.join(__dirname, '..');
const postsDir = path.join(rootDir, 'posts');
const collectionsDir = path.join(rootDir, 'collections');
const outputFile = path.join(rootDir, 'data', 'files.json');

/**
 * 디렉토리에서 .md 파일 목록을 가져오는 함수
 */
function getMarkdownFiles(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            console.warn(`⚠️  디렉토리를 찾을 수 없습니다: ${dirPath}`);
            return [];
        }

        const files = fs.readdirSync(dirPath);
        
        // .md 파일만 필터링하고 날짜순으로 정렬 (최신순)
        return files
            .filter(file => file.endsWith('.md'))
            .sort((a, b) => {
                // 파일명이 YYYY-MM-DD-제목.md 형식이라고 가정
                const dateA = a.substring(0, 10);
                const dateB = b.substring(0, 10);
                return dateB.localeCompare(dateA); // 내림차순 (최신순)
            });
    } catch (error) {
        console.error(`❌ 디렉토리 읽기 실패: ${dirPath}`, error.message);
        return [];
    }
}

/**
 * files.json 생성
 */
function generateFilesList() {
    console.log('🔍 파일 목록 생성 중...\n');

    // 포스트와 컬렉션 파일 목록 가져오기
    const posts = getMarkdownFiles(postsDir);
    const collections = getMarkdownFiles(collectionsDir);

    console.log(`📝 포스트: ${posts.length}개`);
    posts.forEach(file => console.log(`   - ${file}`));
    
    console.log(`\n📚 컬렉션: ${collections.length}개`);
    collections.forEach(file => console.log(`   - ${file}`));

    // JSON 객체 생성
    const filesData = {
        posts,
        collections
    };

    // data 디렉토리가 없으면 생성
    const dataDir = path.dirname(outputFile);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // files.json 파일 쓰기
    try {
        fs.writeFileSync(
            outputFile,
            JSON.stringify(filesData, null, 2),
            'utf8'
        );
        console.log(`\n✅ files.json 생성 완료: ${outputFile}`);
        console.log(`   - 총 ${posts.length + collections.length}개 파일`);
    } catch (error) {
        console.error('❌ files.json 생성 실패:', error.message);
        process.exit(1);
    }
}

// 스크립트 실행
if (require.main === module) {
    console.log('📋 StageX - 파일 목록 자동 생성기\n');
    console.log('=' .repeat(50) + '\n');
    generateFilesList();
    console.log('\n' + '='.repeat(50));
    console.log('✨ 완료!\n');
}

module.exports = { generateFilesList };

