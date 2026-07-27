import { NextResponse } from 'next/server';

// 🔄 FIXED: Links directly to your master variable from .env.local
const RAILWAY_API_URL = process.env.RAILWAY_API_URL || "https://railway.app";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 💡 FIELD ALIGNMENT: Maps your frontend 'username' input to the backend's expected 'email' key
    const formattedPayload = {
      email: body.username || body.email, 
      password: body.password
    };

    // 🔄 FIXED URL: Using master environment URL and pointing directly to their token endpoint
    const backendResponse = await fetch(`${RAILWAY_API_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedPayload),
    });

    const data = await backendResponse.json();

    if (backendResponse.ok) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: data.detail || data.message || "Unauthorized Access: Invalid Credentials." },
      { status: backendResponse.status }
    );
  } catch  {
    return NextResponse.json(
      { error: "Network connection error to the live authentication server." },
      { status: 500 }
    );
  }
}
