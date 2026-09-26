import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

const parseVariants = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
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
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    const variantMeta = parseVariants(variantsRaw);

    if (variantMeta.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one color variant",
      });
    }

    const colors = variantMeta.map((variant) =>
      String(variant.color || "")
        .trim()
        .toLowerCase(),
    );

    if (colors.some((color) => !color)) {
      return res.status(400).json({
        success: false,
        message: "Every variant must have a color",
      });
    }

    if (new Set(colors).size !== colors.length) {
      return res.status(400).json({
        success: false,
        message: "Each color can be added only once",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select product images",
      });
    }

    const uploadedImages = await uploadFiles(req.files);

    const variants = variantMeta.map((variant) => {
      const imageIndexes = Array.isArray(variant.imageIndexes)
        ? variant.imageIndexes
        : [];

      const images = imageIndexes
        .map((index) => uploadedImages[Number(index)])
        .filter(Boolean);

      if (images.length === 0) {
        throw new Error(`Please add at least one image for ${variant.color}`);
      }

      const sizes = Array.isArray(variant.sizes)
        ? variant.sizes.map((size) => String(size).trim()).filter(Boolean)
        : [];

      return {
        color: String(variant.color).trim(),
        images,
        sizes: [...new Set(sizes)],
      };
    });

    // Keep the existing productImage field populated with the first
    // variant's images so your existing product cards/listing continue working.
    const productImg = variants[0]?.images || uploadedImages;

    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice: Number(productPrice),
      category,
      brand,
      productImage: productImg,
      variants,
    });

    return res.status(200).json({
      success: true,
      message: "Product Added Successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Delete old/common images.
    for (const img of product.productImage || []) {
      if (img?.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Delete variant images without deleting the same Cloudinary image twice.
    const deletedIds = new Set(
      (product.productImage || []).map((img) => img?.public_id).filter(Boolean),
    );

    for (const variant of product.variants || []) {
      for (const img of variant.images || []) {
        if (img?.public_id && !deletedIds.has(img.public_id)) {
          await cloudinary.uploader.destroy(img.public_id);
          deletedIds.add(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice =
      productPrice !== undefined && productPrice !== ""
        ? Number(productPrice)
        : product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;

    if (variantsRaw !== undefined) {
      const variantMeta = parseVariants(variantsRaw);

      if (variantMeta.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please add at least one color variant",
        });
      }

      const colors = variantMeta.map((variant) =>
        String(variant.color || "")
          .trim()
          .toLowerCase(),
      );

      if (colors.some((color) => !color)) {
        return res.status(400).json({
          success: false,
          message: "Every variant must have a color",
        });
      }

      if (new Set(colors).size !== colors.length) {
        return res.status(400).json({
          success: false,
          message: "Each color can be added only once",
        });
      }

      // Upload only the newly selected color-specific images.
      const uploadedImages = await uploadFiles(req.files || []);

      const oldVariantImages = (product.variants || []).flatMap(
        (variant) => variant.images || [],
      );

      const variants = variantMeta.map((variant) => {
        const existingImages = Array.isArray(variant.images)
          ? variant.images.filter((img) => img?.public_id && img?.url)
          : [];

        const imageIndexes = Array.isArray(variant.imageIndexes)
          ? variant.imageIndexes
          : [];

        const newImages = imageIndexes
          .map((index) => uploadedImages[Number(index)])
          .filter(Boolean);

        const images = [...existingImages, ...newImages];

        if (images.length === 0) {
          throw new Error(`Please add at least one image for ${variant.color}`);
        }

        const sizes = Array.isArray(variant.sizes)
          ? [
              ...new Set(
                variant.sizes
                  .map((size) => String(size).trim())
                  .filter(Boolean),
              ),
            ]
          : [];

        const rawStock = Array.isArray(variant.sizeStock)
          ? variant.sizeStock
          : [];

        const sizeStock = sizes.map((size) => {
          const stock = rawStock.find(
            (item) =>
              String(item?.size || "")
                .trim()
                .toLowerCase() === size.toLowerCase(),
          );

          return {
            size,
            quantity: Math.max(0, Number(stock?.quantity ?? 1) || 0),
          };
        });

        return {
          color: String(variant.color).trim(),
          images,
          sizes,
          sizeStock,
        };
      });

      // Delete old Cloudinary variant images that are no longer kept.
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

      // Keep the first color's first image in productImage so existing
      // product cards/listings continue to display an image.
      product.productImage = variants[0]?.images || [];
    } else if (req.files && req.files.length > 0) {
      // Backward compatibility for an old product that has only common images.
      const existingImagesRaw = req.body.existingImages;
      let existingImageIds = [];

      if (existingImagesRaw) {
        try {
          existingImageIds = JSON.parse(existingImagesRaw);
        } catch (error) {
          existingImageIds = [];
        }
      }

      const existingImageMap = new Map(
        (product.productImage || [])
          .filter((img) => img?.public_id)
          .map((img) => [img.public_id, img]),
      );

      const keptImages = existingImageIds
        .map((id) => existingImageMap.get(id))
        .filter(Boolean);

      const keepIds = new Set(existingImageIds);

      for (const img of product.productImage || []) {
        if (img?.public_id && !keepIds.has(img.public_id)) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      const newImages = await uploadFiles(req.files);
      product.productImage = [...keptImages, ...newImages];
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
