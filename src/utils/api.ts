const BASE_URL = !import.meta.env.PROD ? 'http://localhost:3000/' :
  'https://direct-sky-backend.onrender.com/';

const userToken = () => {
  const userDataJson = localStorage.getItem('user_data'),
    userData = JSON.parse(userDataJson || '{}');
    
  if(!userData.token) return undefined;
  else return userData.token;
}

const api = async (
  path: string,
  method: 'GET' | 'POST',
  body?: Record<string, unknown>,
  auth?: boolean
) => {
  const response = await fetch(BASE_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': auth ? `Bearer ${userToken()}` : ''
    },
    body: body ? JSON.stringify(body) : undefined
  });

  return {
    status: response.status,
    body: await response.json()
  }
}

export const login = async ({ email, password } : {
  email: string,
  password: string
}) => await api('auth/login', 'POST', {
  email,
  password
});

export const register = async ({ nickname, email, password } : {
  nickname: string,
  email: string,
  password: string
}) => await api('auth/register', 'POST', {
  nickname,
  email,
  password
});

export const rooms = async () =>
  await api('rooms', 'GET', undefined, true);

export const sendMessage = async ({ toEmail, message } : {
  toEmail: string,
  message: string
}) => await api('messages', 'POST', {
  toEmail,
  message,
  sessionUUID: sessionStorage.getItem('session_uuid')
}, true);

export const roomMessages = async (roomId: string) =>
  await api(`rooms/${roomId}`, 'GET', undefined, true);