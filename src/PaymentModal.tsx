import React, { useState, useEffect } from "react";
import "./PaymentModal.css";

interface Invoice {
    id: string;
    vendor: string;
    date: string;
    dueDate: string;
    amount: number;
    priority: "High" | "Normal" | "Urgent" | "Critical";
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // nova prop aqui
    invoice: Invoice | null;
}

function isValidCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s/g, "").split("").reverse().map(Number);
    const checksum = digits.reduce((sum, digit, i) => {
        if (i % 2 === 1) {
            const doubled = digit * 2;
            return sum + (doubled > 9 ? doubled - 9 : doubled);
        }
        return sum + digit;
    }, 0);
    return checksum % 10 === 0;
}

function getCardBrand(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, "");
    if (/^4/.test(number)) return "Visa";
    if (/^5[1-5]/.test(number)) return "Mastercard";
    if (/^3[47]/.test(number)) return "American Express";
    if (/^6(?:011|5)/.test(number)) return "Discover";
    return "Desconhecida";
}

function formatCardNumber(value: string): string {
    const onlyDigits = value.replace(/\D/g, "").slice(0, 16); // no máximo 16 dígitos
    return onlyDigits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpirationDate(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 4); // máximo 4 dígitos

    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidExpiration(value: string): boolean {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;

    const [monthStr, yearStr] = value.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt("20" + yearStr, 10);

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const exp = new Date(year, month - 1, 1);
    const endOfMonth = new Date(exp.getFullYear(), exp.getMonth() + 1, 0);

    return endOfMonth >= now;
}
function formatCVC(value: string): string {
    return value.replace(/\D/g, "").slice(0, 4); // até 4 para suportar Amex
}
function isValidCVC(cvc: string, brand: string): boolean {
    const len = cvc.length;
    if (brand === "amex") {
        return len === 4;
    }
    return len === 3;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, invoice }) => {
    const [email, setEmail] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiration, setExpiration] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [country, setCountry] = useState("United States");
    const [zip, setZip] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setEmail("");
            setCardNumber("");
            setExpiration("");
            setCvv("");
            setCardName("");
            setCountry("United States");
            setZip("");
        }
    }, [isOpen]);

    if (!isOpen || !invoice) return null;

    const callEzyPayments = async (e: React.FormEvent) => {
        e.preventDefault();

        const arrName = cardName.split(" ");
        const firstName = arrName[0];
        const lastName = arrName[arrName.length - 1];

        try {
            const response = await fetch("http://localhost:8080/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    cardNumber,
                    expiry: expiration,
                    cvv,
                    firstName: firstName,
                    lastName: lastName,
                    country,
                    zip,
                    invoiceId: invoice.id,
                    amount: invoice.amount,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro na requisição");
            }

            const data = await response.json();
            console.log("backend response:", data);

            onSuccess();
        } catch (error) {
            console.error("Erro ao enviar:", error);
            alert("Erro ao processar o pagamento.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <form className="modal-form" onSubmit={callEzyPayments}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />

                    <label>Card information</label>
                    <div className="card-info">
                        <input
                            value={cardNumber}
                            onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                setCardNumber(formatted);
                            }}
                            type="text"
                            placeholder="1234 1234 1234 1234"
                            required
                        />
                        <div className="card-subfields">
                            <input
                                value={expiration}
                                onChange={(e) => {
                                    const formatted = formatExpirationDate(e.target.value);
                                    setExpiration(formatted);
                                }}
                                type="text"
                                placeholder="MM / YY"
                                required
                            />
                            <input
                                value={cvv}
                                onChange={(e) => {
                                    const formatted = formatCVC(e.target.value);
                                    setCvv(formatted);
                                }}
                                type="text"
                                placeholder="CVV"
                                required
                            />
                        </div>
                    </div>

                    <label>Cardholder name</label>
                    <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        type="text"
                        placeholder="Full name on card"
                        required
                    />

                    <label>Country or region</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                        <option>United States</option>
                        <option>Brazil</option>
                        <option>Canada</option>
                    </select>

                    <input
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        type="text"
                        placeholder="ZIP"
                        required
                    />

                    <button type="submit" className="pay-btn">Pay</button>
                    <p className="terms">
                        By clicking Pay, you agree to the Link Terms and Privacy Policy.
                    </p>
                </form>

                <button className="close-btn" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default PaymentModal;