import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        minLength: [8, "Password Must contain At Least 8 Characters!"],
        required: [true, "Password Is Required!"],
        select: false,
    },
    role: {
        type: String,
        required: [true, "User Role Required!"],
        enum: ["Admin", "Patient", "Doctor"],
    },
    doctorDepartment: {
        type: String,
    },
    docAvatar: {
        public_id: String,
        url: String,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);

