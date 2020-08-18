import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let listProviders: ListProvidersService;
let fakeUsersRepository: FakeUsersRepository;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('Should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Rickson Simoes1',
      email: 'rickson.simoes1@hotmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Rickson Simoes2',
      email: 'rickson.simoes2@hotmail.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Rickson Simoes3',
      email: 'rickson.simoes3@hotmail.com',
      password: '123456',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
