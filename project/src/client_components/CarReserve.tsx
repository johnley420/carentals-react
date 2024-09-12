import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CarReserve: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [carData, setCarData] = useState(null);
    const userEmail = localStorage.getItem("userEmail");

    const formik = useFormik({
        initialValues: {
            useDate: "",
            numberOfDays: "",
            address: "",
            driverlic_img: "",
        },
        validationSchema: Yup.object({
            useDate: Yup.date().required("Date to use the car is required"),
            numberOfDays: Yup.number().required("Number of days is required"),
            address: Yup.string().required("Address is required"),
            driverlic_img: Yup.mixed().required("Driver's license image is required"),
        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("useDate", values.useDate);
                formData.append("numberOfDays", values.numberOfDays);
                formData.append("address", values.address);

                // Check if userEmail is defined before appending it to FormData
                if (userEmail) {
                    formData.append("userEmail", userEmail);
                }

                formData.append("driverlic_img", values.driverlic_img);

                const response = await axios.post(`http://localhost:8081/add_reserve/${id}`, formData);
                console.log("Reservation Response:", response.data);
                alert("Car reserved successfully");
                navigate("/rentcars");
            } catch (error) {
                console.error("Error reserving car:", error);
                alert("Error reserving car. Please try again.");
            }
        },
    });

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/cars/${id}`);
                const carData = response.data[0];
                setCarData(carData);
            } catch (error) {
                console.error("Error fetching car data:", error);
            }
        };

        fetchCarData();
    }, [id]);
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="container mx-auto mt-6" style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-4">Reserve Car</h2>
                {carData && (
                    <table className="table table-bordered mb-3 table-dark">
                        <tbody>
                            <tr>
                                <td>Car Name:</td>
                                <td>{carData['car_name']}</td>
                            </tr>
                            <tr>
                                <td>Car Brand:</td>
                                <td>{carData['car_brand']}</td>
                            </tr>
                            <tr>
                                <td>Car Type:</td>
                                <td>{carData['car_type']}</td>
                            </tr>
                            <tr>
                                <td>Car Capacity:</td>
                                <td>{carData['car_pax']}</td>
                            </tr>
                            <tr>
                                <td>Car Price:</td>
                                <td>{carData['car_price']}</td>
                            </tr>
                            <tr>
                                <td>Car Image:</td>
                                <td>
                                    {carData["car_img"] && (
                                        <img
                                            src={`http://localhost:8081/images/${carData["car_img"]}`}
                                            alt={`Car ${carData["id"]} Image`}
                                            className="img-fluid"
                                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                                        />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
                {carData && (
                    <form onSubmit={formik.handleSubmit} className="mb-3">
                        <table className="table table-bordered mb-3 table-dark">
                            <tbody>
                                {/* Display car information */}
                                {/* ... */}

                                {/* Use Date input */}
                                <tr>
                                    <td>Use Date:</td>
                                    <td>
                                        <input
                                            type="date"
                                            name="useDate"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.useDate}
                                        />
                                        {formik.touched.useDate && formik.errors.useDate && (
                                            <div className="text-danger">{formik.errors.useDate}</div>
                                        )}
                                    </td>
                                </tr>

                                {/* Number of Days input */}
                                <tr>
                                    <td>Number of Days:</td>
                                    <td>
                                        <input
                                            type="number"
                                            name="numberOfDays"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.numberOfDays}
                                        />
                                        {formik.touched.numberOfDays && formik.errors.numberOfDays && (
                                            <div className="text-danger">{formik.errors.numberOfDays}</div>
                                        )}
                                    </td>
                                </tr>

                                {/* Address input */}
                                <tr>
                                    <td>Address:</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="address"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.address}
                                        />
                                        {formik.touched.address && formik.errors.address && (
                                            <div className="text-danger">{formik.errors.address}</div>
                                        )}
                                    </td>
                                </tr>

                                {/* Driver's License input */}
                                <tr>
                                    <td>Driver's License Image:</td>
                                    <td>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="images/*"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                                                formik.setFieldValue("driverlic_img", file);
                                            }}
                                        />
                                        {formik.touched.driverlic_img && formik.errors.driverlic_img && (
                                            <p className="text-danger">{formik.errors.driverlic_img}</p>
                                        )}

                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Submit Button */}
                        <button className="btn btn-primary" type="submit">
                            Reserve Car
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CarReserve;
