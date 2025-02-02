import { getTopNews } from "~/components/getNews";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { NewsPost } from '~/types/notion';

interface LoaderData {
  news: NewsPost[];
}

export const loader: LoaderFunction = async () => {
  const news = await getTopNews(10);
  return json({ news });
};

export default function News() {
  const { news } = useLoaderData<LoaderData>();

  return (
    <DefaultLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">ニュース一覧</h1>
        </div>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <Link to={`${item.newsId}`} className="text-gray-800 hover:text-gray-600">
                <div className="flex justify-between items-center">
                  <small className="text-gray-500">{item.postDate}</small>
                </div>
                <div className="mt-1">{item.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
