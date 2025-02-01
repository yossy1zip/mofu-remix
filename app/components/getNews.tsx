import { getAllNews } from '~/utils/notion';
import { NewsPost } from '~/types/notion';

export async function getTopNews(limit?: number): Promise<NewsPost[]> {
  const databaseId = 'c2a9cd9428e742c19f559f7363a581bd';
  const posts = await getAllNews(databaseId);

  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.postDate);
    const dateB = new Date(b.postDate);
    return dateB.getTime() - dateA.getTime();
  });

  return limit ? sortedPosts.slice(0, limit) : sortedPosts;
}
