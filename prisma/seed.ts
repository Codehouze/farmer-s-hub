import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const categories = await Promise.all(
    ["Vegetables", "Fruits", "Grains", "Tubers", "Legumes"].map((name) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase() },
        update: {},
        create: { name, slug: name.toLowerCase() },
      })
    )
  );
  const [vegetables, fruits, grains, tubers, legumes] = categories;

  const farmers = await Promise.all([
    prisma.user.upsert({
      where: { email: "jean.farmer@farmershub.rw" },
      update: {},
      create: {
        name: "Jean Baptiste Nshimiyimana",
        email: "jean.farmer@farmershub.rw",
        passwordHash,
        role: "FARMER",
        phone: "+250 788 111 222",
        location: "Rwamagana",
        companyName: "Nshimiyimana Farms",
        bio: "Family-run vegetable farm supplying fresh produce to Kigali markets for over 10 years.",
      },
    }),
    prisma.user.upsert({
      where: { email: "alice.greens@farmershub.rw" },
      update: {},
      create: {
        name: "Alice Uwimana",
        email: "alice.greens@farmershub.rw",
        passwordHash,
        role: "FARMER",
        phone: "+250 788 222 333",
        location: "Kigali",
        companyName: "Uwimana Green Gardens",
        bio: "Specializing in leafy greens and herbs, grown with sustainable practices.",
      },
    }),
    prisma.user.upsert({
      where: { email: "eric.produce@farmershub.rw" },
      update: {},
      create: {
        name: "Eric Habimana",
        email: "eric.produce@farmershub.rw",
        passwordHash,
        role: "FARMER",
        phone: "+250 788 333 444",
        location: "Bugesera",
        companyName: "Habimana Agro Co.",
        bio: "Agricultural company producing a wide range of fresh vegetables year-round.",
      },
    }),
    prisma.user.upsert({
      where: { email: "marie.farms@farmershub.rw" },
      update: {},
      create: {
        name: "Marie Claire Mukamana",
        email: "marie.farms@farmershub.rw",
        passwordHash,
        role: "FARMER",
        phone: "+250 788 444 555",
        location: "Musanze",
        companyName: "Mukamana Highland Produce",
        bio: "Highland farm in Musanze growing peppers, potatoes and fresh vegetables.",
      },
    }),
    prisma.user.upsert({
      where: { email: "paul.carrots@farmershub.rw" },
      update: {},
      create: {
        name: "Paul Kagabo",
        email: "paul.carrots@farmershub.rw",
        passwordHash,
        role: "FARMER",
        phone: "+250 788 555 666",
        location: "Gatsibo",
        companyName: "Kagabo Root Crops",
        bio: "Root vegetable specialists serving buyers across Eastern Rwanda.",
      },
    }),
  ]);

  const [jean, alice, eric, marie, paul] = farmers;

  await prisma.user.upsert({
    where: { email: "buyer@farmershub.rw" },
    update: {},
    create: {
      name: "Grace Buyer",
      email: "buyer@farmershub.rw",
      passwordHash,
      role: "BUYER",
      phone: "+250 788 999 000",
      location: "Kigali",
    },
  });

  const products = [
    {
      name: "Tomatoes",
      price: 2500,
      unit: "kg",
      quantityAvail: 500,
      location: "Rwamagana",
      imageUrl:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
      farmerId: jean.id,
      categoryId: vegetables.id,
      description:
        "Fresh, vine-ripened tomatoes grown without synthetic pesticides. Ideal for markets and restaurants.",
    },
    {
      name: "Lettuce",
      price: 1800,
      unit: "kg",
      quantityAvail: 200,
      location: "Kigali",
      imageUrl:
        "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=800&q=80",
      farmerId: alice.id,
      categoryId: vegetables.id,
      description: "Crisp, fresh lettuce heads harvested daily.",
    },
    {
      name: "Cucumber",
      price: 1600,
      unit: "kg",
      quantityAvail: 300,
      location: "Bugesera",
      imageUrl:
        "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&q=80",
      farmerId: eric.id,
      categoryId: vegetables.id,
      description: "Juicy, fresh cucumbers perfect for salads and pickling.",
    },
    {
      name: "Green Pepper",
      price: 3000,
      unit: "kg",
      quantityAvail: 150,
      location: "Musanze",
      imageUrl:
        "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=800&q=80",
      farmerId: marie.id,
      categoryId: vegetables.id,
      description: "Crunchy green peppers grown in the fertile Musanze highlands.",
    },
    {
      name: "Carrots",
      price: 2200,
      unit: "kg",
      quantityAvail: 250,
      location: "Gatsibo",
      imageUrl:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
      farmerId: paul.id,
      categoryId: tubers.id,
      description: "Sweet, fresh carrots rich in beta-carotene.",
    },
    {
      name: "Irish Potatoes",
      price: 1400,
      unit: "kg",
      quantityAvail: 800,
      location: "Musanze",
      imageUrl:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
      farmerId: marie.id,
      categoryId: tubers.id,
      description: "High-quality Irish potatoes from the volcanic soils of Musanze.",
    },
    {
      name: "Onions",
      price: 2000,
      unit: "kg",
      quantityAvail: 400,
      location: "Bugesera",
      imageUrl:
        "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=800&q=80",
      farmerId: eric.id,
      categoryId: vegetables.id,
      description: "Flavorful red onions, freshly harvested.",
    },
    {
      name: "Bananas",
      price: 1200,
      unit: "bunch",
      quantityAvail: 120,
      location: "Rwamagana",
      imageUrl:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80",
      farmerId: jean.id,
      categoryId: fruits.id,
      description: "Sweet, ripe bananas grown in Rwamagana district.",
    },
    {
      name: "Maize",
      price: 900,
      unit: "kg",
      quantityAvail: 1000,
      location: "Gatsibo",
      imageUrl:
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
      farmerId: paul.id,
      categoryId: grains.id,
      description: "Dried maize, ready for milling or animal feed.",
    },
    {
      name: "Beans",
      price: 1700,
      unit: "kg",
      quantityAvail: 600,
      location: "Kigali",
      imageUrl:
        "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800&q=80",
      farmerId: alice.id,
      categoryId: legumes.id,
      description: "Premium red kidney beans, cleaned and sorted.",
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name, farmerId: product.farmerId },
    });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
