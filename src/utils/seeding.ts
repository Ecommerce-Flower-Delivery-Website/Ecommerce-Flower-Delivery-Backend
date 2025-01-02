import accessoryModel from "./../models/accessoryModel";
import cartModel from "./../models/cartModel";
import categoryModel from "./../models/categoryModel";
import productModel from "./../models/productModel";
export const seeding = async () => {
  console.log("seeding...");

  const category = await categoryModel.create({
    title: "mobiles",
    image: "/",
    description: "lorem ipsum dolor sit amet",
  });
  category.save();
  const accessory = await accessoryModel.create({
    title: "cover",
    image: "/",
    price: 100,
    description: "lorem ipsum dolor sit amet",
    stock: 10,
  });
  const product = await productModel.create({
    title: "iphone 13 pro",
    accessory_id: accessory.id,
    image: "/",
    price: 800,
    description: "lorem ipsum dolor sit amet",
    stock: 10,
    discount: 0,
    priceAfterDiscount: 800,
    quantity: 1,
    category_id: category.id,
  });
  accessory.products_array.push(product._id);
  accessory.save();
  product.save();
  const cart = await cartModel.findById("677446d18d182f893d6fbfb8");
  if (!cart) return;
  //@ts-expect-error asdasd
  cart.product_array.push(product);
  cart.hasDiscount = true;
  cart.totalAmount = 900;
  cart.save();
  console.log("seeded successfully");
};
