export interface NewsApiLiteArticle {
  id: string;
  title: string;
  url: string;
  image: string;
  description: string;
  author: string;
  source_country: string;
  language: string;
  published_at: string;
}

export type NewsApiLiteResponse = NewsApiLiteArticle[];

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