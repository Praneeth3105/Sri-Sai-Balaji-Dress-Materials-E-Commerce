import FilterSidebar from "@/components/FilterSidebar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";

const items = [
  { label: "Price: Low to High", value: "lowtoHigh" },
  { label: "Price: High to Low", value: "highToLow" },
];

const Products = () => {
  const { product } = useSelector((store) => store.product);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 99999]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const getAllProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8000/api/v1/product/getallproducts",
      );

      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  console.log(allProducts);

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto flex gap-7 font-serif">
        {/* Sidebar */}
        <FilterSidebar
          search={search}
          setSearch={setSearch}
          brand={brand}
          setBrand={setBrand}
          category={category}
          setCategory={setCategory}
          allProducts={allProducts}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        {/* Main Product Section */}
        <div className="flex flex-col flex-1">
          {/* Sort */}
          <div className="flex justify-end mb-4">
            <Select items={items}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Sort By Price" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <ProductCard key={index} loading={true} />
                ))
              : allProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loading={false}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
