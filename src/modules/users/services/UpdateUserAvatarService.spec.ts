import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to update a new avatar', async () => {
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
    await expect(
      updateUserAvatar.execute({
        user_id: 'non existing user',
        avatarFilename: 'lerolero',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should delete old avatar when updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
