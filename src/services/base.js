import Nes from 'nes/client';

export default {

  app: null, // Vue
  context: null, // VueComponent
  router: null, // VueRouter
  store: null, // VueStore
  http: null,  // VueResource

  setContext(context) {
    this.context = context;
    this.app = this.context.$root;
    this.router = this.app.$router;
    this.store = this.app.$store;
    this.http = this.app.$http;
  },

  socketConnect() {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const path = `${protocol}//${window.location.host}`;
      const client = new Nes.Client(path);
      const authorization = `Bearer ${this.store.state.token}`;
      const headers = {authorization};
      const auth = {headers};
      client.connect({auth}, err => {
        if (err) reject(err);
        else {
          this.store.commit('addSocket', client);
          resolve(client);
        }
      });
    });
  },

  disconnectAllSockets() {
    for (let client of this.store.state.sockets) client.disconnect();
    this.store.commit('removeAllSockets');
  },

}
