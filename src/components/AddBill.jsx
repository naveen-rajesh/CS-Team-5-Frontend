// AddBill.js
import React, { useState } from "react";

const AddBill = ({ onClose, onAdd, generateBillNo }) => {
  const [patientID, setPatientID] = useState("");
  const [amount, setAmount] = useState(0);
  const [doctorRegNo, setDoctorRegNo] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddMedicine = async () => {
    if (medicineName && quantity > 0) {
      try {
        const response = await fetch(`http://localhost:5000/medicines/${medicineName}`);
        if (!response.ok) throw new Error("Medicine not found");
        const data = await response.json();
        const totalMedicinePrice = data.price * quantity;
        setMedicines([...medicines, { name: data.name, quantity, price: data.price }]);
        setAmount((prevAmount) => prevAmount + totalMedicinePrice);
        setMedicineName("");
        setQuantity(1);
      } catch (error) {
        alert("Error fetching medicine details. Please check the medicine name.");
      }
    } else {
      alert("Please enter a valid medicine name and quantity.");
    }
  };

  const handleSubmit = async () => {
    if (patientID && amount > 0 && doctorRegNo && medicines.length > 0) {
      try {
        const billNo = generateBillNo(); // Generate billNo
        const response = await fetch("http://localhost:5000/bills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ billNo, patientID, amount, doctorRegNo, medicines }),
        });
        if (!response.ok) throw new Error("Failed to add bill");
        const newBill = await response.json();
        onAdd(newBill); // Update local state
      } catch (error) {
        alert("Error adding bill: " + error.message);
      }
    } else {
      alert("Please fill in all fields and add at least one medicine.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Bill</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Patient ID"
          value={patientID}
          onChange={(e) => setPatientID(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="Doctor Registration No"
          value={doctorRegNo}
          onChange={(e) => setDoctorRegNo(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Medicine Name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-20 border rounded-lg px-3 py-2"
            />
            <button
              onClick={handleAddMedicine}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
          <ul className="list-disc ml-6 mt-4">
            {medicines.map((med, index) => (
              <li key={index}>
                {med.name} (x{med.quantity}) - ${med.price}
              </li>
            ))}
          </ul>
        </div>
        <p>Total Amount: ${amount.toFixed(2)}</p>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Add Bill
        </button>
        <button
          onClick={onClose}
          className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddBill;
