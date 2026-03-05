
import axios from 'axios';

export function loginMock() {
  return axios.post('/api/mock/login');
}

export function getMockUserInfo() {
  return axios.get('/api/mock/user');
}
