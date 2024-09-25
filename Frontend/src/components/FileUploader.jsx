import React, { useState } from 'react';

const FileUploader = ({ apiEndpoint, title }) => {
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('category', category);
    formData.append('transaction_type', transactionType);

    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data);  // Store the response data to display later
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <h2>{title}</h2>
      <input type="file" onChange={handleFileChange} />

      <label>Start Date</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

      <label>End Date</label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <label>Category</label>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />

      <label>Transaction Type</label>
      <input type="text" value={transactionType} onChange={(e) => setTransactionType(e.target.value)} />

      <button onClick={handleFileUpload}>Upload and Filter</button>

      {result && (
        <div>
          <h3>Filtered Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUploader;  // Ensure you're exporting the component as default
