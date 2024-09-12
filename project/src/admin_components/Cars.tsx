import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Cars = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8081/cars")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(err));
    }, []);

    function handleDeleteItem(id: string) {
        if (window.confirm("Are you sure you want to delete this car?")) {
            axios.delete(`http://localhost:8081/cars/${id}`).then((response) => {
                console.log("response:" + response.data);
                window.location.reload();
            }).catch((err) => console.log(err));
        }
    }

    return (
        <div className="container mt-3 user-list-container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>Add Cars</h1>
                    <Link className="btn btn-success btn-sm mb-3" to="/addcars">
                        Add Cars &nbsp;
                    </Link>
                    <table className="table table-hover table-bordered table-dark" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((carData, key) => (
                                <tr key={key}>
                                    <td>{carData['id']}</td>
                                    <td>{carData['car_name']}</td>
                                    <td>{carData['car_brand']}</td>
                                    <td>{carData['car_type']}</td>
                                    <td>{carData['car_pax']}</td>
                                    <td>{carData['car_price']}</td>
                                    <td>
                                        {carData["car_img"] && (
                                            <img
                                                src={`http://localhost:8081/images/${carData["car_img"]}`}
                                                alt={`Car ${carData["id"]} Image`}
                                                className="img-fluid"
                                                style={{ maxWidth: "100px", maxHeight: "100px" }}
                                            />
                                        )}
                                    </td>
                                    <td>{carData["status"]}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteItem(carData["id"])}
                                        >
                                            &nbsp;Delete
                                        </button>
                                        &nbsp;
                                        <Link
                                            className="btn btn-warning btn-sm"
                                            to={`/editCar/${carData["id"]}`}
                                        >
                                            Edit
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

export default Cars;
