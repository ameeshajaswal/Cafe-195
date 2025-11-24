import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { apiFetch } from "./api";
import { useNavigate } from "react-router-dom";

function Customer() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [ordersError, setOrdersError] = useState("");
    const [success, setSuccess] = useState("");
    const [orders, setOrders] = useState([]);
    const [orderEdits, setOrderEdits] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await apiFetch("/api/users/me");
                setProfile(data);
                setForm({ name: data.name || "", email: data.email || "", password: "" });
            } catch (err) {
                setError(err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await apiFetch("/api/orders/mine");
                setOrders(data);
            } catch (err) {
                setOrdersError(err.message || "Failed to load orders");
            } finally {
                setOrdersLoading(false);
            }
        }
        loadOrders();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
            };
            if (form.password) {
                payload.password = form.password;
            }
            const updated = await apiFetch("/api/users/me", {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            // Persist updated user in localStorage so nav reflects changes
            const authUserRaw = localStorage.getItem("authUser");
            if (authUserRaw) {
                const authUser = JSON.parse(authUserRaw);
                const merged = { ...authUser, ...updated };
                localStorage.setItem("authUser", JSON.stringify(merged));
            }

            setProfile(updated);
            setForm((prev) => ({ ...prev, password: "" }));
            setSuccess("Profile updated");
        } catch (err) {
            setError(err.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete your account? This cannot be undone.")) return;
        setError("");
        setSuccess("");
        setSaving(true);
        try {
            await apiFetch("/api/users/me", { method: "DELETE" });
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
            navigate("/", { replace: true, state: { loginSuccess: false, signupSuccess: false } });
        } catch (err) {
            setError(err.message || "Delete failed");
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (order) => {
        setOrderEdits((prev) => ({
            ...prev,
            [order._id]: {
                drinkItems: order.drinkItems ? order.drinkItems.map((i) => ({ ...i })) : [],
                foodItems: order.foodItems ? order.foodItems.map((i) => ({ ...i })) : [],
            },
        }));
    };

    const cancelEdit = (orderId) => {
        setOrderEdits((prev) => {
            const next = { ...prev };
            delete next[orderId];
            return next;
        });
    };

    const updateItemQuantity = (orderId, type, index, value) => {
        setOrderEdits((prev) => {
            const edit = prev[orderId];
            if (!edit) return prev;
            const list = [...edit[type]];
            list[index] = { ...list[index], quantity: value, subtotal: list[index].unitPrice * value };
            return { ...prev, [orderId]: { ...edit, [type]: list } };
        });
    };

    const saveOrder = async (orderId) => {
        const edit = orderEdits[orderId];
        if (!edit) return;

        const cleanList = (items) => items.filter((i) => i.quantity > 0);
        const drinkItems = cleanList(edit.drinkItems || []);
        const foodItems = cleanList(edit.foodItems || []);
        const sum = (arr) => arr.reduce((acc, item) => acc + (item.subtotal || 0), 0);
        const total_drink_price = sum(drinkItems);
        const total_food_price = sum(foodItems);
        const total_price = total_drink_price + total_food_price;

        try {
            const updated = await apiFetch(`/api/orders/mine/${orderId}`, {
                method: "PUT",
                body: JSON.stringify({
                    drinkItems,
                    foodItems,
                    total_drink_price,
                    total_food_price,
                    total_price,
                }),
            });
            setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
            cancelEdit(orderId);
        } catch (err) {
            setOrdersError(err.message || "Failed to update order");
        }
    };

    const deleteOrder = async (orderId) => {
        if (!confirm("Cancel this order?")) return;
        try {
            await apiFetch(`/api/orders/mine/${orderId}`, { method: "DELETE" });
            setOrders((prev) => prev.filter((o) => o._id !== orderId));
            cancelEdit(orderId);
        } catch (err) {
            setOrdersError(err.message || "Failed to cancel order");
        }
    };

    const renderItems = (items = [], editable, orderId, type) => {
        if (!items.length) return <p className="admin-order-items">None</p>;
        if (!editable) {
            return (
                <p className="admin-order-items">
                    {items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                </p>
            );
        }
        return (
            <div className="customer-order-edit-list">
                {items.map((item, idx) => (
                    <div key={`${item.name}-${idx}`} className="customer-order-edit-row">
                        <span className="admin-order-items">{item.name}</span>
                        <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(orderId, type, idx, Number(e.target.value))}
                            className="customer-input customer-qty-input"
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="admin-container">
                <div className="admin-hero">
                    <div className="admin-card">
                        <h1 className="admin-title">My Account</h1>
                        <p className="admin-subtitle">View and update your details.</p>
                    </div>
                </div>

                <div className="admin-users-section">
                    <h2 className="admin-users-title">Profile</h2>
                    {loading && <p className="admin-users-meta">Loading profile...</p>}
                    {error && <p className="admin-users-error">{error}</p>}
                    {!loading && !error && profile && (
                        <div className="admin-users-grid">
                            <div className="admin-user-card">
                                <p className="admin-user-name">{profile.name}</p>
                                <p className="admin-user-email">{profile.email}</p>
                            </div>
                        </div>
                    )}
                </div>

                    <div className="admin-users-section">
                        <h2 className="admin-users-title">Update Account</h2>
                        <form className="customer-form" onSubmit={handleUpdate}>
                            <label className="customer-label">
                                Name
                                <input
                                    className="customer-input"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label className="customer-label">
                                Email
                                <input
                                    className="customer-input"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label className="customer-label">
                                Password
                                <input
                                    className="customer-input"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current password"
                                />
                            </label>
                            <div className="customer-actions">
                                <button type="submit" className="customer-button primary" disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button type="button" className="customer-button danger" onClick={handleDelete} disabled={saving}>
                                    Delete Account
                                </button>
                            </div>
                            {success && <p className="admin-users-meta">{success}</p>}
                            {error && <p className="admin-users-error">{error}</p>}
                        </form>
                    </div>

                <div className="admin-orders-section">
                    <h2 className="admin-users-title">My Orders</h2>
                    {ordersLoading && <p className="admin-users-meta">Loading orders...</p>}
                    {ordersError && <p className="admin-users-error">{ordersError}</p>}
                    {!ordersLoading && !ordersError && (
                        <div className="admin-orders-grid">
                            {orders.length === 0 ? (
                                <p className="admin-users-meta">No orders to display.</p>
                            ) : (
                                orders.map((order) => {
                                    const edit = orderEdits[order._id];
                                    const isEditing = Boolean(edit);
                                    return (
                                        <div key={order._id} className="admin-order-card">
                                            <div className="admin-order-header">
                                                <span className="admin-order-number">Order #{order.orderNumber}</span>
                                                <span className="admin-order-total">
                                                    ${Number((edit ? (edit.drinkItems.concat(edit.foodItems).reduce((acc, item) => acc + (item.subtotal || 0), 0)) : order.total_price) || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="admin-order-customer">
                                                Placed by: {profile?.name || "You"}
                                            </p>
                                            <div className="admin-order-body">
                                                <div>
                                                    <p className="admin-order-label">Drinks</p>
                                                    {renderItems(isEditing ? edit.drinkItems : order.drinkItems, isEditing, order._id, "drinkItems")}
                                                </div>
                                                <div>
                                                    <p className="admin-order-label">Foods</p>
                                                    {renderItems(isEditing ? edit.foodItems : order.foodItems, isEditing, order._id, "foodItems")}
                                                </div>
                                            </div>
                                            <div className="customer-order-actions">
                                                {isEditing ? (
                                                    <>
                                                        <button className="customer-button primary" onClick={() => saveOrder(order._id)}>
                                                            Save
                                                        </button>
                                                        <button className="customer-button" onClick={() => cancelEdit(order._id)}>
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="customer-button primary" onClick={() => startEdit(order)}>
                                                        Edit
                                                    </button>
                                                )}
                                                <button className="customer-button danger" onClick={() => deleteOrder(order._id)}>
                                                    Cancel Order
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Customer;
