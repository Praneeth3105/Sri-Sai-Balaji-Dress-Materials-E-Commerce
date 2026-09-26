import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2, X, Package, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import axios from "axios";
import { setProducts } from "@/redux/productSlice";
import { toast } from "sonner";

const AdminProduct = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { products } = useSelector((store) => store.product);

  const accessToken = localStorage.getItem("accessToken");

  const normalizeEditVariants = (variants = []) =>
    variants.map((variant) => {
      const sizes = Array.isArray(variant?.sizes) ? variant.sizes : [];

      return {
        ...variant,
        color: variant?.color || "",
        sizes,
        images: Array.isArray(variant?.images) ? variant.images : [],
        newImages: [],
        sizeStock: sizes.map((size) => {
          const existing = (variant?.sizeStock || []).find(
            (item) =>
              String(item?.size || "")
                .trim()
                .toLowerCase() === String(size).trim().toLowerCase(),
          );

          return {
            size,
            quantity: Math.max(0, Number(existing?.quantity ?? 1) || 0),
          };
        }),
      };
    });

  const createEmptyVariant = () => ({
    color: "",
    sizes: [],
    sizeStock: [],
    images: [],
    newImages: [],
  });

  const updateVariant = (variantIndex, changes) => {
    setEditProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((variant, index) =>
        index === variantIndex ? { ...variant, ...changes } : variant,
      ),
    }));
  };

  const handleVariantColorChange = (variantIndex, value) => {
    updateVariant(variantIndex, { color: value });
  };

  const handleVariantSizesChange = (variantIndex, value) => {
    const sizes = [
      ...new Set(
        value
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),
      ),
    ];

    setEditProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((variant, index) => {
        if (index !== variantIndex) return variant;

        const oldStock = variant.sizeStock || [];

        return {
          ...variant,
          sizes,
          sizeStock: sizes.map((size) => {
            const existing = oldStock.find(
              (item) =>
                String(item?.size || "")
                  .trim()
                  .toLowerCase() === size.toLowerCase(),
            );

            return {
              size,
              quantity: Math.max(0, Number(existing?.quantity ?? 1) || 0),
            };
          }),
        };
      }),
    }));
  };

  const updateEditVariantStock = (variantIndex, size, value) => {
    setEditProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              sizeStock: (variant.sizeStock || []).map((item) =>
                item.size === size
                  ? { ...item, quantity: Math.max(0, Number(value) || 0) }
                  : item,
              ),
            }
          : variant,
      ),
    }));
  };

  const handleVariantImageChange = (variantIndex, e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setEditProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              newImages: [...(variant.newImages || []), ...files],
            }
          : variant,
      ),
    }));

    e.target.value = "";
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setEditProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              images: (variant.images || []).filter((_, i) => i !== imageIndex),
            }
          : variant,
      ),
    }));
  };

  const removeVariantNewImage = (variantIndex, imageIndex) => {
    setEditProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              newImages: (variant.newImages || []).filter(
                (_, i) => i !== imageIndex,
              ),
            }
          : variant,
      ),
    }));
  };

  const addVariant = () => {
    setEditProduct((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), createEmptyVariant()],
    }));
  };

  const removeVariant = (variantIndex) => {
    setEditProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).filter(
        (_, index) => index !== variantIndex,
      ),
    }));
  };

  const items = [
    {
      label: "Price: Low To High",
      value: "lowToHigh",
    },
    {
      label: "Price: High To Low",
      value: "highToLow",
    },
  ];

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredProducts = useMemo(() => {
    let result =
      products?.filter((product) =>
        product?.productName?.toLowerCase().includes(search.toLowerCase()),
      ) || [];

    result = [...result];

    if (sort === "lowToHigh") {
      result.sort((a, b) => Number(a.productPrice) - Number(b.productPrice));
    }

    if (sort === "highToLow") {
      result.sort((a, b) => Number(b.productPrice) - Number(a.productPrice));
    }

    return result;
  }, [products, search, sort]);

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEdit = (product) => {
    setEditProduct({
      ...product,

      productName: product.productName || "",
      productPrice: product.productPrice || "",
      productDesc: product.productDesc || "",
      category: product.category || "",
      brand: product.brand || "",

      productImage: product.productImage || [],
      variants: normalizeEditVariants(product.variants || []),
    });

    setOpen(true);
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD IMAGES
  // =====================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    setEditProduct((prev) => ({
      ...prev,
      productImage: [...(prev.productImage || []), ...files],
    }));

    e.target.value = "";
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = (index) => {
    setEditProduct((prev) => ({
      ...prev,

      productImage: prev.productImage.filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editProduct) {
      return;
    }

    if (
      !editProduct.productName ||
      !editProduct.productPrice ||
      !editProduct.productDesc ||
      !editProduct.category ||
      !editProduct.brand
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("productName", editProduct.productName);

      formData.append("productDesc", editProduct.productDesc);

      formData.append("productPrice", editProduct.productPrice);

      formData.append("category", editProduct.category);

      formData.append("brand", editProduct.brand);

      // Build variants and remember which uploaded files belong to each color.
      let fileIndex = 0;
      const variantPayload = (editProduct.variants || []).map((variant) => {
        const imageIndexes = [];

        (variant.newImages || []).forEach((file) => {
          formData.append("files", file);
          imageIndexes.push(fileIndex);
          fileIndex += 1;
        });

        return {
          color: String(variant.color || "").trim(),
          sizes: variant.sizes || [],
          sizeStock: (variant.sizeStock || []).map((item) => ({
            size: item.size,
            quantity: Math.max(0, Number(item.quantity) || 0),
          })),
          images: (variant.images || []).filter((img) => img?.public_id),
          imageIndexes,
        };
      });

      if (!variantPayload.length) {
        toast.error("Please add at least one color variant");
        setLoading(false);
        return;
      }

      formData.append("variants", JSON.stringify(variantPayload));

      // Existing common product images (used only for products without variants).
      const existingImages =
        editProduct.productImage
          ?.filter((img) => !(img instanceof File) && img?.public_id)
          .map((img) => img.public_id) || [];

      formData.append("existingImages", JSON.stringify(existingImages));

      // Backward compatibility for products that still use common images.
      if ((editProduct.variants || []).length === 0) {
        editProduct.productImage
          ?.filter((img) => img instanceof File)
          .forEach((file) => {
            formData.append("files", file);
          });
      }

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product Updated Successfully");

        const updatedProduct = res.data.product;

        const updatedProducts = products.map((product) =>
          product._id === editProduct._id ? updatedProduct : product,
        );

        dispatch(setProducts(updatedProducts));

        setOpen(false);
        setEditProduct(null);
      }
    } catch (error) {
      console.error("Update Product Error:", error);

      toast.error(error?.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProductHandler = async (productId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product Deleted Successfully");

        const remainingProducts = products.filter(
          (product) => product._id !== productId,
        );

        dispatch(setProducts(remainingProducts));
      }
    } catch (error) {
      console.error("Delete Product Error:", error);

      toast.error(error?.response?.data?.message || "Failed to delete product");
    }
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEdit = () => {
    if (loading) return;

    setOpen(false);
    setEditProduct(null);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f4ee] md:pl-[300px] pt-[130px]">
      <div className="px-5 sm:px-8 lg:px-10 pb-14">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mb-2">
                Collection Management
              </p>

              <h1 className="font-[Cormorant_Garamond] text-5xl sm:text-6xl leading-none text-[#35271f]">
                Our <span className="italic text-[#a78352]">Products</span>
              </h1>

              <p className="font-[DM_Sans] text-sm text-[#7b6d64] mt-4 max-w-xl">
                Manage your boutique collection, update product information and
                maintain your product catalogue.
              </p>

              <div className="w-14 h-px bg-[#b99a6b] mt-6" />
            </div>

            {/* PRODUCT COUNT */}

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#eee5da] flex items-center justify-center">
                <Package className="w-5 h-5 text-[#a78352]" strokeWidth={1.5} />
              </div>

              <div>
                <p className="font-[Cormorant_Garamond] text-2xl text-[#4a382c] leading-none">
                  {products?.length || 0}
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#9a8a7e] mt-1">
                  Total Products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SEARCH + SORT BAR
        ================================================= */}

        <div className="rounded-2xl border border-[#e5d9ca] bg-[#fffdf9] p-4 sm:p-5 mb-7 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* SEARCH */}

            <div className="relative w-full lg:max-w-xl">
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border-[#e5d9ca]
                  bg-[#f8f4ee]
                  pl-11
                  pr-10
                  text-[#4a382c]
                  placeholder:text-[#a99a8f]
                  focus-visible:ring-[#b99a6b]
                  font-[DM_Sans]
                "
              />

              <Search
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  w-4
                  h-4
                  text-[#a78352]
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    w-7
                    h-7
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-[#8c7d72]
                    hover:bg-[#eee5da]
                    cursor-pointer
                  "
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* SORT */}

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger
                className="
                  w-full
                  lg:w-[230px]
                  h-12
                  rounded-xl
                  border-[#e5d9ca]
                  bg-[#f8f4ee]
                  text-[#4a382c]
                  font-[DM_Sans]
                  focus:ring-[#b99a6b]
                "
              >
                <SelectValue placeholder="Sort By Price" />
              </SelectTrigger>

              <SelectContent className="border-[#e5d9ca] bg-[#fffdf9]">
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="font-[DM_Sans] text-[#4a382c]"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* RESULT INFO */}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#eee5da]">
            <p className="text-xs text-[#8b7c72] font-[DM_Sans]">
              Showing{" "}
              <span className="font-semibold text-[#4a382c]">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            {(search || sort) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSort("");
                }}
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
                  font-semibold
                  text-[#a78352]
                  hover:text-[#4a382c]
                  transition
                  cursor-pointer
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const image = product?.productImage?.[0]?.url || "";

              return (
                <Card
                  key={product?._id}
                  className="
                    group
                    border
                    border-[#e5d9ca]
                    bg-[#fffdf9]
                    rounded-2xl
                    shadow-none
                    hover:shadow-md
                    hover:border-[#d7c5ae]
                    transition-all
                    duration-300
                    overflow-hidden
                  "
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                      {/* IMAGE */}

                      <div
                        className="
                        relative
                        w-full
                        md:w-[110px]
                        h-[150px]
                        md:h-[110px]
                        rounded-xl
                        overflow-hidden
                        bg-[#eee5da]
                        flex-shrink-0
                      "
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={product?.productName || "Product"}
                            className="
                              w-full
                              h-full
                              object-cover
                              group-hover:scale-105
                              transition-transform
                              duration-500
                            "
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <Package
                              className="w-7 h-7 text-[#b99a7a]"
                              strokeWidth={1.3}
                            />

                            <span className="text-[10px] text-[#9b8d82] mt-2">
                              No Image
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                      </div>

                      {/* PRODUCT INFORMATION */}

                      <div className="flex-1 min-w-0">
                        <p
                          className="
                          text-[9px]
                          uppercase
                          tracking-[0.2em]
                          text-[#a78352]
                          font-semibold
                          mb-2
                        "
                        >
                          {product?.category || "Collection"}
                        </p>

                        <h2
                          className="
                          font-[Cormorant_Garamond]
                          text-2xl
                          sm:text-3xl
                          leading-tight
                          text-[#4a382c]
                          truncate
                        "
                        >
                          {product?.productName || "Unnamed Product"}
                        </h2>

                        <p
                          className="
                          text-xs
                          text-[#8b7c72]
                          mt-2
                          line-clamp-2
                          max-w-2xl
                          font-[DM_Sans]
                        "
                        >
                          {product?.productDesc || "No description available."}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          <span
                            className="
                            px-3
                            py-1.5
                            rounded-full
                            bg-[#f0e7dc]
                            text-[10px]
                            uppercase
                            tracking-[0.12em]
                            text-[#6c5748]
                            font-semibold
                          "
                          >
                            {product?.brand || "Sri Sai Balaji"}
                          </span>

                          <span
                            className="
                            text-xl
                            font-[Cormorant_Garamond]
                            font-semibold
                            text-[#a78352]
                          "
                          >
                            ₹
                            {Number(product?.productPrice || 0).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div
                        className="
                        flex
                        md:flex-col
                        items-center
                        justify-end
                        gap-2
                        md:pl-4
                        md:border-l
                        md:border-[#eee5da]
                      "
                      >
                        {/* EDIT */}

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleEdit(product)}
                          className="
                            w-10
                            h-10
                            rounded-full
                            text-[#8c7357]
                            hover:text-[#4a382c]
                            hover:bg-[#eee5da]
                            cursor-pointer
                          "
                        >
                          <Edit className="w-4 h-4" strokeWidth={1.6} />
                        </Button>

                        {/* DELETE */}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="
                                w-10
                                h-10
                                rounded-full
                                text-[#a47b70]
                                hover:text-[#8e4e43]
                                hover:bg-[#f3e4df]
                                cursor-pointer
                              "
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.6} />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent className="rounded-2xl border-[#e5d9ca] bg-[#fffdf9]">
                            <AlertDialogHeader>
                              <AlertDialogTitle
                                className="
                                font-[Cormorant_Garamond]
                                text-3xl
                                text-[#4a382c]
                              "
                              >
                                Delete Product?
                              </AlertDialogTitle>

                              <AlertDialogDescription
                                className="
                                text-sm
                                leading-6
                                text-[#7b6d64]
                                font-[DM_Sans]
                              "
                              >
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-[#4a382c]">
                                  {product?.productName}
                                </span>
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className="
                                  rounded-xl
                                  border-[#e5d9ca]
                                  bg-[#f8f4ee]
                                  text-[#4a382c]
                                  hover:bg-[#eee5da]
                                "
                              >
                                Cancel
                              </AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() =>
                                  deleteProductHandler(product._id)
                                }
                                className="
                                  rounded-xl
                                  bg-[#4a382c]
                                  hover:bg-[#35271f]
                                  text-white
                                "
                              >
                                Delete Product
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            /* EMPTY STATE */

            <div
              className="
              rounded-2xl
              border
              border-dashed
              border-[#d9cabb]
              bg-[#fffdf9]
              py-20
              px-6
              text-center
            "
            >
              <div
                className="
                w-16
                h-16
                mx-auto
                rounded-full
                bg-[#eee5da]
                flex
                items-center
                justify-center
              "
              >
                <Package className="w-7 h-7 text-[#a78352]" strokeWidth={1.3} />
              </div>

              <h2
                className="
                mt-5
                font-[Cormorant_Garamond]
                text-3xl
                text-[#4a382c]
              "
              >
                No Products Found
              </h2>

              <p
                className="
                mt-2
                text-sm
                text-[#8b7c72]
                font-[DM_Sans]
              "
              >
                Try changing your search or sorting options.
              </p>

              {(search || sort) && (
                <Button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSort("");
                  }}
                  className="
                    mt-6
                    rounded-xl
                    bg-[#4a382c]
                    hover:bg-[#35271f]
                    text-white
                    px-6
                  "
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* =================================================
            EDIT PRODUCT DIALOG
        ================================================= */}

        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);

            if (!value && !loading) {
              setEditProduct(null);
            }
          }}
        >
          <DialogContent
            className="
            w-[calc(100%-2rem)]
            max-w-2xl
            max-h-[90vh]
            overflow-y-auto
            rounded-2xl
            border-[#e5d9ca]
            bg-[#fffdf9]
            p-0
          "
          >
            <DialogHeader className="px-6 pt-6 pb-5 border-b border-[#eadfd3]">
              <p
                className="
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-[#a78352]
                font-semibold
              "
              >
                Product Studio
              </p>

              <DialogTitle
                className="
                font-[Cormorant_Garamond]
                text-4xl
                text-[#4a382c]
                mt-1
              "
              >
                Edit Product
              </DialogTitle>

              <DialogDescription
                className="
                text-sm
                text-[#7b6d64]
                font-[DM_Sans]
              "
              >
                Update product details and manage product images.
              </DialogDescription>
            </DialogHeader>

            {editProduct && (
              <form onSubmit={handleSave} className="px-6 py-6 space-y-6">
                {/* PRODUCT NAME */}

                <div className="grid gap-2">
                  <label
                    className="
                    text-[10px]
                    uppercase
                    tracking-[0.16em]
                    font-semibold
                    text-[#6d5d52]
                  "
                  >
                    Product Name
                  </label>

                  <Input
                    name="productName"
                    value={editProduct.productName}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="
                      h-12
                      rounded-xl
                      border-[#e5d9ca]
                      bg-[#f8f4ee]
                      text-[#4a382c]
                      focus-visible:ring-[#b99a6b]
                      font-[DM_Sans]
                    "
                  />
                </div>

                {/* PRICE */}

                <div className="grid gap-2">
                  <label
                    className="
                    text-[10px]
                    uppercase
                    tracking-[0.16em]
                    font-semibold
                    text-[#6d5d52]
                  "
                  >
                    Product Price
                  </label>

                  <Input
                    name="productPrice"
                    type="number"
                    value={editProduct.productPrice}
                    onChange={handleChange}
                    placeholder="Product Price"
                    className="
                      h-12
                      rounded-xl
                      border-[#e5d9ca]
                      bg-[#f8f4ee]
                      text-[#4a382c]
                      focus-visible:ring-[#b99a6b]
                      font-[DM_Sans]
                    "
                  />
                </div>

                {/* CATEGORY + BRAND */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <label
                      className="
                      text-[10px]
                      uppercase
                      tracking-[0.16em]
                      font-semibold
                      text-[#6d5d52]
                    "
                    >
                      Category
                    </label>

                    <Input
                      name="category"
                      value={editProduct.category}
                      onChange={handleChange}
                      placeholder="Category"
                      className="
                        h-12
                        rounded-xl
                        border-[#e5d9ca]
                        bg-[#f8f4ee]
                        text-[#4a382c]
                        focus-visible:ring-[#b99a6b]
                        font-[DM_Sans]
                      "
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      className="
                      text-[10px]
                      uppercase
                      tracking-[0.16em]
                      font-semibold
                      text-[#6d5d52]
                    "
                    >
                      Brand
                    </label>

                    <Input
                      name="brand"
                      value={editProduct.brand}
                      onChange={handleChange}
                      placeholder="Brand"
                      className="
                        h-12
                        rounded-xl
                        border-[#e5d9ca]
                        bg-[#f8f4ee]
                        text-[#4a382c]
                        focus-visible:ring-[#b99a6b]
                        font-[DM_Sans]
                      "
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="grid gap-2">
                  <label
                    className="
                    text-[10px]
                    uppercase
                    tracking-[0.16em]
                    font-semibold
                    text-[#6d5d52]
                  "
                  >
                    Description
                  </label>

                  <Textarea
                    name="productDesc"
                    value={editProduct.productDesc}
                    onChange={handleChange}
                    placeholder="Product Description"
                    className="
                      min-h-[120px]
                      resize-none
                      rounded-xl
                      border-[#e5d9ca]
                      bg-[#f8f4ee]
                      text-[#4a382c]
                      focus-visible:ring-[#b99a6b]
                      font-[DM_Sans]
                    "
                  />
                </div>

                {/* COLOR / SIZE / STOCK / IMAGES VARIANTS */}

                <div className="grid gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#6d5d52]">
                        Color / Images / Sizes / Stock
                      </label>

                      <p className="text-xs text-[#93857a] mt-1">
                        Edit each color separately. Every color can have
                        different images, sizes and stock.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={addVariant}
                      className="rounded-xl bg-[#4a382c] hover:bg-[#35271f] text-white shrink-0"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Color
                    </Button>
                  </div>

                  {(editProduct.variants || []).map((variant, variantIndex) => (
                    <div
                      key={variant._id || `variant-${variantIndex}`}
                      className="rounded-2xl border border-[#e5d9ca] bg-[#f8f4ee] p-4 sm:p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                        <div className="grid gap-2 flex-1">
                          <label className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#6d5d52]">
                            Color {variantIndex + 1}
                          </label>
                          <Input
                            value={variant.color || ""}
                            onChange={(e) =>
                              handleVariantColorChange(
                                variantIndex,
                                e.target.value,
                              )
                            }
                            placeholder="Example: Red"
                            className="h-11 rounded-xl border-[#e5d9ca] bg-white text-[#4a382c] focus-visible:ring-[#b99a6b] font-[DM_Sans]"
                          />
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeVariant(variantIndex)}
                          className="h-11 rounded-xl border-[#e5d9ca] bg-white text-[#8e4e43] hover:bg-[#f3e4df]"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove Color
                        </Button>
                      </div>

                      {/* COLOR-SPECIFIC IMAGES */}
                      <div className="grid gap-3 mb-5">
                        <label className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#6d5d52]">
                          {variant.color || "Color"} Images
                        </label>

                        <input
                          id={`variant-images-${editProduct._id}-${variantIndex}`}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) =>
                            handleVariantImageChange(variantIndex, e)
                          }
                        />

                        <label
                          htmlFor={`variant-images-${editProduct._id}-${variantIndex}`}
                          className="w-full h-12 flex items-center justify-center gap-2 border border-dashed border-[#cbbba9] rounded-xl bg-white text-[#6d5d52] hover:border-[#a78352] hover:bg-[#eee5da] transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-[#a78352]" />
                          <span className="text-xs uppercase tracking-[0.12em] font-semibold">
                            Add Images for {variant.color || "this color"}
                          </span>
                        </label>

                        {(variant.images?.length > 0 ||
                          variant.newImages?.length > 0) && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(variant.images || []).map((img, imageIndex) => (
                              <div
                                key={`old-${imageIndex}`}
                                className="relative group"
                              >
                                <div className="h-28 w-full rounded-xl overflow-hidden border border-[#e5d9ca] bg-[#eee5da]">
                                  <img
                                    src={img?.url}
                                    alt={`${variant.color || "Color"} ${imageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariantImage(variantIndex, imageIndex)
                                  }
                                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#4a382c] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}

                            {(variant.newImages || []).map(
                              (file, imageIndex) => {
                                const preview = URL.createObjectURL(file);

                                return (
                                  <div
                                    key={`new-${imageIndex}`}
                                    className="relative group"
                                  >
                                    <div className="h-28 w-full rounded-xl overflow-hidden border border-[#e5d9ca] bg-[#eee5da]">
                                      <img
                                        src={preview}
                                        alt={`${variant.color || "Color"} new ${imageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeVariantNewImage(
                                          variantIndex,
                                          imageIndex,
                                        )
                                      }
                                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#4a382c] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        )}
                      </div>

                      {/* COLOR-SPECIFIC SIZES */}
                      <div className="grid gap-3">
                        <label className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#6d5d52]">
                          Available Sizes for {variant.color || "this color"}
                        </label>

                        <Input
                          value={(variant.sizes || []).join(", ")}
                          onChange={(e) =>
                            handleVariantSizesChange(
                              variantIndex,
                              e.target.value,
                            )
                          }
                          placeholder="Example: S, M, L, XL"
                          className="h-11 rounded-xl border-[#e5d9ca] bg-white text-[#4a382c] focus-visible:ring-[#b99a6b] font-[DM_Sans]"
                        />

                        <p className="text-[11px] text-[#93857a]">
                          Enter sizes separated by commas. Example: S, M, L, XL
                        </p>

                        {variant.sizes?.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                            {variant.sizes.map((size) => {
                              const stock =
                                variant.sizeStock?.find(
                                  (item) =>
                                    String(item.size).toLowerCase() ===
                                    String(size).toLowerCase(),
                                )?.quantity ?? 1;

                              return (
                                <div
                                  key={`${variantIndex}-${size}`}
                                  className="flex items-center justify-between gap-3 rounded-xl border border-[#ded1c2] bg-white px-3 py-2"
                                >
                                  <span className="text-sm font-medium text-[#66584f]">
                                    Size: {size}
                                  </span>

                                  <Input
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) =>
                                      updateEditVariantStock(
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
                        )}
                      </div>
                    </div>
                  ))}

                  {(editProduct.variants || []).length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#d9cabb] bg-[#f8f4ee] py-8 px-5 text-center">
                      <p className="text-sm text-[#7b6d64]">
                        No colors added yet. Click <strong>Add Color</strong> to
                        create a color variant.
                      </p>
                    </div>
                  )}
                </div>

                {/* FOOTER */}

                <DialogFooter
                  className="
                  pt-5
                  border-t
                  border-[#eadfd3]
                  flex-col
                  sm:flex-row
                  gap-3
                "
                >
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={closeEdit}
                    className="
                      w-full
                      sm:w-auto
                      h-11
                      rounded-xl
                      border-[#e5d9ca]
                      bg-[#f8f4ee]
                      text-[#4a382c]
                      hover:bg-[#eee5da]
                    "
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      sm:w-auto
                      h-11
                      rounded-xl
                      bg-[#4a382c]
                      hover:bg-[#35271f]
                      text-white
                      px-7
                    "
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminProduct;
