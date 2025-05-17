# 📄 Product Requirements Document (PRD)

## 🧩 Overview

This project is a minimalistic **Node.js-based API service** that integrates with the **Safaricom M-PESA STK Push API**. It allows users to initiate mobile payment requests in a **sandbox environment** via a `/pay` endpoint and handles asynchronous payment confirmations via the `/callback` endpoint.

The project is designed with simplicity in mind:

* Entire app logic in a single `index.js` file.
* Dependencies and scripts exclusively defined in `package.json`.
* Sandbox testing setup using Ngrok for local development.

---

## 🛠️ Technical Stack

* **Node.js**
* **Express** - Web server framework
* **Axios** - HTTP client for API requests
* **dotenv** - Loads environment variables
* **cors** - Enables cross-origin resource sharing

### 📦 Key Dependencies

```json
{
  "express": "^4.18.2",
  "axios": "^1.6.7",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5"
}
```

---

## 🌐 Environment Configuration

All sensitive credentials and constants are managed via `.env` file using `dotenv`.

### 🔑 Required Environment Variables

| Variable       | Description                                 |
| -------------- | ------------------------------------------- |
| `CONSUMER_KEY` | Safaricom app consumer key                  |
| `SECRET`       | Safaricom app secret                        |
| `PASSKEY`      | M-PESA passkey for generating password      |
| `PAYBILL`      | Shortcode (Business Paybill number)         |
| `CALLBACK_URL` | Public URL to receive payment confirmations |

---

## 🚀 Features and Functional Specs

### 1. 🔐 Token Generation Middleware

**Purpose**:
Authenticate and acquire an OAuth token using Basic Auth (base64-encoded consumer key\:secret).

**Details**:

* Middleware fetches and attaches the token to `req.token`.
* Token is cached in memory (optional enhancement).
* Uses `axios` to make request to:
  `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`

---

### 2. 💳 `/pay` Endpoint

**Method**: `POST`
**Path**: `/pay`

**Description**:
Initiates an STK push by constructing:

* Timestamp in `yyyyMMddHHmmss` format.
* Base64-encoded password from `PAYBILL + PASSKEY + TIMESTAMP`.
* Auth header using the token from middleware.

**Payload Example**:

```json
{
  "phone": "254712345678",
  "amount": 100
}
```

**Response Example**:

```json
{
  "message": "STK Push request sent",
  "CheckoutRequestID": "ws_CO_123456789",
  "ResponseCode": "0"
}
```

**Error Handling**:

* Logs failed requests and returns an appropriate message with HTTP status codes.

---

### 3. 🔁 `/callback` Endpoint

**Method**: `POST`
**Path**: `/callback`

**Description**:
Receives asynchronous confirmation of payment from Safaricom. Extracts and logs:

* `MpesaReceiptNumber`
* `PhoneNumber`
* `Amount`

**Response Example**:

```json
{
  "ResultCode": 0,
  "ResultDesc": "Confirmation received"
}
```

---

### 4. 🧪 Sandbox Setup & Usage

For testing in a local environment, use **Ngrok** to expose the local server to Safaricom’s sandbox.

```bash
ngrok http 3000
```

Update `.env` with:

```
CALLBACK_URL=https://<your-ngrok-url>/callback
```

---

## 🔁 Payment Flow

1. Client sends `POST /pay` with phone and amount.
2. Middleware fetches OAuth token.
3. Server generates:

   * Current timestamp.
   * Base64-encoded password.
4. Sends STK push request to Safaricom.
5. User receives STK prompt and enters PIN.
6. Safaricom sends `POST /callback` with payment results.

---

## 📘 Example Requests & Responses

### ✅ `/pay` Request

```http
POST /pay
Content-Type: application/json

{
  "phone": "254712345678",
  "amount": 150
}
```

### ✅ `/callback` Incoming Sample

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_27072023123456789",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 150 },
          { "Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV" },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      }
    }
  }
}
```

---

## 🚀 Deployment and Usage Scenario

This API is intended for development/testing in a sandbox setup:

1. Run the Node.js app locally (`node index.js`).
2. Use **Ngrok** to expose the service:

   ```bash
   ngrok http 3000
   ```
3. Configure the **CALLBACK\_URL** in your `.env`.
4. Use a REST client like Postman to initiate `/pay` requests.
5. Check logs for callbacks and confirmations.

