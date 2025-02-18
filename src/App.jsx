// App.js
import React, { useState, useEffect } from "react";
import NavBar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import BillCard from "./components/BillCard";
import AddBill from "./components/AddBill";

const App = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [isAddBillVisible, setAddBillVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getbills');
        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }
        const data = await response.json();
        setBills(data);
        setFilteredBills(data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, []);


  const handleAddBill = async (newBill) => {
    try {
      const response = await fetch('http://localhost:3000/api/createbill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBill),
      });
      if (!response.ok) {
        throw new Error('Failed to create bill');
      }
      const createdBill = await response.json();
      
    } catch (error) {
      alert(`Error creating bill: ${error.message}`);
    }
  };

  const confirmDeleteBill = (billNo) => {
    setBillToDelete(billNo);
    setConfirmationVisible(true);
  };

  const handleDeleteBill = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/deletebill/${billToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the bill. Please try again.');
      }
      const updatedBills = bills.filter((bill) => bill.bid !== billToDelete);
      setBills(updatedBills);
      setFilteredBills(updatedBills);
      setBillToDelete(null);
      setConfirmationVisible(false);
    } catch (error) {
      alert(`Error deleting bill: ${error.message}`);
    }
  };

  const searchBills = (searchTerm) => {
    if (searchTerm === "") {
      setFilteredBills(bills);
    } else {
      const filtered = bills.filter(
        (bill) =>
          bill.UHID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.bid.toLowerCase().includes(searchTerm.toLowerCase())||
          bill.reg_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBills(filtered);
    }
  };

  return (
    <div className="flex w-screen bg-black h-screen">
      <NavBar />
      <div className="flex-1 flex flex-col items-center bg-green-100 p-4 overflow-y-auto ml-16 sm:ml-0">
        <SearchBar onSearch={searchBills} />
        {filteredBills.length === 0 && (
          <p className="text-gray-600 mt-6">No Bills Found</p>
        )}
        <div className="flex flex-wrap justify-center gap-6 mt-6 w-full">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.bid}
              bill={bill}
              onDelete={() => confirmDeleteBill(bill.bid)}
            />
          ))}
        </div>
        <button
          className="fixed bottom-10 right-10 bg-blue-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700"
          onClick={() => setAddBillVisible(true)}
        >
          +
        </button>
        {isAddBillVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <AddBill
              onClose={() => setAddBillVisible(false)}
              bills={bills}
              setBills={setBills}
              filteredBills={filteredBills}
              setFilteredBills={setFilteredBills}
              setAddBillVisible={setAddBillVisible}
            />
          </div>
        )}
        {isConfirmationVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <p className="text-gray-800 text-lg font-medium">
                Are you sure you want to delete the bill with Bill No: {billToDelete}?
              </p>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setConfirmationVisible(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBill}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
