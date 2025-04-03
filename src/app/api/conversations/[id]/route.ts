import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params object before accessing the id property
    const { id } = await params;
    const conversationId = id;
    
    // Get auth token from cookies or Authorization header
    let token = request.cookies.get('authToken')?.value;
    
    // Check Authorization header if no cookie token
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    // Return error if no token
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: { 
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        } 
      }, { status: 401 });
    }
    
    // Prepare headers for the external API call
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    // Call the actual external API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/${conversationId}`,
      { headers }
    );
    console.log("🚀 ~ response:", response);
    
    // Return the data from the external API to the client
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API proxy error:', error.response?.data || error.message);
    
    // Handle authentication errors specifically
    if (error.response?.status === 401) {
      return NextResponse.json({ 
        success: false, 
        error: { 
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        } 
      }, { status: 401 });
    }
    
    // Handle other errors
    return NextResponse.json({ 
      success: false, 
      error: { 
        message: error.response?.data?.error?.message || 'Error processing request',
        code: error.response?.data?.error?.code || 'API_ERROR'
      } 
    }, { status: error.response?.status || 500 });
  }
} 