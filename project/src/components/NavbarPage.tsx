import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

const NavbarPage = () => {
  const userEmail = localStorage.getItem("userEmail"); // Retrieve email from localStorage

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Dashboard</Navbar.Brand>
          <Nav className="me-auto text-center">
            {userEmail && (
              <Nav.Item>
                <Nav.Link style={{ color: "white" }}>
                  Welcome, {userEmail}!
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
          {userEmail && (
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Container>
      </Navbar>
      <br />
    </>
  );
};

export default NavbarPage;
