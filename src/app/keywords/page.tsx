'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Location {
  id: string
  business_name: string
  city: string
  state: string
}

interface Keyword {
  id: string
  location_id: string
  keyword: string
  website_url: string
  created_at: string
  location?: Location
}

interface Ranking {
  id: string
  keyword_id: string
  position: number
  page: number
  url: string
  serp_type: 'organic' | 'maps'
  checked_at: string
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [rankings, setRankings] = useState<Record<string, Ranking[]>>({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [newWebsite, setNewWebsite] = useState('')
  const [saving, setSaving] = useState(false)
  const [tracking, setTracking] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Demo user ID for MVP
  const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch locations
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('id, business_name, city, state')
        .order('business_name')

      if (locationsError) throw locationsError
      setLocations(locationsData || [])

      // Fetch keywords with location info
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('*')
        .order('created_at', { ascending: false })

      if (keywordsError) throw keywordsError

      // Attach location info to keywords
      const keywordsWithLocation = (keywordsData || []).map(kw => ({
        ...kw,
        location: locationsData?.find(loc => loc.id === kw.location_id)
      }))

      setKeywords(keywordsWithLocation)

      // Fetch latest rankings for each keyword
      await fetchRankings(keywordsData || [])
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchRankings(keywordsList: Keyword[]) {
    const rankingsMap: Record<string, Ranking[]> = {}

    for (const kw of keywordsList) {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .eq('keyword_id', kw.id)
        .order('checked_at', { ascending: false })
        .limit(10)

      if (!error && data) {
        rankingsMap[kw.id] = data
      }
    }

    setRankings(rankingsMap)
  }

  async function handleAddKeyword(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedLocation || !newKeyword.trim()) return

    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('keywords')
        .insert({ 
          location_id: selectedLocation, 
          keyword: newKeyword.trim(),
          website_url: newWebsite.trim() || null
        })

      if (error) throw error

      setNewKeyword('')
      setNewWebsite('')
      setSelectedLocation('')
      setShowForm(false)
      fetchData()
    } catch (err: any) {
      console.error('Error adding keyword:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteKeyword(id: string) {
    if (!confirm('Are you sure you want to delete this keyword?')) return

    try {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (err: any) {
      console.error('Error deleting keyword:', err)
      setError(err.message)
    }
  }

  async function trackKeyword(keyword: Keyword) {
    setTracking(keyword.id)
    setError('')

    try {
      // Get location details for the API call
      const location = locations.find(l => l.id === keyword.location_id)
      const locationQuery = location ? `${location.city}, ${location.state}` : ''

      // Call the tracking API
      const params = new URLSearchParams({
        keyword: keyword.keyword
      })
      if (locationQuery) {
        params.append('location', locationQuery)
      }

      const response = await fetch(`/api/track-rankings?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track rankings')
      }

      // Save rankings to database
      if (data.results && data.results.length > 0) {
        const rankingRecords = data.results.map((r: any) => ({
          keyword_id: keyword.id,
          position: r.position,
          page: r.page,
          url: r.url,
          serp_type: r.serp_type
        }))

        const { error } = await supabase
          .from('rankings')
          .insert(rankingRecords)

        if (error) throw error
      }

      // Refresh rankings
      await fetchRankings([keyword])
    } catch (err: any) {
      console.error('Error tracking keyword:', err)
      setError(err.message)
    } finally {
      setTracking(null)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Home
            </a>
            <h1 className="text-3xl font-bold text-gray-900">Keyword Tracking</h1>
            <p className="text-gray-600 mt-1">Track your keywords and monitor rankings</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setNewKeyword(''); setNewWebsite(''); setSelectedLocation(locations[0]?.id || ''); }}
            disabled={locations.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Keyword
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* No Locations Warning */}
        {locations.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            Please <a href="/locations" className="underline font-medium">add a location</a> first before tracking keywords.
          </div>
        )}

        {/* Add Keyword Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Keyword</h2>
                <form onSubmit={handleAddKeyword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Location *
                    </label>
                    <select
                      required
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a location...</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.business_name} - {loc.city}, {loc.state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keyword *
                    </label>
                    <input
                      type="text"
                      required
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., mold remediation boca raton"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Website URL
                    </label>
                    <input
                      type="url"
                      value={newWebsite}
                      onChange={(e) => setNewWebsite(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., https://bocaratonmold.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">We'll highlight your site's ranking</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setError(''); }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !selectedLocation || !newKeyword.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : 'Add Keyword'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading keywords...</p>
          </div>
        ) : keywords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No keywords yet</h3>
            <p className="text-gray-500 mb-6">Add your first keyword to start tracking rankings.</p>
            {locations.length > 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Your First Keyword
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {keywords.map((keyword) => (
              <div
                key={keyword.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Keyword Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {keyword.keyword}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {keyword.location && (
                          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {keyword.location.business_name}
                          </span>
                        )}
                        <span className="text-gray-400 text-sm">
                          Added {new Date(keyword.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => trackKeyword(keyword)}
                        disabled={tracking === keyword.id}
                        className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {tracking === keyword.id ? (
                          <>
                            <svg className="animate-spin w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Tracking...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Track Now
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteKeyword(keyword.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rankings Table */}
                <div className="p-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                    Latest Rankings
                  </h4>
                  {rankings[keyword.id] && rankings[keyword.id].length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            <th className="pb-2 pr-4">#</th>
                            <th className="pb-2 pr-4">Type</th>
                            <th className="pb-2 pr-4">URL</th>
                            <th className="pb-2">Page</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {rankings[keyword.id].slice(0, 10).map((ranking, idx) => (
                            <tr key={ranking.id} className="hover:bg-gray-50">
                              <td className="py-2 pr-4">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                  ranking.position <= 3
                                    ? 'bg-green-100 text-green-700'
                                    : ranking.position <= 10
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {ranking.position}
                                </span>
                              </td>
                              <td className="py-2 pr-4">
                                <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                                  ranking.serp_type === 'maps'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {ranking.serp_type}
                                </span>
                              </td>
                              <td className="py-2 pr-4 max-w-xs">
                                <a
                                  href={ranking.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm truncate block"
                                  title={ranking.url}
                                >
                                  {ranking.url.replace(/^https?:\/\//, '').slice(0, 50)}
                                </a>
                              </td>
                              <td className="py-2 text-sm text-gray-600">
                                {ranking.page}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <p className="text-sm">No rankings yet. Click "Track Now" to fetch rankings.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
