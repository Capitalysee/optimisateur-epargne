import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('=== TEST WEBHOOK DEMARRE ===');
  console.log('URL:', req.url);
  console.log('METHODE:', req.method);
  
  try {
    const body = await req.text();
    console.log('BODY LENGTH:', body.length);
    console.log('=== TEST WEBHOOK TERMINE ===');
    
    return NextResponse.json({ 
      message: 'Test webhook réussi',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.log('ERREUR TEST WEBHOOK:', error);
    return NextResponse.json({ error: 'Erreur test' }, { status: 500 });
  }
} 