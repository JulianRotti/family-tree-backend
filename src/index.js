// src/index.js

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './config/swagger.js';  // Import the Swagger configuration
import familyRoutes from './routes/familyRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Swagger route for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/family', familyRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;  // This is useful for testing
