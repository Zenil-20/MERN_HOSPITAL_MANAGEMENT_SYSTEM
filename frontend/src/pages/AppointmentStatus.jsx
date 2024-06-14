// src/pages/AppointmentStatus.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';

const AppointmentStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:9845/api/v1/appointment/status', {
          withCredentials: true,
        });
        if (isMounted) {
          setAppointments(response.data.appointmentStatus);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          toast.error('Failed to fetch appointments');
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  return (
    <div className="appointment-status-container">
      <h2 className="appointment-status-header">Appointment Status</h2>
      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Appointment Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.appointment_date}</td>
                <td>{appointment.select_time}</td>
                <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                <td>{appointment.department}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentStatus;
