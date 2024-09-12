// ClientSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BsCart, BsBoxArrowInRight, BsFile, BsFillArchiveFill, BsListCheck, BsFillGrid3X3GapFill, BsClipboardCheck } from 'react-icons/bs';
import { FaCar, FaComment, FaExchangeAlt, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import RentCar from './RentCar'; // Import the RentCar component

interface ClientSidebarProps {
    openSidebarToggle: boolean;
    OpenSidebar: () => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ openSidebarToggle, OpenSidebar }) => {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <FaCar className='icon_header' /> H.I.J
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>
                    X
                </span>
            </div>
            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <Link to="/rentcars">
                        <FaCar className='icon' /> Rent Car
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/viewreserved">
                        <BsClipboardCheck className='icon' /> Reserved Cars
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/viewrented">
                        <FaShoppingCart className='icon' /> Rented Cars
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/history">
                        <FaExchangeAlt className='icon' /> Transaction History
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/auth">
                        <FaComment className='icon' />  Chat Support
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/">
                        <FaSignOutAlt className='icon' /> Logout
                    </Link>
                </li>
                {/* Add other client-specific links here */}
            </ul>
            {/* Display RentCar component */}
        </aside>
    );
};

export default ClientSidebar;
