import express from 'express';
import cors from 'cors';  // Import CORS middleware
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';  // Import YAML parser to load Swagger YAML
import familyRoutes from './routes/familyRoutes.js';

const app = express();

// Load the YAML Swagger documentation file
const swaggerDocument = YAML.load('./src/config/swagger.yaml');

// Middleware
app.use(express.json());

// Enable CORS for requests from http://localhost:3000 (your React frontend)
app.use(cors({
    origin: 'http://localhost:3000',  // Allow only your frontend
}));

// Swagger route for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/family', familyRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;
