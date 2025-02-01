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
            newsId: post.properties.newsId?.rich_text[0]?.plain_text,
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

import { BasePost, NewsPost, StaticPage, PageInfo } from '~/types/notion';

export async function getPageInfo(pageId: string): Promise<PageInfo> {
    const cacheKey = `info-${pageId}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    } else {
        const page = await notion.pages.retrieve({ page_id: pageId });
        const pageInfo = {
            title: page.properties.title.title[0]?.plain_text,
            date: page.properties.date?.date?.start,
            author: page.properties.author?.select?.name,
        };
        cache.set(cacheKey, pageInfo);
        return pageInfo;
    }
}

import { NewsPost, StaticPage } from '~/types/notion';

// 日付と時間から6桁のIDを生成（暗号化）
function generateNewsId(dateStr: string): string {
  const date = new Date(dateStr);
  const base = parseInt(
    date.getFullYear().toString().slice(-2) + 
    (date.getMonth() + 1).toString().padStart(2, '0') + 
    date.getDate().toString().padStart(2, '0') +
    date.getHours().toString().padStart(2, '0') +
    date.getMinutes().toString().padStart(2, '0')
  );
  
  // 数値を変換して読みにくくする
  return (base * 7 + 13579).toString().slice(-6);
}

// IDから日付を逆算
function getDateFromNewsId(newsId: string): Date {
  const originalNum = (parseInt(newsId) - 13579) / 7;
  const year = 2000 + Math.floor(originalNum / 100000000);
  const month = Math.floor((originalNum % 100000000) / 1000000) - 1;
  const day = Math.floor((originalNum % 1000000) / 10000);
  const hour = Math.floor((originalNum % 10000) / 100);
  const minute = originalNum % 100;
  return new Date(year, month, day, hour, minute);
}

// ニュース記事の取得
export async function getAllNews(databaseId: string): Promise<NewsPost[]> {
  const cacheKey = `news-${databaseId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "postDate",
        direction: "descending"
      }
    ]
  });

  const currentDate = new Date();

  const posts = response.results
    .map((post: any) => {
      const postDate = post.properties.postDate?.date?.start;
      const createdTime = new Date(post.created_time);
      if (!postDate) return null;

      return {
        id: post.id,
        title: post.properties.title.title[0]?.plain_text,
        categories: post.properties.category?.multi_select.map((item: any) => item.name) || [],
        tags: post.properties.tags?.multi_select.map((item: any) => item.name) || [],
        private: post.properties.private?.checkbox || false,
        postDate,
        createdAt: createdTime.toISOString(),
        author: post.properties.author?.select?.name,
        newsId: generateNewsId(createdTime.toISOString())
      };
    })
    .filter((post): post is NewsPost => {
      if (!post || post.private) return false;
      const postDate = new Date(post.postDate);
      return postDate <= currentDate;
    });

  cache.set(cacheKey, posts);
  return posts;
}

// newsIdからニュースを取得する関数を追加
export async function getNewsByNewsId(databaseId: string, targetNewsId: string): Promise<NewsPost | null> {
  const posts = await getAllNews(databaseId);
  return posts.find(post => post.newsId === targetNewsId) || null;
}

// 固定ページの取得
export async function getAllPages(databaseId: string): Promise<StaticPage[]> {
  const cacheKey = `pages-${databaseId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  const pages = response.results
    .map((page: any) => ({
      id: page.id,
      title: page.properties.title.title[0]?.plain_text,
      slug: page.properties.slug?.rich_text[0]?.plain_text,
      categories: page.properties.category?.multi_select.map((item: any) => item.name) || [],
      tags: page.properties.tags?.multi_select.map((item: any) => item.name) || [],
      private: page.properties.private?.checkbox || false,
      updatedAt: page.properties.updatedAt?.date?.start || page.last_edited_time
    }))
    .filter(page => !page.private); // 非公開ページを除外

  cache.set(cacheKey, pages);
  return pages;
}
