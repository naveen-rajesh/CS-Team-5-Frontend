import React, { useState, useEffect } from "react";

const AddBill = ({ onClose,bills,setBills,filteredBills,setFilteredBills,setAddBillVisible }) => {
  const [patientID, setPatientID] = useState("");
  const [doctorRegNo, setDoctorRegNo] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);

  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [medicineList, setMedicineList] = useState([]);

  const [error, setError] = useState({ patient: "", doctor: "", medicine: "" });

  // Function to fetch patients based on input
  const fetchPatients = async (query) => {
    if (query.length < 2) return; // Start searching after 2 characters
    try {
      const res = await fetch(`http://localhost:3000/api/search/patients?query=${query}`);
      const data = await res.json();
      setPatientList(data.results);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  // Function to fetch doctors based on input
  const fetchDoctors = async (query) => {
    if (query.length < 2) return;
    try {
      const res = await fetch(`http://localhost:3000/api/search/doctors?query=${query}`);
      const data = await res.json();
      setDoctorList(data.results);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchMedicines = async (query) => {
    if (query.length < 2) return;
    try {
      const res = await fetch(`http://localhost:3000/api/search/medicines?query=${query}`);
      const data = await res.json();
      setMedicineList(data.results);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    }
  };

  const validatePatient = () => {
    const exists = patientList.some((p) => p.UHID === patientID);
    setError((prev) => ({ ...prev, patient: exists ? "" : "Invalid Patient ID" }));
  };

  const validateDoctor = () => {
    const exists = doctorList.some((d) => d.reg_no === doctorRegNo);
    setError((prev) => ({ ...prev, doctor: exists ? "" : "Invalid Doctor Registration No" }));
  };

  const validateMedicine = () => {
    const exists = medicineList.some((m) => m.name.toLowerCase() === medicineName.toLowerCase());
    if (medicineName == "") {
      setError((prev) => ({ ...prev, medicine: "" }));
      return;
    }
    setError((prev) => ({ ...prev, medicine: exists ? "" : "Invalid Medicine" }));
  };

  const handleAddMedicine = () => {
    validateMedicine();
    const selectedMedicine = medicineList.find((med) => med.name.toLowerCase() === medicineName.toLowerCase());

    if (!selectedMedicine) return;

    setMedicines([...medicines, { name: selectedMedicine.name, mid: selectedMedicine.mid, quantity, price: selectedMedicine.price }]);
    setAmount((prevAmount) => prevAmount + selectedMedicine.price * quantity);
    setMedicineName("");
    setQuantity(1);
  };

  const handleSubmit = async () => {
    validatePatient();
    validateDoctor();

    if (error.patient || error.doctor || medicines.length === 0) {
      alert("Please correct the errors before submitting.");
      return;
    }

    const billData = { UHID: patientID,reg_no:doctorRegNo, med: medicines.map((m) => ({ mid: m.mid, quantity: m.quantity })) };

    try {
      const response = await fetch("http://localhost:3000/api/createbill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });

      if (!response.ok) throw new Error("Failed to add bill");
      const newBill = await response.json();
      setBills((prevBills) => [...prevBills, newBill]);
      setFilteredBills((prevBills) => [...prevBills, newBill]);
      setAddBillVisible(false);
    } catch (error) {
      alert("Error adding bill: " + error.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Bill</h2>
      <div className="space-y-4">
        
        {/* Patient ID Input */}
        <input
          type="text"
          placeholder="Patient ID"
          value={patientID}
          onChange={(e) => {
            setPatientID(e.target.value);
            fetchPatients(e.target.value);
          }}
          onBlur={validatePatient}
          className="w-full border rounded-lg px-3 py-2"
        />
        {error.patient && <p className="text-red-500">{error.patient}</p>}
        {patientList.length > 0 && (
          <ul className="border rounded-lg p-2">
            {patientList.map((p) => (
              <li key={p.UHID} onClick={() => setPatientID(p.UHID)} className="cursor-pointer hover:bg-gray-100 p-1">
                {p.UHID} - {p.firstName} {p.lastName}
              </li>
            ))}
          </ul>
        )}

        {/* Doctor Registration Input */}
        <input
          type="text"
          placeholder="Doctor Registration No"
          value={doctorRegNo}
          onChange={(e) => {
            setDoctorRegNo(e.target.value);
            fetchDoctors(e.target.value);
          }}
          onBlur={validateDoctor}
          className="w-full border rounded-lg px-3 py-2"
        />
        {error.doctor && <p className="text-red-500">{error.doctor}</p>}
        {doctorList.length > 0 && (
          <ul className="border rounded-lg p-2">
            {doctorList.map((d) => (
              <li key={d.reg_no} onClick={() => setDoctorRegNo(d.reg_no)} className="cursor-pointer hover:bg-gray-100 p-1">
                {d.name} ({d.reg_no})
              </li>
            ))}
          </ul>
        )}

        {/* Medicine Input */}
        <div>
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicineName}
            onChange={(e) => {
              setMedicineName(e.target.value);
              fetchMedicines(e.target.value);
            }}
            onBlur={validateMedicine}
            className="w-full border rounded-lg px-3 py-2"
          />
          {error.medicine && <p className="text-red-500">{error.medicine}</p>}
          {medicineList.length > 0 && (
            <ul className="border rounded-lg p-2">
              {medicineList.map((m) => (
                <li key={m.mid} onClick={() => setMedicineName(m.name)} className="cursor-pointer hover:bg-gray-100 p-1">
                  {m.name} - ${m.price}
                </li>
              ))}
            </ul>
          )}

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="w-20 border rounded-lg px-3 py-2"
          />
          <button onClick={handleAddMedicine} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add
          </button>
        </div>

        <p className="font-bold">Total Amount: ${amount.toFixed(2)}</p>
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-lg">Add Bill</button>
        <button onClick={onClose} className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">Cancel</button>
      </div>
    </div>
  );
};

export default AddBill;
