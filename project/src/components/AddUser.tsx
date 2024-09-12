import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

const AddUser = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Required Name"),
      email: Yup.string()
        .email("Invalid email format. Please enter a valid email address")
        .required("Required Email"),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:8081/add_user", values)
        .then((response) => {
          formik.resetForm();
          console.log("response" + response.data);
          alert(" Added Successfully");
          navigate("/userlist");
        })
        .catch((error) => {
          console.error("Error adding user:", error);
          formik.setStatus("Error adding user. Please try again.");
        });
    },
  });

  return (
    <div
      className="container d-flex justify-content-center align-items-center m-3"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="container bg-light p-4 rounded"
        style={{ maxWidth: "700px", marginTop: "-200px" }}
      >
        <h2 className="text-center mb-3 adduser-heading">ADD USER</h2>

        <form onSubmit={formik.handleSubmit}>
          <label className="form-label">Enter Name:</label>
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-danger">{formik.errors.name}</p>
          )}

          <label className="form-label">Enter Email:</label>
          <input
            className="form-control"
            type="text"
            placeholder="Email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-danger">{formik.errors.email}</p>
          )}

          {formik.status && <p className="text-danger">{formik.status}</p>}

          <br />
          <button className="btn btn-primary" type="submit">
            ADD USER &nbsp;
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
