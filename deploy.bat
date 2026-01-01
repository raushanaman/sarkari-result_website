@echo off
echo Building Sarkari Result Website...

cd frontend

echo.
echo Building main website...
npm run build
if %errorlevel% neq 0 (
    echo Main build failed!
    pause
    exit /b 1
)

echo.
echo Building admin panel...
npm run build:admin
if %errorlevel% neq 0 (
    echo Admin build failed!
    pause
    exit /b 1
)

echo.
echo Both builds completed successfully!
echo.
echo Main site build: frontend/dist
echo Admin panel build: frontend/dist (with admin mode enabled)
echo.
echo Deploy the main site build to your main domain
echo Deploy the admin build to your admin subdomain
echo.
pause