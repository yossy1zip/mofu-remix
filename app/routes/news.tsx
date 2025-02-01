import { getTopNews } from "~/components/getNews";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import DefaultLayout from "~/components/layouts/DefaultLayout";

interface NewsItem {
  id: string;
  title: string;
  postDate?: string;
  newsId?: string;
}

export const loader: LoaderFunction = async () => {
  const news = await getTopNews(10);
  return json({ news });
};

export default function News() {
  const { news } = useLoaderData<{ news: NewsItem[] }>();
  console.log('News data:', news); // データの確認用

  return (
    <DefaultLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">ニュース一覧</h1>
        </div>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.newsId || item.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <Link to={`/news/${item.newsId}`} className="text-gray-800 hover:text-gray-600">
                <small className="text-gray-500">{item.postDate}</small>
                <div className="mt-1">{item.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
