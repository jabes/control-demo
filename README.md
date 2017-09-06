# Control Todo Demo

This is a simple todo app built with Node, Vue, and RethinkDB.

### Requirements

- [Node.js](https://nodejs.org/en/download/)
- [RethinkDB](https://rethinkdb.com/docs/install/)

### Install

This will install all third party dependencies required by the application.

```bash
npm install
```

### Build

This will create all assets required by the application.

```bash
npm run build
```

### Start Server

To run the database locally, first install RethinkDB on your machine, and run:

```bash
rethinkdb --config-file rethinkdb.conf
```

To run the database on a cloud service such as [compose.io](https://app.compose.io/), make sure all "`RETHINK_*`" environment variables are defined.

Example:

```yaml
RETHINK_HOST=aws-us-west-2-portal.2.dblayer.com
RETHINK_PORT=16647
RETHINK_DB=control_demo
RETHINK_SSL_CERT={BASE64_ENCODED_SSL_CERTIFICATE}
RETHINK_USER=admin
RETHINK_PASSWORD={DEPLOYMENT_PASSWORD}
```

Once the database is running, you can start the web server:

```bash
npm start
```

Now you can access the app on the localhost domain:

- [Server](http://localhost:8000/)
- [Database administration](http://localhost:8080/)

### Optional

Change `NODE_ENV` in `.env` from `development` to `production` in order to disable webpack middleware.

HTTP/2 and SSL encryption are both disabled by default. To enable them, complete the following:
1. Change `ENABLE_SSL` to `true` in `.env`
2. Uncomment `http-tls-key` and `http-tls-cert` in `rethinkdb.conf`
3. Run `./generate_keys.sh`

### Testing

```bash
npm test
```

### Screenshots

![Login](screenshots/login.png?raw=true)
![Signup](screenshots/signup.png?raw=true)
![Dashboard](screenshots/dashboard.png?raw=true)
