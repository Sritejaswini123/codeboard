import { randFirstName, randJobTitle, randLastName, randPastDate, randRecentDate, randUuid } from '@ngneat/falso';
export const generateFakeUsers = (count = 100) => {
    return Array.from({ length: count }).map((_, i) => {
        const firstName = randFirstName();
        const lastName = randLastName();
        const dob = randPastDate({ years: 30 });
        const doj = randRecentDate();
        const randomStart = ['6', '7', '8', '9'][Math.floor(Math.random() * 4)];
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
