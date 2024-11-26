require("dotenv").config();
const express = require('express');
// Connect
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connection successful!');
})
.catch((e) => {
    console.log('Connection failed!', e);
});


const Customer = require('./Customer');
const app = express();
const port = 8000;

app.use(express.json());

app.post('/customer', (req, res) => {
    const newCustomer = new Customer({ ...req.body });
    newCustomer.save()
        .then(() => {
            res.send('New Customer created successfully!');
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error!');
        });
});

app.get('/customers', (req, res) => {
    Customer.find()
        .then((customers) => {
            if (customers.length > 0) {
                res.json(customers);
            } else {
                res.status(404).send('Customers not found');
            }p
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error!');
        });
});

app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id)
        .then((customer) => {
            if (customer) {
                res.json(customer);
            } else {
                res.status(404).send('Customer not found');
            }
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error!');
        });
});

app.delete('/customer/:id', (req, res) => {
    Customer.findByIdAndRemove(req.params.id)
        .then((customer) => {
            if (customer) {
                res.send('Customer deleted successfully!');
            } else {
                res.status(404).send('Customer not found');
            }
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error!');
        });
});

app.listen(port, () => {
    console.log(`Up and running on port ${port} - This is Customer service`);
});
