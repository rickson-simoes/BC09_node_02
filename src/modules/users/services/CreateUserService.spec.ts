import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      email: 'rickson.simoes@hotmail.com',
      name: 'rickson',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('rickson');
  });

  it('Should not be able to create a new user with an already registered email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      email: 'rickson.simoes@hotmail.com',
      name: 'rickson',
      password: '123456',
    });

    await expect(
      createUser.execute({
        email: 'rickson.simoes@hotmail.com',
        name: 'rickson',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
