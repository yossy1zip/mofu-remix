import { NotionRenderer } from 'react-notion-x';
import { ExtendedRecordMap } from 'notion-types';
import 'react-notion-x/src/styles.css';
import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';

// カスタムイメージコンポーネント
const CustomImage = ({ src, alt, ...props }: { src: string; alt?: string }) => (
  <img src={src} alt={alt || ''} {...props} loading="lazy" />
);

// カスタムリンクコンポーネント
const CustomLink = ({ href, ...props }: { href: string }) => (
  <Link to={href} {...props} />
);

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface NotionRendererProps {
  recordMap: ExtendedRecordMap;
  showToc?: boolean;
}

export default function NotionContent({ recordMap, showToc = true }: NotionRendererProps) {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    if (!showToc || !recordMap) return;

    const headings = Object.values(recordMap.block)
      .filter(({ value }) => 
        value.type === 'header' || 
        value.type === 'sub_header' || 
        value.type === 'sub_sub_header'
      )
      .map(({ value }) => ({
        id: value.id,
        text: value.properties?.title?.[0]?.[0] || '',
        level: value.type === 'header' ? 1 : 
               value.type === 'sub_header' ? 2 : 3
      }));

    setToc(headings);
  }, [recordMap, showToc]);

  return (
    <>
      {showToc && toc.length > 0 && (
        <nav className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-lg font-bold mb-3 pb-2 border-b border-gray-200">目次</div>
          <ul className="space-y-1">
            {toc.map((item) => (
              <li 
                key={item.id}
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
      <div className="notion">
        <NotionRenderer
          recordMap={recordMap}
          fullPage={false}
          darkMode={false}
          components={{
            image: CustomImage,
            link: CustomLink
          }}
          mapPageUrl={id => `/pages/${id}`}
          previewImages={true}
          showCollectionViewDropdown={false}
          showTableOfContents={false}
          minTableOfContentsItems={0}
        />
      </div>
    </>
  );
}