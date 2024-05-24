import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is Required!"],
        minLength: [3, "First Name Must contain At Least 3 characters!"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required!"],
        minLength: [3, "Last Name Must contain At Least 3 characters!"],
    },
    email: {
        type: String,
        required: [true, "Email Is Required"],
        validate: [validator.isEmail, "Please Provide A Valid Email!"],
    },
    phone: {
        type: String,
        required: [true, "Phone Is Required!"],
        minLength: [11, "Phone Number Must contain exact 11 Digits!"],
        maxLength: [11, "Phone Number Must contain exact 11 Digits!"],
    },
    nic: {
        type: String,
        required: [true, "NIC Is Required!"],
        minLength: [13, "NIC Must contain exact 13 Digits!"],
        maxLength: [13, "NIC Must contain exact 13 Digits!"],
    },
    dob: {
        type: Date,
        required: [true, "DOB is required"],
    },
    gender: {
        type: String,
        required: [true, "Gender Is Required!"],
        enum: ["Male", "Female"],
    },
    appointment_date: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    doctor: {
        firstName:{
        type: String,
        required: true,
        },
        lastName:{
        type: String,
        required: true,
        },
    },
    hasVisited:{
        type: Boolean,
        default: false,
    },
    doctorId:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    patientId:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ["Pending","Accepted","Rejected"],
        default: "Pending",
    },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);