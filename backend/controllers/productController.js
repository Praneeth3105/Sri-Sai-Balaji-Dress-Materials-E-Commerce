import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const parseVariants = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    throw new Error("Invalid product variants data");
  }
};

const uploadFiles = async (files = []) => {
  const uploaded = [];

  for (const file of files) {
    const fileUri = getDataUri(file);
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "mern_products",
    });

    uploaded.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  return uploaded;
};

const normalizeVariant = (variant, uploadedImages = []) => {
  const color = String(variant?.color || "").trim();
  const sizes = Array.isArray(variant?.sizes)
    ? [
        ...new Set(
          variant.sizes.map((size) => String(size).trim()).filter(Boolean),
        ),
      ]
    : [];

  const existingImages = Array.isArray(variant?.images)
    ? variant.images.filter((img) => img?.public_id && img?.url)
    : [];

  const imageIndexes = Array.isArray(variant?.imageIndexes)
    ? variant.imageIndexes
    : [];

  const newImages = imageIndexes
    .map((index) => uploadedImages[Number(index)])
    .filter(Boolean);

  const images = [...existingImages, ...newImages];

  const rawStock = Array.isArray(variant?.sizeStock) ? variant.sizeStock : [];
  const sizeStock = sizes.map((size) => {
    const item = rawStock.find(
      (stock) => normalize(stock?.size) === normalize(size),
    );
    return {
      size,
      quantity: Math.max(0, Number(item?.quantity ?? 0) || 0),
    };
  });

  return { color, images, sizes, sizeStock };
};

const validateVariantMeta = (variantMeta) => {
  if (!variantMeta.length) {
    throw new Error("Please add at least one color variant");
  }

  const colors = variantMeta.map((variant) => normalize(variant.color));

  if (colors.some((color) => !color)) {
    throw new Error("Every variant must have a color");
  }

  if (new Set(colors).size !== colors.length) {
    throw new Error("Each color can be added only once");
  }
};

const getSizeQuantity = (variant, size) => {
  const stock = (variant?.sizeStock || []).find(
    (item) => normalize(item?.size) === normalize(size),
  );

  if (stock) return Math.max(0, Number(stock.quantity) || 0);

  const exists = (variant?.sizes || []).some(
    (item) => normalize(item) === normalize(size),
  );

  return exists ? 1 : 0;
};

export const hasAvailableStock = (product) => {
  if (!product?.variants?.length) return true;

  return product.variants.some((variant) =>
    (variant.sizes || []).some((size) => getSizeQuantity(variant, size) > 0),
  );
};

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      variants: variantsRaw,
    } = req.body;
    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }

    const variantMeta = parseVariants(variantsRaw);
    validateVariantMeta(variantMeta);

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please select product images" });
    }

    const uploadedImages = await uploadFiles(req.files);
    const variants = variantMeta.map((variant) =>
      normalizeVariant(variant, uploadedImages),
    );

    for (const variant of variants) {
      if (!variant.images.length) {
        throw new Error(`Please add at least one image for ${variant.color}`);
      }
    }

    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice: Number(productPrice),
      category,
      brand,
      productImage: variants[0]?.images || [],
      variants,
      salesCount: 0,
    });

    return res.status(200).json({
      success: true,
      message: "Product Added Successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableProducts = async (_, res) => {
  try {
    const allProducts = await Product.find().sort({ createdAt: -1 });
    const products = allProducts.filter(hasAvailableStock);
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("GET AVAILABLE PRODUCTS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOutOfStockProducts = async (_, res) => {
  try {
    const allProducts = await Product.find().sort({ updatedAt: -1 });
    const products = allProducts.filter(
      (product) => !hasAvailableStock(product),
    );
    return res
      .status(200)
      .json({ success: true, products, count: products.length });
  } catch (error) {
    console.error("GET OUT OF STOCK PRODUCTS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    const deletedIds = new Set();
    for (const img of product.productImage || []) {
      if (img?.public_id && !deletedIds.has(img.public_id)) {
        await cloudinary.uploader.destroy(img.public_id);
        deletedIds.add(img.public_id);
      }
    }

    for (const variant of product.variants || []) {
      for (const img of variant.images || []) {
        if (img?.public_id && !deletedIds.has(img.public_id)) {
          await cloudinary.uploader.destroy(img.public_id);
          deletedIds.add(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(productId);
    return res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      variants: variantsRaw,
    } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    if (productName !== undefined) product.productName = productName;
    if (productDesc !== undefined) product.productDesc = productDesc;
    if (productPrice !== undefined && productPrice !== "")
      product.productPrice = Number(productPrice);
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;

    if (variantsRaw !== undefined) {
      const variantMeta = parseVariants(variantsRaw);
      validateVariantMeta(variantMeta);

      const uploadedImages = await uploadFiles(req.files || []);
      const oldVariantImages = (product.variants || []).flatMap(
        (variant) => variant.images || [],
      );
      const variants = variantMeta.map((variant) =>
        normalizeVariant(variant, uploadedImages),
      );

      for (const variant of variants) {
        if (!variant.images.length) {
          throw new Error(`Please add at least one image for ${variant.color}`);
        }
      }

      const keptPublicIds = new Set(
        variants.flatMap((variant) =>
          (variant.images || []).map((img) => img?.public_id).filter(Boolean),
        ),
      );

      for (const img of oldVariantImages) {
        if (img?.public_id && !keptPublicIds.has(img.public_id)) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (destroyError) {
            console.error(
              "Failed to remove old variant image:",
              destroyError.message,
            );
          }
        }
      }

      product.variants = variants;
      product.productImage = variants[0]?.images || [];
    } else if (req.files?.length) {
      const existingIds = (() => {
        try {
          return JSON.parse(req.body.existingImages || "[]");
        } catch {
          return [];
        }
      })();

      const existingMap = new Map(
        (product.productImage || [])
          .filter((img) => img?.public_id)
          .map((img) => [img.public_id, img]),
      );
      const keptImages = existingIds
        .map((id) => existingMap.get(id))
        .filter(Boolean);
      const keepIds = new Set(existingIds);

      for (const img of product.productImage || []) {
        if (img?.public_id && !keepIds.has(img.public_id)) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      product.productImage = [...keptImages, ...(await uploadFiles(req.files))];
    }

    const updatedProduct = await product.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Product Updated Successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
