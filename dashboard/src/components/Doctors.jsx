import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import moment from "moment";
import * as ReactTooltip from "react-tooltip";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const [editDoctorData, setEditDoctorData] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:9845/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  const deleteDoctor = async (doctorId) => {
    try {
      await axios.delete(
        `http://localhost:9845/api/v1/user/doctors/${doctorId}`,
        { withCredentials: true }
      );
      setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
      toast.success("Doctor deleted successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = (doctorId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDoctor(doctorId);
      }
    });
  };

  const handleEditClick = (doctor) => {
    setEditDoctorData({
      ...doctor,
      dob: moment(doctor.dob).format("YYYY-MM-DD"),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDoctorData({ ...editDoctorData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to update the doctor information!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.put(
            `http://localhost:9845/api/v1/user/doctors/${editDoctorData._id}`,
            editDoctorData,
            { withCredentials: true }
          );
          setDoctors(
            doctors.map((doctor) =>
              doctor._id === data.doctor._id ? data.doctor : doctor
            )
          );
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Doctor updated successfully!',
          });
          setEditDoctorData(null);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    });
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => (
            <div className="card" key={element._id}>
              <img
                src={element.docAvatar && element.docAvatar.url}
                alt="doctor avatar"
              />
              <h4>{`${element.firstName} ${element.lastName}`}</h4>
              <div className="details">
                <p>
                  Email: <span>{element.email}</span>
                </p>
                <p>
                  Phone: <span>{element.phone}</span>
                </p>
                <p>
                  DOB: <span>{moment(element.dob).format("YYYY-MM-DD")}</span>
                </p>
                <p>
                  Department: <span>{element.doctorDepartment}</span>
                </p>
                <p>
                  NIC: <span>{element.nic}</span>
                </p>
                <p>
                  Gender: <span>{element.gender}</span>
                </p>
                <div className="icons">
                  {/* Edit Doctor Icon */}
                  <MdEdit
                    className="edit-doctor"
                    onClick={() => handleEditClick(element)}
                    style={{ backgroundColor: "#FFA500", padding: "5px", borderRadius: "50%" }}
                    data-tip="Edit Doctor"
                  />
                  {/* Delete Doctor Icon */}
                  <MdDeleteForever
                    className="delete-doctor"
                    onClick={() => handleDelete(element._id)}
                    style={{ backgroundColor: "#FF5733", padding: "5px", borderRadius: "50%" }}
                    data-tip="Delete Doctor"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>

      {/* Display the edit form */}
      {editDoctorData && (
        <div className="edit-form">
          <h2>Edit Doctor</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={editDoctorData.firstName}
                onChange={handleEditChange}
                placeholder="First Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={editDoctorData.lastName}
                onChange={handleEditChange}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editDoctorData.email}
                onChange={handleEditChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={editDoctorData.phone}
                onChange={handleEditChange}
                placeholder="Phone"
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={editDoctorData.dob}
                onChange={handleEditChange}
                placeholder="Date of Birth"
                required
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="doctorDepartment"
                value={editDoctorData.doctorDepartment}
                onChange={handleEditChange}
                placeholder="Department"
                required
              />
            </div>
            <div className="form-group">
              <label>NIC</label>
              <input
                type="text"
                name="nic"
                value={editDoctorData.nic}
                onChange={handleEditChange}
                placeholder="NIC"
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={editDoctorData.gender}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditDoctorData(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default Doctors;
