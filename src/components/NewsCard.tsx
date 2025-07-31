import React from 'react';
import { ExternalLink, Clock, Globe } from 'lucide-react';
import { NewsItem } from '../types/finance';
import { formatDate } from '../utils/helpers';

interface NewsCardProps {
  news: NewsItem[];
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  if (news.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Financial News
        </h3>
        <p className="text-gray-500">No news available at the moment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Globe className="w-5 h-5 mr-2" />
        Financial News
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {news.map((item) => (
          <div key={item.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start gap-3">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    <span className="truncate">{item.source}</span>
                  </div>
                  <div className="flex items-center ml-2">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
                {item.url !== '#' && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-2 transition-colors"
                  >
                    Read more
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};