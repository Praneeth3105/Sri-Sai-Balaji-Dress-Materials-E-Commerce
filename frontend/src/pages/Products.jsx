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
  { label: "Price: Low to High", value: "lowToHigh" },
  { label: "Price: High to Low", value: "highToLow" },
];

const Products = () => {
  const { products } = useSelector((store) => store.product);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState([0, 99999]);
  const [sortOrder, setSortOrder] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");

  const dispatch = useDispatch();

  // --------------------------------------------------
  // GET ALL PRODUCTS
  // --------------------------------------------------
  const getAllProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/getavailableproducts`,
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

  // --------------------------------------------------
  // FILTER + SEARCH + SORT
  // --------------------------------------------------
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    // Search
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Brand
    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    // Price
    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );

    // Sorting
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{
        background: "linear-gradient(180deg, #fbf8f2 0%, #f7f1e8 100%)",
      }}
    >
      {/* --------------------------------------------------
          PAGE HEADER
      -------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Small Label */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-px bg-[#b8945a]" />

            <span
              className="text-[11px] tracking-[0.35em] uppercase"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#a47c43",
              }}
            >
              Sri Sai Balaji
            </span>

            <span className="w-10 h-px bg-[#b8945a]" />
          </div>

          {/* Main Heading */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl leading-none"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 500,
              color: "#3d2c23",
            }}
          >
            Our Collection
          </h1>

          {/* Description */}
          <p
            className="mt-5 text-sm sm:text-base leading-7 max-w-2xl mx-auto"
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: "#78675c",
            }}
          >
            Discover thoughtfully selected fabrics, elegant dress materials and
            everyday styles designed to make you feel beautiful.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------
          MAIN PRODUCTS AREA
      -------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --------------------------------------------------
              FILTER SIDEBAR
          -------------------------------------------------- */}
          <aside className="lg:w-[250px] shrink-0">
            <div
              className="rounded-2xl border p-5 sticky top-28"
              style={{
                backgroundColor: "rgba(255,255,255,0.58)",
                borderColor: "#e7dccd",
                boxShadow: "0 12px 35px rgba(61,44,35,0.05)",
              }}
            >
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
            </div>
          </aside>

          {/* --------------------------------------------------
              PRODUCTS SECTION
          -------------------------------------------------- */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* TOP BAR */}
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7 pb-5 border-b"
              style={{
                borderColor: "#e7dccd",
              }}
            >
              {/* Product Count */}
              <div>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    color: "#78675c",
                  }}
                >
                  Showing{" "}
                  <span className="font-semibold" style={{ color: "#3d2c23" }}>
                    {products?.length || 0}
                  </span>{" "}
                  {products?.length === 1 ? "product" : "products"}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <span
                  className="hidden sm:block text-xs uppercase tracking-[0.15em]"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    color: "#927d6d",
                  }}
                >
                  Sort
                </span>

                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value)}
                >
                  <SelectTrigger
                    className="w-full sm:w-[210px] h-11 rounded-full px-5 bg-white/70 focus:ring-0"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      color: "#3d2c23",
                      borderColor: "#dcccba",
                    }}
                  >
                    <SelectValue placeholder="Sort By Price" />
                  </SelectTrigger>

                  <SelectContent
                    className="rounded-xl"
                    style={{
                      backgroundColor: "#fffdf9",
                      borderColor: "#e7dccd",
                    }}
                  >
                    <SelectGroup>
                      {items.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="cursor-pointer"
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* --------------------------------------------------
                PRODUCT GRID
            -------------------------------------------------- */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductCard key={index} loading={true} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loading={false}
                  />
                ))}
              </div>
            ) : (
              /* --------------------------------------------------
                  NO PRODUCTS
              -------------------------------------------------- */
              <div className="min-h-[420px] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "#eadbc9",
                    }}
                  >
                    <span
                      className="text-2xl"
                      style={{
                        color: "#a47c43",
                      }}
                    >
                      ✦
                    </span>
                  </div>

                  <h2
                    className="text-3xl mb-3"
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      color: "#3d2c23",
                    }}
                  >
                    Nothing found
                  </h2>

                  <p
                    className="text-sm leading-6"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      color: "#78675c",
                    }}
                  >
                    We couldn't find products matching your current filters. Try
                    changing your search or filter options.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          BOTTOM EDITORIAL SECTION
      -------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div
          className="relative overflow-hidden rounded-[2rem] px-8 py-14 sm:px-14 text-center"
          style={{
            background:
              "linear-gradient(135deg, #eee1d2 0%, #f7eee3 50%, #e8d7c5 100%)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full border"
            style={{
              borderColor: "rgba(164,124,67,0.20)",
            }}
          />

          <div
            className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full border"
            style={{
              borderColor: "rgba(164,124,67,0.15)",
            }}
          />

          <div className="relative z-10">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-4"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#a47c43",
              }}
            >
              Curated with love
            </p>

            <h2
              className="text-4xl sm:text-5xl"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 500,
                color: "#3d2c23",
              }}
            >
              Find something that feels
              <span className="italic"> uniquely you.</span>
            </h2>

            <p
              className="mt-4 max-w-xl mx-auto text-sm leading-7"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#78675c",
              }}
            >
              From everyday elegance to special occasions, explore styles chosen
              for comfort, beauty and confidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
