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
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
    const totalItems = orders.reduce((sum, order) => {
        const drinks = (order.drinkItems || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
        const foods = (order.foodItems || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
        return sum + drinks + foods;
    }, 0);

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
            const qty = Math.max(0, value);
            list[index] = { ...list[index], quantity: qty, subtotal: list[index].unitPrice * qty };
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
            <div className="admin-container admin-dashboard">
                <div className="admin-hero-shell">
                    <div className="admin-hero glass-panel">
                        <div className="admin-hero-header">
                            <span className="admin-kicker"><a href="/">🔙</a></span>
                            <h1 className="admin-title">{profile ? `Welcome, ${profile.name}` : "My Dashboard"}</h1>
                            <p className="admin-subtitle">
                                A glassy, calm space to manage your details and keep tabs on your orders.
                            </p>
                        </div>
                        <div className="admin-hero-divider" />
                        <div className="admin-hero-metrics">
                            <div className="admin-chip glass-card fade-in">
                                <p className="chip-label">Total orders</p>
                                <p className="chip-value">{ordersLoading ? "—" : totalOrders}</p>
                            </div>
                            <div className="admin-chip glass-card fade-in">
                                <p className="chip-label">Items ordered</p>
                                <p className="chip-value">{ordersLoading ? "—" : totalItems}</p>
                            </div>
                            <div className="admin-chip glass-card fade-in">
                                <p className="chip-label">Total spent</p>
                                <p className="chip-value">
                                    {ordersLoading ? "—" : `$${Number(totalSpent || 0).toFixed(2)}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-sections">
                    <section className="admin-section glass-panel">
                        <div className="section-header">
                            <div>
                                <p className="section-kicker">Identity</p>
                                <h2 className="section-title">Profile</h2>
                                <p className="section-subtitle">Keep your cafe persona polished and up to date.</p>
                            </div>
                            <div className="section-divider" />
                        </div>

                        <div className="customer-messages">
                            {loading && <p className="admin-users-meta">Loading profile...</p>}
                            {error && <p className="admin-users-error">{error}</p>}
                            {success && <p className="admin-users-meta">{success}</p>}
                        </div>

                        {!loading && !error && profile && (
                            <div className="customer-panel-grid">
                                <article className="admin-card glass-card fade-in user-profile-card">
                                    <div className="admin-card-top">
                                        <div className="admin-avatar">{(profile.name || "U")[0]}</div>
                                        <div>
                                            <p className="admin-user-name">{profile.name}</p>
                                            <p className="admin-user-role">Customer</p>
                                        </div>
                                    </div>
                                    <p className="admin-user-email">{profile.email}</p>
                                    <div className="admin-card-actions">
                                        <button
                                            type="button"
                                            className="admin-btn danger"
                                            onClick={handleDelete}
                                            disabled={saving}
                                        >
                                            Delete account
                                        </button>
                                    </div>
                                </article>

                                <form className="customer-form glass-card fade-in" onSubmit={handleUpdate}>
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
                                        <button type="submit" className="admin-btn primary" disabled={saving}>
                                            {saving ? "Saving..." : "Save changes"}
                                        </button>
                                        <button type="button" className="admin-btn ghost" onClick={() => setForm((prev) => ({ ...prev, password: "" }))} disabled={saving}>
                                            Clear password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </section>

                    <section className="admin-section glass-panel">
                        <div className="section-header">
                            <div>
                                <p className="section-kicker">Service flow</p>
                                <h2 className="section-title">My Orders</h2>
                                <p className="section-subtitle">Review, edit, or cancel your cafe runs in one glance.</p>
                            </div>
                            <div className="section-divider" />
                        </div>

                        {ordersLoading && <p className="admin-users-meta">Loading orders...</p>}
                        {ordersError && <p className="admin-users-error">{ordersError}</p>}
                        {!ordersLoading && !ordersError && (
                            <div className="admin-grid orders-grid">
                                {orders.length === 0 ? (
                                    <p className="admin-users-meta">No orders to display.</p>
                                ) : (
                                    orders.map((order, idx) => {
                                        const edit = orderEdits[order._id];
                                        const isEditing = Boolean(edit);
                                        const liveTotal = isEditing
                                            ? [...(edit.drinkItems || []), ...(edit.foodItems || [])].reduce(
                                                (acc, item) => acc + Number(item.subtotal || 0),
                                                0
                                            )
                                            : Number(order.total_price || 0);

                                        return (
                                            <article
                                                key={order._id}
                                                className="admin-card glass-card fade-in"
                                                style={{ animationDelay: `${idx * 0.05}s` }}
                                            >
                                                <div className="admin-order-header">
                                                    <div className="admin-order-tag">
                                                        <span>Order</span>
                                                        <strong>#{order.orderNumber}</strong>
                                                    </div>
                                                    <span className="admin-order-total">${liveTotal.toFixed(2)}</span>
                                                </div>
                                                <p className="admin-order-customer">Placed by: {profile?.name || "You"}</p>
                                                <div className="admin-order-body">
                                                    <div>
                                                        <p className="admin-order-label">Drinks</p>
                                                        {renderItems(
                                                            isEditing ? edit.drinkItems : order.drinkItems,
                                                            isEditing,
                                                            order._id,
                                                            "drinkItems"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="admin-order-label">Foods</p>
                                                        {renderItems(
                                                            isEditing ? edit.foodItems : order.foodItems,
                                                            isEditing,
                                                            order._id,
                                                            "foodItems"
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="admin-card-actions">
                                                    {isEditing ? (
                                                        <>
                                                            <button className="admin-btn primary" onClick={() => saveOrder(order._id)}>
                                                                Save
                                                            </button>
                                                            <button className="admin-btn ghost" onClick={() => cancelEdit(order._id)}>
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className="admin-btn primary" onClick={() => startEdit(order)}>
                                                            Edit
                                                        </button>
                                                    )}
                                                    <button className="admin-btn danger" onClick={() => deleteOrder(order._id)}>
                                                        Cancel order
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

export default Customer;
