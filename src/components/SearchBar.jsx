import React from "react";

const SearchBar = ({ onSearch }) => {
  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm); // Call parent function to filter bills
  };

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        placeholder="Search by Bill No, Patient ID, or Doctor Reg No"
        onChange={handleInputChange}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
