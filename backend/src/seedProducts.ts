import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedProducts() {
    const categoryNames = ["Electronics", "Clothing", "Home Appliances", "Books", "Toys"];
    const colorData = [
        { name: "Red", hex: "#FF0000" },
        { name: "Blue", hex: "#0000FF" },
        { name: "Green", hex: "#008000" },
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" }
    ];

    // Ensure categories exist
    const categories = await Promise.all(
        categoryNames.map(async (name) => {
            return prisma.category.upsert({
                where: { name },
                update: {},
                create: { name }
            });
        })
    );

    // Ensure colors exist
    const colors = await Promise.all(
        colorData.map(async ({ name, hex }) => {
            return prisma.color.upsert({
                where: { name },
                update: {},
                create: { name, hex }
            });
        })
    );

    const products = await Promise.all(
        Array.from({ length: 30 }, async (_, i) => {
            const category = categories[i % categories.length]; // Assign categories cyclically
            const selectedColors = colors.sort(() => 0.5 - Math.random()).slice(0, 3); // Select up to 3 random colors

            return prisma.product.create({
                data: {
                    name: `Product ${i + 1}`,
                    description: `Description for product ${i + 1}`,
                    price: parseFloat((Math.random() * 100).toFixed(2)),
                    categoryid: category.id,
                    imageUrl: `https://picsum.photos/200/300?random=${i}`,
                    images: [
                        `https://picsum.photos/200/300?random=${i}1`,
                        `https://picsum.photos/200/300?random=${i}2`
                    ],
                    inStock: Math.random() > 0.2,
                    inNew: Math.random() > 0.5,
                    isFeatured: Math.random() > 0.8,
                    variants: {
                        create: selectedColors.map(color => ({
                            colorId: color.id,
                            size: "M", // Defaulting to 'M' for simplicity
                            quantity: Math.floor(Math.random() * 50) + 1
                        }))
                    }
                }
            });
        })
    );

    console.log("Seeded 30 products successfully.");
}

seedProducts()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
