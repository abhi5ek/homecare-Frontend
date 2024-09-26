import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const [countWorker, setCountWorker] = useState();
  const [countClient, setCountClient] = useState();
  const [pending, setPending] = useState();
  const [done, setDone] = useState();

  useEffect(()=>{
    getsize();
  })

  // useEffect(() => {
  //   document.documentElement.addEventListener('ColorSchemeChange', () => {
  //     if (widgetChartRef1.current) {
  //       setTimeout(() => {
  //         widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
  //         widgetChartRef1.current.update()
  //       })
  //     }

  //     if (widgetChartRef2.current) {
  //       setTimeout(() => {
  //         widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
  //         widgetChartRef2.current.update()
  //       })
  //     }
  //   })
  // }, [widgetChartRef1, widgetChartRef2])

  const getsize = async() => {
    try{
      const worker = await axios.get(`http://44.196.192.232:5007/api/client/getworkercount`);
      setCountWorker(worker.data.data);
      const client = await axios.get(`http://44.196.192.232:5007/api/client/getclientcount`);
      setCountClient(client.data.data);
      const status = await axios.get(`http://44.196.192.232:5007/api/guide/status`);
      // console.log(status.data.pending)
      setPending(status.data.pending)
      setDone(status.data.done)
    }catch(error){
      console.error('Error counting guide and client:', error);
    }
  }

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            countClient
          }
          title="Clients"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              // data={{
              //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              //   datasets: [
              //     {
              //       label: 'My First dataset',
              //       backgroundColor: 'transparent',
              //       borderColor: 'rgba(255,255,255,.55)',
              //       pointBackgroundColor: getStyle('--cui-primary'),
              //       data: [65, 59, 84, 84, 51, 55, 40],
              //     },
              //   ],
              // }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            countWorker
          }
          title="Worker"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              // data={{
              //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              //   datasets: [
              //     {
              //       label: 'My First dataset',
              //       backgroundColor: 'transparent',
              //       borderColor: 'rgba(255,255,255,.55)',
              //       pointBackgroundColor: getStyle('--cui-info'),
              //       data: [1, 18, 9, 17, 34, 22, 11],
              //     },
              //   ],
              // }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            pending
          }
          title="Pending Tasks"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              // data={{
              //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              //   datasets: [
              //     {
              //       label: 'My First dataset',
              //       backgroundColor: 'rgba(255,255,255,.2)',
              //       borderColor: 'rgba(255,255,255,.55)',
              //       data: [78, 81, 80, 45, 34, 12, 40],
              //       fill: true,
              //     },
              //   ],
              // }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol> 
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="success"
          value={
           done
          }
          title="Completed Tasks"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              // data={{
              //   labels: [
              //     'January',
              //     'February',
              //     'March',
              //     'April',
              //     'May',
              //     'June',
              //     'July',
              //     'August',
              //     'September',
              //     'October',
              //     'November',
              //     'December',
              //     'January',
              //     'February',
              //     'March',
              //     'April',
              //   ],
              //   datasets: [
              //     {
              //       label: 'My First dataset',
              //       backgroundColor: 'rgba(255,255,255,.2)',
              //       borderColor: 'rgba(255,255,255,.55)',
              //       data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
              //       barPercentage: 0.6,
              //     },
              //   ],
              // }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol> 
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown