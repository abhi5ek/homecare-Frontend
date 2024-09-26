import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { faDownload } from '@fortawesome/free-solid-svg-icons';
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
import { faCheckCircle, faClock, faEye, faDownload, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const AssessmentManagement = () => {
  const [guides, setGuides] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [view, setView] = useState(false);
  const [workstatus, setWorkstatus] = useState([]);
  const [clientData, setclientData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  // useEffect(() => {
  //   console.log('Updated guides:', guides);
  // }, [guides]);

  const downloadPdf = async (iid) => {
    try {
      // Set loading state to true before starting the download
      setIsLoading(true);

      // Make the request to your server to generate the PDF
      const response = await axios.post('http://44.196.192.232:5007/generate-pdf',
        { id: iid },
        {
          responseType: 'blob', // Ensure the response is handled as a blob
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if the response is a blob
      if (response.data instanceof Blob) {
        // Create a URL for the blob response
        const url = URL.createObjectURL(response.data);

        // Create a link and simulate a click to download the file
        const link = document.createElement('a');
        link.href = url;
        link.download = `Report-${iid}.pdf`; // Specify the file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        URL.revokeObjectURL(url);
      } else {
        console.error('Response data is not a blob.');
      }

    } catch (error) {
      console.error('Error downloading the file:', error);
    } finally {
      // Set loading state to false after the download is complete
      setIsLoading(false);
    }
  };

  const searchByName = async (e) => {
    const search = e.target.value;
    setGuides(
      masterData.filter((data) => { return data.name.toLowerCase().includes(search.toLowerCase()) })
    )
  }

  const searchClientData = async (e) => {
    const search = e.target.value;
    setWorkstatus(
      clientData.filter((data) => { return data.clientName.toLowerCase().includes(search.toLowerCase()) })
    )

  }

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

  const viewClient = async (id) => {
    try {
      const response = await axios.get(`http://44.196.192.232:5007/api/guide/getguide/${id}`);
      setWorkstatus(response.data.data.workStatus);
      setclientData(response.data.data.workStatus);
      setView(true);
    } catch (error) {
      setError('Error fetching workstatus');
      console.error('Error fetching workstatus:', error);
    }
  }

  return (
    <>
      {error && <CAlert color="danger">{error}</CAlert>}
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            {/* Title */}
            <CCol xs={12} md={6} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                Worker's History
              </div>
            </CCol>

            {/* Search Box */}
            <CCol xs={12} md={6} className="d-flex justify-content-center justify-content-md-end mb-2 mb-md-0">
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
              <CTableHeaderCell style={{ textAlign: 'center' }} scope="col" className="text-center">Actions</CTableHeaderCell>
            </CTableRow>

          </CTableHead>
          <CTableBody>
            {guides
              .map((guide, index) => (
                <CTableRow key={guide._id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell style={{ textAlign: 'center', fontSize: '0.870rem' }}>
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
                  <CTableDataCell style={{ textAlign: 'center', fontSize: '0.870rem' }}>{guide.name || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ textAlign: 'center', fontSize: '0.870rem' }}>{guide.age || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ textAlign: 'center', fontSize: '0.870rem' }}>{guide.email || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ textAlign: 'center', fontSize: '0.870rem' }}>{guide.mobileNumber || 'null'}</CTableDataCell>
                  <CTableDataCell style={{ textAlign: 'center', fontSize: '0.870rem' }}>{guide.address || 'null'}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton className="p-4" style={{ textAlign: 'center', border: "none" }} onClick={() => viewClient(guide._id)} >
                      <FontAwesomeIcon icon={faEye} style={{ color: "green" }} size='2x' />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>

        </CTable>
      </CCard>

      <CModal size="sm" visible={isLoading} onClose={() => setIsLoading(false)} backdrop="static" keyboard={false} >
        <CModalBody>
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="ms-3">Downloading PDF...</div>
          </div>
        </CModalBody>
      </CModal>


      <CModal size='lg' visible={view} onClose={() => setView(false)}>
        <CModalHeader>
          <CRow className="w-100">
            {/* Title */}
            <CCol xs={12} md={6} className="d-flex align-items-center justify-content-start">
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                CLIENTS
              </div>
            </CCol>

            {/* Search Box */}
            <CCol xs={12} md={6} className="d-flex align-items-center justify-content-end">
              <CForm style={{ width: '100%' }}>
                <CFormInput
                  type="text"
                  id="search-client"
                  placeholder="Search by Name"
                  onChange={searchClientData}
                  style={{ maxWidth: '300px' }} // Adjust width as needed
                />
              </CForm>
            </CCol>
          </CRow>
        </CModalHeader>

        <CModalBody>
          {/* Responsive table container */}
          <div className="table-responsive">
            <table className="table table-success table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col" className="text-center align-middle">#</th>
                  <th scope="col" className="text-center align-middle">Client Id</th>
                  <th scope="col" className="text-center align-middle">Client Name</th>
                  <th scope="col" className="text-center align-middle">Task Status</th>
                  <th scope="col" className="text-center align-middle">Download Pdf</th>
                </tr>
              </thead>
              <tbody>
                {workstatus.map((work, index) => (
                  <tr key={work._id}>
                    <th scope="row" className="text-center align-middle">{index + 1}</th>
                    <td className="text-center align-middle">{work.clientId}</td>
                    <td className="text-center align-middle">{work.clientName}</td>
                    <td className="text-center align-middle">
                      {work.status === 'PENDING' ? (
                        <FontAwesomeIcon icon={faClock} style={{ color: 'orange' }} title="Pending" size="2x" />
                      ) : (
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} title="Completed" size="2x" />
                      )}
                    </td>
                    <td className="text-center align-middle">
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => downloadPdf(work.clientId)}>
                        <FontAwesomeIcon icon={faDownload} style={{ color: 'black' }} title={work.status === 'PENDING' ? 'Pending' : 'Completed'} size="2x" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setView(false)}>Close</CButton>
        </CModalFooter>
      </CModal>


    </>
  )
}

export default AssessmentManagement;
