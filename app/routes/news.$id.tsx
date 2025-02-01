import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageContent, getPageInfo } from "~/utils/notion";
import Markdown from 'markdown-to-jsx';
import DefaultLayout from "~/components/layouts/DefaultLayout";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.id) throw new Response("Not Found", { status: 404 });
  
  const pageContents = await getPageContent(params.id);
  const pageInfo = await getPageInfo(params.id);
  
  return json({ pageContents, pageInfo });
};

export default function NewsArticle() {
  const { pageContents, pageInfo } = useLoaderData<{
    pageContents: PageContent[];
    pageInfo: PageInfo;
  }>();

  return (
    <DefaultLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{pageInfo.title}</h1>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{pageInfo.date}</span>
            {pageInfo.author && <span>{pageInfo.author}</span>}
          </div>
        </header>
        <main className="prose prose-lg max-w-none">
          {pageContents.map((content, index) => {
            const formattedMarkdown = content.parent.replace(/\n/g, '  \n');
            return (
              <div key={index} className="mb-6">
                <Markdown
                  options={{
                    overrides: {
                      ol: {
                        component: 'ol',
                        props: {
                          className: 'list-decimal list-inside pl-6 mb-4'
                        }
                      },
                      li: {
                        component: 'li',
                        props: {
                          className: 'mb-2'
                        }
                      },
                      img: {
                        component: 'img',
                        props: {
                          className: 'max-w-full h-auto my-6'
                        }
                      }
                    }
                  }}
                >
                  {formattedMarkdown}
                </Markdown>
              </div>
            );
          })}
        </main>
      </div>
    </DefaultLayout>
  );
}