import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ClientRent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [carData, setCarData] = useState(null);
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/carcheckout/${id}`);
                const carData = response.data[0];
                setCarData(carData);
            } catch (error) {
                console.error("Error fetching car data:", error);
            }
        };

        fetchCarData();
    }, []);

    const handleCheckoutItem = async (id: string, car_id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to checkout?");
        if (!isConfirmed) {
            return;
        }

        try {
            await axios.post(`http://localhost:8081/checkout/${id}?userEmail=${userEmail}`, { car_id });
            // Update state or navigate to a different page upon successful completion
            // Example: setCarData(null) or navigate to a different page
            navigate('/rentcars'); // Replace with your desired success route
        } catch (error) {
            console.error("Error checking out:", error);
        }
    };

    const handlePayWithCard = async (car_id: string, totalPrice: string, id: string) => {
        try {
            const response = await axios.post("http://localhost:3000/create-checkout-session", {
                items: [{ id: car_id, quantity: 1 }],
                totprice: totalPrice,
            });

            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error initiating payment:", error);
        }
    };






    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="container mx-auto mt-6" style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-4">CheckOut Car</h2>
                {carData && (
                    <div className="card bg-dark text-white">
                        <div className="card-body text-center">
                            <h5 className="card-title">Car Information</h5>
                            <img
                                src={`http://localhost:8081/images/${carData["car_img"]}`}
                                alt={`Car ${carData["id"]} Image`}
                                className="img-fluid mb-3 mx-auto d-block"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                            <p><strong>Car Name:</strong> {carData['car_name']}</p>
                            <p><strong>Car ID:</strong> {carData['car_id']}</p>
                        </div>
                        <div className="card-body ">
                            <h5 className="card-title">User Information</h5>
                            <p><strong>User ID:</strong> {carData['id']}</p>
                            <p><strong>User Name:</strong> {carData['name']}</p>
                            <p><strong>Email:</strong> {carData['email']}</p>
                            <p><strong>Phone Number:</strong> {carData['phoneNum']}</p>
                            <p><strong>Address:</strong> {carData['address']}</p>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Rental Details</h5>
                            <p><strong>Pick up Date:</strong> {carData['Pdate']}</p>
                            <p><strong>Return Date:</strong> {carData['Rdate']}</p>
                            <p><strong>Pick up Time:</strong> {carData['Ptime']}</p>
                            <p><strong>Return Time:</strong> {carData['Rtime']}</p>
                            <p><strong>Pick up Location:</strong> {carData['Plocation']}</p>
                            <p><strong>Total Price:</strong> {carData['totprice']}</p>
                        </div>
                    </div>
                )}
                {carData ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleCheckoutItem(carData['id'], carData['car_id'])}
                        >
                            CHECKOUT
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                handleCheckoutItem(carData['id'], carData['car_id']);
                                handlePayWithCard(carData['car_id'], carData['totprice'], carData['id']);
                            }}
                        >
                            PAY WITH CARD
                        </button>



                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default ClientRent;
