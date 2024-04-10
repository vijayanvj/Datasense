import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const TableData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userData, setUserData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  useEffect(() => {
    axios.get('http://localhost:3005/api/users/getdata')
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const pageCount = Math.ceil(userData.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3005/api/users/delete/${userId}`);
      const updatedUserData = userData.filter(user => user._id !== userId);
      setUserData(updatedUserData);
      alert('User deleted successfully:');
      console.log('User deleted successfully');
      if (pageNumber === pageCount - 1 && userData.length % usersPerPage === 1) {
        setPageNumber(pageNumber - 1);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  

  useEffect(() => {
    if (searchTerm.length >= 3) {
      axios.get(`http://localhost:3005/api/users/search?term=${encodeURIComponent(searchTerm)}`)
        .then(response => {
          setSearchResults(response.data);
        })
        .catch(error => {
          console.error('Error fetching search suggestions:', error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const filteredUsers = searchTerm.length >= 3 ? searchResults : userData;
  const handleNameClick = (name) => {
    setSearchTerm(name); 
  };
  return (
    <>
    <div className="container mt-4">
    <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((user, index) => (
              <li key={index} onClick={() => handleNameClick(user.name)}>{user.name}</li>
            ))}
          </ul>
        )}
      </div>

    <div className="container mt-4">
      <h2>User Details</h2>
      <div className="table-responsive">
        <table className="table table-striped">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Date of Birth</th>
      <th>Gender</th>
      <th>State</th>
      <th>District</th>
      <th>City</th>
      <th>Pincode</th>
      <th>Address</th>
      <th>Landmark</th>
      <th>Phone Number</th>
      <th>Hobbies</th>
      <th>Image</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {filteredUsers.slice(pagesVisited, pagesVisited + usersPerPage).map((user, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{user.name}</td>
        <td>{user.dateOfBirth}</td>
        <td>{user.gender}</td>
        <td>{user.state}</td>
        <td>{user.district}</td>
        <td>{user.city}</td>
        <td>{user.pincode}</td>
        <td>{user.address}</td>
        <td>{user.landmark}</td>
        <td>{user.phoneNumber}</td>
        <td>{user.hobbies.join(', ')}</td>
        <td>
        {user.image && (
  <img src="/logo192.png" alt="Icon for logo" style={{ maxWidth: '50px', maxHeight: '50px' }} />

)}
</td>

        <td>
          <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
      </div>
      
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'pagination'}
        previousLinkClassName={'pagination__link'}
        nextLinkClassName={'pagination__link'}
        disabledClassName={'pagination__link--disabled'}
        activeClassName={'pagination__link--active'}
      />
    </div>
    </>
  );
};

export default TableData;
