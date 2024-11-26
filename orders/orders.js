require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose'); 

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connection successful!');
})
.catch((e) => {
    console.log('Connection failed!', e);
});

const Order = require('./Order');
const app = express();
const port = 9000;

app.use(express.json());

app.post('/order', (req, res) => {
    const newOrder = new Order({
        customerID: new mongoose.Types.ObjectId(req.body.customerID),
        bookID: new mongoose.Types.ObjectId(req.body.bookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    });

    newOrder.save()
        .then(() => {
            res.send('New order added successfully!');
        })
        .catch((err) => {
            console.error("Error saving order:", err);
            res.status(500).send('Internal Server Error!');
        });
});


app.get('/orders', (req, res) => {
    Order.find()
        .then((orders) => {
            if (orders) {
                res.json(orders);
            } else {
                res.status(404).send('Orders not found');
            }
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error!');
        });
});

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id)
        .then((order) => {
            if (order) {
                axios.get(`http://localhost:7000/customer/${order.customerID}`)
                    .then((response) => {
                        let orderObject = {
                            CustomerName: response.data.name,
                            BookTitle: ''
                        };
                        axios.get(`http://localhost:8000/book/${order.bookID}`)
                            .then((response) => {
                                orderObject.BookTitle = response.data.title;
                                res.json(orderObject);
                            })
                            .catch((err) => res.status(500).send('Error fetching book data'));
                    })
                    .catch((err) => res.status(500).send('Error fetching customer data'));
            } else {
                res.status(404).send('Order not found');
            }
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error!');
        });
});

app.listen(port, () => {
    console.log(`Up and running on port ${port} - This is Order service`);
});
