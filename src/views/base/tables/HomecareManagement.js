import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CModalBody,
  CForm,
  CFormInput,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheckCircle, faClock, faEye, faDownload, faHourglass } from '@fortawesome/free-solid-svg-icons';


// Import necessary Font Awesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import ClientManagement from './ClientManagement';
// import { workStatus } from '../../../../../HomecareBackend/controllers/guideController';


// import CIcon from '@coreui/icons-react'
// import { cilTrash, cilPencil } from '@coreui/icons'

const HomecareManagement = () => {
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [status, setStatus] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guideId, setGuideid] = useState(null);
  const [workstatusdata, setWorkstatusdata] = useState([]);
  const [searchstatusdata, setsearchstatusdata] = useState([]);
  const [popup, setPopup] = useState({ visible: false, message: '', title: '' });
  const [guides, setGuides] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    age: '',
    image: null,
    address: '',
    isDeleted: false
  });
  const [error, setError] = useState(null);

  const showPopup = (title, message) => {
    setPopup({ visible: true, message, title });
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await axios.get('http://44.196.192.232:5007/api/guide/');
      setGuides(response.data.data);
      setMasterData(response.data.data);
    } catch (error) {
      setError('Error fetching guides');
      console.error('Error fetching guides:', error);
    }
  };

  const searchByName = async (e) => {
    const search = e.target.value;
    setGuides(
      masterData.filter((data) => { return data.name.toLowerCase().includes(search.toLowerCase()) })
    )
  }

  const searchByNameWork = async (e) => {
    const search = e.target.value;
    setWorkstatusdata(
      searchstatusdata.filter((data) => { return data.clientName.toLowerCase().includes(search.toLowerCase()) })
    )
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://44.196.192.232:5007/api/guide/${id}`);
      setGuides(guides.filter(guide => guide._id !== id));
    } catch (error) {
      setError('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  const handleAddGuide = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('mobileNumber', formData.mobileNumber);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    // formDataToSend.append('role', formData.role);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('isDeleted', formData.isDeleted);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
      console.log('formDataToSend', formData)
    }

    try {
      const response = await axios.post('http://44.196.192.232:5007/api/guide/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const newGuide = response.data.data;
      console.log("response", response);
      setGuides([...guides, newGuide]);
      setFormVisible(false);
      resetFormData();
    } catch (error) {
      setError('Error adding User');
      console.error('Error adding User:', error);
    }
  };

  const handleEdit = (guide) => {
    setSelectedGuide(guide);
    setFormData({
      name: guide.name || '',
      email: guide.email || '',
      mobileNumber: guide.mobileNumber || '',
      // role: guide.role || '',
      age: guide.age || '',
      address: guide.address || '',
      password: '', // Password field will not be pre-filled for security reasons
    });
    setEditVisible(true);
  };

  const handleEditGuide = async (event) => {
    event.preventDefault();
    const { _id } = selectedGuide;
    try {
      await axios.put(`http://44.196.192.232:5007/api/guide/editguide/${_id}`, formData);
      setEditVisible(false);
      resetFormData();
      await fetchGuides(); // Fetch the latest data after updating
    } catch (error) {
      setError('Error updating guide');
      console.error('Error updating guide:', error);
    }
  };

  const handleworkstatus = async (id) => {
    try {
      const response = await axios.get(`http://44.196.192.232:5007/api/guide/getguide/${id}`);
      const workStatus = response.data.data.workStatus;
      const filteredData = workStatus.filter(item => item.isDeleted === 'false');

      setGuideid(id);
      setWorkstatusdata(filteredData);
      setsearchstatusdata(filteredData);
      setStatus(true);
    } catch (error) {
      setError('Error workstatus');
      console.error('Error updating workstatus:', error);
    }
  }

  const deleteworkstatus = async (guideId, workStatusid, clientid) => {
    try {
      const confirmation = window.confirm('Work Assignment will be deleted')
      if (confirmation) {
        // update the workStatus
        const response = await axios.get(`http://44.196.192.232:5007/api/guide/getguide/${guideId}`);
        const updatedguidedata = response.data.data.workStatus.map(status => {
          if (status._id === workStatusid) {
            status.isDeleted = true; // Set isDeleted to true for the matching workStatus
          }
          return status;
        });
        setStatus(false);

        // update the modelclientid
        const updatedmodelclientid = response.data.data.modelclientid.filter(modelclientid => modelclientid != clientid);
        await axios.put(`http://44.196.192.232:5007/api/guide/updateworker/${guideId}`, { modelclientid: updatedmodelclientid });

        //removes workerid from clientdata
        await axios.put(`http://44.196.192.232:5007/api/client/editClient/${clientid}`, { workerid: '', assignStatus: 'NOT ASSIGNED', assigned: 'ASSIGN' });
        await axios.put(`http://44.196.192.232:5007/api/guide/deleteworkstatus/${guideId}`, { workStatus: updatedguidedata });
      }

    } catch (error) {
      setError('Error workstatus');
      console.error('Error updating workstatus:', error);
    }
  }

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      password: '',
      // role: '',
      age: '',
      image: null,
      address: '',
      isDeleted: ''
    });
  };


  return (
    <>
      {error && <CAlert color="danger">{error}</CAlert>}
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol xs={12} md={6} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                Guide Management
              </div>
            </CCol>

            {/* Search Box */}
            <CCol xs={12} md={4} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
              <CForm style={{ width: '100%' }}>
                <CFormInput
                  type="text"
                  id="text"
                  placeholder="Search by Name"
                  onChange={searchByName}
                  style={{ maxWidth: '300px' }} // Adjust width as needed
                />
              </CForm>
            </CCol>
            <CCol xs="auto" className="d-flex justify-content-center justify-content-md-end">
              <CButton color="primary" className="px-4" onClick={() => setFormVisible(true)}>
                Add Worker
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>

        <CTable hover bordered striped responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col" >#</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col" >Photo</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Age</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Mobile Number</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Address</CTableHeaderCell>
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Work Status</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Client ID</CTableHeaderCell> */}
              {/* <CTableHeaderCell scope="col">Role</CTableHeaderCell> */}
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col" className="text-center">Actions</CTableHeaderCell>
            </CTableRow>

          </CTableHead>
          <CTableBody>
            {guides
              .filter(guide => !guide.isDeleted) // Filter out deleted guides
              .map((guide, index) => (
                <CTableRow key={guide._id}>
                  <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                  <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>
                    {guide.image && (
                      <img
                        src={`http://44.196.192.232:5007${guide.image}`}
                        alt={guide.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '5px',
                          border: '1px solid #ccc'
                        }}
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{guide.name || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{guide.age || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{guide.email || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{guide.mobileNumber || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{guide.address || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>
                    <CButton
                      style={{
                        width: '80px',
                        backgroundColor: 'linear-gradient(135deg, #17a2b8 0%, #117a8b 100%)',
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        padding: '8px 12px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}
                      color='info'
                      onClick={() => handleworkstatus(guide._id)}
                    // className="p-2"
                    >
                      View
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell style={{ textAlign: 'center' }} className="text-center">
                    <CButton className="me-1 p-1" onClick={() => handleEdit(guide)}>
                      <FontAwesomeIcon icon={faEdit} style={{ color: "#903dbd" }} />
                    </CButton>
                    <CButton className="me-1 p-1" onClick={() => handleDelete(guide._id)}>
                      <FontAwesomeIcon icon={faTrash} style={{ color: "#a82424" }} />
                    </CButton>
                    <CButton className="p-1" onClick={() => { setSelectedGuide(guide); setVisible(true); }}>
                      <FontAwesomeIcon icon={faEye} style={{ color: "#93ab1c" }} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>

        </CTable>
      </CCard>

      <CModal visible={formVisible} onClose={() => { setFormVisible(false); resetFormData(); }}>
        <CModalHeader closeButton>
          <CModalTitle>Add Worker</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={handleAddGuide}>
            <CCol md={6}>
              <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="age" label="Age" value={formData.age} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="email" label="Email" value={formData.email} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="address" id="address" label="address" value={formData.address} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              {/* <CFormInput type="text" id="role" label="Role" value={formData.role} onChange={handleChange} /> */}
            </CCol>
            <CCol md={12}>
              <CFormInput type="file" id="image" label="Image" onChange={handleChange} />
            </CCol>
            <CCol xs={12}>
              <CButton color="primary" type="submit">Submit</CButton>
            </CCol>
          </CForm>
        </CModalBody>
        {/* <CModalFooter>
          <CButton color="secondary" onClick={() => { setFormVisible(false); resetFormData(); }}>Close</CButton>
        </CModalFooter> */}
      </CModal>

      <CModal visible={editVisible} onClose={() => { setEditVisible(false); resetFormData(); }}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Guide</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={handleEditGuide}>
            <CCol md={6}>
              <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="email" label="Email" value={formData.email} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="age" label="Age" value={formData.age} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="address" label="Address" value={formData.address} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} />
            </CCol>
            <CCol xs={12}>
              <CButton color="primary" type="submit">Submit</CButton>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setEditVisible(false); resetFormData(); }}>Close</CButton>
        </CModalFooter>
      </CModal>


      <CModal size='lg' visible={status} onClose={() => { setStatus(false) }}>
        <CModalHeader>
          <CRow className="w-100">
            {/* Title */}
            <CCol xs={12} md={6} className="d-flex align-items-center justify-content-start">
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              WORK STATUS
              </div>
            </CCol>

            {/* Search Box */}
            <CCol xs={12} md={6} className="d-flex align-items-center justify-content-end">
              <CForm style={{ width: '100%' }}>
                <CFormInput
                  type="text"
                  id="search-client"
                  placeholder="Search by Name"
                  onChange={searchByNameWork}
                  style={{ maxWidth: '300px' }} // Adjust width as needed
                />
              </CForm>
            </CCol>
          </CRow>
        </CModalHeader>
        <CModalBody>
          <div className="table-responsive">

            <table className="table table-success table-striped">
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: 'center', verticalAlign: 'middle' }}>#</th>
                  <th scope="col" style={{ textAlign: 'center', verticalAlign: 'middle' }}>Id</th>
                  <th scope="col" style={{ textAlign: 'center', verticalAlign: 'middle' }}>Name</th>
                  <th scope="col" style={{ textAlign: 'center', verticalAlign: 'middle' }}>STATUS</th>
                  <th scope="col" style={{ textAlign: 'center', verticalAlign: 'middle' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {workstatusdata
                  .map((items, index) => (
                    <tr key={items._id}>
                      <th scope="row" style={{ textAlign: 'center', verticalAlign: 'middle' }}>{index + 1}</th>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{items.clientId || 'null'}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{items.clientName || 'null'}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        {items.status === 'PENDING' ? (
                          <FontAwesomeIcon icon={faClock} style={{ color: 'orange' }} title="Pending" size="2x" />
                        ) : (
                          <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} title="Completed" size="2x" />
                        )}
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <button
                          style={{ border: 'none', background: 'none' }}
                          onClick={() => deleteworkstatus(guideId, items._id, items.clientId)}
                        >
                          <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} title="Delete" size="2x" />
                        </button>
                      </td>

                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setStatus(false); }}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedGuide && (
            <CListGroup flush>
              <CListGroupItem><strong>Name:</strong> {selectedGuide.name || 'null'}</CListGroupItem>
              <CListGroupItem><strong>Age:</strong> {selectedGuide.age || 'null'}</CListGroupItem>
              <CListGroupItem><strong>Email:</strong> {selectedGuide.email || 'null'}</CListGroupItem>
              <CListGroupItem><strong>Address:</strong> {selectedGuide.address || 'null'}</CListGroupItem>
              <CListGroupItem><strong>Mobile Number:</strong> {selectedGuide.mobileNumber || 'null'}</CListGroupItem>
              <CListGroupItem><strong>password</strong> {selectedGuide.password || 'null'}</CListGroupItem>
              {/* <CListGroupItem><strong>Role</strong> {selectedGuide.role || 'null'}</CListGroupItem> */}
            </CListGroup>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
      {/* <div>
        <ClientManagement
          guideprop = {{ name:guides.name, email:guides.email, mobileNumber:guides.mobileNumber, role:guides.role}}
        />
      </div> */}
    </>
  );
};

export default HomecareManagement;
