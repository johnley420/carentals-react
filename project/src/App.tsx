import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './admin_components/Header';
import ClientHeader from './client_components/ClientHeader';
import Sidebar from './admin_components/Sidebar';
import History from './admin_components/History';
import Cars from './admin_components/Cars';
import EditCar from './admin_components/EditCar';
import Login from './LoginPage/Login';
import Register from './Register/Register';
import RentCar from './client_components/RentCar';
import CarReserve from './client_components/CarReserve';
import ClientSidebar from './client_components/ClientSidebar';
import Dashboard from './admin_components/Dasboard';
import AddCar from './admin_components/AddCars';
import './Apps.css'
import ClientViewReserved from './client_components/ClientViewReserved';
import ClientViewRented from './client_components/ClientViewRented';
import ClientRent from './client_components/ClientRent';
import CheckOut from './client_components/CheckOut';
import AdminLogin from './admin_components/AdminLogin';
import TransactionHistory from './client_components/TransactionHistory';
import Auth from './chat/Auth';
import ViewClient from './admin_components/ViewClient';
import AdminAuth from './chat/AdminAuth';
import Payment from './API/Payment';


function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem('logged') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';
  const isAdminLogin = location.pathname === '/admin';
  const isRentCarPage = location.pathname === '/rentcars';
  const isClientViewReserved = location.pathname === '/viewreserved';
  const isClientViewRented = location.pathname === '/viewrented';
  const isTransactionHistory = location.pathname === '/history';
  const isAuth = location.pathname === '/auth';
  const isCarReservePage = /^\/carreserve\/\d+$/.test(location.pathname);
  const isClientRent = /^\/clientrent\/\d+$/.test(location.pathname);
  const isCheckOut = /^\/checkout\/\d+$/.test(location.pathname);

  const showAdminHeader = !isRentCarPage && !isCarReservePage && !isClientViewReserved && !isClientRent && !isClientViewRented && !isCheckOut && !isTransactionHistory && !isAuth;
  const showClientHeader = isRentCarPage || isCarReservePage || isClientViewReserved || isClientRent || isClientViewRented || isCheckOut || isTransactionHistory || isAuth;

  return (
    <>
      {!isLoginPage && !isRegisterPage && !isAdminLogin && (
        <div className={`grid-container ${isRentCarPage ? 'client' : ''}`}>
          {showAdminHeader && (
            <Header OpenSidebar={OpenSidebar} />
          )}
          {showClientHeader && (
            <ClientHeader OpenSidebar={OpenSidebar} />
          )}
          {isRentCarPage || isCarReservePage || isClientViewReserved || isClientRent || isClientViewRented || isCheckOut || isTransactionHistory || isAuth ? (
            <ClientSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          ) : (
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          )}
          <div className='content-container'>
            <Routes>
              <Route path="/viewclient" element={<ViewClient />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/adminhistory" element={<History />} />
              <Route path="/addcars" element={<AddCar />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/editCar/:id" element={<EditCar />} />
              <Route path="/rentcars" element={<RentCar />} />
              <Route path="/carreserve/:id" element={<CarReserve />} />
              <Route path="/viewreserved/" element={<ClientViewReserved />} />
              <Route path="/viewrented/" element={<ClientViewRented />} />
              <Route path="/clientrent/:id" element={<ClientRent />} />
              <Route path="/checkout/:id" element={<CheckOut />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/adminauth/:id" element={<AdminAuth />} />
              <Route path="/history/" element={<TransactionHistory />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </>
  );
}

export default App;
