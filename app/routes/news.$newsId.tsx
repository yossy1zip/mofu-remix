import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageContent, getPageInfo, getAllNews, getNewsByNewsId } from "~/utils/notion";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import MarkdownContent from "~/components/MarkdownContent";
import { PageContent, PageInfo } from '~/types/notion';

async function findPageIdByNewsId(databaseId: string, newsId: string): Promise<string | null> {
  const posts = await getAllNews(databaseId);
  const post = posts.find(p => p.newsId === newsId && !p.private);
  return post ? post.id : null;
}

export const loader: LoaderFunction = async ({ params }) => {
  const { newsId } = params;
  if (!newsId) throw new Response("Not Found", { status: 404 });

  const databaseId = 'c2a9cd9428e742c19f559f7363a581bd';
  const post = await getNewsByNewsId(databaseId, newsId);
  
  if (!post) throw new Response("Not Found", { status: 404 });

  try {
    const [pageContents, pageInfo] = await Promise.all([
      getPageContent(post.id),
      getPageInfo(post.id)
    ]);

    return json({ pageContents, pageInfo });
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function NewsArticle() {
  const { pageContents, pageInfo } = useLoaderData<{ 
    pageContents: PageContent[], 
    pageInfo: PageInfo 
  }>();
  const content = pageContents.map(content => content.parent).join('\n');

  return (
    <DefaultLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <header className="text-center mb-10 border-b">
          {/* ニュースセクション追加 */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-2">ニュース</p>
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <time>{pageInfo.postDate}</time>
              {pageInfo.categories && (
                <div className="flex gap-2">
                  {pageInfo.categories.map(category => (
                    <span key={category} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      {category}
                    </span>
                  ))}
                </div>
              )}
              {pageInfo.tags && (
                <div className="flex gap-2">
                  {pageInfo.tags.map(tag => (
                    <span key={tag} className="text-gray-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* 既存のタイトル */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="relative z-10">{pageInfo.title}</span>
          </h1>
        </header>
        <MarkdownContent content={content} />
      </div>
    </DefaultLayout>
  );
}