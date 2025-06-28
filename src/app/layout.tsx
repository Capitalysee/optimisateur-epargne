import './globals.css';
import { Poppins } from 'next/font/google';
import ThemeProvider from '../components/ThemeProvider';
import { AuthProvider } from '../components/AuthProvider';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata = {
  title: "Optimisateur d'épargne",
  description: "Optimisez votre épargne avec un accompagnement premium et personnalisé.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={poppins.className}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
