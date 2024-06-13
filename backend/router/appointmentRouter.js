import express from "express";
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus, getstats, getAppointmentStatus, getBookedTimes } from "../controller/appointmentController.js";
import {isAdminAuthenticated,isPatientAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post",isPatientAuthenticated,postAppointment);
router.get("/getall", isAdminAuthenticated,getAllAppointments);
router.put("/update/:id", isAdminAuthenticated,updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated,deleteAppointment);
router.get("/stats", isAdminAuthenticated, getstats);
router.get("/status", isPatientAuthenticated, getAppointmentStatus);
router.get("/booked-times", isPatientAuthenticated, getBookedTimes);
export default router;