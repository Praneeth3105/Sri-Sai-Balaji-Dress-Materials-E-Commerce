import React, { useMemo } from "react";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

const FilterSidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  setPriceRange,
  allProducts,
  priceRange,
}) => {
  // --------------------------------------------------
  // UNIQUE CATEGORIES
  // --------------------------------------------------
  const uniqueCategories = useMemo(() => {
    const categories = allProducts.map((p) => p.category).filter(Boolean);

    return ["All", ...new Set(categories)];
  }, [allProducts]);

  // --------------------------------------------------
  // UNIQUE BRANDS
  // --------------------------------------------------
  const uniqueBrands = useMemo(() => {
    const brands = allProducts.map((p) => p.brand).filter(Boolean);

    return ["All", ...new Set(brands)];
  }, [allProducts]);

  // --------------------------------------------------
  // MAX PRODUCT PRICE
  // --------------------------------------------------
  const maxProductPrice = useMemo(() => {
    if (!allProducts.length) return 99999;

    const prices = allProducts
      .map((p) => Number(p.productPrice))
      .filter((price) => !isNaN(price));

    if (!prices.length) return 99999;

    return Math.max(...prices, 99999);
  }, [allProducts]);

  // --------------------------------------------------
  // CATEGORY
  // --------------------------------------------------
  const handleCategoryClick = (value) => {
    setCategory(value);
  };

  // --------------------------------------------------
  // BRAND
  // --------------------------------------------------
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  // --------------------------------------------------
  // MIN PRICE
  // --------------------------------------------------
  const handleMinChange = (e) => {
    const value = Number(e.target.value);

    if (value >= 0 && value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  // --------------------------------------------------
  // MAX PRICE
  // --------------------------------------------------
  const handleMaxChange = (e) => {
    const value = Number(e.target.value);

    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 99999]);
  };

  return (
    <div
      className="w-full"
      style={{
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* ==================================================
          FILTER HEADER
      ================================================== */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#eadbc9",
              color: "#a47c43",
            }}
          >
            <SlidersHorizontal size={16} strokeWidth={1.7} />
          </div>

          <div>
            <p
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{
                color: "#a47c43",
              }}
            >
              Refine
            </p>

            <h2
              className="text-xl"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
                color: "#3d2c23",
              }}
            >
              Filters
            </h2>
          </div>
        </div>
      </div>

      {/* ==================================================
          SEARCH
      ================================================== */}
      <div className="mb-7">
        <label
          className="block text-[11px] uppercase tracking-[0.18em] mb-3"
          style={{
            color: "#927d6d",
          }}
        >
          Search Collection
        </label>

        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.7}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{
              color: "#a47c43",
            }}
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full outline-none transition-all"
            style={{
              backgroundColor: "#fffdf9",
              border: "1px solid #dfd1c0",
              color: "#3d2c23",
              fontSize: "13px",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#b8945a";
              e.target.style.boxShadow = "0 0 0 3px rgba(184,148,90,0.10)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#dfd1c0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* ==================================================
          CATEGORY
      ================================================== */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-6 h-px"
            style={{
              backgroundColor: "#c8aa75",
            }}
          />

          <h3
            className="text-lg"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 600,
              color: "#3d2c23",
            }}
          >
            Category
          </h3>
        </div>

        <div className="space-y-3">
          {uniqueCategories.map((item, index) => {
            const active = category === item;

            return (
              <button
                key={`${item}-${index}`}
                type="button"
                onClick={() => handleCategoryClick(item)}
                className="w-full flex items-center gap-3 text-left group transition-all"
              >
                {/* Custom Radio */}
                <span
                  className="w-[17px] h-[17px] rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{
                    border: active ? "1px solid #a47c43" : "1px solid #cfc1b1",
                    backgroundColor: active ? "#a47c43" : "transparent",
                  }}
                >
                  {active && (
                    <span className="w-[5px] h-[5px] rounded-full bg-white" />
                  )}
                </span>

                <span
                  className="text-sm transition-colors"
                  style={{
                    color: active ? "#3d2c23" : "#78675c",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================
          DIVIDER
      ================================================== */}
      <div
        className="h-px mb-7"
        style={{
          backgroundColor: "#e6dbce",
        }}
      />

      {/* ==================================================
          BRAND
      ================================================== */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-6 h-px"
            style={{
              backgroundColor: "#c8aa75",
            }}
          />

          <h3
            className="text-lg"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 600,
              color: "#3d2c23",
            }}
          >
            Brand
          </h3>
        </div>

        <div className="relative">
          <select
            value={brand}
            onChange={handleBrandChange}
            className="appearance-none w-full h-11 px-4 pr-10 rounded-full outline-none cursor-pointer text-sm"
            style={{
              backgroundColor: "#fffdf9",
              border: "1px solid #dfd1c0",
              color: "#3d2c23",
            }}
          >
            {uniqueBrands.map((item, index) => (
              <option key={`${item}-${index}`} value={item}>
                {item === "All" ? "All Brands" : item}
              </option>
            ))}
          </select>

          {/* Custom Arrow */}
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
            style={{
              color: "#a47c43",
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* ==================================================
          PRICE RANGE
      ================================================== */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-6 h-px"
            style={{
              backgroundColor: "#c8aa75",
            }}
          />

          <h3
            className="text-lg"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 600,
              color: "#3d2c23",
            }}
          >
            Price Range
          </h3>
        </div>

        {/* Current Range */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs"
            style={{
              color: "#927d6d",
            }}
          >
            Your range
          </span>

          <span
            className="text-sm font-medium"
            style={{
              color: "#3d2c23",
            }}
          >
            ₹{priceRange[0].toLocaleString("en-IN")} – ₹
            {priceRange[1].toLocaleString("en-IN")}
          </span>
        </div>

        {/* Number Inputs */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div>
            <span
              className="block text-[10px] uppercase tracking-wider mb-1.5"
              style={{
                color: "#a08d7d",
              }}
            >
              Min
            </span>

            <input
              type="number"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={handleMinChange}
              className="w-full h-10 px-3 rounded-xl outline-none text-sm"
              style={{
                backgroundColor: "#fffdf9",
                border: "1px solid #dfd1c0",
                color: "#3d2c23",
              }}
            />
          </div>

          <span
            className="mt-5"
            style={{
              color: "#c1af9c",
            }}
          >
            —
          </span>

          <div>
            <span
              className="block text-[10px] uppercase tracking-wider mb-1.5"
              style={{
                color: "#a08d7d",
              }}
            >
              Max
            </span>

            <input
              type="number"
              min={priceRange[0]}
              max={maxProductPrice}
              value={priceRange[1]}
              onChange={handleMaxChange}
              className="w-full h-10 px-3 rounded-xl outline-none text-sm"
              style={{
                backgroundColor: "#fffdf9",
                border: "1px solid #dfd1c0",
                color: "#3d2c23",
              }}
            />
          </div>
        </div>

        {/* Price Sliders */}
        <div className="mt-6 space-y-3">
          <div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={Math.min(priceRange[0], 5000)}
              onChange={handleMinChange}
              className="luxury-range w-full"
            />
          </div>

          <div>
            <input
              type="range"
              min="0"
              max="99999"
              step="100"
              value={priceRange[1]}
              onChange={handleMaxChange}
              className="luxury-range w-full"
            />
          </div>
        </div>
      </div>

      {/* ==================================================
          RESET BUTTON
      ================================================== */}
      <button
        type="button"
        onClick={resetFilters}
        className="w-full h-11 rounded-full flex items-center justify-center gap-2 transition-all duration-300 group"
        style={{
          backgroundColor: "transparent",
          border: "1px solid #cdbda9",
          color: "#6f5b4d",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#3d2c23";
          e.currentTarget.style.borderColor = "#3d2c23";
          e.currentTarget.style.color = "#fffdf9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = "#cdbda9";
          e.currentTarget.style.color = "#6f5b4d";
        }}
      >
        <RotateCcw
          size={14}
          strokeWidth={1.7}
          className="transition-transform duration-300 group-hover:-rotate-45"
        />
        Reset Filters
      </button>

      {/* ==================================================
          CUSTOM RANGE STYLE
      ================================================== */}
      <style>
        {`
          .luxury-range {
            appearance: none;
            -webkit-appearance: none;
            width: 100%;
            height: 3px;
            border-radius: 999px;
            background: #ded2c4;
            outline: none;
            cursor: pointer;
          }

          .luxury-range::-webkit-slider-thumb {
            appearance: none;
            -webkit-appearance: none;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #a47c43;
            border: 3px solid #fffdf9;
            box-shadow: 0 1px 5px rgba(61, 44, 35, 0.25);
            cursor: pointer;
          }

          .luxury-range::-moz-range-thumb {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #a47c43;
            border: 3px solid #fffdf9;
            box-shadow: 0 1px 5px rgba(61, 44, 35, 0.25);
            cursor: pointer;
          }

          .luxury-range:focus::-webkit-slider-thumb {
            box-shadow:
              0 0 0 4px rgba(164, 124, 67, 0.12),
              0 1px 5px rgba(61, 44, 35, 0.25);
          }

          @media (max-width: 1023px) {
            .luxury-range::-webkit-slider-thumb {
              width: 17px;
              height: 17px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FilterSidebar;
