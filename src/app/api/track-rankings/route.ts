import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const location = searchParams.get('location');
  const userWebsite = searchParams.get('website'); // Optional: pass user's website to find their ranking faster

  if (!keyword) {
    return NextResponse.json(
      { error: 'Missing required parameter: keyword' },
      { status: 400 }
    );
  }

  const serpApiKey = process.env.SERPAPI_KEY;
  if (!serpApiKey) {
    return NextResponse.json(
      { error: 'Server configuration error: SerpApi key not found' },
      { status: 500 }
    );
  }

  try {
    // Fetch multiple pages to get up to 100 results
    const allResults: any[] = [];
    const pagesToFetch = 10; // 10 pages * 10 results = 100
    
    for (let start = 0; start < pagesToFetch * 10; start += 10) {
      const params = new URLSearchParams({
        api_key: serpApiKey,
        q: keyword,
        engine: 'google',
        num: '10',
        start: start.toString(),
      });

      if (location) {
        const stateMap: Record<string, string> = {
          'FL': 'Florida', 'CA': 'California', 'NY': 'New York', 'TX': 'Texas',
          'AZ': 'Arizona', 'NV': 'Nevada', 'IL': 'Illinois', 'PA': 'Pennsylvania',
          'OH': 'Ohio', 'GA': 'Georgia', 'NC': 'North Carolina', 'MI': 'Michigan'
        }
        
        let formattedLocation = location
        for (const [abbr, full] of Object.entries(stateMap)) {
          formattedLocation = formattedLocation.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full)
        }
        
        if (!formattedLocation.toLowerCase().includes('united states')) {
          formattedLocation += ', United States'
        }
        
        params.append('location', formattedLocation);
        params.append('hl', 'en');
        params.append('gl', 'us');
      }

      const response = await fetch(`https://serpapi.com/search?${params}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) break;
      
      const data = await response.json();
      
      // Process organic results
      if (data.organic_results) {
        data.organic_results.forEach((result: any, idx: number) => {
          allResults.push({
            position: start + idx + 1,
            url: result.link || '',
            page: Math.ceil((start + idx + 1) / 10),
            serp_type: 'organic',
            title: result.title,
            snippet: result.snippet,
          });
        });
      }

      // Process local results (Google Maps / Local Pack)
      if (data.local_results && Array.isArray(data.local_results)) {
        data.local_results.forEach((result: any, idx: number) => {
          allResults.push({
            position: start + idx + 1,
            url: result.link || result.website || '',
            page: 1,
            serp_type: 'maps',
            title: result.title,
            snippet: result.snippet || result.address,
          });
        });
      }
      
      // Also check local_places if present
      if (data.local_results?.places) {
        data.local_results.places.forEach((result: any, idx: number) => {
          allResults.push({
            position: start + idx + 1,
            url: result.links?.website || '',
            page: 1,
            serp_type: 'maps',
            title: result.title,
            snippet: result.description || result.address,
          });
        });
      }

      // Stop if we got fewer than 10 results (no more pages)
      const organicCount = data.organic_results?.length || 0;
      const localCount = (data.local_results?.length || 0) + (data.local_results?.places?.length || 0);
      if (organicCount + localCount < 10) break;
    }

    return NextResponse.json({
      keyword,
      location: location || null,
      results: allResults,
      total_results: allResults.length,
    });
  } catch (error) {
    console.error('SerpApi request failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings', details: String(error) },
      { status: 500 }
    );
  }
}
