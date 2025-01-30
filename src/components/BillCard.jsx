// BillCard.js
import React, { useState } from "react";
import { FaPrint, FaTrash } from "react-icons/fa";

const BillCard = ({ bill, onDelete }) => {
  const [isPrintModalVisible, setPrintModalVisible] = useState(false);

  const handlePrint = () => {
    setPrintModalVisible(true);
  };

  const closePrintModal = () => {
    setPrintModalVisible(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-64 font-sans">
      <p><strong>Bill No:</strong> {bill.bid}</p>
      <p><strong>Patient ID:</strong> {bill.UHID}</p>
      <p><strong>Doctor Reg No:</strong> {bill.reg_no}</p>
      <p><strong>Amount:</strong> ${bill.total}</p>
      <div className="flex justify-between mt-4">
        <button className="text-blue-500" onClick={handlePrint}>
          <FaPrint />
        </button>
        <button className="text-red-500" onClick={onDelete}>
          <FaTrash />
        </button>
      </div>
      {isPrintModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Bill Details</h3>
            <p><strong>Bill No:</strong> {bill.bid}</p>
            <p><strong>Patient ID:</strong> {bill.UHID}</p>
            <p><strong>Doctor Reg No:</strong> {bill.reg_no}</p>
            <p><strong>Amount:</strong> ${bill.total}</p>
            <ul className="list-disc ml-6 mt-2">
              {bill.medicines.map((med, index) => (
                <li key={index}>
                  {med.name} (x{med.quantity}) - ${med.price}
                </li>
              ))}
            </ul>
            <button
              onClick={closePrintModal}
              className="mt-4 bg-gray-300 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillCard;
