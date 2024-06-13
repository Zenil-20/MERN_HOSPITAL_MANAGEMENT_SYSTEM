import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [department, setDepartment] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const { user, isAuthenticated } = useContext(Context);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(
        "http://localhost:9845/api/v1/user/doctors",
        { withCredentials: true }
      );
      setDoctors(data.doctors);
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchBookedAppointments = async () => {
      if (appointmentDate && department && doctorFirstName && doctorLastName) {
        const { data } = await axios.get(
          "http://localhost:9845/api/v1/appointment",
          {
            params: {
              appointment_date: appointmentDate,
              department,
              doctor_firstName: doctorFirstName,
              doctor_lastName: doctorLastName,
            },
            withCredentials: true,
          }
        );
        setAppointments(data.appointments);
      }
    };
    fetchBookedAppointments();
  }, [appointmentDate, department, doctorFirstName, doctorLastName]);

  useEffect(() => {
    setAvailableTimeSlots(generateTimeSlots(appointments));
  }, [appointments]);

  const handleAppointment = async (e) => {
    e.preventDefault();

    if (email !== user.email) {
      toast.error("Logged in email and Entered Email not verified");
      return;
    }

    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        "http://localhost:9845/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          select_time: appointmentTime,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      resetFormFields();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const resetFormFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNic("");
    setDob("");
    setGender("");
    setAppointmentDate("");
    setAppointmentTime("");
    setDepartment("");
    setDoctorFirstName("");
    setDoctorLastName("");
    setHasVisited(false);
    setAddress("");
  };

  const generateTimeSlots = (bookedAppointments) => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
        const minStr = min < 10 ? `0${min}` : `${min}`;
        const time = `${hourStr}:${minStr}`;
        const isAvailable = !bookedAppointments.some(appointment =>
          appointment.select_time === time && 
          appointment.department === department && 
          appointment.doctor_firstName === doctorFirstName && 
          appointment.doctor_lastName === doctorLastName && 
          appointment.appointment_date === appointmentDate && 
          appointment.status === 'Accepted' // Check for accepted appointments
        );
        if (isAvailable) {
          slots.push(time);
        }
      }
    }
    return slots;
  };
  
  

  const handleLoginRegister = () => {
    window.location.href = "/login"; // Change to your login/register route
  };

  return (
    <>
      {!isAuthenticated && (
        <div className="blur-overlay">
          <button onClick={handleLoginRegister}>Login/Register</button>
        </div>
      )}
      <div className={`container form-component appointment-form ${!isAuthenticated ? 'blur' : ''}`}>
        <h2 className="appointment-title">Appointment</h2>
        <form onSubmit={handleAppointment}>
          <div className="form-row">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ width: "45%", marginRight: "10px" }}
              disabled={!isAuthenticated}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ width: "45%" }}
              disabled={!isAuthenticated}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Confirm Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "45%", marginRight: "10px" }}
              disabled={!isAuthenticated}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "45%" }}
              disabled={!isAuthenticated}
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              placeholder="NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              style={{ width: "45%", marginRight: "10px" }}
              disabled={!isAuthenticated}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{ width: "45%" }}
              disabled={!isAuthenticated}
            />
          </div>
          <div className="form-row">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ width: "45%", marginRight: "10px" }}
              disabled={!isAuthenticated}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="date"
              placeholder="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              style={{ width: "45%" }}
              disabled={!isAuthenticated}
            />
          </div>
          <div className="form-row">
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setDoctorFirstName("");
                setDoctorLastName("");
              }}
              style={{ width: "45%", marginRight: "10px" }}
              disabled={!isAuthenticated}
            >
              <option value="">Select Department</option>
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>
                  {depart}
                </option>
              ))}
            </select>
            <select
              value={`${doctorFirstName} ${doctorLastName}`}
              onChange={(e) => {
                const [firstName, lastName] = e.target.value.split(" ");
                setDoctorFirstName(firstName);
                setDoctorLastName(lastName);
              }}
              disabled={!department || !isAuthenticated}
              style={{ width: "45%" }}
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor, index) => (
                  <option
                    value={`${doctor.firstName} ${doctor.lastName}`}
                    key={index}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-row">
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              style={{ width: "100%" }}
              disabled={!isAuthenticated}
            >
              <option value="">Select Time</option>
              {availableTimeSlots.map((time, index) => (
                <option value={time} key={index}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            style={{ width: "100%" }}
            disabled={!isAuthenticated}
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
            className="form-row"
          >
            <p style={{ marginBottom: 0 }}>Have you visited before?</p>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
              style={{ flex: "none", width: "25px" }}
              disabled={!isAuthenticated}
            />
          </div>
          <button style={{ margin: "0 auto" }} disabled={!isAuthenticated}>
            BOOK APPOINTMENT
          </button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;