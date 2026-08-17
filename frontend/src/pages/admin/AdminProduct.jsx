import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2, X } from "lucide-react";
import React, { useState } from "react";

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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import axios from "axios";
import { setProducts } from "@/redux/productSlice";
import { toast } from "sonner";

const AdminProduct = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Edit product
  const [editProduct, setEditProduct] = useState(null);

  // Dialog open/close
  const [open, setOpen] = useState(false);

  // Loading
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { products } = useSelector((store) => store.product);

  const accessToken = localStorage.getItem("accessToken");

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

  // =========================
  // SEARCH
  // =========================

  let filteredProducts =
    products?.filter((product) =>
      product?.productName?.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  // =========================
  // SORT
  // =========================

  if (sort === "lowToHigh") {
    filteredProducts.sort(
      (a, b) => Number(a.productPrice) - Number(b.productPrice),
    );
  }

  if (sort === "highToLow") {
    filteredProducts.sort(
      (a, b) => Number(b.productPrice) - Number(a.productPrice),
    );
  }

  // =========================
  // OPEN EDIT POPUP
  // =========================

  const handleEdit = (product) => {
    setEditProduct({
      ...product,

      productName: product.productName || "",
      productPrice: product.productPrice || "",
      productDesc: product.productDesc || "",
      category: product.category || "",
      brand: product.brand || "",

      productImage: product.productImage || [],
    });

    // Open popup
    setOpen(true);
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    setEditProduct((prev) => ({
      ...prev,

      productImage: [...(prev.productImage || []), ...files],
    }));

    // Allows selecting the same image again
    e.target.value = "";
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImage = (index) => {
    setEditProduct((prev) => ({
      ...prev,

      productImage: prev.productImage.filter((_, i) => i !== index),
    }));
  };

  // =========================
  // SAVE / UPDATE PRODUCT
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editProduct) {
      return;
    }

    // Validate
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

      // Product details
      formData.append("productName", editProduct.productName);

      formData.append("productDesc", editProduct.productDesc);

      formData.append("productPrice", editProduct.productPrice);

      formData.append("category", editProduct.category);

      formData.append("brand", editProduct.brand);

      // =========================
      // EXISTING IMAGES
      // =========================

      const existingImages =
        editProduct.productImage
          ?.filter((img) => !(img instanceof File) && img?.public_id)
          .map((img) => img.public_id) || [];

      formData.append("existingImages", JSON.stringify(existingImages));

      // =========================
      // NEW IMAGES
      // =========================

      editProduct.productImage
        ?.filter((img) => img instanceof File)
        .forEach((file) => {
          formData.append("files", file);
        });

      console.log("Updating product:", editProduct._id);

      // =========================
      // API REQUEST
      // =========================

      const res = await axios.put(
        `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("Update response:", res.data);

      // =========================
      // SUCCESS
      // =========================

      if (res.data.success) {
        toast.success("Product Updated Successfully");

        const updatedProduct = res.data.product;

        // Update Redux
        const updatedProducts = products.map((product) =>
          product._id === editProduct._id ? updatedProduct : product,
        );

        dispatch(setProducts(updatedProducts));

        // Close popup
        setOpen(false);

        // Clear edit data
        setEditProduct(null);
      }
    } catch (error) {
      console.log("Update Product Error:", error);

      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-[350px] py-20 pr-20 flex flex-col gap-5 min-h-screen bg-gray-100">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex justify-between items-center">
        {/* SEARCH */}

        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[400px] pr-10"
          />

          <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>

        {/* SORT */}

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[200px] bg-white font-serif">
            <SelectValue placeholder="Sort By Price" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup className="font-serif">
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* =========================
          PRODUCTS
      ========================= */}

      <div className="flex flex-col gap-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const image = product?.productImage?.[0]?.url || "";

            return (
              <Card key={product?._id} className="p-4 bg-white">
                <div className="flex items-center gap-5 w-full">
                  {/* IMAGE */}

                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={product?.productName || "Product"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  {/* PRODUCT NAME */}

                  <h2 className="font-semibold text-lg font-serif text-gray-800 w-[250px]">
                    {product?.productName || "Unnamed Product"}
                  </h2>

                  {/* PRICE */}

                  <div className="flex-1 flex justify-center">
                    <h2 className="font-semibold text-gray-800">
                      ₹{product?.productPrice}
                    </h2>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-4">
                    {/* ================= EDIT ================= */}

                    <Dialog
                      open={open && editProduct?._id === product._id}
                      onOpenChange={(value) => {
                        setOpen(value);

                        if (!value) {
                          setEditProduct(null);
                        }
                      }}
                    >
                      {/* EDIT BUTTON */}

                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="p-2 cursor-pointer hover:bg-green-50"
                      >
                        <Edit className="text-green-500 w-5 h-5" />
                      </Button>

                      {/* POPUP */}

                      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-serif text-xl">
                            Edit Product
                          </DialogTitle>

                          <DialogDescription>
                            Update your product details and images.
                          </DialogDescription>
                        </DialogHeader>

                        {editProduct && (
                          <form onSubmit={handleSave} className="space-y-5">
                            {/* PRODUCT NAME */}

                            <div className="grid gap-2">
                              <label className="text-sm font-semibold font-serif text-gray-700">
                                Product Name
                              </label>

                              <Input
                                name="productName"
                                value={editProduct.productName}
                                onChange={handleChange}
                                placeholder="Product Name"
                                className="h-11 font-serif"
                              />
                            </div>

                            {/* PRICE */}

                            <div className="grid gap-2">
                              <label className="text-sm font-semibold font-serif text-gray-700">
                                Product Price
                              </label>

                              <Input
                                name="productPrice"
                                type="number"
                                value={editProduct.productPrice}
                                onChange={handleChange}
                                placeholder="Product Price"
                                className="h-11 font-serif"
                              />
                            </div>

                            {/* CATEGORY */}

                            <div className="grid gap-2">
                              <label className="text-sm font-semibold font-serif text-gray-700">
                                Category
                              </label>

                              <Input
                                name="category"
                                value={editProduct.category}
                                onChange={handleChange}
                                placeholder="Category"
                                className="h-11 font-serif"
                              />
                            </div>

                            {/* BRAND */}

                            <div className="grid gap-2">
                              <label className="text-sm font-semibold font-serif text-gray-700">
                                Brand
                              </label>

                              <Input
                                name="brand"
                                value={editProduct.brand}
                                onChange={handleChange}
                                placeholder="Brand"
                                className="h-11 font-serif"
                              />
                            </div>

                            {/* DESCRIPTION */}

                            <div className="grid gap-2">
                              <label className="text-sm font-semibold font-serif text-gray-700">
                                Description
                              </label>

                              <Textarea
                                name="productDesc"
                                value={editProduct.productDesc}
                                onChange={handleChange}
                                placeholder="Product Description"
                                className="min-h-[100px] resize-none font-serif"
                              />
                            </div>

                            {/* =========================
                                PRODUCT IMAGES
                            ========================= */}

                            <div className="grid gap-3">
                              <label className="text-sm font-semibold font-serif text-gray-700">
                                Product Images
                              </label>

                              {/* FILE INPUT */}

                              <input
                                id={`edit-product-images-${product._id}`}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageChange}
                              />

                              <label
                                htmlFor={`edit-product-images-${product._id}`}
                                className="w-full h-12 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
                              >
                                <span className="font-serif font-semibold text-gray-700">
                                  + Add / Change Images
                                </span>
                              </label>

                              {/* IMAGE PREVIEW */}

                              {editProduct.productImage?.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {editProduct.productImage.map(
                                    (img, index) => {
                                      const preview =
                                        img instanceof File
                                          ? URL.createObjectURL(img)
                                          : img?.url;

                                      return (
                                        <div
                                          key={index}
                                          className="relative group"
                                        >
                                          <div className="h-28 w-full rounded-lg overflow-hidden border bg-gray-100">
                                            <img
                                              src={preview}
                                              alt={`Product ${index + 1}`}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>

                                          {/* REMOVE IMAGE */}

                                          <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              )}

                              <p className="text-xs text-gray-500">
                                Remove existing images and add new images if
                                required.
                              </p>
                            </div>

                            {/* =========================
                                FOOTER
                            ========================= */}

                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                onClick={() => {
                                  setOpen(false);
                                  setEditProduct(null);
                                }}
                              >
                                Cancel
                              </Button>

                              <Button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                {loading ? "Updating..." : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* ================= DELETE ================= */}

                    <Button
                      variant="ghost"
                      type="button"
                      className="p-2 cursor-pointer hover:bg-red-50"
                    >
                      <Trash2 className="text-red-500 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="bg-white rounded-lg p-10 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProduct;
