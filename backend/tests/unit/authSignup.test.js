const userSignUpController = require('../../controllers/User/authSignup');

describe('User Signup Controller - Unit Test', () => {
  it('should return 400 if email missing', async () => {
    const req = { body: { password: '123456' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await userSignUpController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
