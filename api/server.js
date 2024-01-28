const express       = require('express');
const mongoose      = require('mongoose');
const swaggerUi     = require('swagger-ui-express');
const swaggerJSDoc  = require('swagger-jsdoc');

const app           = express();
const port          = process.env.API_PORT || 3000;

mongoose.connect(process.env.MONGO_URL)

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentation API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                Authorization: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                },
            },
        },
        security: [
            {
                Authorization: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const openAiSpec    = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAiSpec));

const userRoute     = require("./src/routes/userRoute");
userRoute(app);

app.listen(port);