import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(req: NextRequest) {
  try {
    // Chemin vers le fichier PDF dans le dossier racine du projet
    const pdfPath = join(process.cwd(), 'PDF Conditions Générales.pdf');
    
    // Lire le fichier PDF
    const pdfBuffer = readFileSync(pdfPath);
    
    // Retourner le PDF avec les bons headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="conditions-generales.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    return NextResponse.json(
      { error: 'Fichier PDF non trouvé' },
      { status: 404 }
    );
  }
} 