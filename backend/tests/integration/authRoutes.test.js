const request = require('supertest');
const app = require('../../server'); // export your express app

describe('Auth Routes - Integration Test', () => {

  it('POST /signin should return 200 for valid user', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: 'test@gmail.com',
        password: '123456'
      });

    expect(response.statusCode).toBe(200);
  });

});
