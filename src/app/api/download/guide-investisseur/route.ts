import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Chemin vers le fichier PDF dans le dossier public
    const filePath = path.join(process.cwd(), 'public', 'guide-investisseur-debutant.pdf');
    
    // Vérifier si le fichier existe
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

    // Lire le fichier
    const fileBuffer = await fs.readFile(filePath);

    // Créer la réponse avec les headers appropriés pour forcer le téléchargement
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Guide-Investisseur-Debutant.pdf"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });

    return response;
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    );
  }
} 