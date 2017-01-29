'use strict';

const Backbone = require('backbone');
const Locale = require('./locale');

const SettingsManager = {
    neutralLocale: null,
    activeLocale: 'en',

    setBySettings: function(settings) {
        if (settings.get('theme')) {
            this.setTheme(settings.get('theme'));
        }
        if (settings.get('fontSize')) {
            this.setFontSize(settings.get('fontSize'));
        }
        let locale = settings.get('locale');
        if (locale) {
            this.setLocale(settings.get('locale'));
        } else {
            try {
                this.setLocale(this.getBrowserLocale());
            } catch (ex) {}
        }
    },

    setTheme: function(theme) {
        _.forEach(document.body.classList, cls => {
            if (/^th\-/.test(cls)) {
                document.body.classList.remove(cls);
            }
        });
        document.body.classList.add(this.getThemeClass(theme));
        var metaThemeColor = document.head.querySelector('meta[name=theme-color]');
        if (metaThemeColor) {
            metaThemeColor.content = window.getComputedStyle(document.body).backgroundColor;
        }
    },

    getThemeClass: function(theme) {
        return 'th-' + theme;
    },

    setFontSize: function(fontSize) {
        document.documentElement.style.fontSize = fontSize ? (12 + fontSize * 2) + 'px' : '';
    },

    setLocale(loc) {
        if (!loc || loc === this.activeLocale) {
            return;
        }
        let localeValues;
        if (loc !== 'en') {
            localeValues = require('../locales/' + loc + '.json');
        }
        if (!this.neutralLocale) {
            this.neutralLocale = _.clone(Locale);
        }
        _.extend(Locale, this.neutralLocale, localeValues);
        this.activeLocale = loc;
        Backbone.trigger('set-locale', loc);
    },

    getBrowserLocale: function() {
        let language = navigator.languages && navigator.languages[0] || navigator.language;
        return language ? language.substr(0, 2).toLowerCase() : null;
    }
};

module.exports = SettingsManager;
