import { Client } from '@notionhq/client';
import {NotionToMarkdown} from "notion-to-md";
// @ts-ignore
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });  // 100秒のデフォルトTTL（有効期限）

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export default notion;

const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getPageContent(pageId) {
    if (!pageId) {
        throw new Error('Page ID is undefined');
    }
    console.log('Received pageId:', pageId);

    const cacheKey = `content-markdown-${pageId}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    } else {
        const markdown = await n2m.pageToMarkdown(pageId, 2); // ページをMarkdownに変換
        cache.set(cacheKey, markdown);
        return markdown;
    }
}

export async function getDatabase(databaseId) {
    return await notion.databases.query({
        database_id: databaseId || '',
    });
}

export async function getAllPosts(databaseId: string) {

    if (!databaseId) {
        throw new Error('Database ID is undefined');
    }

    const cacheKey = `posts-${databaseId}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    } else {
        const response = await notion.databases.query({
            database_id: databaseId,
        });
        const posts = response.results.map((post) => ({
            id: post.id,
            title: post.properties.title.title[0]?.plain_text,
            slug: post.properties.slug?.rich_text[0]?.plain_text,
            postDate: post.properties.postDate?.date?.start,
            date: post.properties.date?.date.start,
            private: post.properties.private?.boolean,
            newsId: post.properties.newsId?.number,
            // multi_selectプロパティの取り出し（例：types）
            //const types = post.properties.types.multi_select.map((item:any) => item.name);

            // filesプロパティの取り出し（例：file）
            //const files = post.properties.file.files.map((file:any) => file.file.url);

            // peopleプロパティの取り出し（例：author）
            //const author = post.properties.author.select.name;
        }));
        cache.set(cacheKey, posts);
        return posts;
    }
}


//個々のページの詳細を取得
interface NotionPostInfo {
    title:  string;
    slug: string;
    date: string;
    author: string
}

export async function getPageInfo(pageId: string): Promise<NotionPostInfo> {
    const cacheKey = `info-${pageId}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    } else {
        const page = await notion.pages.retrieve({ page_id: pageId });
        const pageInfo = {
            id: page.id,
            title: page.properties.title.title[0]?.plain_text,
            slug: page.slug?.rich_text[0]?.plain_text,
            date: page.date?.date.start,
            author: page.author?.select.name,
        };
        cache.set(cacheKey, pageInfo);
        return pageInfo;
    }
}
