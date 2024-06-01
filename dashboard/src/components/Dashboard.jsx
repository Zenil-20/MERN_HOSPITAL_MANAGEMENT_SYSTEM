import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [registeredDoctors, setRegisteredDoctors] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:9845/api/v1/appointment/getall",
          { withCredentials: true }
        );

        // Sort appointments by date and time before setting the state
        const sortedAppointments = data.appointments.sort((a, b) => {
          const dateA = new Date(a.appointment_date + "T" + a.select_time);
          const dateB = new Date(b.appointment_date + "T" + b.select_time);
          return dateA - dateB;
        });

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]); // Ensure this line is properly placed inside the catch block
      }
    };

    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:9845/api/v1/appointment/stats",
          { withCredentials: true }
        );
        setTotalAppointments(data.appointmentCount);
        setRegisteredDoctors(data.doctorCount);
      } catch (error) {
        toast.error("Failed to fetch dashboard statistics");
      }
    };

    fetchAppointments();
    fetchStats();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:9845/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.delete(
            `http://localhost:9845/api/v1/appointment/delete/${appointmentId}`,
            { withCredentials: true }
          );
          setAppointments((prevAppointments) =>
            prevAppointments.filter(
              (appointment) => appointment._id !== appointmentId
            )
          );
          toast.success(data.message);
          Swal.fire(
            'Deleted!',
            'Your appointment has been deleted.',
            'success'
          );
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    });
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p>Hello ,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
            </div>
            <p>
              Welcome to the control center of our hospital management system. Your role is crucial in ensuring smooth operations and optimal patient care. Here, you have the tools and capabilities to manage various aspects of the hospital's functions effectively.
            </p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{totalAppointments}</h3>
        </div>
        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>{registeredDoctors}</h3>
        </div>
      </div>
      <div className="banner">
        <h5>Appointments</h5>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
              <th>Visited</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                  <td>{appointment.appointment_date.substring(0, 10)}</td>
                  <td>{appointment.select_time}</td>
                  <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                  <td>{appointment.department}</td>
                  <td>
                    <select
                      className={
                        appointment.status === "Pending"
                          ? "value-pending"
                          : appointment.status === "Accepted"
                            ? "value-accepted"
                            : "value-rejected"
                      }
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateStatus(appointment._id, e.target.value)
                      }
                    >
                      <option value="Pending" className="value-pending">
                        Pending
                      </option>
                      <option value="Accepted" className="value-accepted">
                        Accepted
                      </option>
                      <option value="Rejected" className="value-rejected">
                        Rejected
                      </option>
                    </select>
                  </td>
                  <td>
                    {appointment.hasVisited ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                  <td>
                    <MdDeleteForever
                      className="delete-icon"
                      onClick={() => handleDeleteAppointment(appointment._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No Appointments Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
