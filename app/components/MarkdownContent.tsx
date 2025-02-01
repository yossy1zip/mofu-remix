import { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface MarkdownContentProps {
  content: string;
  showToc?: boolean;
}

export default function MarkdownContent({ content, showToc = true }: MarkdownContentProps) {
  const [toc, setToc] = useState<TocItem[]>([]);

  // マークダウンの前処理
  const processMarkdown = (text: string) => {
    return text
      // 見出しの#を削除
      .replace(/^(#{1,3})\s*(.+)$/gm, (_, level, content) => {
        const prefix = 'h' + level.length;
        return `<${prefix}>${content}</${prefix}>`;
      })
      // カラーコードを処理
      .replace(/`#([0-9a-fA-F]{6})`/g, '<span style="color: #$1">#$1</span>');
  };

  useEffect(() => {
    if (!showToc) return;
    
    const headings: TocItem[] = [];
    content.split('\n').forEach(line => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({ id, text, level });
      }
    });
    setToc(headings);
  }, [content, showToc]);

  return (
    <>
      {showToc && toc.length > 0 && (
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
      <div className="prose prose-lg max-w-none">
        <Markdown
          options={{
            overrides: {
              p: {
                props: {
                  className: 'mb-6 leading-7'
                }
              },
              h1: {
                props: {
                  className: 'text-3xl font-bold mt-12 mb-6 text-gray-800',
                  id: (props: any) => props.children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                }
              },
              h2: {
                props: {
                  className: 'text-2xl font-bold mt-10 mb-4 text-gray-700',
                  id: (props: any) => props.children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                }
              },
              h3: {
                props: {
                  className: 'text-xl font-bold mt-8 mb-3 text-gray-600',
                  id: (props: any) => props.children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                }
              },
              a: {
                props: {
                  className: 'text-blue-600 hover:underline',
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }
              },
              pre: {
                props: {
                  className: 'bg-gray-50 rounded-lg p-4 overflow-x-auto'
                }
              },
              code: {
                props: {
                  className: 'px-2 py-1 bg-gray-100 rounded text-sm'
                }
              }
            }
          }}
        >
          {processMarkdown(content)}
        </Markdown>
      </div>
    </>
  );
}