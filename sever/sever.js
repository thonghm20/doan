const express = require("express");
const dotenv = require('dotenv');
const dbConnect = require('./config/dbconnect');
const initRoutes = require('./routes/')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3030;

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials:true
}));


dotenv.config();
app.use(express.json());
app.use(cookieParser())
dbConnect();
initRoutes(app)

app.use(express.urlencoded({ extended: true }));

app.use('/', (req, res) => {
    res.send("hua minh thong");
});

app.listen(port, () => {
    console.log('Server running on port ' + port);
});
