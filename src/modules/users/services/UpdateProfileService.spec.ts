import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rickson Simoes',
      email: 'rickson.simoes@hotmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Rickson S',
      email: 'rickson.simoes@hotmail.com',
    });

    expect(updatedUser.name).toBe('Rickson S');
    expect(updatedUser.email).toBe('rickson.simoes@hotmail.com');
  });

  it('Should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Rickson Simoes',
      email: 'rickson.simoes@hotmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Rick teste',
      email: 'rickteste@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Rickson S',
        email: 'rickson.simoes@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rickson Simoes',
      email: 'rickson.simoes@hotmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Rickson S',
      email: 'ricksonteste@hotmail.com',
      old_password: '123456',
      password: '123455',
    });

    expect(updatedUser.password).toBe('123455');
  });

  it('Should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rickson Simoes',
      email: 'rickson.simoes@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Rickson S',
        email: 'rickson.simoes@hotmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rickson Simoes',
      email: 'rickson.simoes@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Rickson S',
        email: 'rickson.simoes@hotmail.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
