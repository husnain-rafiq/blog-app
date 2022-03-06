// const axios = require('axios');

// const users = [
//   {
//     username: 'hus_rafiq',
//     email: 'hus@email.com',
//     role: 'admin',
//     isActive: true,
//     password: 'asad1122',
//   },
//   {
//     username: 'uma_rafiq',
//     email: 'uma@email.com',
//     role: 'admin',
//     isActive: true,
//     password: 'asad1122',
//   },
//   {
//     username: 'rafiq_rafiq',
//     email: 'rafiq@email.com',
//     role: 'admin',
//     isActive: true,
//     password: 'asad1122',
//   },
// ];

// async function apiRequest(config) {
//   const val = await axios(config);
//   return val;
// }

// const loginData = JSON.stringify({
//   email: 'admin@email.com',
//   password: 'admin123',
// });

// const loginConfig = {
//   method: 'post',
//   url: 'http://localhost:5000/api/users/login',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   data: loginData,
// };

// const createUsers = async (tokenValue) => {
//   const configUser = {
//     method: 'post',
//     url: 'http://localhost:5000/api/users',
//     headers: {
//       Authorization: `Bearer ${tokenValue}`,
//       'Content-Type': 'application/json',
//     },
//     data: users,
//   };

//   users.map(async (item) => {
//     const userRes = await apiRequest({ ...configUser, data: JSON.stringify(item) });
//     return null;
//   });
// };

// let loginRes;
// (async function test() {
//   loginRes = await apiRequest(loginConfig);
//   const tokenValue = loginRes.data.data.token;
//   createUsers(tokenValue);
// })();
// // =========================================================================================
