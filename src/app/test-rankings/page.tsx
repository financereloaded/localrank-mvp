'use client';

import { useState } from 'react';

interface RankingResult {
  position: number;
  url: string;
  page: number;
  serp_type: 'organic' | 'maps';
  title?: string;
  snippet?: string;
}

export default function TestRankings() {
  const [keyword, setKeyword] = useState('plumber');
  const [location, setLocation] = useState('Miami, FL');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RankingResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const params = new URLSearchParams({ keyword });
      if (location) params.append('location', location);

      const response = await fetch(`/api/track-rankings?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Request failed');
        return;
      }

      setResults(data.results || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rank Tracking API Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter keyword"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="City, State"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchRankings}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Loading...' : 'Track'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">URL</th>
                  <th className="px-4 py-2 text-left">Page</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.position} className="border-t">
                    <td className="px-4 py-2">{result.position}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        result.serp_type === 'maps' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {result.serp_type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm truncate max-w-xs">{result.title}</td>
                    <td className="px-4 py-2 text-sm truncate max-w-xs">
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {result.url}
                      </a>
                    </td>
                    <td className="px-4 py-2">{result.page}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
