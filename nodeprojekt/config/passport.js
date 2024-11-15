const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Profil kezelése, új felhasználó létrehozása vagy létező felhasználó keresése
    db.query('SELECT * FROM felhasznalo WHERE email = ?', [profile.emails[0].value], (err, results) => {
        if (err) return done(err);
        if (results.length === 0) {
            // Új felhasználó hozzáadása
            db.query('INSERT INTO felhasznalo (nev, email, jogosultsag) VALUES (?, ?, ?)', [profile.displayName, profile.emails[0].value, 'ugyfel'], (err, result) => {
                if (err) return done(err);
                return done(null, result);
            });
        } else {
            return done(null, results[0]);
        }
    });
}));

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 'FACEBOOK_APP_ID',
    clientSecret: 'FACEBOOK_APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
    db.query('SELECT * FROM felhasznalo WHERE email = ?', [profile.emails[0].value], (err, results) => {
        if (err) return done(err);
        if (results.length === 0) {
            db.query('INSERT INTO felhasznalo (nev, email, jogosultsag) VALUES (?, ?, ?)', [profile.displayName, profile.emails[0].value, 'ugyfel'], (err, result) => {
                if (err) return done(err);
                return done(null, result);
            });
        } else {
            return done(null, results[0]);
        }
    });
}));

const jwt = require('jsonwebtoken');

const checkRole = (roles) => {
    return (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(403).json({ message: 'Token szükséges' });

        try {
            const decoded = jwt.verify(token, 'titkoskulcs');
            if (!roles.includes(decoded.jogosultsag)) {
                return res.status(403).json({ message: 'Nincs megfelelő jogosultságod' });
            }
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(400).json({ message: 'Érvénytelen token' });
        }
    };
};

// Példa a middleware használatára
app.post('/api/some-endpoint', checkRole(['ugyfel', 'vallalkozo']), (req, res) => {
    res.send('Felhasználói jogosultság ellenőrzés sikerült');
});
