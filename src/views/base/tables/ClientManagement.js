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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
// import { workStatus } from '../../../../../HomecareBackend/controllers/guideController';
// import { assign } from 'core-js/core/object';

const ClientManagement = () => {
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [action, setAction] = useState(false);
  const [selectedclient, setSelectedclient] = useState(null);
  const [clients, setClients] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [searchWorkers, setSearchWorkers] = useState([]);
  const [view, setView] = useState(false);
  const [dataVisible, setDataVisible] = useState(false);
  const [clientid, setClientid] = useState("");
  const [worker, setWorker] = useState("");
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    age: '',
    medicalhistory: '',
    // password: '',
    // role: '',
    assigned: 'ASSIGN',
    assignStatus: 'NOT ASSIGNED',
    image: null
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);



  const fetchClients = async () => {
    try {
      const response = await axios.get('http://44.196.192.232:5007/api/client/');
      setClients(response.data.data || []);
      setMasterData(response.data.data);
    } catch (error) {
      setError('Error fetching clients');
      console.error('Error fetching clients:', error);
    }
  };

  const searchByName = async (e) => {
    const search = e.target.value;
    setClients(
      masterData.filter((data) => { return data.name.toLowerCase().includes(search.toLowerCase()) })
    )
  }

  const searchByNameReassign = async (e) => {
    const search = e.target.value;
    setWorkers(
      searchWorkers.filter((data) => { return data.name.toLowerCase().includes(search.toLowerCase()) })
    )
  }



  const handleAssign = async (id) => {
    try {
      const response = await axios.get('http://44.196.192.232:5007/api/guide/');
      const filteredGuides = response.data.data.filter(guide => guide.isDeleted !== true);
      setWorkers(filteredGuides);
      setSearchWorkers(filteredGuides)
      setView(true);

    } catch (error) {
      setError('Error fetching clients');
      console.error('Error fetching clients:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://44.196.192.232:5007/api/client/deleteClient/${id}`);
      setClients(clients.filter(client => client._id !== id));
    } catch (error) {
      setError('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  const handleEditClient = async (event) => {
    event.preventDefault();
    const confirmEdit = window.confirm('Are you sure you want to update this client?');
    if (confirmEdit) {
      const { _id } = selectedclient;
      try {
        await axios.put(`http://44.196.192.232:5007/api/client/editClient/${_id}`, formData);
        setEditVisible(false);
        resetFormData();
        await fetchClients();
        alert('Client updated successfully');
      } catch (error) {
        alert('Error updating client');
        console.error('Error updating client:', error);
      }
    } else {
      alert('Update action canceled');
    }
  };


  const handleAddClient = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('mobileNumber', formData.mobileNumber);
    data.append('email', formData.email);
    data.append('address', formData.address);
    data.append('age', formData.age);
    // data.append('role', formData.role);
    data.append('medicalhistory', formData.medicalhistory);
    // data.append('password', formData.password);
    data.append('assigned', formData.assigned);
    data.append('assignStatus', formData.assignStatus);
    data.append('workerid', formData.workerid);
    data.append('image', formData.image);

    console.log('data', data);


    try {
      console.log("hhhh", formData);
      // const response = await axios.post('http://44.196.192.232:5007/api/client/addClient', formData);
      const response = await axios.post('http://44.196.192.232:5007/api/client/addClient', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Client added:', response); // Log the response
      // const newClient = response.data.data;
      // setClients([...clients, newClient]);
      fetchClients();
      setFormVisible(false);
      resetFormData();
    } catch (error) {
      setError('Error adding User');
      console.error('Error adding User:', error);
    }
  };


  const updateStatus = async (guideId, workstatusdataid) => {
    try {

      const status = 'COMPLETED';
      const payload = { status };

      console.log(payload);
      const response = await axios.put(`http://44.196.192.232:5007/api/guide/updatestatus/${guideId}/${workstatusdataid}`, payload);

      if (response.status === 200) {
        console.log('Work status updated successfully', response.data);
      } else {
        console.log('Failed to update work status', response.data);
      }
    } catch (error) {
      console.error('Error updating work status:', error);
    }
  };

  const clientAssigned = async (id, assigned, assignStatus) => {
    try {
      // if (assigned === 'REASSIGN')
      //   await axios.put(`http://44.196.192.232:5007/api/client/reassign/${id}`)
      setClientid(id);
      setStatus(assigned);
      handleAssign();
      // assigned === 'true' ? clientIsAssigned(id, assigned, assignStatus) : clientNotAssigned(id, assigned, assignStatus);
    } catch (error) {
      alert('Error assigning client');
      console.error('Error assigning client:', error);
    }
  };

  const viewAssignedGuide = async (id) => {
    try {
      const response = await axios.get(`http://44.196.192.232:5007/api/client/getbyid/${id}`)
      setClientid(id);
      const guideid = response.data.data.workerid;
      // console.log('guideid',guideid);
      const guidedata = await axios.get(`http://44.196.192.232:5007/api/guide/getguide/${guideid}`)
      setWorker(guidedata.data.data);
      console.log('worker', worker)
      setDataVisible(true);
    } catch (error) {
      console.log('Error fetching worker data', error);
    }
  };


  const removeworker = async (id) => {
    try {
      const response = await axios.put(`http://44.196.192.232:5007/api/client/reassign/${id}`)
      console.log("Deleted", response.data.data);
      fetchClients();
    } catch (error) {
      console.log("Deletaion Failed", error);
    }
  }

  const assignWorker = async (id, clientid, assigned) => {

    if (assigned === 'REASSIGN')
      await axios.put(`http://44.196.192.232:5007/api/client/reassign/${clientid}`)

    const response = await axios.get(`http://44.196.192.232:5007/api/client/getbyid/${clientid}`)
    const clientName = response.data.data.name;

    const clientId = clientid;
    const status = 'PENDING';

    const payload = {
      clientName, clientId, status
    }

    await axios.put(`http://44.196.192.232:5007/api/guide/updateworkstatus/${id}`, { workStatus: payload })

    const workerid = id;
    await axios.put(`http://44.196.192.232:5007/api/client/editClient/${clientid}`, { workerid: workerid, assignStatus: 'ASSIGNED', assigned: 'REASSIGN' });

    await axios.put(`http://44.196.192.232:5007/api/guide/${id}`, { modelclientid: clientid });
    handleAssign();
    resetFormData();
    await fetchClients();
    setView(false);

  };

  const handleEdit = (client) => {
    setSelectedclient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      mobileNumber: client.mobileNumber || '',
    });
    setEditVisible(true);
  };

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
      address: '',
      age: '',
      medicalhistory: '',
      // password: '',
      // role: '',
      assigned: 'ASSIGN',
      assignStatus: 'NOT ASSIGNED',
      image: null
    });
  };



  return (
    <>
      {error && <CAlert color="danger">{error}</CAlert>}
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            {/* Title */}
            <CCol xs={12} md={6} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                Client Management
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

            {/* Add Client Button */}
            <CCol xs="auto" className="d-flex justify-content-center justify-content-md-end">
              <CButton color="primary" className="px-4" onClick={() => setFormVisible(true)}>
                Add Client
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>


        <CTable hover bordered striped responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Photo</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Email</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Mobile Number</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Address</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Age</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Medical History</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Assign</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {clients.map((client, index) => (
              <CTableRow key={client._id}>
                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center', color: 'white' }}>
                  {client.image && <img src={`http://44.196.192.232:5007${client.image}`} alt={client.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ccc' }} />}
                </CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{client.name || 'null'}</CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{client.email || 'null'}</CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{client.mobileNumber || 'null'}</CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{client.address || 'null'}</CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{client.age || 'null'}</CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>{client.medicalhistory || 'null'}</CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>
                  <CButton
                    style={{
                      width: '110px',
                      backgroundColor: 'linear-gradient(135deg, #17a2b8 0%, #117a8b 100%)',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      padding: '8px 12px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                    color='info'
                    onClick={() => { clientAssigned(client._id, client.assigned, client.assignStatus) }}>
                    {client.assigned || 'null'}

                  </CButton>
                </CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  {client.assignStatus === 'ASSIGNED' ? (
                    <CButton style={{
                      width: '80px',
                      backgroundColor: 'linear-gradient(135deg, #17a2b8 0%, #117a8b 100%)',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      padding: '8px 12px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                      color='info'
                      onClick={() => viewAssignedGuide(client._id)}>
                      View
                    </CButton>
                  ) : (
                    client.assignStatus
                  )}
                </CTableDataCell>
                <CTableDataCell style={{ width: '10%' }} className="text-center">
                  <CButton className="me-1 p-1" onClick={() => handleEdit(client)}>
                    <FontAwesomeIcon icon={faEdit} style={{ color: "#c24c9d" }} />
                  </CButton>
                  <CButton className="me-1 p-1" onClick={() => handleDelete(client._id)}>
                    <FontAwesomeIcon icon={faTrash} style={{ color: "#a82424" }} />
                  </CButton>
                  <CButton className="p-1" onClick={() => { setSelectedclient(client); setVisible(true); }}>
                    <FontAwesomeIcon icon={faEye} style={{ color: "#20c5aa" }} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

      </CCard>

      <CModal visible={formVisible} onClose={() => { setFormVisible(false); resetFormData(); }}>
        <CModalHeader closeButton>
          <CModalTitle>Add Client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={handleAddClient}>
            <CCol md={6}>
              <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="email" label="Email" value={formData.email} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="address" label="Address" value={formData.address} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="age" label="Age" value={formData.age} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="medicalhistory" label="Medical History" value={formData.medicalhistory} onChange={handleChange} />
            </CCol>
            {/* <CCol md={6}>
              <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="role" label="Role" value={formData.role} onChange={handleChange} />
            </CCol> */}
            <CCol md={6}>
              <CFormInput type="file" name='image' id="image" label="Image" onChange={handleChange} />
            </CCol>
            <CCol xs={12}>
              <CButton color="primary" type="submit">Add client</CButton>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setFormVisible(false); resetFormData(); }}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal size='xl' visible={view} onClose={() => { setView(false); }}>
        <CModalHeader>
          <CRow className="w-100">
            {/* Title */}
            <CCol xs={12} md={6} className="d-flex align-items-center justify-content-start">
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              ASSIGN WORKER
              </div>
            </CCol>

            {/* Search Box */}
            <CCol xs={12} md={6} className="d-flex align-items-center justify-content-end">
              <CForm style={{ width: '100%' }}>
                <CFormInput
                  type="text"
                  id="search-client"
                  placeholder="Search by Name"
                  onChange={searchByNameReassign}
                  style={{ maxWidth: '300px' }} // Adjust width as needed
                />
              </CForm>
            </CCol>
          </CRow>
        </CModalHeader>
        <CModalBody>
          <CTable hover bordered striped responsive>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col" >#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
                {/* <CTableHeaderCell scope="col">Role</CTableHeaderCell> */}
                <CTableHeaderCell scope="col" className="text-center">Actions</CTableHeaderCell>
              </CTableRow>

            </CTableHead>
            <CTableBody>
              {workers.map((workers, index) => (
                <CTableRow key={workers._id}>
                  <CTableHeaderCell scope="row" >{index + 1}</CTableHeaderCell>
                  <CTableDataCell style={{ fontSize: '0.870rem' }}>{workers.name || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ fontSize: '0.870rem' }}>{workers.email || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ fontSize: '0.870rem' }}>{workers.mobileNumber || 'null'}</CTableDataCell>
                  {/* <CTableDataCell style={{ fontSize: '0.870rem' }}>{workers.role || 'null'}</CTableDataCell> */}
                  <CTableDataCell style={{ fontSize: '0.870rem', textAlign: 'center' }}>
                    <CButton style={{
                      width: '80px',
                      backgroundColor: 'linear-gradient(135deg, #17a2b8 0%, #117a8b 100%)',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      padding: '8px 12px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                      color='info'
                      onClick={() => { assignWorker(workers._id, clientid, status) }}>ASSIGN</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>

          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setView(false); }}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={editVisible} onClose={() => { setEditVisible(false); resetFormData(); }}>
        <CModalHeader closeButton>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={handleEditClient}>
            <CCol md={6}>
              <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="email" label="Email" value={formData.email} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="address" label="Address" value={formData.address} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="age" label="Age" value={formData.age} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="medicalhistory" label="Medical History" value={formData.medicalhistory} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              {/* <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} /> */}
            </CCol>
            <CCol md={6}>
              {/* <CFormInput type="text" id="role" label="Role" value={formData.role} onChange={handleChange} /> */}
            </CCol>
            <CCol xs={12}>
              <CButton color="primary" type="submit">Update client</CButton>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setEditVisible(false); resetFormData(); }}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={dataVisible} onClose={() => { setDataVisible(false); }}>
        <CModalHeader closeButton>
          <CModalTitle>Assigned Worker</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CListGroup flush>
            <CListGroupItem>
              Image:{worker.image && <img src={`http://44.196.192.232:5007${worker.image}`} alt={worker.name} style={{ width: '100px' }} />}
            </CListGroupItem>
            <CListGroupItem>Name: {worker.name || 'null'}</CListGroupItem>
            <CListGroupItem>Age: {worker.age || 'null'}</CListGroupItem>
            <CListGroupItem>Email: {worker.email || 'null'}</CListGroupItem>
            <CListGroupItem>Mobile Number: {worker.mobileNumber || 'null'}</CListGroupItem>
            <CListGroupItem>Address: {worker.address || 'null'}</CListGroupItem>
            <CListGroupItem>
              <CButton onClick={() => { removeworker(clientid), setDataVisible(false) }} color="danger">Remove Worker</CButton>
            </CListGroupItem>
          </CListGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setDataVisible(false) }}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>client Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedclient && (
            <CListGroup flush>
              <CListGroupItem>Name: {selectedclient.name || 'null'}</CListGroupItem>
              <CListGroupItem>Email: {selectedclient.email || 'null'}</CListGroupItem>
              <CListGroupItem>Mobile Number: {selectedclient.mobileNumber || 'null'}</CListGroupItem>
              <CListGroupItem>Address: {selectedclient.address || 'null'}</CListGroupItem>
              <CListGroupItem>Age: {selectedclient.age || 'null'}</CListGroupItem>
              <CListGroupItem>Medical History: {selectedclient.medicalhistory || 'null'}</CListGroupItem>
            </CListGroup>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ClientManagement;
