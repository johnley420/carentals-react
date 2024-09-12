import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill }
    from 'react-icons/bs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer }
    from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
    const [numberOfCars, setNumberOfCars] = useState(0);
    const [numberOfReserve, setNumberOfReserve] = useState(0);
    const [numberOfRented, setNumberOfRented] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [monthlyIncomeData, setMonthlyIncomeData] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    useEffect(() => {
        const fetchData = async () => {
            try {
                const carsResponse = await fetch('http://localhost:8081/countcars');
                const carsData = await carsResponse.json();
                if (carsData.length > 0) {
                    setNumberOfCars(carsData[0].total_rows);
                } else {
                    console.error('Unexpected data structure for countcars:', carsData);
                }

                const reserveResponse = await fetch('http://localhost:8081/countreservations');
                const reserveData = await reserveResponse.json();
                if (reserveData.length > 0) {
                    setNumberOfReserve(reserveData[0].total_reservations);
                } else {
                    console.error('Unexpected data structure for countreservations:', reserveData);
                }

                const rentedResponse = await fetch('http://localhost:8081/countrented');
                const rentedData = await rentedResponse.json();
                if (rentedData.length > 0) {
                    setNumberOfRented(rentedData[0].total_rented);
                } else {
                    console.error('Unexpected data structure for countrented:', rentedData);
                }

                const incomeResponse = await fetch('http://localhost:8081/totalincome');
                const incomeData = await incomeResponse.json();
                if (incomeData.length > 0) {
                    setTotalIncome(incomeData[0].total_income);
                } else {
                    console.error('Unexpected data structure for totalincome:', incomeData);
                }

                const monthlyIncomeResponse = await fetch('http://localhost:8081/fetchMonthlyIncome');
                const monthlyIncomeData = await monthlyIncomeResponse.json();
                setMonthlyIncomeData(monthlyIncomeData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Open modal when component mounts
        setShowModal(true);
    }, []);

    // Function to close modal
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>CARS</h3>
                        <BsFillArchiveFill className='card_icon' />
                    </div>
                    <h1>{numberOfCars}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>RESERVED CARS</h3>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <h1>{numberOfReserve}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>RENTED CARS</h3>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <h1>{numberOfRented}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>TOTAL INCOME</h3>
                        <BsFillBellFill className='card_icon' />
                    </div>
                    <h1>{totalIncome}</h1>
                </div>
            </div>

            <div className='charts'>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={monthlyIncomeData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis dataKey="income" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    id="policyModal"
                    aria-labelledby="policyModalLabel"
                    aria-hidden="true"
                    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="policyModalLabel" style={{ color: 'black' }}>
                                    HIJ Car Rentals Admin Policies
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body" style={{ color: 'black' }}>
                                <p>Welcome to HIJ Car Rentals Admin Dashboard. Please review the following policies regarding administrative functions:</p>

                                <ol>
                                    <li>
                                        <strong>Adding and Editing Cars:</strong> Administrators can add new cars to the rental fleet, including uploading actual images, specifying brand, capacity, and other details. Cars can also be edited as needed to maintain accurate inventory.
                                    </li>
                                    <li>
                                        <strong>Rental History Management:</strong> The system provides access to comprehensive rental history records for all cars. This includes details on reservations, rentals, and returns, ensuring transparency and efficient management.
                                    </li>
                                    <li>
                                        <strong>Customer Interaction:</strong> Administrators have access to a customer chat support feature to address inquiries, concerns, and provide assistance promptly during operational hours.
                                    </li>
                                    <li>
                                        <strong>Data Privacy and Security:</strong> HIJ Car Rentals prioritizes the privacy and security of all data within the system. Administrators are responsible for maintaining data integrity and adhering to privacy policies to safeguard customer information.
                                    </li>
                                    <li>
                                        <strong>Compliance and Accountability:</strong> Administrators are expected to comply with all internal policies and legal requirements related to car rental operations. This ensures a consistent and reliable service for our customers.
                                    </li>
                                    <li>
                                        <strong>System Maintenance and Updates:</strong> Regular updates and maintenance of the system are conducted to enhance functionality and improve user experience. Administrators are informed of any updates that may impact operations.
                                    </li>
                                    <li>
                                        <strong>Training and Support:</strong> HIJ Car Rentals provides ongoing training and support to administrators to ensure proficiency in using the system and implementing operational policies effectively.
                                    </li>
                                    <li>
                                        <strong>Feedback and Improvement:</strong> Administrators are encouraged to provide feedback and suggestions for system improvement to enhance service delivery and customer satisfaction.
                                    </li>
                                </ol>

                                <p>Please adhere to these policies while performing administrative tasks on the HIJ Car Rentals platform.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Dashboard;
