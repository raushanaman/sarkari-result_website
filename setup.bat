@echo off
echo Setting up Sarkari Result Website...
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
echo Backend dependencies installed!
echo.

echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
echo Frontend dependencies installed!
echo.

echo Setup completed successfully!
echo.
echo To start the application:
echo 1. Start MongoDB service
echo 2. Run 'npm run dev' in backend folder
echo 3. Run 'npm run dev' in frontend folder
echo 4. Visit http://localhost:3000
echo.
echo Admin Login: http://localhost:3000/admin/login
echo Username: admin
echo Password: admin123
echo.
pause