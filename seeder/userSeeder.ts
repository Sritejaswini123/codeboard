

import {
  randFirstName,
  randLastName,
  randEmail,
  randPhoneNumber,
  randBoolean,
  randJobTitle,
  randPastDate,
} from '@ngneat/falso';
import { NewUser } from '../src/database/schemas/users';


export const generateFakeUsers = (count = 100): NewUser[] => {
  return Array.from({ length: count }).map((_, i) => {
    const dob = randPastDate({ years: 30 });
    const doj = randPastDate({ years: 10 });

    return {
      first_name: randFirstName(),
      last_name: randLastName(),
      email: `user${i + 1}_${randEmail()}`, 
      phone: randPhoneNumber(),
      is_active: randBoolean(),
      dob: dob,
      doj: doj,
      designation: randJobTitle(),
      created_at: new Date(),
      updated_at: new Date(),
    };
  });
};
