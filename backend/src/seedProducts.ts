import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary"; // Ensure you have a Cloudinary utility
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

async function uploadImageToCloudinary(imagePath: string) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "products",
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}

async function seedProducts() {
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  const categoryNames = ["Men", "Woman", "Accessories"];
  const sizes = ["M", "S", "L", "XS"];
  const colorData = [
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#008000" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
  ];

  // Ensure categories exist
  const categories = await Promise.all(
    categoryNames.map(async (name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Ensure colors exist
  const colors = await Promise.all(
    colorData.map(async ({ name, hex }) =>
      prisma.color.upsert({
        where: { name },
        update: {},
        create: { name, hex },
      })
    )
  );

  // 📂 Define Image Paths (Assuming You Have Local Files)
  const localImages = [path.join(__dirname, "image.jpg")];

  const products = await Promise.all(
    Array.from({ length: 10 }, async (_, i) => {
      const category = categories[i % categories.length]; // Assign categories cyclically
      const selectedColors = colors.sort(() => 0.5 - Math.random()).slice(0, 3); // Select up to 3 random colors

      // Upload images and get Cloudinary URLs
      const uploadedImages = await Promise.all(
        localImages.map((imagePath) => uploadImageToCloudinary(imagePath))
      );

      // Filter out failed uploads
      const validImages = uploadedImages.filter((img) => img !== null);

      return prisma.product.create({
        data: {
          name: `Product ${i + 1}`,
          description: `Description for product ${i + 1}`,
          price: parseFloat((Math.random() * 100).toFixed(2)),
          salePrice:
            Math.random() > 0.5
              ? parseFloat((Math.random() * 50).toFixed(2))
              : 0,
          categoryName: category.name,
          mainImage: {
            
          },
          images: {
            createMany: {
              data: validImages,
            },
          }, // Store { url, public_id } format
          inStock: Math.random() > 0.2,
          inNew: Math.random() > 0.5,
          isFeatured: Math.random() > 0.8,
          variants: {
            create: selectedColors.map((color) => ({
              color: {
                connect: { id: color.id },
              },
              size: sizes[Math.floor(Math.random() * sizes.length)],
              quantity: Math.floor(Math.random() * 50) + 1,
            })),
          },
        },
      });
    })
  );

  console.log("Seeded products successfully.");
}

seedProducts()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
