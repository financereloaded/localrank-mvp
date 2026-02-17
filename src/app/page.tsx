import { supabase } from '@/lib/supabase'

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">LocalRank MVP</h1>
        <p className="text-gray-600 mb-8">Track your local SEO rankings</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Locations Card */}
          <a
            href="/locations"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
                <p className="text-gray-500 text-sm">Manage your business locations</p>
              </div>
            </div>
          </a>

          {/* Keywords Card */}
          <a
            href="/keywords"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Keywords</h2>
                <p className="text-gray-500 text-sm">Track your target keywords</p>
              </div>
            </div>
          </a>

          {/* Rankings Card */}
          <a href="/keywords" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Rankings</h2>
                <p className="text-gray-500 text-sm">View your search rankings</p>
              </div>
            </div>
          </a>

          {/* Citations Card */}
          <a href="/citations" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Citations</h2>
                <p className="text-gray-500 text-sm">Manage your business citations</p>
              </div>
            </div>
          </a>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Supabase:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
        </div>
      </div>
    </div>
  )
}
