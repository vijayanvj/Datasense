import React, { useState,useRef  } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    // address: '',
    landmark: '', 
    phoneNumber: '',
    // email: '',
    hobbies: [],
    image: null,
    // password: ''
  });
  const navigate = useNavigate()
  const [nameError, setNameError] = useState('');
  // const [emailError, setEmailError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const previousPhoneNumbers = useRef([]);
  // const [passwordError, setPasswordError] = useState('');
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === 'checkbox' ? [...formData[name], value] : value;
    setFormData({ ...formData, [name]: type === 'file' ? files[0] : newValue });

  };
  const validateName = () => {
    const nameRegex = /^[A-Za-z]{3,16}(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(formData.name)) {
      setNameError('Invalid name format');
    } else {
      setNameError('');
    }
  };

  // const validateEmail = () => {
  //   const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  //   const firstCharRegex = /^[^\s].*$/;
  //   if (!emailRegex.test(formData.email)) {
  //     setEmailError('Invalid email format');
  //   } else if (!firstCharRegex.test(formData.email)) {
  //     setEmailError('Email cannot start with a space');
  //   } else {
  //     setEmailError('');
  //   }
  // };
  const validateMobileNumber = () => {
    const mobileNumberRegex = /^[6-9]\d{9}$/;
    const specialCharRegex = /[+\-()_%@/.,]/;
    const mobileNumber = formData.phoneNumber;

    const isDuplicate = previousPhoneNumbers.current.includes(mobileNumber);
    if (isDuplicate) {
      setMobileNumberError('Phone number already exists');
    } else if (!formData.phoneNumber) {
      setMobileNumberError('Please enter the number');
    } else if (formData.phoneNumber.length !== 10) {
      setMobileNumberError('Mobile number should be 10 digits long');
    } else if (specialCharRegex.test(formData.phoneNumber)) {
      setMobileNumberError('Special characters are not allowed');
    } else if (!mobileNumberRegex.test(formData.phoneNumber)) {
      setMobileNumberError('Invalid mobile number format');
    } else {
      setMobileNumberError('');
    }
  };

  const validatePincode = () => {
    const pincodeRegex = /^[1-9]\d{5}$/;
    if (!formData.pincode) {
      setPincodeError('Please enter the pincode');
    } else if (formData.pincode.length !== 6) {
      setPincodeError('Pincode should be 6 digits long');
    } else if (!pincodeRegex.test(formData.pincode)) {
      setPincodeError('Invalid pincode format');
    } else {
      setPincodeError('');
    }
  };
//   const validateAddress = () => {
//     const flatNumberRegex = /^[a-zA-Z0-9\s]{1,20}$/; // Alphanumeric values up to 20 characters
//     const landmarkRegex = /^[a-zA-Z\s]+$/; // Alphabet values only

//     if (!formData.flatNumber || !formData.flatNumber.trim()) {
//       setFlatNumberError('Please enter the flat/house no/floor');
//     } else if (!flatNumberRegex.test(formData.flatNumber)) {
//       setFlatNumberError('Invalid flat/house no/floor format');
//     }

//     if (!formData.landmark || !formData.landmark.trim()) {
//       setLandmarkError('Please enter the landmark');
//     } else if (!landmarkRegex.test(formData.landmark)) {
//       setLandmarkError('Invalid landmark format');
//     }
//   };

  // const validatePassword = () => {
  //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,16}$/;

  //   if (!formData.password) {
  //     setPasswordError('Please enter the password');
  //   } else if (formData.password.length < 4 || formData.password.length > 16) {
  //     setPasswordError('Password should be between 4 and 16 characters');
  //   } else if (!passwordRegex.test(formData.password)) {
  //     setPasswordError('Invalid password format');
  //   } else {
  //     setPasswordError('');
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateMobileNumber();
    if (mobileNumberError) {
      return; // Don't proceed if there's a mobile number error
    }

    try {
      if (previousPhoneNumbers.current.includes(formData.phoneNumber)) {
        setMobileNumberError('Phone number already exists');
        return;
      }

      previousPhoneNumbers.current.push(formData.phoneNumber);

      const formDataWithImage = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataWithImage.append(key, formData[key]);
      });

      // Upload image
      const imageUploadResponse = await axios.post('http://localhost:3005/api/users/upload', formDataWithImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { imageUrl } = imageUploadResponse.data; // Assuming your API returns the image URL
      const userData = { ...formData, image: imageUrl };
      const response = await axios.post('http://localhost:3005/api/users/register', userData );
      console.log(response.data);
      
      alert('Registration successful!');
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };


  const handleUserDetailsClick = (userId) => {
    navigate(`/table-data/${userId}`);
  };
  return (
    <>

<h1 className="text-center">Manage Registration form</h1>
    <form onSubmit={handleSubmit} className="container mt-6">
      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Name:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} onBlur={validateName} />
          {nameError && <div className="text-danger">{nameError}</div>}
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Date of Birth:</label>
        <div className="col-sm-10">
        <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Gender:</label>
        <div className="col-sm-10">
          <label className="form-check-label me-3">
            Male <input type="radio" className="form-check-input" name="gender" value="Male" onChange={handleInputChange} />
          </label>
          <label className="form-check-label me-3">
            Female <input type="radio" className="form-check-input" name="gender" value="Female" onChange={handleInputChange} />
          </label>
          <label className="form-check-label">
            Other <input type="radio" className="form-check-input" name="gender" value="Other" onChange={handleInputChange} />
          </label>
        </div>
      </div>

    <div className="row mb-3">
        <label className="col-sm-2 col-form-label">State:</label>
        <div className="col-sm-10">
          <select className="form-select" name="state" value={formData.state} onChange={handleInputChange}>
            <option value="">Select State</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>
    </div>

    {formData.state && (
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">District:</label>
          <div className="col-sm-10">
            <select className="form-select" name="district" value={formData.district} onChange={handleInputChange}>
              <option value="">Select District</option>
              {formData.state === 'Tamil Nadu' && (
                <>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Erode">Erode</option>
                </>
              )}
            </select>
          </div>
        </div>
      )}

      {formData.district && (
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">City:</label>
          <div className="col-sm-10">
            <select className="form-select" name="city" value={formData.city} onChange={handleInputChange}>
              <option value="">Select City</option>
              {formData.district === 'Coimbatore' && <option value="Coimbatore">Coimbatore</option>}
              {formData.district === 'Erode' && <option value="Erode">Erode</option>}
            </select>
          </div>
        </div>
      )}

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Pincode:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleInputChange} onBlur={validatePincode}/>
          {pincodeError && <div className="text-danger">{pincodeError}</div>}
        </div>
      </div>

      {/* <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Flat/House No/Floor:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" name="flatNumber" value={formData.address} onChange={handleInputChange} />
         
        </div>
      </div> */}
      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Landmark:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" name="landmark" value={formData.landmark} onChange={handleInputChange} />
        </div>
      </div>

      <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Phone Number:</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} onBlur={validateMobileNumber} />
            {mobileNumberError && <div className="text-danger">{mobileNumberError}</div>}
          </div>
        </div>

      {/* <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Email:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" name="email" value={formData.email} onChange={handleInputChange} onBlur={validateEmail} />
          {emailError && <div className="text-danger">{emailError}</div>}
        </div>
      </div> */}

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Hobbies:</label>
        <div className="col-sm-10">
          <label className="form-check-label me-3">
            Reading <input type="checkbox" className="form-check-input" name="hobbies" value="Reading" onChange={handleInputChange} />
          </label>
          <label className="form-check-label me-3">
            Cooking <input type="checkbox" className="form-check-input" name="hobbies" value="Cooking" onChange={handleInputChange} />
          </label>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Image:</label>
        <div className="col-sm-10">
        <input
          type="file"
          className="form-control"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
        />
        </div>
      </div>

      {/* <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Password:</label>
        <div className="col-sm-10">
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleInputChange} onBlur={validatePassword}/>
          {passwordError && <div className="text-danger">{passwordError}</div>}
        </div>
      </div> */}
      
      <div className="row mb-3">
  <div className="col-sm-10 offset-sm-2 d-flex justify-content-between">
    <button type="submit" className="btn btn-primary">Submit</button>
    <button className="btn btn-primary" onClick={handleUserDetailsClick}>User Details</button>
  </div>
</div>
    </form>
    </>
  );
};

export default UserForm;
