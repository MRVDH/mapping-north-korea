const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../server/dist'),

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
