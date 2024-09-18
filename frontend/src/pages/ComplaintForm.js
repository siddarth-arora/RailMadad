import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils'; // Custom functions for notifications
import 'react-toastify/dist/ReactToastify.css'; // Ensure the toast notifications display properly

function ComplaintForm() {
  const [complaintInfo, setComplaintInfo] = useState({
    typeOfComplaint: '',
    description: '',
    trainNumber: '',
    ticketNumber: '',
    uploadedImage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaintInfo({
      ...complaintInfo,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setComplaintInfo({
      ...complaintInfo,
      uploadedImage: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { typeOfComplaint, description, trainNumber, ticketNumber, uploadedImage } = complaintInfo;
  
    if (!typeOfComplaint || !description || !trainNumber || !ticketNumber) {
      return handleError('All fields except the image are required.');
    }
  
    try {
      const formData = new FormData();
      formData.append('typeOfComplaint', typeOfComplaint);
      formData.append('description', description);
      formData.append('trainNumber', trainNumber);
      formData.append('ticketNumber', ticketNumber);
      if (uploadedImage) {
        formData.append('uploadedImage', uploadedImage);
      }
  
      const response = await fetch('http://localhost:8080/auth/complaintform', {
        method: 'PUT',
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        handleSuccess('Complaint submitted successfully!');
        // Refresh the page after successful submission
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Delay for a moment to ensure the success toast is visible
      } else {
        handleError(result.message || 'Failed to submit complaint.');
      }
    } catch (err) {
      console.log(err);
      handleError('An error occurred while submitting the complaint.');
    }
  };

  return (
    <div className='container'>
      <h1>Submit a Complaint</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='typeOfComplaint'>Type of Complaint</label>
          <select
            name='typeOfComplaint'
            onChange={handleChange}
            value={complaintInfo.typeOfComplaint}
            required
          >
            <option value=''>-- Select Complaint Type --</option>
            <option value='Late Train'>Late Train</option>
            <option value='Poor Service'>Poor Service</option>
            <option value='Cleanliness'>Cleanliness</option>
            <option value='Safety Issue'>Safety Issue</option>
            <option value='Other'>Other</option>
          </select>
        </div>

        <div>
          <label htmlFor='description'>Description</label>
          <textarea
            name='description'
            onChange={handleChange}
            placeholder='Enter complaint description...'
            value={complaintInfo.description}
            required
          />
        </div>

        <div>
          <label htmlFor='trainNumber'>Train Number</label>
          <input
            type='number'
            name='trainNumber'
            onChange={handleChange}
            placeholder='Enter train number...'
            value={complaintInfo.trainNumber}
            required
          />
        </div>

        <div>
          <label htmlFor='ticketNumber'>Ticket Number</label>
          <input
            type='number'
            name='ticketNumber'
            onChange={handleChange}
            placeholder='Enter ticket number...'
            value={complaintInfo.ticketNumber}
            required
          />
        </div>

        <div>
          <label htmlFor='uploadedImage'>Upload Image (Optional)</label>
          <input
            type='file'
            name='uploadedImage'
            accept='.jpg, .jpeg'
            onChange={handleFileChange}
          />
        </div>

        <button type='submit'>Submit</button>
      </form>

      <ToastContainer />
    </div>
  );
}

export default ComplaintForm;
