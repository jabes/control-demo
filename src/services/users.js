import Base from './base'
import Auth from './auth'

export default {

  ...Base,

  subscribe() {
    this.socketConnect().then(client => {
      client.subscribe(
        '/user/updates',
        message => {
          if (!message.new_val.token) {
            Auth.logout();
            this.router.push({name: 'login'});
          }
        },
        err => {
          if (err) console.error(err);
        },
      );
    });
  },

}
