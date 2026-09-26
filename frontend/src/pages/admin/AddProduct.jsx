import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { setProducts } from "@/redux/productSlice";

import axios from "axios";

import {
  Loader2,
  PackagePlus,
  Sparkles,
  ImagePlus,
  IndianRupee,
  Tag,
  Layers3,
  FileText,
  Plus,
  X,
} from "lucide-react";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "Free Size",
];

const createEmptyVariant = () => ({
  color: "",
  images: [],
  sizes: [],
  sizeStock: [],
  customSize: "",
});

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const { products } = useSelector((store) => store.product);

  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    brand: "",
    category: "",
    variants: [createEmptyVariant()],
  });

  // =========================================================
  // HANDLE BASIC INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // VARIANT INPUT
  // =========================================================

  const updateVariant = (index, changes) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...changes } : variant,
      ),
    }));
  };

  const handleVariantColorChange = (index, value) => {
    updateVariant(index, { color: value });
  };

  const handleVariantImages = (index, e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    updateVariant(index, {
      images: [...(productData.variants[index]?.images || []), ...files],
    });

    e.target.value = "";
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const variant = productData.variants[variantIndex];

    updateVariant(variantIndex, {
      images: variant.images.filter((_, index) => index !== imageIndex),
    });
  };

  const toggleSize = (variantIndex, size) => {
    const variant = productData.variants[variantIndex];
    const exists = variant.sizes.includes(size);

    if (exists) {
      updateVariant(variantIndex, {
        sizes: variant.sizes.filter((item) => item !== size),
        sizeStock: (variant.sizeStock || []).filter(
          (item) => item.size !== size,
        ),
      });
      return;
    }

    updateVariant(variantIndex, {
      sizes: [...variant.sizes, size],
      sizeStock: [...(variant.sizeStock || []), { size, quantity: 0 }],
    });
  };

  const handleCustomSizeChange = (variantIndex, value) => {
    updateVariant(variantIndex, {
      customSize: value,
    });
  };

  const addCustomSize = (variantIndex) => {
    const variant = productData.variants[variantIndex];
    const customSize = String(variant.customSize || "").trim();

    if (!customSize) return;

    const alreadyExists = variant.sizes.some(
      (size) => size.toLowerCase() === customSize.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error("This size is already selected");
      return;
    }

    updateVariant(variantIndex, {
      sizes: [...variant.sizes, customSize],
      sizeStock: [
        ...(variant.sizeStock || []),
        { size: customSize, quantity: 0 },
      ],
      customSize: "",
    });
  };

  const handleStockChange = (variantIndex, size, value) => {
    updateVariant(variantIndex, {
      sizeStock: (productData.variants[variantIndex]?.sizeStock || []).map(
        (item) =>
          item.size === size
            ? { ...item, quantity: Math.max(0, Number(value) || 0) }
            : item,
      ),
    });
  };

  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  };

  const removeVariant = (index) => {
    if (productData.variants.length === 1) {
      toast.error("At least one color variant is required");
      return;
    }

    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.filter(
        (_, variantIndex) => variantIndex !== index,
      ),
    }));
  };

  // =========================================================
  // SUBMIT PRODUCT
  // =========================================================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !productData.productName ||
      !productData.productPrice ||
      !productData.productDesc ||
      !productData.brand ||
      !productData.category
    ) {
      toast.error("Please fill all product details");
      return;
    }

    if (!productData.variants.length) {
      toast.error("Please add at least one color variant");
      return;
    }

    const normalizedColors = productData.variants.map((variant) =>
      String(variant.color || "")
        .trim()
        .toLowerCase(),
    );

    if (normalizedColors.some((color) => !color)) {
      toast.error("Please enter a color for every variant");
      return;
    }

    if (new Set(normalizedColors).size !== normalizedColors.length) {
      toast.error("Each color can be added only once");
      return;
    }

    if (productData.variants.some((variant) => variant.images.length === 0)) {
      toast.error("Please upload at least one image for every color");
      return;
    }

    const formData = new FormData();

    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    let globalImageIndex = 0;

    const variantMeta = productData.variants.map((variant) => {
      const imageIndexes = [];

      variant.images.forEach((image) => {
        formData.append("files", image);
        imageIndexes.push(globalImageIndex);
        globalImageIndex += 1;
      });

      return {
        color: variant.color.trim(),
        sizes: variant.sizes,
        sizeStock: (variant.sizeStock || []).map((item) => ({
          size: item.size,
          quantity: Math.max(0, Number(item.quantity) || 0),
        })),
        imageIndexes,
      };
    });

    formData.append("variants", JSON.stringify(variantMeta));

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setProducts([...(products || []), res.data.product]));

        toast.success("Product Added Successfully");

        setProductData({
          productName: "",
          productPrice: 0,
          productDesc: "",
          brand: "",
          category: "",
          variants: [createEmptyVariant()],
        });
      }
    } catch (error) {
      console.log("Add Product Error:", error);

      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028] pl-0 md:pl-[300px] pt-[125px] pb-24">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#ead8bd]/30 blur-3xl" />

        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-[#ead6d0]/20 blur-3xl" />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#a78352]" strokeWidth={1.5} />

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
              Product Studio
            </span>
          </div>

          <h1 className="font-[Cormorant_Garamond] text-5xl md:text-6xl text-[#382b24] leading-none">
            Add New
            <span className="italic text-[#a78352]"> Product</span>
          </h1>

          <div className="w-12 h-px bg-[#b99a6b] mt-5 mb-4" />

          <p className="text-sm text-[#7b6d64] max-w-xl">
            Create a beautiful product listing for your boutique collection.
          </p>
        </div>

        {/* ===================================================
            FORM
        ==================================================== */}

        <Card className="w-full bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] shadow-sm overflow-hidden">
          <CardHeader className="bg-[#eee5da] border-b border-[#e2d5c5] px-6 md:px-8 py-7">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#fffdf9] border border-[#d8c6ad] flex items-center justify-center">
                <PackagePlus
                  className="w-5 h-5 text-[#a78352]"
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <CardTitle className="font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                  Product Details
                </CardTitle>

                <CardDescription className="text-xs text-[#7b6d64] mt-1">
                  Enter the details below to add a new product.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 md:px-8 py-8">
            <div className="flex flex-col gap-7">
              {/* PRODUCT NAME */}
              <div className="grid gap-2">
                <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                  Product Name
                </Label>

                <Input
                  type="text"
                  name="productName"
                  value={productData.productName}
                  onChange={handleChange}
                  placeholder="Example - Floral Cotton Dress Material"
                  required
                  className="h-12 rounded-xl border-[#ded1c2] bg-[#faf7f2] px-4 text-sm text-[#44352c] focus-visible:border-[#b99a6b] focus-visible:ring-[#b99a6b]"
                />
              </div>

              {/* PRICE */}
              <div className="grid gap-2">
                <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                  Price
                </Label>

                <div className="relative">
                  <IndianRupee
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78352]"
                    strokeWidth={1.5}
                  />

                  <Input
                    value={productData.productPrice}
                    onChange={handleChange}
                    type="number"
                    name="productPrice"
                    placeholder="Enter price"
                    min="0"
                    required
                    className="h-12 pl-10 rounded-xl border-[#ded1c2] bg-[#faf7f2] text-[#44352c] focus-visible:border-[#b99a6b] focus-visible:ring-[#b99a6b]"
                  />
                </div>
              </div>

              {/* BRAND / CATEGORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                    Brand
                  </Label>

                  <div className="relative">
                    <Tag
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78352]"
                      strokeWidth={1.5}
                    />

                    <Input
                      value={productData.brand}
                      onChange={handleChange}
                      type="text"
                      name="brand"
                      placeholder="Example - Biba"
                      required
                      className="h-12 pl-10 rounded-xl border-[#ded1c2] bg-[#faf7f2] text-[#44352c] focus-visible:border-[#b99a6b] focus-visible:ring-[#b99a6b]"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                    Category
                  </Label>

                  <div className="relative">
                    <Layers3
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78352]"
                      strokeWidth={1.5}
                    />

                    <Input
                      value={productData.category}
                      onChange={handleChange}
                      type="text"
                      name="category"
                      placeholder="Example - Saree / Material"
                      required
                      className="h-12 pl-10 rounded-xl border-[#ded1c2] bg-[#faf7f2] text-[#44352c] focus-visible:border-[#b99a6b] focus-visible:ring-[#b99a6b]"
                    />
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                    Description
                  </Label>

                  <FileText
                    className="w-4 h-4 text-[#b99a6b]"
                    strokeWidth={1.5}
                  />
                </div>

                <Textarea
                  name="productDesc"
                  value={productData.productDesc}
                  onChange={handleChange}
                  placeholder="Enter a brief description of the product..."
                  className="min-h-[140px] resize-none rounded-xl border-[#ded1c2] bg-[#faf7f2] px-4 py-3 text-sm leading-6 text-[#44352c] focus-visible:border-[#b99a6b] focus-visible:ring-[#b99a6b]"
                />
              </div>

              {/* =================================================
                  COLOR VARIANTS
              ================================================== */}

              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ImagePlus
                      className="w-4 h-4 text-[#a78352]"
                      strokeWidth={1.5}
                    />

                    <div>
                      <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                        Color Variants
                      </Label>

                      <p className="text-xs text-[#8b7d73] mt-1">
                        Each color can have different images and sizes.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={addVariant}
                    variant="outline"
                    className="rounded-full border-[#cdb690] text-[#80644a] hover:bg-[#eee5da] hover:text-[#4a382c] cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Color
                  </Button>
                </div>

                <div className="space-y-5">
                  {productData.variants.map((variant, variantIndex) => (
                    <div
                      key={variantIndex}
                      className="rounded-2xl border border-[#e5d9ca] bg-[#faf7f2] p-5"
                    >
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#a78352] font-semibold">
                            Color Variant {variantIndex + 1}
                          </p>

                          <p className="text-xs text-[#8b7d73] mt-1">
                            Upload only the images belonging to this color.
                          </p>
                        </div>

                        {productData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(variantIndex)}
                            className="w-9 h-9 rounded-full border border-[#dfcfc0] bg-[#fffdf9] text-[#98736b] hover:bg-[#f2e0dc] flex items-center justify-center cursor-pointer"
                            title="Remove color"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* COLOR */}
                      <div className="grid gap-2">
                        <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                          Color Name
                        </Label>

                        <Input
                          value={variant.color}
                          onChange={(e) =>
                            handleVariantColorChange(
                              variantIndex,
                              e.target.value,
                            )
                          }
                          placeholder="Example - Red"
                          className="h-11 rounded-xl border-[#ded1c2] bg-[#fffdf9] text-[#44352c] focus-visible:border-[#b99a6b] focus-visible:ring-[#b99a6b]"
                        />
                      </div>

                      {/* IMAGES */}
                      <div className="grid gap-3 mt-5">
                        <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                          Images for {variant.color || "this color"}
                        </Label>

                        <div className="flex items-center gap-3">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              handleVariantImages(variantIndex, e)
                            }
                            className="h-11 rounded-xl border-[#ded1c2] bg-[#fffdf9] text-sm cursor-pointer"
                          />
                        </div>

                        {variant.images.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                            {variant.images.map((file, imageIndex) => (
                              <div
                                key={imageIndex}
                                className="relative group rounded-xl overflow-hidden border border-[#e3d5c5] bg-[#fffdf9]"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`${variant.color || "Color"} ${imageIndex + 1}`}
                                  className="w-full h-32 object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariantImage(variantIndex, imageIndex)
                                  }
                                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* SIZES */}
                      <div className="grid gap-3 mt-6">
                        <div>
                          <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                            Available Sizes for {variant.color || "this color"}
                          </Label>

                          <p className="text-xs text-[#8b7d73] mt-1">
                            Select only the sizes available in this color.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {SIZE_OPTIONS.map((size) => {
                            const selected = variant.sizes.includes(size);

                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(variantIndex, size)}
                                className="px-4 py-2 rounded-full text-xs border transition-all cursor-pointer"
                                style={{
                                  backgroundColor: selected
                                    ? "#4a382c"
                                    : "#fffdf9",
                                  color: selected ? "#fffdf9" : "#66584f",
                                  borderColor: selected ? "#4a382c" : "#ded1c2",
                                }}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            value={variant.customSize}
                            onChange={(e) =>
                              handleCustomSizeChange(
                                variantIndex,
                                e.target.value,
                              )
                            }
                            placeholder="Custom size (example: 38 / 2.5m)"
                            className="h-10 rounded-xl border-[#ded1c2] bg-[#fffdf9] text-sm text-[#44352c]"
                          />

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addCustomSize(variantIndex)}
                            className="h-10 rounded-xl border-[#cdb690] text-[#80644a] hover:bg-[#eee5da] cursor-pointer"
                          >
                            Add Size
                          </Button>
                        </div>

                        {variant.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {variant.sizes.map((size) => (
                              <span
                                key={size}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eee5da] text-[#66584f] text-xs"
                              >
                                {size}
                                <button
                                  type="button"
                                  onClick={() => toggleSize(variantIndex, size)}
                                  className="cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* STOCK / QUANTITY */}
                        {variant.sizes.length > 0 && (
                          <div className="mt-4 grid gap-3">
                            <div>
                              <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                                Available Quantity for Each Size
                              </Label>
                              <p className="text-xs text-[#8b7d73] mt-1">
                                Enter how many pieces are available for this
                                color and size.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {variant.sizes.map((size) => {
                                const stock =
                                  variant.sizeStock?.find(
                                    (item) =>
                                      String(item.size).toLowerCase() ===
                                      String(size).toLowerCase(),
                                  )?.quantity ?? 0;

                                return (
                                  <div
                                    key={`stock-${variantIndex}-${size}`}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-[#ded1c2] bg-[#fffdf9] px-3 py-2"
                                  >
                                    <span className="text-sm font-medium text-[#66584f]">
                                      {size}
                                    </span>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={stock}
                                      onChange={(e) =>
                                        handleStockChange(
                                          variantIndex,
                                          size,
                                          e.target.value,
                                        )
                                      }
                                      className="w-24 h-9 rounded-lg border-[#ded1c2] bg-white text-center text-sm text-[#44352c]"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 px-6 md:px-8 pb-8 pt-0">
            <div className="w-full border-t border-[#eadfd3] pt-6">
              <Button
                disabled={loading}
                onClick={submitHandler}
                className="w-full h-12 rounded-full bg-[#4a382c] hover:bg-[#35271f] disabled:bg-[#8c7b6e] text-white font-medium shadow-lg shadow-[#4a382c]/10 transition-all duration-300 cursor-pointer"
                type="submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding Product...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <PackagePlus className="w-4 h-4" />
                    Add Product
                  </span>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Brand note */}
        <div className="text-center mt-10 pb-4">
          <p className="font-[Cormorant_Garamond] italic text-lg text-[#9a784e]">
            Style that feels like you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
