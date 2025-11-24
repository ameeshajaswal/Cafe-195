import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { apiFetch } from "./api";

function Admin() {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({ name: "", email: "", role: "customer" });
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [orderEdits, setOrderEdits] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [usersData, ordersData] = await Promise.all([
                    apiFetch("/api/users"),
                    apiFetch("/api/orders")
                ]);
                const nonAdmins = usersData.filter((u) => u.role !== "admin");
                setUsers(nonAdmins);
                setOrders(ordersData);
            } catch (err) {
                setError(err.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    async function handleDeleteUser(userId) {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        setActionError("");
        try {
            await apiFetch(`/api/users/${userId}`, { method: "DELETE" });
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
            setActionError(err.message || "Failed to delete user");
        }
    }

    async function handleDeleteOrder(orderId) {
        if (!confirm("Cancel this order?")) return;
        setActionError("");
        try {
            await apiFetch(`/api/orders/${orderId}`, { method: "DELETE" });
            setOrders((prev) => prev.filter((o) => o._id !== orderId));
        } catch (err) {
            setActionError(err.message || "Failed to cancel order");
        }
    }

    function startEditUser(user) {
        setEditingUser(user);
        setUserForm({ name: user.name || "", email: user.email || "", role: user.role || "customer" });
        setActionError("");
    }

    function closeUserEdit() {
        setEditingUser(null);
        setUserForm({ name: "", email: "", role: "customer" });
    }

    async function saveUserEdit() {
        if (!editingUser) return;
        setSaving(true);
        setActionError("");
        try {
            const updated = await apiFetch(`/api/users/${editingUser._id}`, {
                method: "PUT",
                body: JSON.stringify(userForm),
            });
            setUsers((prev) => prev.map((u) => (u._id === editingUser._id ? updated : u)));
            closeUserEdit();
        } catch (err) {
            setActionError(err.message || "Failed to update user");
        } finally {
            setSaving(false);
        }
    }

    function startEditOrder(order) {
        setEditingOrderId(order._id);
        setOrderEdits({
            drinkItems: order.drinkItems ? order.drinkItems.map((i) => ({ ...i })) : [],
            foodItems: order.foodItems ? order.foodItems.map((i) => ({ ...i })) : [],
        });
        setActionError("");
    }

    function cancelEditOrder() {
        setEditingOrderId(null);
        setOrderEdits({});
    }

    function updateItemQuantity(type, index, value) {
        setOrderEdits((prev) => {
            const list = [...(prev[type] || [])];
            if (!list[index]) return prev;
            const qty = Math.max(0, value);
            list[index] = { ...list[index], quantity: qty, subtotal: list[index].unitPrice * qty };
            return { ...prev, [type]: list };
        });
    }

    async function saveOrderEdit(orderId) {
        const edit = orderEdits;
        if (!edit) return;
        const clean = (items) => (items || []).filter((i) => i.quantity > 0);
        const drinkItems = clean(edit.drinkItems);
        const foodItems = clean(edit.foodItems);
        const sum = (arr) => arr.reduce((acc, item) => acc + (item.subtotal || 0), 0);
        const total_drink_price = sum(drinkItems);
        const total_food_price = sum(foodItems);
        const total_price = total_drink_price + total_food_price;

        setSaving(true);
        setActionError("");
        try {
            const updated = await apiFetch(`/api/orders/${orderId}`, {
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
            cancelEditOrder();
        } catch (err) {
            setActionError(err.message || "Failed to update order");
        } finally {
            setSaving(false);
        }
    }

    function renderEditItems(type) {
        const items = orderEdits[type] || [];
        if (!items.length) return <p className="admin-order-items">None</p>;
        return (
            <div className="customer-order-edit-list">
                {items.map((item, idx) => (
                    <div key={`${item.name}-${idx}`} className="customer-order-edit-row">
                        <span className="admin-order-items">{item.name}</span>
                        <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(type, idx, Number(e.target.value))}
                            className="customer-input customer-qty-input"
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="admin-container">
                <div className="admin-hero">
                    <div className="admin-card">
                        <h1 className="admin-title">Admin Dashboard</h1>
                        <p className="admin-subtitle">
                            Manage users, orders, and products.
                        </p>
                    </div>
                </div>

                <div className="admin-users-section">
                    <h2 className="admin-users-title">Users</h2>
                    {isLoading && <p className="admin-users-meta">Loading users...</p>}
                    {error && <p className="admin-users-error">{error}</p>}
                    {actionError && <p className="admin-users-error">{actionError}</p>}
                    {!isLoading && !error && (
                        <div className="admin-users-grid">
                            {users.length === 0 ? (
                                <p className="admin-users-meta">No users to display.</p>
                            ) : (
                                users.map((user) => (
                                    <div key={user._id} className="admin-user-card">
                                        <p className="admin-user-name">{user.name}</p>
                                        <p className="admin-user-email">{user.email}</p>
                                        <div className="admin-card-actions">
                                            <button className="customer-button primary" onClick={() => startEditUser(user)}>
                                                Edit
                                            </button>
                                            <button className="customer-button danger" onClick={() => handleDeleteUser(user._id)}>
                                                Remove User
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div className="admin-orders-section">
                    <h2 className="admin-users-title">Orders</h2>
                    {isLoading && <p className="admin-users-meta">Loading orders...</p>}
                    {error && !orders.length && <p className="admin-users-error">{error}</p>}
                    {actionError && <p className="admin-users-error">{actionError}</p>}
                    {!isLoading && !error && (
                        <div className="admin-orders-grid">
                            {orders.length === 0 ? (
                                <p className="admin-users-meta">No orders to display.</p>
                            ) : (
                                orders.map((order) => (
                                    <div key={order._id} className="admin-order-card">
                                        <div className="admin-order-header">
                                            <span className="admin-order-number">Order #{order.orderNumber}</span>
                                            <span className="admin-order-total">
                                                ${Number(order.total_price || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="admin-order-customer">
                                            Customer: {order.UserID?.name || "Unknown"}
                                        </p>
                                        <div className="admin-order-body">
                                            <div>
                                                <p className="admin-order-label">Drinks</p>
                                                <p className="admin-order-items">
                                                    {order.drinkItems && order.drinkItems.length
                                                        ? order.drinkItems
                                                            .map((item) => `${item.name} x${item.quantity}`)
                                                            .join(", ")
                                                        : "None"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="admin-order-label">Foods</p>
                                                <p className="admin-order-items">
                                                    {order.foodItems && order.foodItems.length
                                                        ? order.foodItems
                                                            .map((item) => `${item.name} x${item.quantity}`)
                                                            .join(", ")
                                                        : "None"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="admin-card-actions">
                                            <button className="customer-button primary" onClick={() => startEditOrder(order)}>
                                                Edit
                                            </button>
                                            <button className="customer-button danger" onClick={() => handleDeleteOrder(order._id)}>
                                                Cancel Order
                                            </button>
                                        </div>
                                    </div>
                                    ))
                                )}
                        </div>
                    )}
                </div>
            </div>

            {/* User edit modal */}
            {editingUser && (
                <div className="admin-modal">
                    <div className="admin-modal-content">
                        <h3 className="admin-users-title">Edit User</h3>
                        <label className="customer-label">
                            Name
                            <input
                                className="customer-input"
                                type="text"
                                value={userForm.name}
                                onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                        </label>
                        <label className="customer-label">
                            Email
                            <input
                                className="customer-input"
                                type="email"
                                value={userForm.email}
                                onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                            />
                        </label>
                        <label className="customer-label">
                            Role
                            <select
                                className="customer-input"
                                value={userForm.role}
                                onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value }))}
                            >
                                <option value="customer">customer</option>
                                <option value="admin">admin</option>
                            </select>
                        </label>
                        <div className="customer-actions">
                            <button className="customer-button primary" onClick={saveUserEdit} disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button className="customer-button" onClick={closeUserEdit} disabled={saving}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order edit modal */}
            {editingOrderId && (
                <div className="admin-modal">
                    <div className="admin-modal-content">
                        <h3 className="admin-users-title">Edit Order</h3>
                        <div className="admin-order-body">
                            <div>
                                <p className="admin-order-label">Drinks</p>
                                {renderEditItems("drinkItems")}
                            </div>
                            <div>
                                <p className="admin-order-label">Foods</p>
                                {renderEditItems("foodItems")}
                            </div>
                        </div>
                        <div className="customer-actions">
                            <button className="customer-button primary" onClick={() => saveOrderEdit(editingOrderId)} disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button className="customer-button" onClick={cancelEditOrder} disabled={saving}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Admin;
