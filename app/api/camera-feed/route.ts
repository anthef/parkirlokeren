// app/api/camera-feed/route.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // The public URL of your Django camera feed
  const djangoStreamUrl = `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/camera/`;

  console.log(`Proxying request to: ${djangoStreamUrl}`);

  try {
    // Fetch the stream from the public Django backend
    const djangoResponse = await fetch(djangoStreamUrl, {
      // Set duplex: 'half' to handle the streaming response correctly
      // @ts-ignore
      duplex: 'half',
    });


    // Check if the backend responded successfully
    if (!djangoResponse.ok || !djangoResponse.body) {
      throw new Error(`Failed to fetch stream from Django: ${djangoResponse.statusText}`);
    }

    // Return the stream directly to the client
    return new NextResponse(djangoResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error("Error proxying camera feed:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to connect to the camera feed.' }), {
      status: 502, // Bad Gateway
      headers: { 'Content-Type': 'application/json' },
    });
  }
}