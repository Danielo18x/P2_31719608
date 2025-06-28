import i18n from 'i18n';
import path from 'path';
import { RequestHandler } from 'express';

i18n.configure({
    locales: ['en', 'es'],
    defaultLocale: 'es',
    directory: path.join(__dirname, '../locales'),
    queryParameter: 'lang',
    cookie: 'lang',
    autoReload: true,
    updateFiles: false
});

export const i18nInit: RequestHandler = (req, res, next) => {
    i18n.init(req, res, () => {
        res.locals.__ = res.__;
        res.locals.locale = res.getLocale();
        next();
    });
};

export default i18n;