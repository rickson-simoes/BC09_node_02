import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('UpdateUserAvatar', () => {
  it('Should be able to update a new avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Rickson Simoes',
      email: 'rickson.simoes@hotmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'lerolero',
    });

    expect(user.avatar).toBe('lerolero');
  });

  it('Should not be able to update an avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: 'non existing user',
        avatarFilename: 'lerolero',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should delete old avatar when updating a new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Rickson Simoes',
      email: 'rickson.simoes@hotmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'lerolero',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'lerolero2',
    });

    expect(deleteFile).toHaveBeenCalledWith('lerolero');
    expect(user.avatar).toBe('lerolero2');
  });
});
