import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Register.css";

const Register: React.FC = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      civilStatus: "",
      birthDate: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters.")
        .required("Name is required."),
      email: Yup.string()
        .email("Invalid Email Address.")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters.")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
      gender: Yup.string().required("Gender is required"),
      civilStatus: Yup.string()
        .required("Civil status is required")
        .oneOf(
          ["single", "married", "divorced", "widowed"],
          "Invalid civil status"
        ),
      birthDate: Yup.date().required("Birth date is required").nullable(),
    }),
    onSubmit: async (values) => {
      if (!recaptchaToken) {
        alert("Please complete the reCAPTCHA");
        return;
      }

      const formattedBirthDate = values.birthDate
        ? new Date(values.birthDate).toISOString().split('T')[0]
        : null;

      const requestData = {
        name: values.name,
        email: values.email,
        password: values.password,
        gender: values.gender,
        civilstatus: values.civilStatus,
        bdate: formattedBirthDate,
        recaptchaToken,
      };

      console.log("Request Data:", requestData);

      try {
        const response = await axios.post("http://localhost:8081/register", requestData);
        alert("Registration Successful.");
        window.location.href = "/";
      } catch (error) {
        console.error("Error registering user:", error);
        alert("Error registering user. Please try again.");
      }
    },
  });

  const logoPath = "src/images/logo_new.png";
  const sloganText = "EXPAND YOUR RENTAL OPTION WITH US!";

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="main-content text-center">
      <div className="company__info">
        <span className="company__logo">
          <h2>
            <img src={logoPath} className="logo-img" alt="" />
          </h2>
          <p className="slogan">{sloganText}</p>
        </span>
      </div>
      <div className="login_form">
        <div className="container-fluid">
          <div className="row">
            <h2>Create an Account</h2>
          </div>
          <div className="row">
            <form onSubmit={formik.handleSubmit} className="form-group">
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`form__input ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className={`form__input ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className={`form__input ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                    placeholder="Enter Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className={`form__input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "is-invalid" : ""}`}
                    placeholder="Confirm Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <select
                    name="gender"
                    id="gender"
                    className={`form__input ${formik.touched.gender && formik.errors.gender ? "is-invalid" : ""}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.gender}
                  >
                    <option value="" disabled>Select Gender</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="invalid-feedback">{formik.errors.gender}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <select
                    name="civilStatus"
                    id="civilStatus"
                    className={`form__input ${formik.touched.civilStatus && formik.errors.civilStatus ? "is-invalid" : ""}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.civilStatus}
                  >
                    <option value="" disabled>Select Civil Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {formik.touched.civilStatus && formik.errors.civilStatus && (
                    <div className="invalid-feedback">{formik.errors.civilStatus}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="birthDate">Birth Date</label>
                  <input
                    type="date"
                    name="birthDate"
                    id="birthDate"
                    className={`form__input ${formik.touched.birthDate && formik.errors.birthDate ? "is-invalid" : ""}`}
                    placeholder="Enter BirthDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.birthDate}
                  />
                  {formik.touched.birthDate && formik.errors.birthDate && (
                    <div className="invalid-feedback">{formik.errors.birthDate}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <ReCAPTCHA
                    sitekey="6LciEQwqAAAAAAemjDj5ZX6mePfBXRb8UKtdGLja"
                    onChange={onRecaptchaChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <button type="submit" className="btn btn-outline-primary">
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
          <p className="small-text">
            Already have an account?{" "}
            <Link to="/" className="fw-bold text-body">
              <u>Login here</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
