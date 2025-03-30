import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    // Get code from URL parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: { message: 'No code provided' } }, 
        { status: 400 }
      );
    }
    
    // Forward the code to the backend
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/callback?code=${code}`
    );
    
    // Get data from response
    const data = response.data;
    
    // If we have a session with an access token, use it
    if (data.session && data.session.access_token) {
      return NextResponse.json({ 
        success: true, 
        token: data.session.access_token 
      });
    }
    
    // If the token is directly in the response data
    if (data.token) {
      return NextResponse.json({ 
        success: true, 
        token: data.token 
      });
    }
    
    // Check if the API returns a redirect URL with token (common pattern)
    if (data.redirectTo && data.redirectTo.includes('token=')) {
      const tokenMatch = data.redirectTo.match(/token=([^&]+)/);
      if (tokenMatch && tokenMatch[1]) {
        return NextResponse.json({ 
          success: true, 
          token: tokenMatch[1] 
        });
      }
    }
    
    // No token found in the response
    return NextResponse.json(
      { success: false, error: { message: 'No token in response' } }, 
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('OAuth callback API error:', error);
    
    // Extract error message from response if available
    const errorMessage = error.response?.data?.error?.message || 
                         error.message || 
                         'Authentication failed';
    
    return NextResponse.json(
      { success: false, error: { message: errorMessage } },
      { status: error.response?.status || 500 }
    );
  }
}