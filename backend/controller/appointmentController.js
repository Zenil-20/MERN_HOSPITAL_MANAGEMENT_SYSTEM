// controllers/appointmentController.js
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/errorMiddleware.js';
import { Appointment } from '../models/appointmentSchema.js';
import { User } from '../models/userSchema.js';

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
    select_time,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address ||
    !select_time
  ) {
    return next(new ErrorHandler('Please Fill Full Form', 400));
  }

    // Check if the appointment date is a Sunday
    const appointmentDate = new Date(appointment_date);
    if (appointmentDate.getUTCDay() === 0) {
      return next(new ErrorHandler('It is a non-working day', 400));
    }
    
    // Check if the appointment date is in the future
  const currentDate = new Date();
  if (appointmentDate <= currentDate) {
    return next(new ErrorHandler('Select appropriate appointment date', 400));
  }

  // Check if the selected time slot is already taken
  const existingAppointment = await Appointment.findOne({
    appointment_date,
    select_time,
    department,
    'doctor.firstName': doctor_firstName,
    'doctor.lastName': doctor_lastName,
    status: { $ne: 'Rejected' } // Ensure that rejected slots are available
  });

  if (existingAppointment) {
    return next(new ErrorHandler('Time slot already taken', 400));
  }
  /*********************************************************** */

  const doctor = await User.findOne({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: 'Doctor',
    doctorDepartment: department,
  });

  if (!doctor) {
    return next(new ErrorHandler('Doctor Not Found', 404));
  }

  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId: doctor._id,
    patientId,
    select_time,
  });

  res.status(200).json({
    success: true,
    message: 'Appointment Sent Successfully!',
    appointment,
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler('Appointment Not Found!', 404));
  }
  appointment = await Appointment.findByIdAndUpdate(id, req.body, {
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

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler('Appointment Not Found!', 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Appointment Deleted!',
  });
});

// Function to get appointment status for authenticated patient
export const getAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const userEmail = req.user.email;

  const appointments = await Appointment.find({ email: userEmail });

  const appointmentStatus = appointments.map(appointment => ({
    _id: appointment._id,
    appointment_date: appointment.appointment_date,
    select_time: appointment.select_time,
    department: appointment.department,
    doctor: {
      firstName: appointment.doctor.firstName,
      lastName: appointment.doctor.lastName
    },
    status: appointment.status
  }));

  res.status(200).json({
    success: true,
    appointmentStatus
  });
});

export const getstats = catchAsyncErrors(async (req, res, next) => {
  const appointmentCount = await Appointment.countDocuments({});
  const doctorCount = await User.countDocuments({ role: 'Doctor' });
  res.status(200).json({
    success: true,
    appointmentCount,
    doctorCount,
  });
});