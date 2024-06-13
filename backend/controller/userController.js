import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import { Appointment } from "../models/appointmentSchema.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic
    ) {
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }

    // Convert dob from string to Date object
    let dobDate;
    try {
        dobDate = new Date(dob); // Attempt to parse the date directly
        if (isNaN(dobDate.getTime())) {
            throw new Error("Invalid Date");
        }
    } catch (error) {
        return next(new ErrorHandler("Invalid Date of Birth", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User Already Registered", 400));
    }

    user = new User({
        firstName,
        lastName,
        email,
        phone,
        password,
        nic,
        dob: dobDate,
        gender,
        role: "Patient",
    });

    await user.save();

    generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please Provide All Details!", 400));
    }
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password Do Not Match!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Password Or Email!", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password Or Email!", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler("User With This Role Is Not Found!", 400));
    }
    generateToken(user, "User Login Succesfully!", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic
    ) {
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        const roleMessage = isRegistered.role === 'Admin' ? 'Admin' : isRegistered.role;
        return next(new ErrorHandler(`${roleMessage} With This Email Already Exist!`, 400));
    }
    const admin = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role: "Admin", })
    res.status(200).json({
        success: true,
        message: "New Admin Registered!",
    })
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res
        .status(200)
        .cookie("adminToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Admin Logged Out Successfully!",
        });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res
        .status(200)
        .cookie("patientToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Patient Logged Out Successfully!",
        });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    const { firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;
    if (
        !firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment
    ) {
        return next(new ErrorHandler("Please Provide Full Details", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email!`, 400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error!", cloudinaryResponse.error || "Unknown Cloudinary Error!");
    }
    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role: "Doctor",
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "New Doctor Registered!",
        doctor,
    });
});

export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Check if the doctor exists
    const doctor = await User.findById(id);
    if (!doctor) {
        return next(new ErrorHandler('Doctor not found!', 404));
    }

    // Check if the user to be deleted is a doctor
    if (doctor.role !== 'Doctor') {
        return next(new ErrorHandler('The user is not a doctor!', 400));
    }

    // Delete the doctor from the database
    await User.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Doctor deleted successfully!',
    });
});

// To update a doctor
export const updateDoctor = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone, gender, dob, nic, doctorDepartment } = req.body;

    let doctor = await User.findById(id);
    if (!doctor) {
        return next(new ErrorHandler('Doctor not found!', 404));
    }

    if (doctor.role !== 'Doctor') {
        return next(new ErrorHandler('The user is not a doctor!', 400));
    }

    const updatedData = {
        firstName,
        lastName,
        email,
        phone,
        gender,
        dob,
        nic,
        doctorDepartment,
    };

    doctor = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: 'Doctor updated successfully!',
        doctor,
    });
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler('Appointment Not Found!', 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, {...req.body, status: 'Accepted'}, { // Set status to 'Accepted'
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: 'Appointment Status Updated',
      appointment,
    });
  });
  
