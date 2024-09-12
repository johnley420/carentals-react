import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name should be at least 2 characters")
        .required("Required Name"),
      email: Yup.string().email("Invalid email").required("Required Email"),
    }),
    onSubmit: (values) => {
      // Handle form submission here
      axios
        .put(`http://localhost:8081/user/${id}`, {
          name: values.name,
          email: values.email,
        })
        .then((response) => {
          console.log("response:" + response.data);
        });
    },
  });

  const handleUpdateItem = () => {
    // Trigger form validation manually
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        // No validation errors, proceed with the API call
        axios
          .put(`http://localhost:8081/user/${id}`, {
            name: formik.values.name,
            email: formik.values.email,
          })

          .then((response) => {
            console.log("response:" + response.data);
            navigate("/userlist");
          });
      }
    });
  };

  useEffect(() => {
    fetch(`http://localhost:8081/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Set the initial values of the form with the fetched user data
        formik.setValues({
          name: data[0].name,
          email: data[0].email,
        });
      })
      .catch((err) => console.log(err));
  }, [id, formik.setValues]);

  return (
    <div
      className="container d-flex justify-content-center align-items-center m-3"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="container bg-light p-4 rounded"
        style={{ maxWidth: "700px", marginTop: "-200px" }}
      >
        <h2 className="text-center mb-3 edituser-heading">EDIT USER</h2>
        <label className="form-label">Enter Name:</label>
        <input
          className={`form-control mb-3 ${
            formik.touched.name && formik.errors.name ? "is-invalid" : ""
          }`}
          type="text"
          placeholder="Name"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="invalid-feedback">{formik.errors.name}</div>
        )}
        <label className="form-label">Enter Email:</label>
        <input
          className={`form-control mb-3 ${
            formik.touched.email && formik.errors.email ? "is-invalid" : ""
          }`}
          type="text"
          placeholder="Email"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="invalid-feedback">{formik.errors.email}</div>
        )}

        <button className="btn btn-primary" onClick={handleUpdateItem}>
          Update &nbsp;
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </div>
    </div>
  );
};

export default EditUser;
