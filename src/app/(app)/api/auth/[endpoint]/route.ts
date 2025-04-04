import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// This is a dynamic API route handler for auth endpoints
export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    // Await params before destructuring
    const resolvedParams = await params;
    const { endpoint } = resolvedParams;
    const body = await request.json();
    
    console.log(`Auth API POST request to ${endpoint}:`, body);
    
    // Forward the request to the backend API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${endpoint}`, 
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          // Forward Authorization header if present
          ...(request.headers.get('Authorization') ? {
            'Authorization': request.headers.get('Authorization') || ''
          } : {})
        }
      }
    );
    
    // Return the response from the backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Await params before accessing endpoint
    const resolvedParams = await params;
    
    // More detailed error logging
    console.error(`Auth API error (${resolvedParams.endpoint}):`, {
      message: error.message,
      stack: error.stack,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      requestURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${resolvedParams.endpoint}`
    });
    
    // Return the error from the backend if available
    if (error.response) {
      return NextResponse.json(
        error.response.data, 
        { status: error.response.status }
      );
    }
    
    // Return a more specific error if backend error is not available
    return NextResponse.json({ 
      success: false, 
      error: { 
        message: 'An error occurred processing your request',
        details: error.message 
      } 
    }, { status: 500 });
  }
}

// Handler for GET requests (like /api/auth/me)
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    // Await params before destructuring
    const resolvedParams = await params;
    const { endpoint } = resolvedParams;
    
    // Special handling for Google OAuth
    if (endpoint === 'google') {
      // Extract redirect URL from query parameters
      const { searchParams } = new URL(request.url);
      const redirectUrl = searchParams.get('redirect_url') || process.env.FRONTEND_URL;
      
      // Forward the request to the backend API with the redirect URL
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`, 
        {
          params: { redirect_url: redirectUrl }
        }
      );
      
      // Return the response from the backend
      return NextResponse.json(response.data);
    }
    
    // Forward the request to the backend API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${endpoint}`,
      {
        headers: {
          // Forward Authorization header if present
          ...(request.headers.get('Authorization') ? {
            'Authorization': request.headers.get('Authorization') || ''
          } : {})
        }
      }
    );
    
    // Return the response from the backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Await params before accessing endpoint
    const resolvedParams = await params;
    
    // More detailed error logging
    console.error(`Auth API error (${resolvedParams.endpoint}):`, {
      message: error.message,
      stack: error.stack,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      requestURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${resolvedParams.endpoint}`
    });
    
    // Return the error from the backend if available
    if (error.response) {
      return NextResponse.json(
        error.response.data, 
        { status: error.response.status }
      );
    }
    
    // Return a more specific error if backend error is not available
    return NextResponse.json({ 
      success: false, 
      error: { 
        message: 'An error occurred processing your request',
        details: error.message 
      } 
    }, { status: 500 });
  }
}

// Handler for PUT requests (like /api/auth/profile)
export async function PUT(
  request: NextRequest,
  { params }: any
) {
  try {
    // Await params before destructuring
    const resolvedParams = await params;
    const { endpoint } = resolvedParams;
    const body = await request.json();
    
    console.log(`Auth API PUT request to ${endpoint}:`, body);
    
    // Forward the request to the backend API
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${endpoint}`,
      body,
      {
        headers: { 
          'Content-Type': 'application/json',
          // Forward Authorization header if present
          ...(request.headers.get('Authorization') ? {
            'Authorization': request.headers.get('Authorization') || ''
          } : {})
        }
      }
    );

    // Return the response from the backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Await params before accessing endpoint
    const resolvedParams = await params;

    // More detailed error logging
    console.error(`Auth API error (${resolvedParams.endpoint}):`, {
      message: error.message,
      stack: error.stack,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      requestURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${resolvedParams.endpoint}`
    });

    // Return the error from the backend if available
    if (error.response) {
      return NextResponse.json(
        error.response.data, 
        { status: error.response.status }
      );
    }
    
    // Return a more specific error if backend error is not available
    return NextResponse.json({ 
      success: false, 
      error: { 
        message: 'An error occurred processing your request',
        details: error.message 
      } 
    }, { status: 500 });
  }
}