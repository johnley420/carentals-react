import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewClient = () => {
    const { id } = useParams();

    const [data, setData] = useState([]);
    const userEmail = localStorage.getItem("userEmail"); // Replace with user's actual email or get it from user input

    useEffect(() => {
        fetch(`http://localhost:8081/viewclient`)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(err));
    }, [userEmail]);

    return (
        <div className="container mt-3 user-list-container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>Customer Chat</h1>
                    <table className="table table-hover table-bordered table-dark " style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Civil Status</th>
                                <th>Birth Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((carData, key) => (
                                <tr key={key}>
                                    <td>{carData['id']}</td>
                                    <td>{carData['name']}</td>
                                    <td>{carData['email']}</td>
                                    <td>{carData['gender']}</td>
                                    <td>{carData['civilstatus']}</td>
                                    <td>{carData['bdate']}</td>
                                    <td>  <Link
                                        className="btn btn-danger btn-sm"
                                        to={`/adminauth/${carData["id"]}`}
                                    >
                                        Chat
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

export default ViewClient;
