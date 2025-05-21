import React, { useState } from "react";
import "./InvoicesPage.css";
import PaymentModal from "./PaymentModal";
import PaymentSuccessModal from "./PaymentSuccesModal";

interface Invoice {
    id: string;
    vendor: string;
    date: string;
    dueDate: string;
    amount: number;
    priority: "High" | "Normal" | "Urgent" | "Critical";
}

const invoices: Invoice[] = [
    {
        id: "INV-2025-002",
        vendor: "Tech Solutions Inc.",
        date: "20-Feb-2025",
        dueDate: "20-Mar-2025",
        amount: 2850.0,
        priority: "High",
    },
    {
        id: "INV-2025-003",
        vendor: "Marketing Partners LLC",
        date: "28-Feb-2025",
        dueDate: "30-Mar-2025",
        amount: 4580.98,
        priority: "Normal",
    },
    {
        id: "INV-2025-004",
        vendor: "Utility Services",
        date: "01-Mar-2025",
        dueDate: "15-Mar-2025",
        amount: 526.45,
        priority: "Urgent",
    },
    {
        id: "INV-2025-007",
        vendor: "Server Hosting Pro",
        date: "08-Mar-2025",
        dueDate: "22-Mar-2025",
        amount: 899.99,
        priority: "High",
    },
    {
        id: "INV-2025-008",
        vendor: "Office Rent LLC",
        date: "01-Mar-2025",
        dueDate: "01-Mar-2025",
        amount: 5000.0,
        priority: "Critical",
    },
];

const InvoicesPage: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string | null>("INV-2025-008");
    const selectedInvoice = invoices.find((i) => i.id === selectedId);
    const totalAmount = invoices.reduce((acc, i) => acc + i.amount, 0);
    const today = new Date().toISOString().split("T")[0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handlePaymentSuccess = () => {
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    return (
        <div className="page">
            <header className="header">LOGO</header>
            <div className="content">
                <h2 className="title">INVOICES TO PAY</h2>

                <div className="table-container">
                    <div className="table-header styled-header">
                        <div className="header-left">
                            <span className="header-label">Total amount to pay</span>
                            <span className="header-date">{today}</span>
                        </div>
                        <div className="header-right amount-box">
                            <span className="currency">$</span>
                            <span className="amount">
                                {totalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>

                    <table className="invoice-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Number</th>
                            <th>Vendor</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Priority</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map((inv) => (
                            <tr
                                key={inv.id}
                                className={selectedId === inv.id ? "selected" : ""}
                            >
                                <td>
                                    <input
                                        type="radio"
                                        checked={selectedId === inv.id}
                                        onChange={() => setSelectedId(inv.id)}
                                    />
                                </td>
                                <td>{inv.id}</td>
                                <td className="vendor">{inv.vendor}</td>
                                <td>{inv.date}</td>
                                <td>{inv.dueDate}</td>
                                <td>$ {inv.amount.toLocaleString()}</td>
                                <td>
                                        <span className={`badge ${inv.priority.toLowerCase()}`}>
                                            {inv.priority}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {selectedInvoice && (
                    <>
                        <PaymentModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSuccess={handlePaymentSuccess} // <- nova prop aqui
                            invoice={selectedInvoice}
                        />

                        <PaymentSuccessModal
                            isOpen={isSuccessModalOpen}
                            onClose={() => setIsSuccessModalOpen(false)}
                            amount={selectedInvoice.amount}
                            fee={5}
                            paymentTime={new Date().toLocaleDateString()}
                            refNumber={selectedInvoice.id}
                        />

                        <div className="summary">
                            <div className="summary-box">
                                <p>{selectedInvoice.id}</p>
                                <p className="fee">Fee</p>
                                <p>$ 5.00</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="pay-btn"
                            >
                                Pay ${" "}
                                {(selectedInvoice.amount + 5).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                })}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InvoicesPage;