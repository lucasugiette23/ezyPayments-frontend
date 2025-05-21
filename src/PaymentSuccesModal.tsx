import React from "react";
import "./PaymentSuccesModal.css";

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    fee: number;
    refNumber: string;
    paymentTime: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     amount,
                                                                     fee,
                                                                     refNumber,
                                                                     paymentTime,
                                                                 }) => {
    if (!isOpen) return null;

    const total = amount + fee;

    return (
        <div className="modal-overlay">
        <div className="success-modal">
            <div className="check-circle">
                <button className="close-btn" onClick={onClose}>×</button>
                <span>✔</span>
            </div>
            <h2>Payment Success!</h2>
            <h1 className="amount">${total.toFixed(2).toLocaleString()}</h1>

    <div className="info-row">
        <span>Ref Number</span>
    <span>{refNumber}</span>
    </div>
    <div className="info-row">
        <span>Payment Time</span>
    <span>{paymentTime}</span>
    </div>

    <hr />

    <div className="info-row">
        <span>Amount</span>
        <span>${amount.toFixed(2)}</span>
    </div>
    <div className="info-row">
        <span>Fee</span>
        <span>${fee.toFixed(2)}</span>
    </div>
    </div>
    </div>
);
};

export default PaymentSuccessModal;