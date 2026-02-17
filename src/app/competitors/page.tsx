'use client'

import { useState } from 'react'
import Link from 'next/link'

// Demo competitors data
const initialCompetitors = [
  { id: 1, name: 'ABC Plumbing', website: 'https://abcplumbing.com', location: 'Miami, FL' },
  { id: 2, name: 'Quick Fix Plumbing', website: 'https://quickfixplumbing.com', location: 'Miami, FL' },
]

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState(initialCompetitors)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', website: '', location: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCompetitor = {
      id: Date.now(),
      ...formData,
    }
    setCompetitors([...competitors, newCompetitor])
    setFormData({ name: '', website: '', location: '' })
    setShowForm(false)
  }

  const handleDelete = (id: number) => {
    setCompetitors(competitors.filter(c => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Competitor Analysis</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Competitor
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{competitors.length}</div>
            <div className="text-sm text-gray-500">Total Competitors</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600">Track</div>
            <div className="text-sm text-gray-500">Ranking Updates</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-blue-600">Compare</div>
            <div className="text-sm text-gray-500">Side-by-Side View</div>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4">Add New Competitor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="ABC Plumbing"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Miami, FL"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Add Competitor
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Competitors List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Business Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Website</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Location</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {competitors.map((competitor) => (
                <tr key={competitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{competitor.name}</td>
                  <td className="px-6 py-4">
                    <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {competitor.website}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{competitor.location}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Track</button>
                    <button onClick={() => handleDelete(competitor.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {competitors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No competitors added yet. Click "Add Competitor" to get started.
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Keyword Ranking Comparison</h2>
          <p className="text-gray-500 mb-4">
            Track how your keywords rank compared to competitors. Add competitors and click "Track" to see rankings.
          </p>
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Select a competitor and click "Track" to compare rankings</p>
          </div>
        </div>
      </main>
    </div>
  )
}
