import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let showProfile: ShowProfileService;
let fakeUsersRepository: FakeUsersRepository;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rickson Simoes',
      email: 'rickson.simoes@hotmail.com',
      password: '123456',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe('Rickson Simoes');
    expect(profile.email).toBe('rickson.simoes@hotmail.com');
  });

  it('Should not be able to show the profile from non existing user', async () => {
    await expect(
      showProfile.execute({ user_id: 'id-not-found' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
