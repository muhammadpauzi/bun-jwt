import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/id_ID";

const prisma = new PrismaClient();

const seed = async () => {
    await prisma.user.create({
        data: {
            name: "Administrator",
            email: "administrator@gmail.com",
            password: await Bun.password.hash("password", {
                algorithm: "bcrypt",
                cost: 4,
            }),
        },
    });

    for (let i = 0; i < 10; i++) {
        // create a new user
        await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.exampleEmail(),
                password: await Bun.password.hash("password", {
                    algorithm: "bcrypt",
                    cost: 4,
                }),
            },
        });
    }

    // count the number of users
    const count = await prisma.user.count();
    console.log(`There are ${count} users in the database.`);
};

// seed().then(() => console.log("Finished!"));
await seed();
