const https = require("https");
const http = require("http");
const fs = require("fs");
const migrate = require('migrate');
const app = require('./app');
const config = require('./config.json');

// Ensure migrations are up-to-date
migrate.load({
    stateStore: '.migrate'
}, (err, set) => {
    if (err) {
        throw err
    }

    set.up( (err) => {
        if (err) {
            throw err
        }

        // Migrations are finished
        setupServer();
    });
});

const setupServer = () => {
    let server = http.createServer();

    // If the host URL is a HTTPS url, use the HTTP server
    if (config.server.host.indexOf('https') >= 0) {
        console.log('Using SSL');
        const keyFile = '../key.pem';
        const certFile = '../cert.pem';
        const sslOptions = {
            key: fs.readFileSync(keyFile,),
            cert: fs.readFileSync(certFile),
        };

        server = https.createServer(sslOptions);
    }

    server
        .on('request', app.app)
        .listen(config.server.port, () => {
            let host = config.server.host;
            if ((config.server.port !== 80) && (config.server.port !== 443)) {
                host += `:${config.server.port}`;
            }

            console.log(`Server running at: ${host}`);
        });
}