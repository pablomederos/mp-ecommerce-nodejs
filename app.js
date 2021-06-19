const express = require('express');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
});

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

const jsonParser = express.json()

app.get('/detail', async function (req, res) {
    console.table(req.query);
    let preference = {
        external_reference: 'pablomedeross@gmail.com',
        items: [{
            id: Number(1234),
            title: req.query.title,
            unit_price: Number(req.query.price),
            quantity: Number(req.query.unit),
        }],
        payer: {
            phone: {
                area_code: "11",
                number: 22223333
            },
            email: 'test_user_63274575@testuser.com',
            address: {
                street_name: "Falsa",
                street_number: Number("123"),
                zip_code: "1111"
            },
            name: 'Lalo',
            surname: 'Landa',
        },
        payment_methods: {
            excluded_payment_methods: [{ id: 'amex' }],
            excluded_payment_types: [{ id: 'atm' }],
            installments: 6,
            default_installments: 6
        },
        back_urls: {
            "success": "http://localhost:3000/successPayment",
            "failure": "http://localhost:3000/failurePayment",
            "pending": "http://localhost:3000/pendingPayment"
        },
        auto_return: 'approved',
    };

    try {
        const response = await mercadopago.preferences.create(preference)
        console.log(response);
        const options = {...req.query, id: response.body.id}

        res.render('detail', options);
    } catch (error) {
        console.error(error);
        res.render('checkout_error', req.query);
    }
});

app.get('/successPayment', async function (req, res) {
    res.render('checkout_success', req.query);
});

app.get('/failurePayment', async function (req, res) {
    res.render('checkout_error', req.query);
});

app.get('/pendingPayment', async function (req, res) {
    res.render('checkout_pending', req.query);
});

app.post('/mp-notifications', jsonParser, async function (req, res) {
    console.log(req.body)

    res.status(200).send("Endpoint de prueba")
});

app.listen(port);