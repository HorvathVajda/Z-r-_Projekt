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
    document.querySelectorAll('[data-text-hu], [data-text-en]').forEach(element => {
        const textHu = element.getAttribute('data-text-hu');
        const textEn = element.getAttribute('data-text-en');

        if (language === 'hu') {
            element.textContent = textHu || '';
        } else if (language === 'en') {
            element.textContent = textEn || '';
        }
    });
}