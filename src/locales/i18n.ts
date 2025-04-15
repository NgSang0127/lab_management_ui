import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true,
        interpolation: { escapeValue: false },
        detection: {
            order: ["localStorage", "navigator"],
            lookupLocalStorage: "language",
            caches: ["localStorage"],
        },
    });
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;

