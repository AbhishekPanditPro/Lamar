const fs = require('fs');
const os = require('os');
const path = require('path');




// Assuming updateBaseUrl.js and your config file are in the project root
const configFilePath = path.join(__dirname, 'config.js');

function getLocalIpAddress() {
  // Your existing implementation...
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }

  return '0.0.0.0';
}

const ipAddress = getLocalIpAddress();
const fileContents = `export const API_BASE_URL = "http://${ipAddress}:3000";\n`;

fs.writeFile(configFilePath, fileContents, (err) => {
  if (err) throw err;
  console.log('IP address updated in config.js');
});
