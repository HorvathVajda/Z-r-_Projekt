<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('messages.settings') }}</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome ikonkészlet -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .settings-container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 20px;
        }
        .settings-header {
            margin-bottom: 20px;
        }
        .list-group-item {
            border: none;
            border-bottom: 1px solid #e9ecef;
        }
        .list-group-item:last-child {
            border-bottom: none;
        }
        .list-group-item a {
            text-decoration: none;
            color: #212529;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
        .list-group-item a:hover {
            background-color: #f1f1f1;
            border-radius: 4px;
            padding: 10px;
        }
        .list-group-item i {
            margin-right: 10px;
            color: #6c757d;
        }
        .arrow-icon {
            color: #6c757d;
        }
        /* Nyelv opciók stílus */
        .language-options {
            padding-left: 40px;
            padding-top: 10px;
            padding-bottom: 10px;
            background-color: #f8f9fa;
        }
        .language-option {
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            padding: 5px 0;
        }
        .language-option:hover {
            background-color: #e9ecef;
            border-radius: 4px;
        }
        .check-icon {
            color: #0d6efd;
            margin-right: 10px;
            display: none; /* Alapértelmezetten rejtve */
        }
        .language-option.selected .check-icon {
            display: inline; /* Kijelölve megjelenik */
        }
    </style>
</head>
<body>
    <!-- Navigációs sáv -->
    <nav class="navbar navbar-expand-lg navbar-light bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="{{ url('/') }}">
                <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30" fill="#FFFFFF">
                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
                </svg>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('settings') }}" style="color: white;">
                            <i class="fas fa-cog"></i> <span data-i18n="settings">{{ __('messages.settings') }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Beállítások tartalom -->
    <div class="settings-container">
        <h2 class="settings-header" data-i18n="settings">{{ __('messages.settings') }}</h2>
        <div class="list-group">
            <!-- Nyelv beállítás -->
            <div class="list-group-item">
                <a data-bs-toggle="collapse" href="#languageOptions" role="button" aria-expanded="false" aria-controls="languageOptions">
                    <div>
                        <i class="fas fa-language"></i> <span data-i18n="language">{{ __('messages.language') }}</span>
                    </div>
                    <i class="fas fa-chevron-down arrow-icon"></i>
                </a>
                <div class="collapse language-options" id="languageOptions">
                    <div class="language-option" data-language="hu">
                        <i class="fas fa-check-circle check-icon"></i> Magyar
                    </div>
                    <div class="language-option" data-language="en">
                        <i class="fas fa-check-circle check-icon"></i> Angol
                    </div>
                </div>
            </div>
            <!-- Profil beállítás -->
            <div class="list-group-item">
                <a href="#">
                    <div>
                        <i class="fas fa-user"></i> <span data-i18n="profile">{{ __('messages.profile') }}</span>
                    </div>
                    <i class="fas fa-chevron-right arrow-icon"></i>
                </a>
            </div>
            <!-- Értesítések beállítás -->
            <div class="list-group-item">
                <a href="#">
                    <div>
                        <i class="fas fa-bell"></i> <span data-i18n="notifications">{{ __('messages.notifications') }}</span>
                    </div>
                    <i class="fas fa-chevron-right arrow-icon"></i>
                </a>
            </div>
            <!-- Adatvédelem beállítás -->
            <div class="list-group-item">
                <a href="#">
                    <div>
                        <i class="fas fa-shield-alt"></i> <span data-i18n="privacy">{{ __('messages.privacy') }}</span>
                    </div>
                    <i class="fas fa-chevron-right arrow-icon"></i>
                </a>
            </div>
            <!-- Névjegy beállítás -->
            <div class="list-group-item">
                <a href="#">
                    <div>
                        <i class="fas fa-info-circle"></i> <span data-i18n="about">{{ __('messages.about') }}</span>
                    </div>
                    <i class="fas fa-chevron-right arrow-icon"></i>
                </a>
            </div>
        </div>
    </div>

    <!-- Fordítási Adatok -->
    <script>
        const translations = {
            hu: {
                "settings": "Beállítások",
                "language": "Nyelv",
                "profile": "Profil",
                "notifications": "Értesítések",
                "privacy": "Adatvédelem",
                "about": "Névjegy",
                "save": "Mentés",
                "home": "Főoldal",
                "login": "Bejelentkezés",
                "contact": "Kapcsolat",
                "about_us": "Rólunk",
                "welcome": "Üdvözlünk a BookMyTime oldalon!",
                "description": "Itt foglalhatsz időpontokat különböző szolgáltatásokra.",
                // További fordítások...
            },
            en: {
                "settings": "Settings",
                "language": "Language",
                "profile": "Profile",
                "notifications": "Notifications",
                "privacy": "Privacy",
                "about": "About",
                "save": "Save",
                "home": "Home",
                "login": "Login",
                "contact": "Contact",
                "about_us": "About Us",
                "welcome": "Welcome to the BookMyTime website!",
                "description": "Here you can book appointments for various services.",
                // További fordítások...
            }
        };
    </script>

    <!-- Bootstrap Bundle JS (includes Popper) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Nyelv betöltése localStorage-ból vagy alapértelmezettként a Laravel beállításából
            let currentLanguage = localStorage.getItem('selectedLanguage') || '{{ app()->getLocale() }}';
            setLanguage(currentLanguage);

            // Jelöljük ki a megfelelő nyelvet
            document.querySelector(`.language-option[data-language="${currentLanguage}"]`).classList.add('selected');

            // Nyelv kiválasztás kezelése
            document.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', () => {
                    const selectedLang = option.getAttribute('data-language');
                    if (selectedLang !== currentLanguage) {
                        currentLanguage = selectedLang;
                        localStorage.setItem('selectedLanguage', currentLanguage);
                        setLanguage(currentLanguage);

                        // Eltávolítjuk a 'selected' osztályt minden opcióból
                        document.querySelectorAll('.language-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });

                        // Hozzáadjuk a 'selected' osztályt a kiválasztott opcióhoz
                        option.classList.add('selected');

                        // Bezárjuk a legördülő nyelvi opciókat
                        const languageOptions = document.getElementById('languageOptions');
                        const bsCollapse = new bootstrap.Collapse(languageOptions, {
                            toggle: false
                        });
                        bsCollapse.hide();

                        // Felhasználói visszajelzés
                        alert(`{{ __('messages.language') }} set to: {{ __('messages.language') }}`);
                    }
                });
            });

            // Fordítás függvény
            function setLanguage(lang) {
                // Minden elem, amelynek van data-i18n attribútuma
                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const key = element.getAttribute('data-i18n');
                    if (translations[lang][key]) {
                        element.textContent = translations[lang][key];
                    }
                });

                // Jelöljük ki a kiválasztott nyelvet
                document.querySelectorAll('.language-option').forEach(option => {
                    if (option.getAttribute('data-language') === lang) {
                        option.classList.add('selected');
                    } else {
                        option.classList.remove('selected');
                    }
                });
            }
        });
    </script>
</body>
</html>
