import { jwtVerify } from 'jose';
import { getJwksUrl, getJwks, extractBearerToken } from './extractTokenAndKey.js';
import dotenv from 'dotenv';

dotenv.config();

const keycloakUrl = process.env.KEYCLOAK_URL;
const realm = process.env.KEYCLOAK_REALM;

export const validateToken = async (req, res, next) => {
    try {
        const token = extractBearerToken(req);
        const jwksUri = await getJwksUrl(keycloakUrl, realm);
        const jwks = await getJwks(jwksUri);

        const { payload } = await jwtVerify(token, jwks, {
            issuer: `${keycloakUrl}/realms/${realm}`
        });

        req.user = payload; 
        next();
    } catch (error) {
        res.status(401).json({ error: `Unauthorized: ${error.message}` });
    }
};

export const validateRole = (requiredRole) => {
    return (req, res, next) => {
        try {
            const roles = req.user?.realm_access?.roles || [];
            if (!roles.includes(requiredRole)) {
                throw new Error(`Missing required role: ${requiredRole}`);
            }
            next(); // Role is valid, proceed
        } catch (error) {
            res.status(403).json({ error: `Forbidden: ${error.message}` });
        }
    };
};

export const validateTokenAndRole = (requiredRole) => {
    return [validateToken, validateRole(requiredRole)];
}
