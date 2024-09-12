import { useState, useEffect } from "react";
import {
    BsFillBellFill,
    BsFillEnvelopeFill,
    BsPersonCircle,
    BsSearch,
    BsJustify,
} from 'react-icons/bs';

// Define the interface for the prop types
interface HeaderProps {
    OpenSidebar: () => void; // Assuming OpenSidebar is a function that takes no arguments and returns void
}

const userEmail = localStorage.getItem("userEmail"); // Retrieve email from localStorage


// Use React.FC with the defined interface for the functional component
const ClientHeader: React.FC<HeaderProps> = ({ OpenSidebar }) => {
    return (
        <header className='header'>
            Welcome, {userEmail}!
        </header>
    );
};

export default ClientHeader;
