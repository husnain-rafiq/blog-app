// import { describe, expect, it } from '@jest/globals';
import app from '../../app';
import 'dotenv/config';

const request = require('supertest');

const auth = {};
let createdUserId = '';

beforeEach(async () => {
  const response = await request(app)
    .post('/api/users/login')
    .set({ 'content-type': 'application/json' })
    .send({
      email: 'admin@email.com',
      password: 'admin123',
    });
  auth.token = response.body.data.token;
});

describe('User API Testings', () => {
  it('User with Invalid Credentials Login', async (done) => {
    const response = await request(app)
      .post('/api/users/login')
      .set({ 'content-type': 'application/json' })
      .send({
        email: 'admin@email.com',
        password: 'adminn123',
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('Invalid credentials');
    done();
  });

  it('User with valid Credentials Login', (done) => {
    request(app)
      .post('/api/users/login')
      .set({ 'content-type': 'application/json' })
      .send({
        email: 'admin@email.com',
        password: 'admin123',
      })
      .expect(200, done);
  });

  test('Returns a list of users', async (done) => {
    const response = await request(app)
      .get('/api/users/')
      // add an authorization header with the token
      .set({ authorization: `Bearer ${auth.token}`, 'content-type': 'application/json' });
    expect(response.statusCode).toBe(200);
    done();
  });

  test('Try to Authenticate with wrong token', async (done) => {
    const response = await request(app)
      // add an authorization header with the token, but go to a different ID than the one stored in the token
      .get(`/api/users/1`)
      .set('authorization', '45684648444844848');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No authorization token was found');
    done();
  });

  test('Access only Authorizes users', async (done) => {
    const response = await request(app)
      // add an authorization header with the token, but go to a different ID than the one stored in the token
      .get(`/api/users/1`)
      .set({ authorization: `Bearer ${auth.token}`, 'content-type': 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('post');
    done();
  });

  test('Create New User', async (done) => {
    const response = await request(app)
      .post('/api/users/')
      // add an authorization header with the token
      .set({ authorization: `Bearer ${auth.token}`, 'content-type': 'application/json' })
      .send({
        username: 'sidraSial',
        email: 'sidra@email.com',
        password: 'sidra@123',
        role: 'admin',
        isActive: 'true',
      });
    createdUserId = response?.body?.data?.id;
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('isActive');
    done();
  });

  test('Update User', async (done) => {
    const response = await request(app)
      .put(`/api/users/${createdUserId}`)
      // add an authorization header with the token
      .set({ authorization: `Bearer ${auth.token}`, 'content-type': 'application/json' })
      .send({
        username: 'sidraKhalil',
        role: 'user',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.role).toEqual('user');
    expect(response.body.data.username).toEqual('sidraKhalil');
    expect(response.body.data).toHaveProperty('role');
    expect(response.body.data).toHaveProperty('username');
    done();
  });

  test('Delete User', async (done) => {
    const response = await request(app)
      .delete('/api/users/deleteUsers')
      .set({ authorization: `Bearer ${auth.token}`, 'content-type': 'application/json' })
      .send({
        ids: [createdUserId],
      });
    expect(response.statusCode).toBe(200);
    done();
  });
});
