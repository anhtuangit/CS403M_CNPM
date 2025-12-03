set up
create .env 
1, fe
VITE_GOOGLE_CLIENT_ID= gg client id
2, be 
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/batdongsan
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=super-secret-string
CLIENT_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=example@gmail.com
SMTP_PASS=app-password
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=ChangeMe123!
COOKIE_DOMAIN=localhost
<!-- Instal library -->
## Frontend
cd frontend
npm i
### Run
npm run dev
## Backend
cd backend
npm i
## Run
npm run dev
