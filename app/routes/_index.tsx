import { Link } from "@remix-run/react";
import DefaultLayout from "~/components/layouts/DefaultLayout";

interface MenuItem {
  title: string;
  slug: string;
  image: string;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    id: 'general',
    title: 'Menu - 全般',
    items: [
      { title: "ルール", slug: "/rules", image: "//mofucraft.net/image/link/autumn_lobby_mofulife.jpg" },
      { title: "Discord", slug: "/discord", image: "//mofucraft.net/image/link/map.jpg" },
      { title: "投票", slug: "/vote", image: "//mofucraft.net/image/link/chicken.jpg" },
      { title: "リソースパック", slug: "/resourcepack", image: "//mofucraft.net/image/link/autumn_lobby_mofulife.jpg" },
      { title: "スタッフリスト", slug: "/staff", image: "//mofucraft.net/image/link/map.jpg" },
      { title: "BANリスト", slug: "/ban", image: "//mofucraft.net/image/link/lake.jpg" },
      { title: "寄付・課金", slug: "/donation", image: "//mofucraft.net/image/link/cow.jpg" },
      { title: "お問い合わせ", slug: "/contact", image: "//mofucraft.net/image/link/wolf.jpg" },
      { title: "よくある質問", slug: "/faq", image: "//mofucraft.net/image/link/wolf.jpg" },
    ]
  },
  {
    id: 'main',
    title: 'Menu - メインサーバー',
    items: [
      { title: "はじめての方へ", slug: "/pages", image: "//mofucraft.net/image/link/chicken.jpg" },
      { title: "ルール", slug: "/rules", image: "//mofucraft.net/image/link/autumn_lobby_mofulife.jpg" },
      { title: "マッポ", slug: "/map", image: "//mofucraft.net/image/link/map.jpg" },
      { title: "ニュース一覧", slug: "/news", image: "//mofucraft.net/image/link/lake.jpg" },
      { title: "写真", slug: "/photo", image: "//mofucraft.net/image/link/cow.jpg" },
    ]
  }
];

export default function Index() {
  return (
    <DefaultLayout isTopPage={true}>
      <div className="space-y-8">
        {menuSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl mb-6 border-b-2 font-raleway">{section.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {section.items.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.slug}
                  className="flex flex-col items-center group p-2"
                >
                  <div className="w-[72px] h-[72px] mb-2 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <img
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      alt=""
                      src={item.image}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors font-raleway">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}