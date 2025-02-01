import { Link, useLoaderData } from "@remix-run/react";
import { formatDate } from "~/utils/date";
import { getTopNews } from "~/components/getNews";

// リンクリストの定義を追加
const links = [
  { title: '非公式Wiki', url: '//example.com' },
  { title: 'BANリスト', url: '//discord.gg/example' },
  { title: '公式X', url: '//auth.example.com/register' },
  { title: 'minecraft.jp', url: '//auth.example.com/reset' }
];

interface SidebarData {
  news: {
    id: string;
    title: string;
    postDate?: string;
    newsId?: string;
  }[];
}

export default function Sidebar() {
  /*const { news } = useLoaderData<SidebarData>();*/

  return (
    <div className="space-y-4 sticky top-4">
      {/* サーバー情報 */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-700">ログインアドレス: mofucraft.net</p>
        <p className="text-gray-700">おすすめバージョン: 1.20.x</p>
      </div>

      {/* イベント */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="p-4 font-bold border-b">Events</h2>
        <div className="p-4">
          準備中
          {/* <DiscordEvents /> */}
        </div>
      </div>

      {/* ステータス */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow">
          <h2 className="p-4 font-bold border-b">Status</h2>
          <div className="p-4">
            準備中
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <h2 className="p-4 font-bold border-b">準備中</h2>
          <div className="p-4">
            準備中
          </div>
        </div>
      </div>

      {/* News */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="p-4 font-bold border-b">
          <Link to="/news" className="hover:text-blue-500 transition-colors">News</Link>
        </h2>
        <div className="divide-y divide-gray-100">

        </div>
      </div>

      {/* Links */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="p-4 font-bold border-b">Links</h2>
        <div className="p-4 space-y-2">
          {links.map((link, index) => (
            <div key={index}>
              <Link
                to={link.url}
                className="text-blue-500 hover:underline block"
              >
                {link.title}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Twitter */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="p-4 font-bold border-b">Twitter @mofucraft</h2>
        <div className="p-4">
          準備中
        </div>
      </div>

      {/* Solo Server */}
      <div id="solo" className="bg-white rounded-lg shadow">
        <h2 className="p-4 font-bold border-b">Solo Server</h2>
        <div className="p-4 text-center">
          <p>シングルプレイなマルチプレイ！？</p>
          <div id="solo-icon" className="my-4">
            <Link to="//solo.mofucraft.net">
              <img src="//mofucraft.net/image/Grass.png" alt="Solo Server" className="mx-auto" />
            </Link>
          </div>
          <p>↑↑ 気になったらクリック！ ↑↑</p>
        </div>
      </div>
    </div>
  );
}
