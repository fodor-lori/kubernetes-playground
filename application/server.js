const express = require('express');
const Sequelize = require('sequelize');
const winston = require('winston');
const app = express();

const db = process.env.POSTGRES_DB;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;

var sequelize = new Sequelize(db, user, password, {
    host, port, dialect: 'postgres',
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './backend/backend-logs.log', options: { flags: 'a' } })
    ]
})

sequelize.authenticate().then(() => {
    logger.info('Successful connection to postgres database.');
}).catch(() => {
    logger.info('Unable to connect to the database.');
});

var Message = sequelize.define('message', {
    message: Sequelize.STRING,
});

sequelize.sync().then(() => {
    return Message.create({
        message: 'Ez itt egy teszt message',
    });
});

app.get('/', (req, res) => {
    logger.info('GET request from the browser.');
    return Message.findAll().then((result) => res.status(200).json(result));
});

app.listen(80, () => logger.info(`Listening on port 80.`))