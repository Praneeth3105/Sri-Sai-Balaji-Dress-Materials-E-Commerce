import React, { useEffect, useState } from "react";
import { AlertTriangle, Package, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const OutOfStock = () => {
  const [products, setLocalProducts] = useState([]);
  const [stockValues, setStockValues] = useState({});
  const [savingId, setSavingId] = useState("");
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  const getStock = (variant, size) => {
    const item = (variant?.sizeStock || []).find(
      (entry) =>
        String(entry?.size || "")
          .trim()
          .toLowerCase() ===
        String(size || "")
          .trim()
          .toLowerCase(),
    );

    if (item) return Math.max(0, Number(item.quantity) || 0);

    // Existing old products without sizeStock get one legacy unit.
    const exists = (variant?.sizes || []).some(
      (entry) =>
        String(entry).trim().toLowerCase() ===
        String(size || "")
          .trim()
          .toLowerCase(),
    );

    return exists ? 1 : 0;
  };

  const loadOutOfStock = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/out-of-stock`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        const list = res.data.products || [];
        setLocalProducts(list);

        const values = {};
        list.forEach((product) => {
          (product.variants || []).forEach((variant, variantIndex) => {
            (variant.sizes || []).forEach((size, sizeIndex) => {
              values[`${product._id}-${variantIndex}-${sizeIndex}`] = getStock(
                variant,
                size,
              );
            });
          });
        });
        setStockValues(values);
      }
    } catch (error) {
      console.error("Out Of Stock Load Error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to load out-of-stock products",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) loadOutOfStock();
  }, [accessToken]);

  const setQuantity = (key, value) => {
    setStockValues((prev) => ({
      ...prev,
      [key]: Math.max(0, Number(value) || 0),
    }));
  };

  const saveStock = async (product) => {
    try {
      setSavingId(product._id);

      const variants = (product.variants || []).map(
        (variant, variantIndex) => ({
          color: variant.color,
          sizes: variant.sizes || [],
          images: variant.images || [],
          sizeStock: (variant.sizes || []).map((size, sizeIndex) => ({
            size,
            quantity:
              stockValues[`${product._id}-${variantIndex}-${sizeIndex}`] ??
              getStock(variant, size),
          })),
        }),
      );

      const formData = new FormData();
      formData.append("variants", JSON.stringify(variants));

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/product/update/${product._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Stock updated successfully");

        const updated = res.data.product;
        setLocalProducts((prev) =>
          prev.filter((item) => item._id !== product._id),
        );
        // If every size is still 0, keep it here. Otherwise it has returned
        // to the customer catalogue and disappears from this page.
        const hasStock = (updated.variants || []).some((variant) =>
          (variant.sizes || []).some((size) => getStock(variant, size) > 0),
        );

        if (!hasStock) {
          setLocalProducts((prev) => [...prev, updated]);
        }
      }
    } catch (error) {
      console.error("Update Stock Error:", error);
      toast.error(error?.response?.data?.message || "Failed to update stock");
    } finally {
      setSavingId("");
    }
  };

  const removeProduct = async (productId) => {
    const confirmed = window.confirm(
      "Remove this product permanently? Its product images will also be removed from Cloudinary.",
    );

    if (!confirmed) return;

    try {
      setSavingId(productId);

      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setLocalProducts((prev) =>
          prev.filter((item) => item._id !== productId),
        );
        toast.success("Product removed successfully");
      }
    } catch (error) {
      console.error("Remove Product Error:", error);
      toast.error(error?.response?.data?.message || "Failed to remove product");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] md:pl-[300px] pt-[130px]">
      <div className="px-5 sm:px-8 lg:px-10 pb-14">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mb-2">
            Inventory Management
          </p>
          <h1 className="font-[Cormorant_Garamond] text-5xl sm:text-6xl leading-none text-[#35271f]">
            Out of <span className="italic text-[#a78352]">Stock</span>
          </h1>
          <p className="font-[DM_Sans] text-sm text-[#7b6d64] mt-4 max-w-xl">
            Products with no remaining stock are kept here. Increase the
            quantity to bring a product back to the customer catalogue, or
            remove it permanently.
          </p>
          <div className="w-14 h-px bg-[#b99a6b] mt-6" />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#e5d9ca] bg-[#fffdf9] p-10 text-center text-sm text-[#8b7c72]">
            Loading inventory...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cabb] bg-[#fffdf9] py-20 px-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#eee5da] flex items-center justify-center">
              <Package className="w-7 h-7 text-[#a78352]" strokeWidth={1.3} />
            </div>
            <h2 className="mt-5 font-[Cormorant_Garamond] text-3xl text-[#4a382c]">
              Everything is in stock
            </h2>
            <p className="mt-2 text-sm text-[#8b7c72] font-[DM_Sans]">
              No products currently need inventory attention.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {products.map((product) => (
              <Card
                key={product._id}
                className="border border-[#e5d9ca] bg-[#fffdf9] rounded-2xl shadow-none overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="flex gap-4 min-w-0">
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#eee5da] shrink-0">
                        {product.productImage?.[0]?.url ? (
                          <img
                            src={product.productImage[0].url}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-[#b99a7a]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#a78352] font-semibold">
                          {product.category || "Collection"}
                        </p>
                        <h2 className="font-[Cormorant_Garamond] text-3xl text-[#4a382c] mt-1">
                          {product.productName}
                        </h2>
                        <p className="text-xs text-[#8b7c72] mt-2">
                          All current variants have reached zero stock.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#8e4e43] text-xs uppercase tracking-[0.12em]">
                      <AlertTriangle className="w-4 h-4" />
                      Out of Stock
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {(product.variants || []).map((variant, variantIndex) => (
                      <div
                        key={variant._id || `${product._id}-${variantIndex}`}
                        className="rounded-xl border border-[#e5d9ca] bg-[#f8f4ee] p-4"
                      >
                        <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#6d5d52] mb-3">
                          {variant.color} — Size Stock
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {(variant.sizes || []).map((size, sizeIndex) => {
                            const key = `${product._id}-${variantIndex}-${sizeIndex}`;
                            const value =
                              stockValues[key] ?? getStock(variant, size);

                            return (
                              <div
                                key={key}
                                className="flex items-center justify-between gap-3 rounded-xl border border-[#ded1c2] bg-white px-3 py-2"
                              >
                                <span className="text-sm font-medium text-[#66584f]">
                                  {size}
                                </span>
                                <Input
                                  type="number"
                                  min="0"
                                  value={value}
                                  onChange={(e) =>
                                    setQuantity(key, e.target.value)
                                  }
                                  className="w-24 h-9 rounded-lg border-[#ded1c2] bg-white text-center text-sm text-[#44352c]"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#eadfd3] flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={savingId === product._id}
                      onClick={() => removeProduct(product._id)}
                      className="rounded-xl border-[#dfcfc0] bg-[#f8f4ee] text-[#8e4e43] hover:bg-[#f3e4df]"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Product
                    </Button>

                    <Button
                      type="button"
                      disabled={savingId === product._id}
                      onClick={() => saveStock(product)}
                      className="rounded-xl bg-[#4a382c] hover:bg-[#35271f] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {savingId === product._id
                        ? "Saving..."
                        : "Increase / Save Stock"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutOfStock;
