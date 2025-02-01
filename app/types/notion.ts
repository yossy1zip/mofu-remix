import { S } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export interface BasePost {
  id: string;
  title: string;
  categories: string[];
  tags: string[];
  private: boolean;
}

export interface NewsPost extends BasePost {
  postDate: string;
  author?: string;
  newsId: string;
}

export interface StaticPage extends BasePost {
  slug: string;
  updatedAt: string;
}

export interface PageContent {
  parent: string;
}

export interface PageInfo {
  title: string;
  date: string;
  author?: string;
}