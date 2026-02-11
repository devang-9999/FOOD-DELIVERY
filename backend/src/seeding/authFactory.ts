import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Authentication } from 'src/authentication/entities/authentication.entity';

export default class TagSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const authRepository = dataSource.getRepository(Authentication);
    const CUSTOMERData = [
      {
        id: 1,
        username: 'jdoe',
        email: 'john.doe@example.com',
        password: 'hashed_password_1',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 2,
        username: 'asmith',
        email: 'alice.smith@example.com',
        password: 'hashed_password_2',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 3,
        username: 'bjones',
        email: 'bob.jones@example.com',
        password: 'hashed_password_3',
        role: 'CUSTOMER',
        isBlocked: true,
      },
      {
        id: 4,
        username: 'clara_v',
        email: 'clara.v@example.com',
        password: 'hashed_password_4',
        role: 'RESTAURANT OWNER',
        isBlocked: false,
      },
      {
        id: 5,
        username: 'davis_m',
        email: 'mike.davis@example.com',
        password: 'hashed_password_5',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 6,
        username: 'ethan_hunt',
        email: 'ethan@mission.com',
        password: 'hashed_password_6',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 7,
        username: 'fiona_g',
        email: 'fiona@web.com',
        password: 'hashed_password_7',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 8,
        username: 'george_t',
        email: 'george@tech.com',
        password: 'hashed_password_8',
        role: 'RESTAURANT OWNER',
        isBlocked: false,
      },
      {
        id: 9,
        username: 'hannah_b',
        email: 'hannah@service.org',
        password: 'hashed_password_9',
        role: 'CUSTOMER',
        isBlocked: true,
      },
      {
        id: 10,
        username: 'ian_wright',
        email: 'ian.w@example.com',
        password: 'hashed_password_10',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 11,
        username: 'jenny_k',
        email: 'jenny.k@provider.net',
        password: 'hashed_password_11',
        role: 'RESTAURANT OWNER',
        isBlocked: false,
      },
      {
        id: 12,
        username: 'kevin_s',
        email: 'kevin@domain.com',
        password: 'hashed_password_12',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 13,
        username: 'lara_croft',
        email: 'lara@tomb.com',
        password: 'hashed_password_13',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 14,
        username: 'mike_ross',
        email: 'mike.r@legal.com',
        password: 'hashed_password_14',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 15,
        username: 'nina_w',
        email: 'nina@media.com',
        password: 'hashed_password_15',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 16,
        username: 'oscar_wild',
        email: 'oscar@poetry.com',
        password: 'hashed_password_16',
        role: 'RESTAURANT OWNER',
        isBlocked: true,
      },
      {
        id: 17,
        username: 'paul_r',
        email: 'paul.r@example.com',
        password: 'hashed_password_17',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 18,
        username: 'quinn_f',
        email: 'quinn@studio.com',
        password: 'hashed_password_18',
        role: 'CUSTOMER',
        isBlocked: false,
      },
      {
        id: 19,
        username: 'rose_t',
        email: 'rose@garden.com',
        password: 'hashed_password_19',
        role: 'RESTAURANT OWNER',
        isBlocked: false,
      },
      {
        id: 20,
        username: 'steve_rogers',
        email: 'cap@avenge.com',
        password: 'hashed_password_20',
        role: 'CUSTOMER',
        isBlocked: false,
      },
    ];

    for (const data of CUSTOMERData) {
      await authRepository.save(authRepository.create(data));
    }
    console.log('Tags seeded successfully');
  }
}
