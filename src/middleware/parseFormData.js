import multer from 'multer';

const upload = multer(); // Handles form-data but does NOT store files

export const parseFormData = (req, res, next) => {
    upload.single("member_image")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: `Fehler beim Parsen des Formulars: ${err}` });
        }
        //console.log("Parsed form fields:", req.body);
        //console.log("Parsed file:", req.file); // Check file presence
        next();
    });
};
