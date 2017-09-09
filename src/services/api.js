const API_URL = `//${window.location.host}`;

export const endpoints = {
  users: {
    check: `${API_URL}/users/check`,
    login: `${API_URL}/users/login`,
    logout: `${API_URL}/users/logout`,
    signup: `${API_URL}/users/create`,
  },
  todos: {
    get: `${API_URL}/todos/get`,
    insert: `${API_URL}/todos/insert`,
    update: `${API_URL}/todos/update`,
    remove: `${API_URL}/todos/remove`,
  },
};
