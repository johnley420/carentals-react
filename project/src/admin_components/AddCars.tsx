import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, } from "react-router-dom";


const AddCar = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            car_name: "",
            car_brand: "",
            car_type: "",
            car_pax: "",
            car_price: "",
            car_img: "",
        },
        validationSchema: Yup.object({
            car_name: Yup.string().required("Car name is required"),
            car_brand: Yup.string().required("Car Brand is required"),
            car_type: Yup.string().required("Car type is required"),
            car_pax: Yup.number().required("Car capacity required"),
            car_price: Yup.number().required("Car price is required"),
            car_img: Yup.mixed().required("Car Image is required"),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("car_name", values.car_name);
            formData.append("car_brand", values.car_brand);
            formData.append("car_type", values.car_type);
            formData.append("car_pax", values.car_pax);
            formData.append("car_price", values.car_price);
            formData.append("car_img", values.car_img);

            axios.post("http://localhost:8081/add_cars", formData)
                .then((response) => {
                    formik.resetForm();
                    console.log("response", response.data);
                    alert("Added Successfully");
                    navigate("/cars");
                })
                .catch((error) => {
                    console.error("Error adding cars:", error);
                    formik.setStatus("Error adding cars. Please try again.");
                });
        },
    });

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="m-8">
                <h2>Add Cars</h2>

                <form onSubmit={formik.handleSubmit} className="mb-3">
                    <label className="form-label">Enter Car Name:</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Car name"
                        {...formik.getFieldProps("car_name")}
                    />
                    {formik.touched.car_name && formik.errors.car_name && (
                        <p className="text-danger">{formik.errors.car_name}</p>
                    )}

                    <label className="form-label">Enter Car brand:</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Car brand"
                        {...formik.getFieldProps("car_brand")}
                    />
                    {formik.touched.car_brand && formik.errors.car_brand && (
                        <p className="text-danger">{formik.errors.car_brand}</p>
                    )}

                    <label className="form-label">Select Car Type:</label>
                    <select
                        className="form-control"
                        {...formik.getFieldProps("car_type")}
                    >
                        <option value="" label="Select Car Type" />
                        <option value="Sedan" label="Sedna" />
                        <option value="SUV" label="SUV" />
                        <option value="Hatchback" label="Hatchback" />
                        <option value="Pickup truck" label="Pickup truck" />
                        <option value="Compact Car" label="Compact Car" />
                    </select>
                    {formik.touched.car_type && formik.errors.car_type && (
                        <p className="text-danger">{formik.errors.car_type}</p>
                    )}

                    <label className="form-label">Enter Car Capacity:</label>
                    <input
                        className="form-control"
                        type="number"
                        placeholder="Car capacity"
                        {...formik.getFieldProps("car_pax")}
                    />
                    {formik.touched.car_pax && formik.errors.car_pax && (
                        <p className="text-danger">{formik.errors.car_pax}</p>
                    )}

                    <label className="form-label">Enter Car Price:</label>
                    <input
                        className="form-control"
                        type="number"
                        placeholder="Car price"
                        {...formik.getFieldProps("car_price")}
                    />
                    {formik.touched.car_price && formik.errors.car_price && (
                        <p className="text-danger">{formik.errors.car_price}</p>
                    )}

                    <label className="form-label">Upload Car Image:</label>
                    <div className="input-group">
                        <input
                            type="file"
                            className="form-control"
                            accept="images/*"
                            onChange={(event) => {
                                const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                                formik.setFieldValue("car_img", file);
                            }}
                        />
                    </div>
                    {formik.touched.car_img && formik.errors.car_img && (
                        <p className="text-danger">{formik.errors.car_img}</p>
                    )}

                    <button className="btn btn-primary mt-3" type="submit">
                        Add Car
                    </button>
                </form>
            </div>
        </div>
    );

};

export default AddCar;
