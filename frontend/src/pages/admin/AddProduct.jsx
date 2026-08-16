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
import { setProducts } from "@/redux/productSlice";
import { Input } from "@base-ui/react";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice ", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("Please Select Alteast One Image");
      return;
    }
    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setProducts([...Products, res.data.product]));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-[350px] py-20 pr-20 mx-auto px-4 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-4xl mx-auto my-10 shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="border-b bg-white rounded-t-xl px-8 py-6">
          <CardTitle className="text-3xl font-bold font-serif text-gray-800">
            Add Product
          </CardTitle>

          <CardDescription className="text-gray-500 font-serif mt-1">
            Enter Product Details Below
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 py-8 bg-white rounded-b-xl">
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold font-serif text-gray-700">
                Product Name
              </Label>

              <Input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="Example - Saree"
                required
                className="h-11 rounded-lg border border-gray-300 px-4 font-serif text-gray-800 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold font-serif text-gray-700">
                Price
              </Label>

              <Input
                value={productData.productPrice}
                onChange={handleChange}
                type="number"
                name="productPrice"
                placeholder=""
                required
                className="h-11 rounded-lg border border-gray-300 px-4 font-serif text-gray-800 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-semibold font-serif text-gray-700">
                  Brand
                </Label>

                <Input
                  value={productData.brand}
                  onChange={handleChange}
                  type="text"
                  name="brand"
                  placeholder="Example - Biba"
                  required
                  className="h-11 rounded-lg border border-gray-300 px-4 font-serif text-gray-800 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-semibold font-serif text-gray-700">
                  Category
                </Label>

                <Input
                  value={productData.category}
                  onChange={handleChange}
                  type="text"
                  name="category"
                  placeholder="Example - Saree/Material"
                  required
                  className="h-11 rounded-lg border border-gray-300 px-4 font-serif text-gray-800 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label className="text-sm font-semibold font-serif text-gray-700">
                  Description
                </Label>
              </div>

              <Textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handleChange}
                placeholder="Enter Brief Description of Product"
                className="min-h-[120px] resize-none rounded-lg border border-gray-300 px-4 py-3 font-serif text-gray-800 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>
            <ImageUpload
              productData={productData}
              setProductData={setProductData}
            />
          </div>
          <CardFooter className="flex-col gap-2 pt-6">
            <Button
              disabled={loading}
              onClick={submitHandler}
              className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-serif font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              type="submit"
            >
              {
                loading?<span className="flex gap-1 items-center"><Loader2 className="animate-spin"/>Please Wait</span>:"Add Product"
             }
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
