import React from 'react';
import { Link } from 'react-router-dom';
import {
    BsCart,  // Import the car icon
    BsFile,
    BsFillArchiveFill,
    BsListCheck,
    BsFillGrid3X3GapFill,
    BsGearWideConnected,
} from 'react-icons/bs';

import { FaCar, FaComment, FaExchangeAlt, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
    openSidebarToggle: boolean;
    OpenSidebar: () => void; // Assuming OpenSidebar is a function that takes no arguments and returns void
}


const Sidebar: React.FC<SidebarProps> = ({ openSidebarToggle, OpenSidebar }) => {
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
                    <Link to="/dashboard">
                        <BsFile className='icon' /> Dashboard
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/cars">
                        <FaCar className='icon' /> Cars
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/adminhistory">
                        <FaExchangeAlt className='icon' /> Rentals history
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/viewclient">
                        <FaComment className='icon' /> Customer chats
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/admin">
                        <FaSignOutAlt className='icon' /> LOGOUT
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
