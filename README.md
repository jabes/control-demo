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

```bash
npm start
```

- [Server](http://localhost:8000/)
- [Database administration](http://localhost:8080/)

Change `NODE_ENV` in `nodemon.json` from `development` to `production` in order to disable webpack middleware.
You must also run `npm run build` to bundle required assets before you disable webpack.

HTTP/2 and SSL encryption are both disabled by default, however it can be enabled with the following:
1. Change `ENABLE_SSL` to `true` in `nodemon.json`
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
