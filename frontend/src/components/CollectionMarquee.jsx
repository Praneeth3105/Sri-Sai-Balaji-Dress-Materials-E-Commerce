import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CollectionMarquee = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL}/api/v1/product/getavailableproducts`)
      .then((res) => {
        if (res.data.success) {
          setProducts((res.data.products || []).slice(0, 12));
        }
      })
      .catch(() => {});
  }, []);

  if (!products.length) return null;

  const items = [...products, ...products];

  return (
    <section className="overflow-hidden bg-[#f5efe7] py-14 border-y border-[#e5d9ca]">
      <style>
        {`
          @keyframes sbd-marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .sbd-marquee {
            animation: sbd-marquee 32s linear infinite;
            width: max-content;
          }

          .sbd-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-6 mb-7 flex items-end justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[.3em] text-[#a78352] font-semibold">
            A moving selection
          </p>

          <h2 className="font-[Cormorant_Garamond] text-4xl text-[#3d2c23] mt-1">
            From Our <span className="italic text-[#a78352]">Collection</span>
          </h2>
        </div>

        <button
          onClick={() => navigate("/products")}
          className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#6f5a49]"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-hidden">
        <div className="sbd-marquee flex gap-5 px-6">
          {items.map((product, index) => (
            <button
              key={`${product._id}-${index}`}
              onClick={() => navigate(`/products/${product._id}`)}
              className="w-[180px] sm:w-[210px] shrink-0 text-left group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#eee5da] border border-[#dfd1c0]">
                <img
                  src={product.productImage?.[0]?.url || "/Shop.png"}
                  alt={product.productName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <p className="mt-3 text-[9px] uppercase tracking-[.18em] text-[#a78352]">
                Sri Sai Balaji
              </p>

              <p className="font-[Cormorant_Garamond] text-xl text-[#44352c] truncate">
                {product.productName}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionMarquee;
