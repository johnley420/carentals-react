import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const TransactionHistory = () => {

    const [data, setData] = useState([]);
    const userEmail = localStorage.getItem("userEmail"); // Replace with user's actual email or get it from user input

    useEffect(() => {
        fetch(`http://localhost:8081/history?userEmail=${userEmail}`)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(err));
    }, [userEmail]);

    function handleDeleteItem(id: string, car_id: string) {
        const isConfirmed = window.confirm("Are you sure you want to cancel?");
        if (!isConfirmed) {
            return;
        }

        console.log("Deleting item with ID:", id);
        axios.delete(`http://localhost:8081/history/${id}`, { data: { car_id: car_id } })
            .then((response) => {
                console.log("response:" + response.data);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error deleting reservation:", error);
            });
    }




    return (
        <div className="container mt-3 user-list-container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>Transaction History</h1>
                    <table className="table table-hover table-bordered table-dark " style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Car ID</th>
                                <th>Car Name</th>
                                <th>Car Image</th>
                                <th>Car Image</th>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>Duration</th>
                                <th>Date Checkout</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((carData, key) => (
                                <tr key={key}>
                                    <td>{carData['car_id']}</td>
                                    <td>{carData['car_name']}</td>
                                    <td>
                                        {carData['car_img'] && (
                                            <img
                                                src={`http://localhost:8081/images/${carData['car_img']}`}
                                                alt={`Car ${carData['id']} Image`}
                                                className="img-fluid"
                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                            />
                                        )}
                                    </td>
                                    <td>{carData['user_id']}</td>
                                    <td>{carData['user_name']}</td>
                                    <td>{carData['duration']}</td>
                                    <td>{carData['date_started']}</td>
                                    <td>{carData['date_checkout']}</td>
                                    <td>{carData['totprice']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
