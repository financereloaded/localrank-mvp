'use client'

import { useState } from 'react'
import Link from 'next/link'

// Demo recommendations
const initialRecommendations = [
  {
    id: 1,
    category: 'Citation',
    priority: 'High',
    title: 'Claim Your Google Business Profile',
    description: 'Ensure your Google Business Profile is fully optimized with accurate NAP data, photos, and regular posts.',
    impact: 'High',
    effort: 'Low',
  },
  {
    id: 2,
    category: 'Content',
    priority: 'High',
    title: 'Add Service Area Pages',
    description: 'Create dedicated pages for each service area you serve to improve local relevance.',
    impact: 'High',
    effort: 'Medium',
  },
  {
    id: 3,
    category: 'SEO',
    priority: 'Medium',
    title: 'Build More Citations',
    description: 'Add your business to 10+ new citation directories to improve local trust signals.',
    impact: 'Medium',
    effort: 'Low',
  },
  {
    id: 4,
    category: 'Review',
    priority: 'High',
    title: 'Request More Reviews',
    description: 'Implement a review request system after completed services.',
    impact: 'High',
    effort: 'Medium',
  },
  {
    id: 5,
    category: 'Technical',
    priority: 'Medium',
    title: 'Improve Page Speed',
    description: 'Optimize images and enable caching to improve website loading speed.',
    impact: 'Medium',
    effort: 'Medium',
  },
]

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category.toLowerCase() === filter)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-green-600'
      case 'Medium': return 'text-yellow-600'
      case 'Low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Action Recommendations</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
            <div className="text-sm text-gray-500">Total Recommendations</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {recommendations.filter(r => r.priority === 'High').length}
            </div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {recommendations.filter(r => r.priority === 'Medium').length}
            </div>
            <div className="text-sm text-gray-500">Medium Priority</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.priority === 'Low').length}
            </div>
            <div className="text-sm text-gray-500">Low Priority</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'citation', 'content', 'seo', 'review', 'technical'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${
                filter === f 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {filtered.map((rec) => (
            <div key={rec.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {rec.category}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h3>
              <p className="text-gray-600 mb-4">{rec.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Impact: </span>
                  <span className={`font-medium ${getImpactColor(rec.impact)}`}>{rec.impact}</span>
                </div>
                <div>
                  <span className="text-gray-500">Effort: </span>
                  <span className="font-medium text-gray-900">{rec.effort}</span>
                </div>
                <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Mark Complete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No recommendations in this category.
          </div>
        )}
      </main>
    </div>
  )
}
