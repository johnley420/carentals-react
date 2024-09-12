import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            car_name: "",
            car_brand: "",
            car_type: "",
            car_pax: "",
            car_price: "",
            car_img: null,
        },
        validationSchema: Yup.object({
            car_name: Yup.string().required("Car name is required"),
            car_brand: Yup.string().required("Car brand is required"),
            car_type: Yup.string().required("Car type is required"),
            car_pax: Yup.number().required("Car capacity required"),
            car_price: Yup.number().required("Car price is required"),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("car_name", values.car_name);
            formData.append("car_brand", values.car_brand);
            formData.append("car_type", values.car_type);
            formData.append("car_pax", values.car_pax);
            formData.append("car_price", values.car_price);

            // Only append the new image if it's provided
            if (values.car_img) {
                formData.append("car_img", values.car_img);
            } else {
                // If no new image is provided, fetch the existing image from the server
                const existingImage = await axios
                    .get(`http://localhost:8081/cars/${id}`)
                    .then((response) => response.data[0].car_img);

                formData.append("car_img", existingImage);
            }

            try {
                const response = await axios.put(`http://localhost:8081/cars/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.log("Response from API:", response.data);
                alert("Updated Successfully");
                navigate("/cars");
            } catch (error) {
                console.error("Error updating car:", error);
                formik.setStatus("Error updating car. Please try again.");
            }
        },
    });

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/cars/${id}`);
                const carData = response.data[0];

                formik.setValues({
                    car_name: carData.car_name,
                    car_brand: carData.car_brand,
                    car_type: carData.car_type,
                    car_pax: carData.car_pax,
                    car_price: carData.car_price,
                    car_img: carData.car_img, // Set the existing image directly
                });
            } catch (error) {
                console.error("Error fetching car data:", error);
            }
        };

        fetchCarData();
    }, [id, formik.setValues]);

    const handleUpdateItem = () => {
        formik.validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                formik.handleSubmit();
            }
        });
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="container mx-auto mt-6" style={{ maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Edit Car</h2>

                <form onSubmit={(e) => {
                    e.preventDefault(); // Prevent default form submission
                    formik.handleSubmit(); // Manually trigger formik submission
                }} className="mb-3">
                    <label className="form-label">Enter Car Name:</label>
                    <input
                        className={`form-control mb-3 ${formik.touched.car_name && formik.errors.car_name ? "is-invalid" : ""}`}
                        type="text"
                        placeholder="Car Name"
                        {...formik.getFieldProps("car_name")}
                    />
                    {formik.touched.car_name && formik.errors.car_name && (
                        <div className="invalid-feedback">{formik.errors.car_name}</div>
                    )}

                    <label className="form-label">Enter Car Brand:</label>
                    <input
                        className={`form-control mb-3 ${formik.touched.car_brand && formik.errors.car_brand ? "is-invalid" : ""}`}
                        type="text"
                        placeholder="Car Brand"
                        {...formik.getFieldProps("car_brand")}
                    />
                    {formik.touched.car_brand && formik.errors.car_brand && (
                        <div className="invalid-feedback">{formik.errors.car_brand}</div>
                    )}

                    <label className="form-label">Select Car Type:</label>
                    <select
                        className={`form-control mb-3 ${formik.touched.car_type && formik.errors.car_type ? "is-invalid" : ""}`}
                        {...formik.getFieldProps("car_type")}
                    >
                        <option value="" label="Select Car Type" />
                        <option value="Sedan" label="Sedan" />
                        <option value="SUV" label="SUV" />
                        <option value="Hatchback" label="Hatchback" />
                        <option value="Pickup truck" label="Pickup truck" />
                        <option value="Compact Car" label="Compact Car" />
                    </select>
                    {formik.touched.car_type && formik.errors.car_type && (
                        <div className="invalid-feedback">{formik.errors.car_type}</div>
                    )}

                    <label className="form-label">Enter Car Capacity:</label>
                    <input
                        className={`form-control mb-3 ${formik.touched.car_pax && formik.errors.car_pax ? "is-invalid" : ""}`}
                        type="number"
                        placeholder="Car Capacity"
                        {...formik.getFieldProps("car_pax")}
                    />
                    {formik.touched.car_pax && formik.errors.car_pax && (
                        <div className="invalid-feedback">{formik.errors.car_pax}</div>
                    )}

                    <label className="form-label">Enter Car Price:</label>
                    <input
                        className={`form-control mb-3 ${formik.touched.car_price && formik.errors.car_price ? "is-invalid" : ""}`}
                        type="number"
                        placeholder="Car Price"
                        {...formik.getFieldProps("car_price")}
                    />
                    {formik.touched.car_price && formik.errors.car_price && (
                        <div className="invalid-feedback">{formik.errors.car_price}</div>
                    )}

                    <label className="form-label">Existing Image:</label>
                    {formik.values.car_img && (
                        <img
                            src={`http://localhost:8081/images/${formik.values.car_img}`}
                            alt={`Existing Car Image`}
                            style={{ width: "18%", height: "auto", marginBottom: "10px" }}
                        />
                    )}

                    <label className="form-label">Upload image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        className={`form-control mb-3 ${formik.touched.car_img && formik.errors.car_img ? "is-invalid" : ""}`}
                        onChange={(event) => {
                            formik.setFieldTouched("car_img", true);
                            formik.setFieldValue("car_img", event.currentTarget.files?.[0]);
                        }}
                    />
                    {formik.touched.car_img && formik.errors.car_img && (
                        <div className="invalid-feedback">{formik.errors.car_img}</div>
                    )}

                    <button className="btn btn-primary" type="submit" onClick={handleUpdateItem}>
                        Update Car &nbsp;
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCar;
