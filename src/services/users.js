import Base from './base'
import Auth from './auth'

export default {

  ...Base,

  subscribe(context) {
    this.setContext(context);
    this.socketConnect().then(client => {
      client.subscribe(
        '/user/updates',
        message => {
          if (!message.new_val.token) {
            Auth.setContext(context);
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
