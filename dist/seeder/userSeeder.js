import {
  randFirstName,
  randLastName,
  randJobTitle,
  randPastDate,
  randRecentDate,
  randUuid,
} from "@ngneat/falso";

//   return Array.from({ length: count }).map((_, i) => {
//     const dob = randPastDate({ years: 30 });
//     const doj = randFutureDate({ years: 10 });
//     return {
//       first_name: randFirstName(),
//       last_name: randLastName(),
//       email: `${i + 1}_${randEmail()}`,
//       phone: randPhoneNumber(),
//       is_active: randBoolean(),
//       dob: dob,
//       doj: doj,
//       designation: randJobTitle(),
//       created_at: new Date(),
//       updated_at: new Date(),
//     };
//   });
// };
// export const generateFakeUsers = (count = 100): NewUser[] => {
//   return Array.from({ length: count }).map((_, i) => {
//     const firstName = randFirstName();
//     const lastName = randLastName();
//     const dob = randPastDate({ years: 30 });
//     const doj = randRecentDate();
//     return {
//       first_name: firstName,
//       last_name: lastName,
//       email: `${firstName.toLowerCase()}${i + 1}@gmail.com`,
//       phone: `+91${randPhoneNumber().replace(/\D/g, '').slice(-10)}`, // 👉 ensures only last 10 digits
//       is_active:true,
//       dob: dob,
//       doj: doj,
//       designation: randJobTitle(),
//       created_at: new Date(),
//       updated_at: new Date(),
//     };
//   });
// };
export const generateFakeUsers = (count = 100) => {
  return Array.from({ length: count }).map((_, i) => {
    const firstName = randFirstName();
    const lastName = randLastName();
    const dob = randPastDate({ years: 30 });
    const doj = randRecentDate();
    const randomStart = ["6", "7", "8", "9"][Math.floor(Math.random() * 4)];
    const phoneNumber = `${randomStart}${Math.floor(100000000 + Math.random() * 900000000)}`;
    return {
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}${randUuid().slice(0, 5)}@gmail.com`,
      phone: `+91 ${phoneNumber}`,
      is_active: true,
      dob: dob,
      doj: doj,
      designation: randJobTitle(),
      created_at: new Date(),
      updated_at: new Date(),
      // gender: randGender(), // optional field
    };
  });
};
