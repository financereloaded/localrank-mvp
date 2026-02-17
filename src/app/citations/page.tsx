'use client'

import { useState } from 'react'
import Link from 'next/link'
import citationsData from '@/data/citations.json'

export const metadata = {
  title: 'Citations | LocalRank MVP',
  description: 'Track your local business citations'
}

interface Directory {
  name: string
  url: string
  da: number
  category: string
}

export default function CitationsPage() {
  const directories: Directory[] = citationsData.directories
  const [claimed, setClaimed] = useState<Record<string, boolean>>({})

  // Group by category
  const categories = directories.reduce((acc, dir) => {
    if (!acc[dir.category]) {
      acc[dir.category] = []
    }
    acc[dir.category].push(dir)
    return acc
  }, {} as Record<string, Directory[]>)

  const toggleClaimed = (name: string) => {
    setClaimed(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const claimedCount = Object.values(claimed).filter(Boolean).length
  const totalCount = directories.length
  const progress = Math.round((claimedCount / totalCount) * 100)

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
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Citation Tracker</h1>
                <p className="text-sm text-gray-500">Track your business directory listings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Summary */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Citation Progress</span>
            <span className="text-sm text-gray-500">{claimedCount} of {totalCount} directories</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progress}% complete • Higher DA directories in green
          </p>
        </div>
      </div>

      {/* Directories by Category */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {Object.entries(categories).map(([category, dirs]) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
                {category}
              </span>
              <span className="text-gray-400 font-normal">({dirs.length})</span>
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claimed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Directory</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dirs.map((dir) => (
                    <tr key={dir.name} className={claimed[dir.name] ? 'bg-green-50' : ''}>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleClaimed(dir.name)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            claimed[dir.name] 
                              ? 'bg-green-600 border-green-600 text-white' 
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {claimed[dir.name] && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${claimed[dir.name] ? 'text-green-700' : 'text-gray-900'}`}>
                          {dir.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          dir.da >= 80 ? 'bg-green-100 text-green-700' :
                          dir.da >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {dir.da}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={dir.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Visit →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
