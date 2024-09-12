import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Admin.css";

const AdminLogin: React.FC = () => {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid Email Address")
                .required("Email is required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: (values) => {
            axios
                .post("http://localhost:8081/admin", values)
                .then((response) => {
                    if (response.data.success) {
                        localStorage.setItem("logged", "true");
                        localStorage.setItem("adminEmail", values.email);
                        window.location.href = "/dashboard";
                    } else {
                        alert("Invalid login credentials. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Error logging in:", error);
                    alert("Error logging in. Please try again.");
                });
        },
    });

    const logoPath = "src/images/logo_new.png";
    const sloganText = "EXPAND YOUR RENTAL OPTION WITH US!";

    return (
        <>
            <div className="main-content text-center">
                <div className="company__info">
                    <span className="company__logo">
                        <h2>
                            <img src={logoPath} className="logo-img" alt="" />
                        </h2>
                        <p className="slogan">{sloganText}</p> {/* Added slogan */}
                    </span>
                </div>
                <div className="login_form">
                    <div className="container-fluid">
                        <div className="row">
                            <h2>Admin Login</h2>
                        </div>
                        <div className="row">
                            <form onSubmit={formik.handleSubmit} className="form-group">
                                <div className="row">
                                    <div className="col">
                                        <input
                                            type="text"
                                            name="email"
                                            id="email"
                                            className={`form__input ${formik.touched.email && formik.errors.email
                                                ? "is-invalid"
                                                : ""
                                                }`}
                                            placeholder="Enter Email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                        />
                                        {formik.touched.email && formik.errors.email && (
                                            <div className="invalid-feedback">
                                                {formik.errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className={`form__input ${formik.touched.password && formik.errors.password
                                                ? "is-invalid"
                                                : ""
                                                }`}
                                            placeholder="Enter Password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.password}
                                        />
                                        {formik.touched.password && formik.errors.password && (
                                            <div className="invalid-feedback">
                                                {formik.errors.password}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <input
                                            type="submit"
                                            value="Submit"
                                            className="buttons btn-outline-primary"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
