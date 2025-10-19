// Internal application Article type.
export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// Type for the raw response from worldnewsapi.com
export interface WorldNewsApiResponse {
  news: WorldNewsApiArticle[];
}

// Type for a single article from worldnewsapi.com
export interface WorldNewsApiArticle {
  id: number;
  title: string;
  text: string;
  url: string;
  image: string;
  publish_date: string;
  authors: string[];
}