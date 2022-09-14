const { getCars, addCar, getCar, updateCar } = require('./dynamo');
const express = require('express');

const app = express();
app.use(express.json());

app.get('/cars', async (req, res) => {
    console.log('Get cars');
    const cars = await getCars();
    res.send(cars['Items']);
    res.status;
});

app.post('/addCar', async (req, res) => {
    const model = req.body.model;
    const manufacturer = req.body.manufacturer;

    await addCar(manufacturer, model);
    res.status(200);
    res.send('Success!');
});

app.get('/:id', async (req, res) => {
    const id = req.params.id;

    const car = await getCar(id);
    res.send(car['Item']);
    res.status(200);
});

app.put('/modifyCar/:id', async (req, res) => {
    const id = req.params.id;
    const model = req.body.model;
    const manufacturer = req.body.manufacturer;

    await updateCar(id, manufacturer, model);
    res.status(200);
    res.send('Success!');
});

const port = 5000;
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
