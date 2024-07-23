import axios from 'axios';

const URL = 'http://localhost:3002/bp';

const API = axios.create({ baseURL: URL });

export { API };
