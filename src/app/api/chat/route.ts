import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { question, language } = await request.json();
    
    // Call the actual external API
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/query`, {
      question,
      language
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Add any API keys or auth tokens here
        // 'Authorization': `Bearer ${process.env.API_KEY}`
      }
    });
    
    // Return the data from the external API to the client
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}