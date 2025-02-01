import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageContent, getPageInfo, getAllPages } from "~/utils/notion";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import MarkdownContent from '~/components/MarkdownContent';
import { PageContent, PageInfo } from '~/types/notion';

// データベースからリンクに該当するページIDを検索する関数
async function findPageIdBySlug(databaseId: string, slug: string): Promise<string | null> {
  const pages = await getAllPages(databaseId);
  const page = pages.find(p => p.slug === slug.toLowerCase() && !p.private);
  return page ? page.id : null;
}

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const databaseId = 'b16388157cb04c55b7584c59a2aa5b63';
  const pageId = await findPageIdBySlug(databaseId, slug);
  if (!pageId) throw new Response("Not Found", { status: 404 });

  const pageContents = await getPageContent(pageId);
  const pageInfo = await getPageInfo(pageId);

  return json({ pageContents, pageInfo });
};

export default function Page() {
  const { pageContents, pageInfo } = useLoaderData<{ 
    pageContents: PageContent[], 
    pageInfo: PageInfo 
  }>();
  const content = pageContents.map(content => content.parent).join('\n');

  return (
    <DefaultLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <header className="text-center mb-10 border-b">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="relative z-10">
              {pageInfo.title}
            </span>
            <span className="absolute left-0 bottom-0 w-full h-3 bg-blue-100 -z-10 transform -skew-x-12"></span>
          </h1>
          <time className="text-sm text-gray-600">
            {pageInfo.date}
          </time>
        </header>
        <MarkdownContent content={content} />
      </div>
    </DefaultLayout>
  );
}