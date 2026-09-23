import ImageUpload from "@/components/ImageUpload";

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
} from "lucide-react";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const { products } = useSelector((store) => store.product);

  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
  });

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
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

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();

    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

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
          productImg: [],
          brand: "",
          category: "",
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
          {/* Header */}
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

          {/* Content */}
          <CardContent className="px-6 md:px-8 py-8">
            <div className="flex flex-col gap-7">
              {/* =================================================
                  PRODUCT NAME
              ================================================== */}

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

              {/* =================================================
                  PRICE
              ================================================== */}

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

              {/* =================================================
                  BRAND / CATEGORY
              ================================================== */}

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

              {/* =================================================
                  DESCRIPTION
              ================================================== */}

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
                  IMAGE UPLOAD
              ================================================== */}

              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <ImagePlus
                    className="w-4 h-4 text-[#a78352]"
                    strokeWidth={1.5}
                  />

                  <Label className="text-[10px] uppercase tracking-wider text-[#6f6259] font-semibold">
                    Product Images
                  </Label>
                </div>

                <div className="rounded-2xl border border-dashed border-[#d8c8b5] bg-[#faf7f2] p-5">
                  <ImageUpload
                    productData={productData}
                    setProductData={setProductData}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          {/* ===================================================
              FOOTER
          ==================================================== */}

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
