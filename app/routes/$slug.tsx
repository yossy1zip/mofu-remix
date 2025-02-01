import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageContent, getPageInfo, getAllPosts } from "~/utils/notion";
import Markdown from 'markdown-to-jsx';
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { useState, useEffect } from 'react';

interface PageContent {
  parent: string;
}

interface PageInfo {
  title: string;
  date: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// データベースからリンクに該当するページIDを検索する関数
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
    const [toc, setToc] = useState<TocItem[]>([]);

    useEffect(() => {
        const headings: TocItem[] = [];
        pageContents.forEach(content => {
            const lines = content.parent.split('\n');
            lines.forEach(line => {
                const match = line.match(/^(#{1,3})\s+(.+)$/);
                if (match) {
                    const level = match[1].length;
                    const text = match[2];
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    headings.push({ id, text, level });
                }
            });
        });
        setToc(headings);
    }, [pageContents]);

    const handleTocClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <DefaultLayout>
            <div className="bg-white rounded-lg shadow p-6">
                <article className="max-w-4xl mx-auto">
                    {/* タイトルセクション */}
                    <header className="text-center mb-8 pb-4 border-b border-gray-200">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            {pageInfo.title}
                        </h1>
                        <time className="text-gray-600">
                            {pageInfo.date}
                        </time>
                    </header>

                    {/* 目次セクション */}
                    {toc.length > 0 && (
                        <nav className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="text-lg font-bold mb-3 pb-2 border-b border-gray-200">目次</h2>
                            <ul className="space-y-1">
                                {toc.map((item, index) => (
                                    <li 
                                        key={index} 
                                        className={`
                                            hover:text-blue-600 transition-colors
                                            ${item.level === 1 ? 'font-medium' : ''}
                                            ${item.level === 2 ? 'ml-4' : ''}
                                            ${item.level === 3 ? 'ml-8 text-sm' : ''}
                                        `}
                                    >
                                        <a href={`#${item.id}`} className="hover:underline">
                                            {item.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {/* コンテンツ */}
                    <div className="prose prose-lg max-w-none">
                        {pageContents.map((content, index) => {
                            const formattedMarkdown = content.parent.replace(/\n/g, '  \n')
                                .replace(/\[toc\]/gi, ''); // [toc]タグを削除

                            return (
                                <div className="pt-3" key={index}>
                                    <Markdown
                                        options={{
                                            overrides: {
                                                h1: {
                                                    component: 'h1',
                                                    props: {
                                                        className: 'text-3xl font-bold mt-8 mb-4',
                                                        id: (props: any) => props.children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                                    }
                                                },
                                                h2: {
                                                    component: 'h2',
                                                    props: {
                                                        className: 'text-2xl font-bold mt-6 mb-3',
                                                        id: (props: any) => props.children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                                    }
                                                },
                                                h3: {
                                                    component: 'h3',
                                                    props: {
                                                        className: 'text-xl font-bold mt-4 mb-2',
                                                        id: (props: any) => props.children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                                    }
                                                },
                                                a: {
                                                    component: 'a',
                                                    props: {
                                                        className: 'text-blue-600 hover:underline',
                                                        target: '_blank',
                                                        rel: 'noopener noreferrer'
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
                    </div>
                </article>
            </div>
        </DefaultLayout>
    );
}