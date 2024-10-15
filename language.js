
"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js"

"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"

    document.addEventListener('DOMContentLoaded', () => {
        let currentLanguage = localStorage.getItem('selectedLanguage') || 'hu';
        setLanguage(currentLanguage);

        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', () => {
                const selectedLang = option.getAttribute('data-language');
                if (selectedLang !== currentLanguage) {
                    currentLanguage = selectedLang;
                    localStorage.setItem('selectedLanguage', currentLanguage);
                    setLanguage(currentLanguage);
                }
            });
        });
    });

    function setLanguage(language) {
        document.querySelectorAll('[data-text-hu]').forEach(element => {
            element.textContent = language === 'hu' ? element.getAttribute('data-text-hu') : element.getAttribute('data-text-en');
        });
    }
