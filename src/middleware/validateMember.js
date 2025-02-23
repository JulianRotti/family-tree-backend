// src/middlewares/validateMember.js

import { getMemberByAttributes } from '../services/familyService.js';

// Define regex patterns for validation
const nameRegex = /^[A-Za-zÄÖÜäöüß-]+$/; // Allows letters, hyphens, and German umlauts
const cityRegex = /^[A-Za-zÄÖÜäöüß()\s-]+$/; // Allows letters, hyphens, spaces, parentheses, and umlauts
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Standard email format
const telephoneRegex = /^[0-9+\s()-]{7,20}$/; // Allows digits, spaces, +, (), - (7-20 characters)
const streetNumberRegex = /^[A-Za-zÄÖÜäöüß\s.-]+\s\d+[A-Za-z]?$/; // Matches "Müllerstraße 12", "Hauptstr. 5", "Goethe-Straße 7A"

export const validateDoubleMember = async (req, res, next) => {
    const {
        first_name, last_name, birth_date
    } = req.body;
    
    try {
        // heck if a member with the same name and birth date already exists
        const existingMember = await getMemberByAttributes(first_name, last_name, birth_date);
        if (existingMember) {
            return res.status(200).json({ notice: 'Ein Mitglied mit demselben Namen und Geburtsdatum existiert bereits.' });
        }

        // If all validations pass, proceed to the next middleware
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Serverfehler bei der Mitgliedsvalidierung.' });
    }
};   

export const validateMember = async (req, res, next) => {
    const {
        first_name, last_name, birth_date, death_date, birth_city, birth_country, 
        email, telephone, street_number, plz, city
    } = req.body;

    // Validate required fields
    if (!first_name) return res.status(400).json({ error: 'Vorname ist nicht angegeben.' });
    if (!last_name) return res.status(400).json({ error: 'Nachname ist nicht angegeben.' });
    if (!birth_date) return res.status(400).json({ error: 'Geburtsdatum ist nicht angegeben.' });
    if (!birth_city) return res.status(400).json({ error: 'Geburtsort ist nicht angegeben.' });
    if (!birth_country) return res.status(400).json({ error: 'Geburtsland ist nicht angegeben.' });

    // Validate name, city, and country fields
    if (!nameRegex.test(first_name)) return res.status(400).json({ error: 'Vorname enthält unerlaubte Zeichen.' });
    if (!nameRegex.test(last_name)) return res.status(400).json({ error: 'Nachname enthält unerlaubte Zeichen.' });
    if (!cityRegex.test(birth_city)) return res.status(400).json({ error: 'Geburtsort enthält unerlaubte Zeichen.' });
    if (!cityRegex.test(birth_country)) return res.status(400).json({ error: 'Geburtsland enthält unerlaubte Zeichen.' });

    // Validate dates (correct format & logical order)
    if (isNaN(Date.parse(birth_date))) return res.status(400).json({ error: 'Geburtsdatum ist nicht valide.' });
    if (death_date && isNaN(Date.parse(death_date))) return res.status(400).json({ error: 'Sterbedatum ist nicht valide.' });
    if (death_date && new Date(birth_date) > new Date(death_date)) {
        return res.status(400).json({ error: 'Geburtsdatum darf nicht nach dem Sterbedatum liegen.' });
    }

    // Validate optional fields if provided
    if (email && !emailRegex.test(email)) return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
    if (telephone && !telephoneRegex.test(telephone)) return res.status(400).json({ error: 'Ungültige Telefonnummer.' });
    if (street_number && !streetNumberRegex.test(street_number)) {
        return res.status(400).json({ error: 'Straßenname und Hausnummer sind ungültig. (z. B. Müllerstraße 12 oder Hauptstr. 5)' });
    }
    if (city && !cityRegex.test(city)) return res.status(400).json({ error: 'Stadtname enthält unerlaubte Zeichen.' });

    next();
};
