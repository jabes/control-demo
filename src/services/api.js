import config from '../../config'

const API_URL = `http://${config.hapi.host}:${config.hapi.port}`;

export const endpoints = {
  users: {
    login: `${API_URL}/users/login`,
    signup: `${API_URL}/users/create`,
  },
  todos: {
    get: `${API_URL}/todos/get`,
    insert: `${API_URL}/todos/insert`,
    update: `${API_URL}/todos/update`,
    remove: `${API_URL}/todos/remove`,
  },
};
