import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const location = searchParams.get('location');

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
    const params = new URLSearchParams({
      api_key: serpApiKey,
      q: keyword,
      engine: 'google',
      num: '20',
    });

    if (location) {
      // Convert state abbreviations to full names for SerpApi
      const stateMap: Record<string, string> = {
        'FL': 'Florida', 'CA': 'California', 'NY': 'New York', 'TX': 'Texas',
        'AZ': 'Arizona', 'NV': 'Nevada', 'IL': 'Illinois', 'PA': 'Pennsylvania',
        'OH': 'Ohio', 'GA': 'Georgia', 'NC': 'North Carolina', 'MI': 'Michigan'
      }
      
      let formattedLocation = location
      // Replace state abbreviations with full names
      for (const [abbr, full] of Object.entries(stateMap)) {
        formattedLocation = formattedLocation.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full)
      }
      
      // Add country if not present
      if (!formattedLocation.toLowerCase().includes('united states')) {
        formattedLocation += ', United States'
      }
      
      params.append('location', formattedLocation);
      params.append('hl', 'en');
      params.append('gl', 'us');
    }

    const response = await fetch(`https://serpapi.com/search?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `SerpApi error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Parse organic results and maps results
    const results: Array<{
      position: number;
      url: string;
      page: number;
      serp_type: 'organic' | 'maps';
      title?: string;
      snippet?: string;
    }> = [];

    // Process organic results
    if (data.organic_results) {
      data.organic_results.forEach((result: any, index: number) => {
        results.push({
          position: index + 1,
          url: result.link || '',
          page: Math.ceil((index + 1) / 10),
          serp_type: 'organic',
          title: result.title,
          snippet: result.snippet,
        });
      });
    }

    // Process maps results (local pack)
    if (data.local_results && Array.isArray(data.local_results)) {
      data.local_results.forEach((result: any, index: number) => {
        results.push({
          position: index + 1,
          url: result.link || result.website || '',
          page: 1,
          serp_type: 'maps',
          title: result.title,
          snippet: result.snippet || result.address,
        });
      });
    }

    return NextResponse.json({
      keyword,
      location: location || null,
      results,
      total_results: results.length,
      search_metadata: {
        id: data.search_metadata?.id,
        status: data.search_metadata?.status,
      },
    });
  } catch (error) {
    console.error('SerpApi request failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings', details: String(error) },
      { status: 500 }
    );
  }
}
