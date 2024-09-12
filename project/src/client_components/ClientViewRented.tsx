import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ClientViewReserved = () => {

    const [data, setData] = useState([]);
    const userEmail = localStorage.getItem("userEmail"); // Replace with user's actual email or get it from user input

    useEffect(() => {
        fetch(`http://localhost:8081/carrented?userEmail=${userEmail}`)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(err));
    }, [userEmail]);

    return (
        <div className="container mt-3 user-list-container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>Rented Cars</h1>
                    <table className="table table-hover table-bordered table-dark " style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Car ID</th>
                                <th>Car Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>PhoneNum</th>
                                <th>Address</th>
                                <th>Pick up Date</th>
                                <th>Return Date</th>
                                <th>Pick up time</th>
                                <th>Return time</th>
                                <th>Pick up Location</th>
                                <th>Driver License</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((carData, key) => (
                                <tr key={key}>
                                    <td>{carData['id']}</td>
                                    <td>{carData['car_id']}</td>
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
                                    <td>{carData['name']}</td>
                                    <td>{carData['email']}</td>
                                    <td>{carData['phoneNum']}</td>
                                    <td>{carData['address']}</td>
                                    <td>{carData['Pdate']}</td>
                                    <td>{carData['Rdate']}</td>
                                    <td>{carData['Ptime']}</td>
                                    <td>{carData['Rtime']}</td>
                                    <td>{carData['Plocation']}</td>
                                    <td>
                                        {carData['drivlic'] && (
                                            <img
                                                src={`http://localhost:8081/images/${carData['drivlic']}`}
                                                alt={`License ${carData['id']} Image`}
                                                className="img-fluid"
                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                            />
                                        )}
                                    </td>
                                    <td>{carData['totprice']}</td>
                                    <td>{carData['status']}</td>
                                    <td>  <Link
                                        className="btn btn-danger btn-sm"
                                        to={`/checkout/${carData["id"]}`}
                                    >
                                        CheckOut
                                    </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientViewReserved;
