# Coffee Kiosk Payment Backend

A minimalistic Node.js/TypeScript API service for handling M-PESA STK Push payments, designed for the Safaricom sandbox environment.

---

## 🚀 Features

- **STK Push initiation** (`/pay`)
- **Payment confirmation callback** (`/callback`)
- **OAuth token generation** (middleware)
- **Sandbox environment support**
- **Comprehensive test suite** (unit & integration)
- **TypeScript-first** codebase

---

## 📋 Prerequisites

- **Node.js** v14 or higher
- **npm** (or yarn)
- **Ngrok** (for local development and callbacks)
- **Safaricom Developer Account** (sandbox credentials)

---

## 🔧 Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd coffee-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create your environment file:**
   - Copy and fill in your credentials:
     ```bash
     cp .env.example .env
     ```
   - If `.env.example` does not exist, create `.env` with:
     ```
     CONSUMER_KEY=your_consumer_key_here
     SECRET=your_secret_here
     PASSKEY=your_passkey_here
     PAYBILL=your_paybill_number_here
     CALLBACK_URL=https://your-ngrok-url/callback
     PORT=3000
     ```

---

## 🏃 Running the Application

### In Development (with hot reload & TypeScript)
```bash
npm run dev
```
- Runs using `ts-node-dev` on your local machine.

### In Production
```bash
npm run build
npm start
```
- Compiles TypeScript to `dist/` and runs the compiled JS.

### Exposing Locally (for Safaricom callbacks)
```bash
ngrok http 3000
```
- Update your `.env`'s `CALLBACK_URL` with the new Ngrok URL.

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Individual Test Suites
```bash
# Run setup tests
npm test tests/setup.test.js

# Run validation tests
npm test tests/validation.test.js

# Run API integration tests
npm test tests/api.test.js

# Run token generation tests
npm test tests/generateToken.test.js

# Run callback tests
npm test tests/callback.test.js
```

### Run All Tests via Script
```bash
bash test.sh
```
- This script will install dependencies (if needed) and run all test suites in order.

---

## 📝 API Endpoints

### `POST /pay`
Initiate an M-PESA STK Push.

**Request Body:**
```json
{
  "phone": "254712345678",
  "amount": 100
}
```

**Response:**
```json
{
  "message": "STK Push request sent",
  "CheckoutRequestID": "ws_CO_123456789",
  "ResponseCode": "0"
}
```

---

### `POST /callback`
Receive payment confirmation from Safaricom.

**Response:**
```json
{
  "ResultCode": 0,
  "ResultDesc": "Confirmation received"
}
```

---

## 🚀 Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```
2. **Start the server:**
   ```bash
   npm start
   ```
3. **Set up your environment variables** on your production server as in `.env`.

---

## 🛠️ Project Structure

```
coffee-backend/
  src/
    app.ts           # Express app setup
    index.ts         # Entry point
    routes/          # Route handlers
    controllers/     # Business logic
    middleware/      # Custom middleware
    utils/           # Utility functions
    types/           # TypeScript types
  tests/             # Test suites
  .env               # Environment variables
  package.json
  tsconfig.json
```

---

## 📚 References

- [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
- [M-PESA API Documentation](https://developer.safaricom.co.ke/docs)

---

**Need help?** Open an issue or contact the maintainer. 
>>>>>>> a669e2e (Initial commit with backend/frontend integration)
