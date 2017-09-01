const fs = require('fs');
const pkg = require('./package.json');
const source = './src/images/favicon.svg';
const configuration = {
  appName: pkg.name, // Your application's name.
  appDescription: pkg.description, // Your application's description.
  developerName: pkg.author.name, // Your (or your developer's) name.
  developerURL: pkg.author.url, // Your (or your developer's) URL.
  background: '#fff', // Background colour for flattened icons.
  theme_color: '#fff', // Theme color for browser chrome.
  path: '/favicons', // Path for overriding default icons path.
  display: 'standalone', // Android display: 'browser' or 'standalone'.
  orientation: 'any', // Android orientation: 'portrait' or 'landscape'.
  start_url: '/', // Android start application's URL.
  version: pkg.version, // Your application's version number.
  logging: true, // Print logs to console?
  online: false, // Use RealFaviconGenerator to create favicons?
  preferOnline: false, // Use offline generation, if online generation has failed.
  html: "index.html",
  pipeHTML: true,
  icons: {
    android: true, // Create Android homescreen icon.
    appleIcon: true, // Create Apple touch icons.
    appleStartup: true, // Create Apple startup images.
    coast: false, // Create Opera Coast icon.
    favicons: true, // Create regular favicons.
    firefox: true, // Create Firefox OS icons.
    windows: true, // Create Windows 8 tile icons.
    yandex: false, // Create Yandex browser icon.
  }
};

const callback = function (error, response) {
  const destination = './public/favicons';
  if (!fs.existsSync(destination)) fs.mkdirSync(destination);
  for (let file of response.files) {
    let path = `${destination}/${file.name}`;
    fs.writeFileSync(path, file.contents);
    console.log(`Write file: ${path}`);
  }
  for (let image of response.images) {
    let path = `${destination}/${image.name}`;
    fs.writeFileSync(path, image.contents);
    console.log(`Write image: ${path}`);
  }
};

require('favicons')(source, configuration, callback);
