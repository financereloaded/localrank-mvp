import Link from 'next/link'
import citationsData from '@/data/citations.json'

export const metadata = {
  title: 'Citations | LocalRank MVP',
  description: 'Top local business directories for SEO citations'
}

export default function CitationsPage() {
  const directories = citationsData.directories

  // Group by category
  const categories = directories.reduce((acc, dir) => {
    if (!acc[dir.category]) {
      acc[dir.category] = []
    }
    acc[dir.category].push(dir)
    return acc
  }, {} as Record<string, typeof directories>)

  const categoryColors: Record<string, string> = {
    'General': 'bg-gray-100 text-gray-800',
    'Map/Search': 'bg-blue-100 text-blue-800',
    'Social': 'bg-indigo-100 text-indigo-800',
    'Home Services': 'bg-green-100 text-green-800',
    'Healthcare': 'bg-red-100 text-red-800',
    'Legal': 'bg-purple-100 text-purple-800',
    'Food': 'bg-orange-100 text-orange-800',
    'Travel': 'bg-cyan-100 text-cyan-800',
    'Automotive': 'bg-yellow-100 text-yellow-800',
    'Events': 'bg-pink-100 text-pink-800',
    'Tech': 'bg-slate-100 text-slate-800',
    'Services': 'bg-teal-100 text-teal-800',
    'Business Network': 'bg-amber-100 text-amber-800',
    'Accreditation': 'bg-emerald-100 text-emerald-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Local Business Citations</h1>
            </div>
            <div className="text-sm text-gray-500">
              {directories.length} directories
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{directories.length}</div>
            <div className="text-sm text-gray-500">Total Directories</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{Object.keys(categories).length}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {directories.filter(d => d.domain_authority >= 80).length}
            </div>
            <div className="text-sm text-gray-500">High DA (80+)</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(directories.reduce((sum, d) => sum + d.domain_authority, 0) / directories.length)}%
            </div>
            <div className="text-sm text-gray-500">Avg Domain Authority</div>
          </div>
        </div>

        {/* Directories by Category */}
        {Object.entries(categories).map(([category, dirs]) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
                {category}
              </span>
              <span className="text-gray-500 font-normal text-sm">
                ({dirs.length} {dirs.length === 1 ? 'directory' : 'directories'})
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dirs
                .sort((a, b) => b.domain_authority - a.domain_authority)
                .map((directory) => (
                  <a
                    key={directory.id}
                    href={directory.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all group border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {directory.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        directory.domain_authority >= 80 ? 'bg-green-100 text-green-700' :
                        directory.domain_authority >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        DA {directory.domain_authority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {directory.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 group-hover:text-blue-500">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit site
                    </div>
                  </a>
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
