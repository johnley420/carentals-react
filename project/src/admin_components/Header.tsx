import React from 'react';
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
const adminEmail = localStorage.getItem("adminEmail");

// Use React.FC with the defined interface for the functional component
const Header: React.FC<HeaderProps> = ({ OpenSidebar }) => {
    return (
        <header className='header'>
            Welcome, {adminEmail}!
        </header>
    );
};

export default Header;
