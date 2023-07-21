const express = require("express");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const router = express.Router();

router.get("/health", (req, res) => {
  res.send("I'm alive!");
});

router.post('/confirm', (req, res) => {
  const csrfToken = req.body.reqid
  const clientRef = req.body.clientRef
  const url = `https://sampath.paycorp.lk/webinterface/qw/confirm?csrfToken=${csrfToken}&authToken=${process.env.PG_AUTH_TOKEN}&clientRef=${clientRef}`
  axios.post(url, {})
      .then((response) => {
          const responseString = response.data
          const responseArray = responseString.split('&')
          const responseObj = {}
          responseArray.forEach((item) => {
              const [key, value] = item.split('=')
              responseObj[key] = value
          })

          console.log(responseObj)
          res.status(200).send(responseObj)
      })
      .catch((error) => {
          console.log(error)
          res.status(500).send(error)
      })

}
)

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
