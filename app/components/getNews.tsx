import { getAllPosts } from "~/utils/notion";
import { Link } from "@remix-run/react";

interface Post {
    id: string;
    postDate?: string;
    title: string;
    newsId?: string;
    private?: boolean;
}

function formatDate(dateString: string | undefined): string {
    if (!dateString) return '日付なし';

    // 既に 'YYYY/MM/DD' 形式の場合はそのまま返す
    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('/');
        return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return '無効な日付';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

export async function getTopNews(limit?: number): Promise<Post[]> {
    const databaseId = 'c2a9cd9428e742c19f559f7363a581bd';
    const posts = await getAllPosts(databaseId);

    // 新着順にソート
    posts.sort((a, b) => {
        const dateA = new Date(a.postDate || '');
        const dateB = new Date(b.postDate || '');
        return dateB.getTime() - dateA.getTime();
    });

    // limit指定がある場合は指定件数を返す
    return limit ? posts.slice(0, limit) : posts;
}
