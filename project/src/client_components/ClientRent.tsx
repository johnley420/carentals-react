import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ClientRent: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [carData, setCarData] = useState(null);
    const userEmail = localStorage.getItem("userEmail");

    const formik = useFormik({
        initialValues: {
            phoneNumber: "",
            homeAddress: "",
            useDate: "",
            returnDate: "",
            pickUpTime: "",
            returnTime: "",
            pickUpLocation: "",
            driverlic_img: "",
        },
        validationSchema: Yup.object({
            phoneNumber: Yup.string().required("Phone number is required"),
            homeAddress: Yup.string().required("Home address is required"),
            useDate: Yup.date().required("Pick up date is required"),
            returnDate: Yup.date().required("Return date is required"),
            pickUpTime: Yup.string().required("Pick up time is required"),
            returnTime: Yup.string().required("Return time is required"),
            pickUpLocation: Yup.string().required("Pick up location is required"),
            driverlic_img: Yup.mixed().required("Driver's license image is required"),
        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("phoneNumber", values.phoneNumber);
                formData.append("homeAddress", values.homeAddress);
                formData.append("useDate", values.useDate);
                formData.append("returnDate", values.returnDate);
                formData.append("pickUpTime", values.pickUpTime);
                formData.append("returnTime", values.returnTime);
                formData.append("pickUpLocation", values.pickUpLocation);

                // Check if userEmail is defined before appending it to FormData
                if (userEmail) {
                    formData.append("userEmail", userEmail);
                }

                formData.append("driverlic_img", values.driverlic_img);

                const response = await axios.post(`http://localhost:8081/add_rent/${id}`, formData);
                console.log("Reservation Response:", response.data);
                alert("Car rented successfully");
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
                <h2 className="text-center mb-4">Rent Car</h2>
                {carData && (
                    <table className="table table-bordered mb-3 table-dark">
                        {/* Car information table */}
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
                            {/* Car information table */}
                            <tbody>
                                <tr>
                                    <td>Phone Number:</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.phoneNumber}
                                        />
                                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                            <div className="text-danger">{formik.errors.phoneNumber}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Home Address:</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="homeAddress"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.homeAddress}
                                        />
                                        {formik.touched.homeAddress && formik.errors.homeAddress && (
                                            <div className="text-danger">{formik.errors.homeAddress}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pick Up Date:</td>
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
                                <tr>
                                    <td>Return Date:</td>
                                    <td>
                                        <input
                                            type="date"
                                            name="returnDate"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.returnDate}
                                        />
                                        {formik.touched.returnDate && formik.errors.returnDate && (
                                            <div className="text-danger">{formik.errors.returnDate}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pick Up Time:</td>
                                    <td>
                                        <input
                                            type="time"
                                            name="pickUpTime"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.pickUpTime}
                                        />
                                        {formik.touched.pickUpTime && formik.errors.pickUpTime && (
                                            <div className="text-danger">{formik.errors.pickUpTime}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Return Time:</td>
                                    <td>
                                        <input
                                            type="time"
                                            name="returnTime"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.returnTime}
                                        />
                                        {formik.touched.returnTime && formik.errors.returnTime && (
                                            <div className="text-danger">{formik.errors.returnTime}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pick Up Location:</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="pickUpLocation"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.pickUpLocation}
                                        />
                                        {formik.touched.pickUpLocation && formik.errors.pickUpLocation && (
                                            <div className="text-danger">{formik.errors.pickUpLocation}</div>
                                        )}
                                    </td>
                                </tr>
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
                            Rent Car
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ClientRent;
