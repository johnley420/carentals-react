import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ClientViewReserved = () => {

    const [data, setData] = useState([]);
    const userEmail = localStorage.getItem("userEmail"); // Replace with user's actual email or get it from user input

    useEffect(() => {
        fetch(`http://localhost:8081/carreserved?userEmail=${userEmail}`)
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
        axios.delete(`http://localhost:8081/carreserved/${id}`, { data: { car_id: car_id } })
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
                    <h1>Reserved Cars</h1>
                    <table className="table table-hover table-bordered table-dark " style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Car ID</th>
                                <th>Car Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Driver License</th>
                                <th>Date Use</th>
                                <th>Days</th>
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
                                    <td>{carData['address']}</td>
                                    <td>
                                        {carData['drivelic_img'] && (
                                            <img
                                                src={`http://localhost:8081/images/${carData['drivelic_img']}`}
                                                alt={`License ${carData['id']} Image`}
                                                className="img-fluid"
                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                            />
                                        )}
                                    </td>

                                    <td>{carData['date_use']}</td>
                                    <td>{carData['days']}</td>
                                    <td>{carData['totprice']}</td>
                                    <td>{carData['status']}</td>
                                    <td> <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteItem(carData["id"], carData['car_id'])}
                                    >
                                        &nbsp;Cancel
                                    </button>

                                        &nbsp;
                                        <Link className="btn btn-success btn-sm" to={`/clientrent/${carData['car_id']}`}>
                                            Proceed
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
