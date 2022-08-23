const createServer = require('http').createServer;
const url = require('url');
const axios = require('axios');
const chalk = require('chalk');
const dotenv = require('dotenv');
dotenv.config();
const  config = require('./config');
const app_id = process.env.APP_ID;
const api_key = process.env.API_KEY;

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
};
const decodeParams = searchParams => Array
    .from(searchParams.keys())
    .reduce((acc, key) => ({...acc, [key]: searchParams.get(key) }), {});
const server = createServer((req, res) => {
    const requestURL = url.parse(req.url);
    const decodedParams = decodeParams(new URLSearchParams(requestURL.search));
    const { search, location, country = 'gb' } = decodedParams;
    const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${app_id}&app_key=${api_key}&what=${search}&where=${location}`;

    if (req.method === 'GET') {
        console.log(chalk.green(`Proxy GET request to: ${targetURL}`));
        axios.get(targetURL)
            .then(response => {
                res.writeHead(200, headers);
                res.end(JSON.stringify(response.data));
            })
            .catch(error => {
                console.log(chalk.red(error));
                res.writeHead(500, headers);
                res.end(JSON.stringify(error));
            });
    }

});

server.listen(3000, () => {
    console.log(chalk.green('Server Listening'));
})
