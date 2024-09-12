import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RentCar = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    useEffect(() => {
        fetch('http://localhost:8081/rentcars')
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(err));

        // Open modal when component mounts
        setShowModal(true);
    }, []); // Empty dependency array ensures this effect runs only once, on mount

    // Function to close modal
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mt-3 user-list-container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>Cars</h1>
                    <div className="car-grid">
                        {data.map((carData, key) => (
                            <div key={key} className="car-card">
                                <div className="car-image">
                                    {carData['car_img'] && (
                                        <img
                                            src={`http://localhost:8081/images/${carData['car_img']}`}
                                            alt={`Car ${carData['id']} Image`}
                                            className="img-fluid"
                                        />
                                    )}
                                </div>
                                <div className="car-details">
                                    <p>ID: {carData['id']}</p>
                                    <p>Name: {carData['car_name']}</p>
                                    <p>Brand: {carData['car_brand']}</p>
                                    <p>Type: {carData['car_type']}</p>
                                    <p>Capacity: {carData['car_pax']}</p>
                                    <p>Price: {carData['car_price']}</p>
                                    <p>Status: {carData['status']}</p>
                                    <div className="car-actions">
                                        <Link
                                            className="btn btn-warning btn-sm"
                                            to={`/carreserve/${carData['id']}`}
                                        >
                                            Reserve
                                        </Link>
                                        <Link
                                            className="btn btn-warning btn-sm"
                                            to={`/clientrent/${carData['id']}`}
                                        >
                                            Rent
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    id="policyModal"
                    aria-labelledby="policyModalLabel"
                    aria-hidden="true"
                    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="policyModalLabel">
                                    HIJ Car Rentals Policies
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Welcome to HIJ Car Rentals, where we aim to provide a seamless car rental experience. Please review the following policies before proceeding with your reservation or rental:</p>

                                <ol>
                                    <li>
                                        <strong>Reservation and Rental Process:</strong> Users can easily browse available cars, reserve directly from the website, or rent a car on-site.
                                    </li>
                                    <li>
                                        <strong>Driver Requirements:</strong> Renters must present a valid driver's license and be of legal driving age according to local regulations.
                                    </li>
                                    <li>
                                        <strong>Information Collection:</strong> Users are required to provide accurate personal information, including contact details and identification, to complete reservations and rentals.
                                    </li>
                                    <li>
                                        <strong>Transaction History:</strong> Customers have access to their transaction history for transparency and record-keeping purposes.
                                    </li>
                                    <li>
                                        <strong>Customer Support:</strong> Chat support is available to address concerns and questions promptly during operating hours.
                                    </li>
                                    <li>
                                        <strong>Payment Methods:</strong> We offer secure online credit card payments through our website. Alternatively, traditional payment methods are accepted at our rental locations.
                                    </li>
                                    <li>
                                        <strong>Data Integrity:</strong> HIJ Car Rentals maintains the integrity of user data within the system to ensure privacy and security.
                                    </li>
                                    <li>
                                        <strong>User Experience Focus:</strong> Our platform is designed to optimize the rental process, providing a user-friendly interface for both customers and administrators.
                                    </li>
                                    <li>
                                        <strong>Policy Compliance:</strong> Users are expected to adhere to all terms and conditions outlined to ensure a hassle-free rental experience.
                                    </li>
                                </ol>

                                <p>Please feel free to contact our customer support team for any further clarification or assistance regarding our policies. We strive to provide a reliable and convenient car rental service tailored to your needs.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RentCar;
