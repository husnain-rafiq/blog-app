// import { describe, expect, it } from '@jest/globals';
import app from '../../app';
import 'dotenv/config';

const request = require('supertest');

const auth = {};

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
    // expect(response.body.length).toBe(1);
    expect(response.statusCode).toBe(200);
    done();
  });

  test('Try to Authorizes using wrong token', async (done) => {
    const response = await request(app)
      // add an authorization header with the token, but go to a different ID than the one stored in the token
      .get(`/api/users/1`)
      .set('authorization', '45684648444844848');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No authorization token was found');
    done();
  });

  test('Authorizes only correct users', async (done) => {
    const response = await request(app)
      // add an authorization header with the token, but go to a different ID than the one stored in the token
      .get(`/api/users/1`)
      .set({ authorization: `Bearer ${auth.token}`, 'content-type': 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('post');

    done();
  });
});
