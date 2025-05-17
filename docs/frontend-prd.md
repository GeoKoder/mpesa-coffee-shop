# ☕ **Coffee Kiosk** – Product Requirements Document (PRD)

---

## 1. 📌 Overview

**Coffee Kiosk** is a React-based web application designed to allow users to browse and purchase coffee products online. The application integrates with the **Safaricom M-PESA STK Push API** to facilitate mobile payments directly from users' phones. With a minimalist design and mobile-first responsiveness, Coffee Kiosk provides a smooth and secure payment experience.

---

## 2. 🎯 Goals and Objectives

* Provide a simple, intuitive interface for purchasing coffee products.
* Seamlessly integrate **M-PESA STK Push** for quick mobile payments.
* Ensure secure and valid phone number handling during the payment process.
* Deliver a responsive user experience optimized for both desktop and mobile users.

---

## 3. ✨ Core Features

### 🛍️ Product Display

* Show a grid of coffee products with:

  * **Image**
  * **Name**
  * **Price** (in KES)

### 💰 Payment via Modal

* Clicking "**Buy with M-PESA**" opens a **modal**.
* Modal includes a form to enter a **Safaricom phone number**.
* On submission, sends payment request to backend.

### 🔐 Phone Number Validation

* Accepts:

  * `07XXXXXXXX`
  * `+2547XXXXXXXX`
  * `2547XXXXXXXX`
* Invalid formats are rejected with inline feedback.

### 📱 Responsive UI

* Includes:

  * Header with branding/logo
  * Navigation bar (or minimal nav)
  * Product grid (responsive to screen size)
  * Footer with attribution/contact info

---

## 4. 🔄 User Flow

1. **User visits the Coffee Kiosk site**.
2. **Coffee products are displayed** in a grid.
3. User clicks **"Buy with M-PESA"** on a product.
4. A **modal appears** asking for their Safaricom phone number.
5. User enters a valid number and submits.
6. App sends a `POST /pay` request to the backend with the product price and phone number.
7. Backend responds, and the user sees a:

   * **Success alert** if STK push is sent
   * **Error alert** if the API call fails
8. User completes the payment via M-PESA on their phone.

---

## 5. ⚙️ Technical Stack

| Layer        | Technology           |
| ------------ | -------------------- |
| **Frontend** | React + Tailwind CSS |
| **Backend**  | Node.js              |
| **API Comm** | Axios                |

> The backend must be running on `http://localhost:3000` and expose a `/pay` endpoint.

---

## 6. 🔌 API Interaction

### Endpoint

```
POST http://localhost:3000/pay
```

### Request Payload

```json
{
  "phone": "254712345678",
  "amount": 250
}
```

### Expected Backend Behavior

* Initiates an M-PESA STK Push via Safaricom API.
* Returns a success/failure response.

### Expected Frontend Behavior

* Display a **loading spinner** while request is in progress.
* Show **alert** on success/failure.

---

## 7. ❗ Validation & Error Handling

* **Phone Number Validation**:

  * Accepts only Kenyan Safaricom numbers.
  * Regex-based input checks with real-time validation.
* **Frontend Error Handling**:

  * Inline error if phone format is invalid.
  * `try-catch` block around Axios request.
  * Display error alert with a friendly message on API failure (e.g., "Failed to initiate payment. Please try again.").

---

## 8. 🎨 UI/UX Requirements

| Component          | Requirement                                                  |
| ------------------ | ------------------------------------------------------------ |
| **Theme**          | Green (#0F9D58) for primary actions, gray for neutral states |
| **Modal**          | Centered modal with input and buttons, dismissible           |
| **Typography**     | Clean and readable font (e.g., Inter, Roboto, or sans-serif) |
| **Responsiveness** | Mobile-first layout, collapsible navigation if needed        |
| **Buttons**        | Rounded, full-width on mobile, hover states                  |
| **Loading**        | Spinner or loading text shown during API requests            |

---

## 9. 📌 Assumptions & Constraints

* The backend is:

  * Running on `http://localhost:3000`
  * Properly integrated with **Safaricom M-PESA sandbox** using `/pay`
* The STK Push will be triggered only for **valid Kenyan Safaricom numbers**
* Product pricing and catalog are:

  * **Static**
  * **Hardcoded** client-side
  * No backend database is required for product data
* The app will not handle order history, user accounts, or inventory

---
