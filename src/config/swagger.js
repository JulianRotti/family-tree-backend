// src/config/swagger.js
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Family API',
      description: 'API for managing family members and relationships',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@familyapi.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', // Your local development URL
        description: 'Local server'
      }
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs (you'll write JSDoc comments here)
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
