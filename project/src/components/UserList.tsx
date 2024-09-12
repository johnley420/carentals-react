import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencil,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

import NavbarPage from "./NavbarPage";

const UserList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/login")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  function handleDeleteItem(id: string) {
    axios.delete(`http://localhost:8081/login/${id}`).then((response) => {
      console.log("response: " + response.data);
      window.location.reload();
    });
  }

  return (
    <>
      {" "}
      <NavbarPage />
      <div className="container mt-3">
        <div className="row">
          <div className="col-sm-12">
            <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
              <div className="container"></div>
            </nav>
            <h1>React MYSQL Connection</h1>
            <Link to="/add" className="btn btn-primary mb-2">
              ADD USER &nbsp;
              <FontAwesomeIcon icon={faPlusCircle} />
            </Link>

            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((data, key) => (
                  <tr key={key}>
                    <td>{data["id"]}</td>
                    <td>{data["name"]}</td>
                    <td>{data["email"]}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const isConfirmed = window.confirm(
                            "Are you sure you want to delete this User?"
                          );
                          if (isConfirmed) {
                            handleDeleteItem(data["id"]);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        &nbsp; Delete
                      </button>
                      &nbsp;
                      <Link
                        className="btn btn-warning btn-sm"
                        to={`/edit/${data["id"]}`}
                      >
                        <FontAwesomeIcon icon={faPencil} />
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
    </>
  );
};

export default UserList;
