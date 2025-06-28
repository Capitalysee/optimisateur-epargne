@echo off
echo Lancement du serveur de developpement...
REM Lance le serveur Next.js dans une nouvelle fenetre de terminal
start "Serveur de developpement" cmd /c "npm run dev"

echo Attente de 5 secondes que le serveur demarre...
REM Met en pause le script pendant 5 secondes
timeout /t 5 /nobreak > NUL

echo Ouverture du site dans votre navigateur...
REM Ouvre le site dans le navigateur par defaut
start http://localhost:3000

exit 