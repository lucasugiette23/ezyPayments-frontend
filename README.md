💸 Invoices Payment Frontend

This project is a responsive frontend interface for viewing and paying invoices, built with React + TypeScript and pure CSS.

🚀 Features

Invoice listing with details (ID, vendor, date, due date, amount, priority)

Calculation of total amount due

Selection of an invoice for payment

Dynamic payment modal with form

Input masks and validations for:

Card number (with brand detection and Luhn validation)

Expiration date (MM/YY)

CVC / CVV (3 or 4 digits)

Success modal shown after a successful payment

🧩 Technologies Used

React

TypeScript

Pure CSS (no UI frameworks)

🗂 Project Structure

src/
├── components/
│   ├── InvoicesPage.tsx
│   ├── PaymentModal.tsx
│   ├── PaymentSuccessModal.tsx
├── styles/
│   ├── InvoicesPage.css
│   ├── PaymentModal.css
│   └── PaymentSuccessModal.css
├── utils/
│   └── cardUtils.ts  # Luhn, brand detection, masks, and validations

🧪 How to Run the Project

Clone the repository:

git clone https://github.com/youruser/invoices-frontend.git
cd invoices-frontend

Install dependencies:

npm install

Start the project:

npm run dev
# or npm start depending on the setup

Open in your browser:

http://localhost:5173

Make sure the backend is running on port 8080 and accepts POST requests to /payments.

📦 Expected API

POST /payments

{
  "email": "client@example.com",
  "cardNumber": "1234123412341234",
  "expirationDate": "12/25",
  "cvc": "123",
  "cardName": "Customer Name",
  "country": "Brazil",
  "zip": "12345",
  "invoiceId": "INV-2025-001",
  "amount": 2850.00
}

✅ Validations and Masks

Card Number: formatted as 1234 1234 1234 1234 + Luhn validation

Expiration Date: MM/YY with future date validation

CVV: 3 digits (Visa/MasterCard) or 4 digits (Amex)

🖼️ Demo (screenshots or GIFs)

[Coming soon]

🧠 Future Improvements

Add unit tests with Jest

Internationalization (i18n)

Integrate with real payment services (e.g., Stripe)

Real-time validation and loading animations

Made by Lucas Ugiette
