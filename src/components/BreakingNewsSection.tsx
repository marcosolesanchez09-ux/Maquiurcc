import React, { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Newspaper, RefreshCw } from 'lucide-react';
import type { NewsArticle } from '../shared/types';

function formatRelativeTime(iso: string): string {
  const diffMin = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (diffMin < 60) return `hace ${diffMin} min`;
  const hours = Math.floor(diffMin / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

export const BreakingNewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const resp = await fetch('/api/news');
      if (resp.ok) {
        const data = (await resp.json()) as { articles: NewsArticle[] };
        setArticles(data.articles || []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews(false);
  }, [loadNews]);

  return (
    <section
      id="noticias-ultima-hora"
      className="pt-8 border-t border-white/10 space-y-5"
      aria-labelledby="breaking-news-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Newspaper className="w-4 h-4" />
            <span>Actualidad futbolística</span>
          </div>
          <h2
            id="breaking-news-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-white mt-1"
          >
            Noticias de última hora
          </h2>
        </div>

        <button
          type="button"
          disabled={refreshing}
          onClick={() => loadNews(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#151E29] border border-white/10 text-slate-200 hover:border-white/25 transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Actualizando...' : 'Actualizar noticias'}</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-44 rounded-xl bg-[#151E29] border border-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <article
              key={article.id}
              className="p-5 rounded-xl bg-[#151E29] border border-white/10 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400">{article.source}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{formatRelativeTime(article.publishedAt)}</span>
                </div>

                <h3 className="font-display text-xl font-bold text-white leading-snug">
                  {article.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors pt-2 border-t border-white/10"
              >
                <span>Leer artículo completo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-[#151E29] border border-white/10 text-center">
          <p className="text-sm text-slate-300">
            No se pudieron cargar titulares en este momento. Pulsa en Actualizar noticias para reintentar.
          </p>
        </div>
      )}
    </section>
  );
};
