import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageContent, getPageInfo, getAllPosts } from "~/utils/notion";
import Markdown from 'markdown-to-jsx';
import DefaultLayout from "~/components/layouts/DefaultLayout";

interface PageContent {
  parent: string;
}

interface PageInfo {
  title: string;
  date: string;
}

// データベースからリンクに該当するページIDを検索する関数s
async function findPageIdBySlug(databaseId: string, slug: string): Promise<string | null> {
  const posts = await getAllPosts(databaseId);
  const post = posts.find(p => p.slug === slug.toLowerCase());
  return post ? post.id : null;
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
    const { pageContents, pageInfo } = useLoaderData<{ pageContents: PageContent[], pageInfo: PageInfo }>();

    return (
        <DefaultLayout>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">--- {pageInfo.title} ---</h1>
                </div>
                <div className="text-right px-5 lg:px-20 text-gray-500">
                    <p>{pageInfo.date}</p>
                </div>
                <div className="py-10 px-5 lg:p-10 lg:px-20">
                    {pageContents.map((content, index) => {
                        const formattedMarkdown = content.parent.replace(/\n/g, '  \n');
                        return (
                            <div className="pt-3" key={index}>
                                <Markdown
                                    options={{
                                        overrides: {
                                            ol: {
                                                component: 'ol',
                                                props: {
                                                    className: 'list-decimal list-inside pb-2'
                                                }
                                            },
                                            li: {
                                                component: 'li'
                                            }
                                        }
                                    }}
                                >
                                    {formattedMarkdown}
                                </Markdown>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DefaultLayout>
    );
}