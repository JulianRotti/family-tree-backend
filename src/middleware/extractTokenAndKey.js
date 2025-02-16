import axios from 'axios';
import { createRemoteJWKSet } from 'jose';

export const getJwksUrl = async (keycloakUrl, realm) => {
    const wellKnownUrl = `${keycloakUrl}/realms/${realm}/.well-known/openid-configuration`;
    const { data } = await axios.get(wellKnownUrl);
    return data.jwks_uri;
};

/**
 * Fetch and prepare the JWKS for token validation
 * @param {string} jwksUri - The URI of the JWKS
 * @returns {object} - A Remote JWK Set object for token validation
 */
export const getJwks = async (jwksUri) => {
    try {
        const response = await axios.get(jwksUri);
        return createRemoteJWKSet(new URL(jwksUri));
    } catch (error) {
        throw new Error(`Failed to fetch JWKS: ${error.message}`);
    }
};

export const extractBearerToken = (req) => {
    console.log(req.headers);
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1]; // Extract and return the token
    }
    throw new Error('Authorization token is missing.');
};