const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const axios = require('axios');
const { error } = require('console');
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 8081;

const stripe = require("stripe")("sk_test_51OMWg6K93R2IrZWGa0I5u7XPAfBcjQCst8wDeqVaTyi341YPb5S7bcX2kSDBJL9oHDsIt1QADV2PuN6rYUuwrxrE00OHx2INA1");





app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(express.json());

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'images'),
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'react_final',
});


app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/cars', (req, res) => {
    const sql = 'SELECT * FROM cars';
    db.query(sql, (error, data) => {
        if (error) return res.status(500).json({ error: 'Internal Server Error' });
        return res.json(data);
    });
});

app.post('/add_cars', upload.single('car_img'), (req, res) => {
    const { car_name, car_brand, car_type, car_pax, car_price } = req.body;
    const car_img = req.file ? req.file.filename : null;

    const sql =
        'INSERT INTO cars (car_name, car_brand, car_type, car_pax, car_price, car_img, status) VALUES (?, ?, ?, ?, ?, ?, "Available")';

    console.log('SQL Query:', sql);
    console.log('Values:', [car_name, car_brand, car_type, car_pax, car_price, car_img]);

    db.query(sql, [car_name, car_brand, car_type, car_pax, car_price, car_img], (error, result) => {
        if (error) {
            console.error('Error adding car:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Car added successfully' });
    });
});

app.delete('/cars/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'DELETE FROM cars WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.error('Error deleting car:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        response.send('Car Deleted');
    });
});

app.get('/cars/:id', (request, response) => {
    const id = request.params.id;
    console.log('id' + id);
    const sql = 'SELECT * FROM cars WHERE id = ?';
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data); // Corrected typo: changed `jsono` to `json`
    });
});

app.put('/cars/:id', upload.single('car_img'), async (request, response) => {
    const id = request.params.id;
    const { car_name, car_brand, car_type, car_pax, car_price } = request.body;
    let car_img = null;

    if (request.file) {
        // New image provided, use the uploaded image
        car_img = request.file.filename;
    } else {
        // No new image provided, fetch the existing image from the server
        try {
            const existingImageData = await new Promise((resolve, reject) => {
                const sql = 'SELECT car_img FROM cars WHERE id = ?';
                db.query(sql, [id], (error, result) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(result[0].car_img);
                    }
                });
            });

            car_img = existingImageData;
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    const sql = 'UPDATE cars SET car_name = ?, car_brand = ?, car_type = ?, car_pax = ?, car_price = ?, car_img = ? WHERE id = ?';
    db.query(sql, [car_name, car_brand, car_type, car_pax, car_price, car_img, id], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        response.send('Car Updated');
    });
});

app.get('/login', (request, response) => {
    const sql = "SELECT * FROM login";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data)
    });
});

app.get('/admin', (request, response) => {
    const sql = "SELECT * FROM admin";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data)
    });
});

app.post('/admin', (request, response) => {
    const { email, password } = request.body;
    const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (error, data) => {
        if (error) return response.json(error);

        if (data.length > 0) {
            return response.json({ success: true, message: 'Successfully Login' });
        } else {
            return response.json({ success: false, message: 'Invalid Login Credentials, Please try Again.' });
        }
    });
});


app.post('/add_user', (request, response) => {
    const { name, email } = request.body;
    const sql = 'INSERT INTO login (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (error, result) => {
        if (error) throw error;
        response.send('User Successfully Added');
    });
});

app.delete('/login/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'DELETE FROM login WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) throw error;
        response.send('User Successfully Delete');

    });
});

app.get('/users/:id', (request, response) => {
    const id = request.params.id;
    console.log("id:" + id);
    const sql = 'SELECT * FROM login WHERE id=?';
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data)
    });
});

app.put('/user/:id', (request, response) => {
    const id = request.params.id;
    const { name, email } = request.body;
    const sql = 'UPDATE login SET name = ?, email = ? WHERE id = ?';
    db.query(sql, [name, email, id], (error, result) => {
        if (error) throw error;
        response.send('User Succesfully Updated');
    });
});

app.post('/login', (request, response) => {
    const { email, password } = request.body;
    const sql = 'SELECT * FROM login WHERE email = ? AND password = MD5(?)';

    db.query(sql, [email, password], (error, results) => {
        if (error) {
            console.error("Error retrieving user:", error);
            return response.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return response.json({ success: false, message: 'Invalid Login Credentials, Please try Again.' });
        } else {
            return response.json({ success: true, message: 'Successfully Login' });
        }
    });
});

// ... (other imports)

app.post('/register', async (req, res) => {
    const { name, email, password, gender, civilstatus, bdate, recaptchaToken } = req.body;

    try {
        const recaptchaSecretKey = '6LciEQwqAAAAAA36yPpqM_Xu6lw3DmTGH2i1PyvH'; // Replace with your actual secret key

        // Validate the reCAPTCHA token
        const recaptchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`
        );

        if (!recaptchaResponse.data.success) {
            console.error('reCAPTCHA validation failed:', recaptchaResponse.data);
            return res.status(400).send('Invalid reCAPTCHA');
        }

        // Use MySQL's MD5() function to hash the password
        const sql = 'INSERT INTO login (name, email, password, gender, civilstatus, bdate) VALUES (?, ?, MD5(?), ?, ?, ?)';
        db.query(sql, [name, email, password, gender, civilstatus, bdate], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).send('Error registering user');
            }
            res.send('Registration successful');
        });
    } catch (error) {
        console.error('Error during registration process:', error);
        res.status(500).send('Error registering user');
    }
});



app.get('/rentcars', (req, res) => {
    const sql = 'SELECT * FROM cars WHERE status = "Available"';
    db.query(sql, (error, data) => {
        if (error) return res.status(500).json({ error: 'Internal Server Error' });
        return res.json(data);
    });
});

app.post('/add_reserve/:id', upload.single('driverlic_img'), async (req, res) => {
    const carId = req.params.id;
    const { useDate, numberOfDays, address, userEmail } = req.body;
    const driverLicImg = req.file ? req.file.filename : null;

    try {
        // Start a MySQL transaction
        db.beginTransaction((transactionError) => {
            if (transactionError) {
                console.error("Error starting transaction:", transactionError);
                res.status(500).send('Error starting transaction. Please try again.');
                return;
            }

            // Your MySQL query to insert the reservation
            const reservationQuery = `
                INSERT INTO reserve (car_id, name, email, address, date_use, days, drivelic_img, totprice, status)
                VALUES (
                    (SELECT id FROM cars WHERE id = ?),
                    (SELECT name FROM login WHERE email = ?),
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ((SELECT car_price FROM cars WHERE id = ?) * ?),
                    'reserve'
                );
            `;

            // Your MySQL query to update the car status to 'Reserved'
            const updateCarQuery = 'UPDATE cars SET status = "Reserved" WHERE id = ?';

            // Execute the reservation query
            db.query(reservationQuery, [carId, userEmail, userEmail, address, useDate, numberOfDays, driverLicImg, carId, numberOfDays], (reservationError, reservationResult) => {
                if (reservationError) {
                    console.error("Error inserting reservation:", reservationError);
                    // Rollback the transaction if the reservation query fails
                    db.rollback(() => {
                        res.status(500).send('Error adding reservation. Please try again.');
                    });
                    return;
                }

                // Execute the car status update query
                db.query(updateCarQuery, [carId], (updateError, updateResult) => {
                    if (updateError) {
                        console.error("Error updating car status:", updateError);
                        // Rollback the transaction if the car status update query fails
                        db.rollback(() => {
                            res.status(500).send('Error updating car status. Please try again.');
                        });
                        return;
                    }

                    // Commit the transaction if both queries are successful
                    db.commit((commitError) => {
                        if (commitError) {
                            console.error("Error committing transaction:", commitError);
                            res.status(500).send('Error committing transaction. Please try again.');
                        } else {
                            res.status(200).send('Successfully Added.');
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/carreserved', (req, res) => {
    const { userEmail } = req.query;

    console.log('User Email:', userEmail);

    // Assuming car_id is a column in the reserve table
    const sql = `
        SELECT 
            r.id,
            r.car_id, 
            c.car_img, 
            r.name, 
            r.email, 
            r.address,
            r.drivelic_img,
            r.date_use, 
            r.days, 
            r.totprice, 
            r.status 
        FROM 
            reserve r
        INNER JOIN 
            cars c ON r.car_id = c.id
        WHERE 
            r.email = ?;
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

app.delete('/carreserved/:id', (request, response) => {
    const id = request.params.id;
    const car_id = request.body.car_id; // Get car_id from request body

    console.log('Deleting reserve with ID:', id);

    // First query to delete reservation
    const deleteSql = 'DELETE FROM reserve WHERE id = ?';
    db.query(deleteSql, [id], (error, deleteResult) => {
        if (error) {
            console.error('Error deleting reserve:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }

        // Second query to update car status
        const updateSql = 'UPDATE cars SET status = "Available" WHERE id = ?';
        db.query(updateSql, [car_id], (updateError, updateResult) => {
            if (updateError) {
                console.error('Error updating car status:', updateError);
                return response.status(500).json({ error: 'Internal Server Error' });
            }

            response.send('Reserve canceled and car status updated');
        });
    });
});






app.post('/add_rent/:id', upload.single('driverlic_img'), async (req, res) => {
    const carId = req.params.id;
    const { phoneNumber, homeAddress, useDate, returnDate, pickUpTime, returnTime, pickUpLocation, userEmail } = req.body;
    const driverLicImg = req.file ? req.file.filename : null;

    try {
        // Start a MySQL transaction
        db.beginTransaction((transactionError) => {
            if (transactionError) {
                console.error("Error starting transaction:", transactionError);
                res.status(500).send('Error starting transaction. Please try again.');
                return;
            }

            // Define your MySQL queries
            const reservationQuery = `
                INSERT INTO rent (car_id, name, email, phoneNum, address, Pdate, Rdate, Ptime, Rtime, Plocation, drivlic, totprice, status)
                VALUES (
                    (SELECT ID FROM cars WHERE id = ?),
                    (SELECT name FROM login WHERE email = ?),
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    (SELECT car_price FROM cars WHERE id = ?) * DATEDIFF(?, ?),
                    'Rented'
                );
            `;
            const updateCarQuery = 'UPDATE cars SET status = "Rented" WHERE id = ?';
            const deleteReservationQuery = 'DELETE FROM reserve WHERE car_id = ?';

            // Execute the reservation query
            db.query(reservationQuery, [carId, userEmail, userEmail, phoneNumber, homeAddress, useDate, returnDate, pickUpTime, returnTime, pickUpLocation, driverLicImg, carId, returnDate, useDate], (reservationError, reservationResult) => {
                if (reservationError) {
                    handleTransactionError(res, db, 'Error inserting reservation.', reservationError);
                    return;
                }

                // Execute the reservation deletion query
                db.query(deleteReservationQuery, [carId], (deleteError, deleteResult) => {
                    if (deleteError) {
                        handleTransactionError(res, db, 'Error deleting reservation.', deleteError);
                        return;
                    }

                    // Execute the car status update query
                    db.query(updateCarQuery, [carId], (updateError, updateResult) => {
                        if (updateError) {
                            handleTransactionError(res, db, 'Error updating car status.', updateError);
                            return;
                        }

                        // Commit the transaction if all queries are successful
                        db.commit((commitError) => {
                            if (commitError) {
                                console.error("Error committing transaction:", commitError);
                                res.status(500).send('Error committing transaction. Please try again.');
                            } else {
                                res.status(200).send('Successfully Added.');
                            }
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

function handleTransactionError(res, db, errorMessage, error) {
    console.error(errorMessage, error);
    // Rollback the transaction
    db.rollback(() => {
        res.status(500).send(errorMessage + ' Please try again.');
    });
}




app.get('/carrented', (req, res) => {
    const { userEmail } = req.query;

    console.log('User Email:', userEmail);

    // Assuming car_id is a column in the reserve table
    const sql = `
       SELECT
            r.id,
            r.car_id,
            c.car_img,
            r.name,
            r.email,
            r.phoneNum,
            r.address,
            r.Pdate,
            r.Rdate,
            r.Ptime,
            r.Rtime,
            r.Plocation,
            r.drivlic,
            r.totprice,
            r.status
        FROM
            rent r
        INNER JOIN
            cars c ON r.car_id = c.id
        WHERE
            r.email = ?;
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

app.get('/carcheckout/:id', (req, res) => {
    const id = req.params.id;

    // Assuming car_id is a column in the rent table
    const sql = `
        SELECT
            r.id,
            r.car_id,
            c.car_name,
            c.car_img,
            r.name,
            r.email,
            r.phoneNum,
            r.address,
            r.Pdate,
            r.Rdate,
            r.Ptime,
            r.Rtime,
            r.Plocation,
            r.drivlic,
            r.totprice
        FROM
            rent r
        INNER JOIN
            cars c ON r.car_id = c.id
        WHERE
            r.id = ?;
    `;

    db.query(sql, [id], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

app.post('/checkout/:id', async (req, res) => {
    const id = req.params.id;
    const { userEmail } = req.query;
    const car_id = req.body.car_id;

    try {
        // Start a MySQL transaction
        await beginTransaction();

        // MySQL query to insert the reservation
        const checkoutQuery = `
            INSERT INTO checkout (
                car_id,
                user_id,
                email,
                duration,
                date_started,
                date_checkout,
                totprice
            ) VALUES (
                (SELECT ID FROM cars WHERE id = ? LIMIT 1),
                (SELECT ID FROM login WHERE email = ? LIMIT 1),
                ?,
                DATEDIFF(
                    (SELECT Rdate FROM rent WHERE email = ? LIMIT 1),
                    (SELECT Pdate FROM rent WHERE email = ? LIMIT 1)
                ),
                (SELECT Pdate FROM rent WHERE email = ? LIMIT 1),
                CURRENT_TIMESTAMP,
                (SELECT totprice FROM rent WHERE email = ? LIMIT 1)
            );
        `;

        // MySQL query to update the car status to 'Available'
        const updateCarQuery = 'UPDATE cars SET status = "Available" WHERE id = ?';

        // MySQL query to delete the reservation
        const deleteReservationQuery = 'DELETE FROM rent WHERE car_id = ?';

        // Execute the reservation query
        await executeQuery(checkoutQuery, [car_id, userEmail, userEmail, userEmail, userEmail, userEmail, userEmail]);

        // Execute the car status update query
        await executeQuery(updateCarQuery, [car_id]);

        // Execute the reservation deletion query
        await executeQuery(deleteReservationQuery, [car_id]);

        // Commit the transaction if all queries are successful
        await commitTransaction();

        res.status(200).send('Successfully Added and Deleted.');
    } catch (error) {
        console.error('Error:', error);

        // Rollback the transaction if an error occurs
        await rollbackTransaction();

        res.status(500).send('Internal Server Error');
    }
});

// Helper functions for asynchronous database operations
async function beginTransaction() {
    return new Promise((resolve, reject) => {
        db.beginTransaction((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function executeQuery(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

async function commitTransaction() {
    return new Promise((resolve, reject) => {
        db.commit((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function rollbackTransaction() {
    return new Promise((resolve, reject) => {
        db.rollback(() => {
            resolve();
        });
    });
}

app.get('/history', (req, res) => {
    const { userEmail } = req.query;

    console.log('User Email:', userEmail);

    // Assuming car_id is a column in the reserve table
    const sql = `
        SELECT ch.car_id,
           cr.car_name,
           cr.car_img,
           ch.user_id,
           l.name AS user_name,
           ch.duration,
           ch.date_started,
           ch.date_checkout,
           ch.totprice
    FROM checkout ch
    JOIN cars cr ON ch.car_id = cr.id
    JOIN login l ON ch.user_id = l.id
    WHERE ch.email = ?;
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

app.get('/adminhistory', (req, res) => {
    // Assuming car_id is a column in the reserve table
    const sql = `
        SELECT ch.car_id,
           cr.car_name,
           cr.car_img,
           ch.user_id,
           l.name AS user_name,
           ch.duration,
           ch.date_started,
           ch.date_checkout,
           ch.totprice
    FROM checkout ch
    JOIN cars cr ON ch.car_id = cr.id
    JOIN login l ON ch.user_id = l.id
    ;
    `;

    db.query(sql, (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

app.get('/countcars', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total_rows FROM cars;
    `;

    db.query(sql, (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Query Result:', data); // Add this line
        return res.json(data);
    });
});

app.get('/countreservations', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total_reservations FROM reserve WHERE status = 'reserve';
    `;

    db.query(sql, (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

app.get('/countrented', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total_rented FROM rent WHERE status = 'Rented';
    `;

    db.query(sql, (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

app.get('/totalincome', (req, res) => {
    const sql = `
        SELECT SUM(totprice) AS total_income FROM checkout;
    `;

    db.query(sql, (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

app.get('/fetchMonthlyIncome', (req, res) => {
    const sql = 'SELECT DATE_FORMAT(date_checkout, "%Y-%m") AS month, SUM(totprice) AS income FROM checkout GROUP BY month;';

    db.query(sql, (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle joining a room
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);

        // Retrieve previous messages for the room and send them to the client
        const query = "SELECT * FROM messages WHERE room = ? ORDER BY id";
        db.query(query, [data], (err, results) => {
            if (err) {
                console.error("Error retrieving messages from database:", err);
            } else {
                const messages = results.map((row) => ({
                    room: row.room,
                    author: row.author,
                    message: row.message,
                    time: row.time,
                }));
                socket.emit("receive_messages", messages);
            }
        });
    });

    // Handle sending a message
    socket.on("send_message", (data) => {
        const { room, author, message, time } = data;

        // Save the message to MySQL database
        const query = "INSERT INTO messages (room, author, message, time) VALUES (?, ?, ?, ?)";
        db.query(query, [room, author, message, time], (err) => {
            if (err) {
                console.error("Error saving message to database:", err);
            } else {
                console.log("Message saved to database");

                // Broadcast the message to other clients
                socket.to(room).emit("receive_message", data);
            }
        });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

app.get('/authuser', (req, res) => {
    const { userEmail } = req.query;
    const sql = `
        SELECT id FROM login WHERE email = ?
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Query Result:', data); // Add this line
        return res.json(data);
    });
});

app.get('/authusername', (req, res) => {
    const { userEmail } = req.query;
    const sql = `
        SELECT name FROM login WHERE email = ?
    `;

    db.query(sql, [userEmail], (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Query Result:', data); // Add this line
        return res.json(data);
    });
});


app.get('/viewclient', (req, res) => {
    // Assuming car_id is a column in the reserve table
    const sql = `
        SELECT * FROM login
    ;
    `;

    db.query(sql, (error, data) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});



const successUrl = "http://localhost:5173/rentcars";
const cancelUrl = "http://localhost:3000/cancel.html";

app.post("/create-checkout-session", async (req, res) => {
    try {
        const { totprice, items } = req.body;
        const car_id = req.body.car_id;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: items.map(item => {
                return {
                    price_data: {
                        currency: "php",
                        product_data: {
                            name: "Rented Car", // Replace with your product name
                        },
                        unit_amount: totprice * 100, // Convert totprice to cents if needed
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



app.listen(3000);


app.get('/', (req, res) => {
    return res.send('Starting the node server');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});
