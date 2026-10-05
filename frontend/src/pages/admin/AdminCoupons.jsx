import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BadgePercent,
  Check,
  Clock3,
  Edit3,
  Plus,
  Power,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  code: "",
  title: "",
  description: "",
  discountType: "percent",
  discountValue: "",
  minimumOrderValue: "0",
  maximumDiscount: "",
  usageLimit: "",
  startDate: "",
  endDate: "",
  audience: "all",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem("accessToken");
  const api = `${import.meta.env.VITE_URL}/api/v1/coupons`;
  const headers = { Authorization: `Bearer ${token}` };

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/all`, { headers });
      if (res.data.success) setCoupons(res.data.coupons || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const stats = useMemo(
    () => ({
      total: coupons.length,
      pending: coupons.filter((c) => c.approvalStatus === "Draft").length,
      active: coupons.filter(
        (c) => c.approvalStatus === "Approved" && c.status === "active",
      ).length,
    }),
    [coupons],
  );

  const updateForm = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (
      !form.code ||
      !form.title ||
      !form.discountValue ||
      !form.startDate ||
      !form.endDate
    ) {
      toast.error("Please fill the required offer details");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minimumOrderValue: Number(form.minimumOrderValue || 0),
        maximumDiscount:
          form.maximumDiscount === "" ? null : Number(form.maximumDiscount),
        usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };

      const res = editingId
        ? await axios.put(`${api}/${editingId}`, payload, { headers })
        : await axios.post(`${api}/create`, payload, { headers });

      if (res.data.success) {
        toast.success(res.data.message);
        resetForm();
        loadCoupons();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save offer");
    } finally {
      setSaving(false);
    }
  };

  const approve = async (id) => {
    try {
      const res = await axios.put(`${api}/${id}/approve`, {}, { headers });
      if (res.data.success) {
        toast.success(res.data.message);
        loadCoupons();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to approve offer");
    }
  };

  const reject = async (id) => {
    try {
      const res = await axios.put(`${api}/${id}/reject`, {}, { headers });
      if (res.data.success) {
        toast.success(res.data.message);
        loadCoupons();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to reject offer");
    }
  };

  const toggle = async (id) => {
    try {
      const res = await axios.put(`${api}/${id}/toggle`, {}, { headers });
      if (res.data.success) {
        toast.success(res.data.message);
        loadCoupons();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update offer");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      const res = await axios.delete(`${api}/${id}`, { headers });
      if (res.data.success) {
        toast.success(res.data.message);
        loadCoupons();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete offer");
    }
  };

  const edit = (coupon) => {
    const local = (value) => {
      const d = new Date(value);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minimumOrderValue: String(coupon.minimumOrderValue || 0),
      maximumDiscount:
        coupon.maximumDiscount === null ? "" : String(coupon.maximumDiscount),
      usageLimit: coupon.usageLimit === null ? "" : String(coupon.usageLimit),
      startDate: local(coupon.startDate),
      endDate: local(coupon.endDate),
      audience: coupon.audience,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#f8f4ee] px-4 sm:px-6 lg:px-8 py-8 md:py-12 md:ml-[300px]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
              Promotions
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-[Cormorant_Garamond] text-[#3d2c23]">
              Offers & Coupons
            </h1>
            <p className="mt-2 text-sm text-[#7b6d64]">
              Create approved offers that each customer can use only once.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadCoupons}
              className="h-11 px-4 rounded-xl border border-[#d9cabb] text-[#4a382c] bg-[#fffdf9] flex items-center gap-2 text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setShowForm(true);
              }}
              className="h-11 px-4 rounded-xl bg-[#4a382c] text-white flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Offer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            ["Total Offers", stats.total, BadgePercent],
            ["Pending Approval", stats.pending, Clock3],
            ["Active Offers", stats.active, Check],
          ].map(([label, value, Icon]) => (
            <div
              key={label}
              className="rounded-2xl border border-[#e5d9ca] bg-[#fffdf9] p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b7c72]">
                  {label}
                </p>
                <Icon className="w-4 h-4 text-[#a78352]" />
              </div>
              <p className="mt-3 text-3xl font-[Cormorant_Garamond] text-[#3d2c23]">
                {value}
              </p>
            </div>
          ))}
        </div>

        {showForm && (
          <form
            onSubmit={submit}
            className="rounded-3xl border border-[#e5d9ca] bg-[#fffdf9] shadow-sm p-6 md:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#a78352] font-semibold">
                  Offer Studio
                </p>
                <h2 className="text-3xl font-[Cormorant_Garamond] text-[#3d2c23] mt-1">
                  {editingId ? "Edit Offer" : "Create Offer"}
                </h2>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="w-9 h-9 rounded-full border border-[#e5d9ca] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#6f6259]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Coupon Code *
                </span>
                <input
                  value={form.code}
                  onChange={(e) =>
                    updateForm("code", e.target.value.toUpperCase())
                  }
                  disabled={!!editingId}
                  placeholder="FESTIVE25"
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none disabled:bg-[#f4efe7]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Offer Title *
                </span>
                <input
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder="Festive Season Offer"
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Description
                </span>
                <input
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Get 25% off on your festive purchase"
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Discount Type *
                </span>
                <select
                  value={form.discountType}
                  onChange={(e) => updateForm("discountType", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                >
                  <option value="percent">Percentage</option>
                  <option value="flat">Fixed Amount</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Discount Value *
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.discountValue}
                  onChange={(e) => updateForm("discountValue", e.target.value)}
                  placeholder="25"
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Minimum Order
                </span>
                <input
                  type="number"
                  min="0"
                  value={form.minimumOrderValue}
                  onChange={(e) =>
                    updateForm("minimumOrderValue", e.target.value)
                  }
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Maximum Discount
                </span>
                <input
                  type="number"
                  min="0"
                  value={form.maximumDiscount}
                  onChange={(e) =>
                    updateForm("maximumDiscount", e.target.value)
                  }
                  placeholder="Leave empty for no cap"
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Total Usage Limit
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.usageLimit}
                  onChange={(e) => updateForm("usageLimit", e.target.value)}
                  placeholder="Leave empty for unlimited"
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Audience
                </span>
                <select
                  value={form.audience}
                  onChange={(e) => updateForm("audience", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="new">New Users Only</option>
                  <option value="existing">Existing Users Only</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  Start Date & Time *
                </span>
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => updateForm("startDate", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold text-[#4a382c]">
                  End Date & Time *
                </span>
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => updateForm("endDate", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#e5d9ca] bg-[#fffdf9] px-3 outline-none"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="h-11 px-5 rounded-xl border border-[#d9cabb] text-[#4a382c] cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="h-11 px-6 rounded-xl bg-[#4a382c] text-white cursor-pointer disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Offer"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl bg-[#fffdf9] border border-[#e5d9ca] p-8 text-center text-sm text-[#7b6d64]">
              Loading offers...
            </div>
          ) : coupons.length === 0 ? (
            <div className="rounded-2xl bg-[#fffdf9] border border-[#e5d9ca] p-8 text-center text-sm text-[#7b6d64]">
              No offers created yet.
            </div>
          ) : (
            coupons.map((coupon) => {
              const expired = new Date(coupon.endDate) < new Date();
              const upcoming = new Date(coupon.startDate) > new Date();
              return (
                <div
                  key={coupon._id}
                  className="rounded-3xl border border-[#e5d9ca] bg-[#fffdf9] p-5 md:p-6 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-[#4a382c] text-white text-[10px] font-bold tracking-[0.18em]">
                          {coupon.code}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#eee5da] text-[#6f6259] text-[10px]">
                          {coupon.audience === "all"
                            ? "All Users"
                            : coupon.audience === "new"
                              ? "New Users"
                              : "Existing Users"}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] ${coupon.approvalStatus === "Approved" ? "bg-[#e7efe8] text-[#536b53]" : coupon.approvalStatus === "Rejected" ? "bg-[#f4e5e1] text-[#8e4e43]" : "bg-[#f6eedf] text-[#9a784e]"}`}
                        >
                          {coupon.approvalStatus}
                        </span>
                        {expired && (
                          <span className="px-2.5 py-1 rounded-full bg-[#f4e5e1] text-[#8e4e43] text-[10px]">
                            Expired
                          </span>
                        )}
                        {upcoming && (
                          <span className="px-2.5 py-1 rounded-full bg-[#eee5da] text-[#6f6259] text-[10px]">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-2xl font-[Cormorant_Garamond] font-semibold text-[#3d2c23]">
                        {coupon.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#7b6d64]">
                        {coupon.description || "No description"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6f6259]">
                        <span>
                          {coupon.discountType === "percent"
                            ? `${coupon.discountValue}% OFF`
                            : `₹${coupon.discountValue} OFF`}
                        </span>
                        <span>
                          Min ₹
                          {Number(coupon.minimumOrderValue || 0).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                        <span>
                          Used {coupon.usedCount}
                          {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                        </span>
                        <span>
                          {formatDate(coupon.startDate)} →{" "}
                          {formatDate(coupon.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:max-w-[360px] lg:justify-end">
                      {coupon.approvalStatus === "Draft" && (
                        <button
                          onClick={() => approve(coupon._id)}
                          className="h-10 px-4 rounded-xl bg-[#536b53] text-white text-xs flex items-center gap-2 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                      )}
                      {coupon.approvalStatus === "Approved" && (
                        <button
                          onClick={() => reject(coupon._id)}
                          className="h-10 px-4 rounded-xl border border-[#ead2cd] text-[#8e4e43] text-xs flex items-center gap-2 cursor-pointer"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      )}
                      <button
                        onClick={() => edit(coupon)}
                        className="h-10 px-4 rounded-xl border border-[#d9cabb] text-[#4a382c] text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => toggle(coupon._id)}
                        className="h-10 px-4 rounded-xl border border-[#d9cabb] text-[#4a382c] text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Power className="w-4 h-4" />{" "}
                        {coupon.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => remove(coupon._id)}
                        className="h-10 px-4 rounded-xl border border-[#ead2cd] text-[#8e4e43] text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminCoupons;
