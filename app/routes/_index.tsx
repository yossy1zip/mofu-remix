import { Link } from "@remix-run/react";
import DefaultLayout from "~/components/layouts/DefaultLayout";
import { useState, useEffect } from "react";

interface MenuItem {
  title: string;
  slug: string;
  image: string;
  isFolder?: boolean;
  items?: MenuItem[];
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
      { 
        title: "サーバー情報", 
        slug: "#", 
        image: "//mofucraft.net/image/link/autumn_lobby_mofulife.jpg",
        isFolder: true,
        items: [
          { title: "ルール", slug: "/rules", image: "//mofucraft.net/image/link/autumn_lobby_mofulife.jpg" },
          { title: "マッポ", slug: "/map", image: "//mofucraft.net/image/link/map.jpg" },
          { title: "スタッフリスト", slug: "/staff", image: "//mofucraft.net/image/link/map.jpg" },
        ]
      },
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

const FolderIcon = ({ items }: { items: MenuItem[] }) => {
  const displayItems = items.slice(0, 4);
  
  return (
    <div className="w-[72px] h-[72px] grid grid-cols-2 gap-1 p-2 rounded-2xl bg-gray-200 shadow-lg">
      {displayItems.map((item, index) => (
        <div key={index} className="overflow-hidden rounded-lg">
          <img
            src={item.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default function Index() {
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.getElementById('folder-modal');
      if (modal && !modal.contains(event.target as Node)) {
        setOpenFolderId(null);
      }
    };

    if (openFolderId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openFolderId]);

  return (
    <DefaultLayout isTopPage={true}>
      <div className="space-y-8">
        {menuSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl mb-6 border-b-2 font-raleway">{section.title}</h2>
            <div className="grid grid-cols-3 gap-4 relative">
              {section.items.map((item, index) => (
                <div key={index}>
                  {item.isFolder ? (
                    <>
                      <button
                        onClick={() => setOpenFolderId(item.title)}
                        className="flex flex-col items-center group p-2 w-full"
                      >
                        <FolderIcon items={item.items || []} />
                        <p className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors font-raleway">
                          {item.title}
                        </p>
                      </button>
                      {openFolderId === item.title && (
                        <div className="fixed inset-0 bg-black/50 z-40">
                          <div 
                            id="folder-modal"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg bg-white rounded-xl shadow-xl p-6 z-50"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-bold">{item.title}</h3>
                              <button
                                onClick={() => setOpenFolderId(null)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                              >
                                <span className="text-2xl">×</span>
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              {item.items?.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  to={subItem.slug}
                                  className="flex flex-col items-center group p-2"
                                  onClick={() => setOpenFolderId(null)}
                                >
                                  <div className="w-[72px] h-[72px] mb-2 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                    <img
                                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                      alt=""
                                      src={subItem.image}
                                    />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors font-raleway">
                                    {subItem.title}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
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
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}