import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  FileText,
  Truck,
  ShoppingBag,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X,
  RotateCcw,
} from 'lucide-react';
import api from '../services/api';
import { Order, Product } from '../types';

type TabType = 'orders' | 'wishlist' | 'addresses' | 'profile';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = (searchParams.get('tab') as TabType) || 'orders';

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to cancel order ${orderNumber}? Stock will be released.`)) return;
    try {
      const res = await api.post(`/orders/${orderId}/cancel`, { reason: 'Cancelled by customer' });
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev: any) => (prev ? { ...prev, status: 'CANCELLED' } : null));
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleReorder = (ord: any) => {
    if (ord.items && ord.items.length > 0) {
      ord.items.forEach((item: any) => {
        const dummyProduct = {
          id: item.productId,
          name: item.productName || item.product?.name || 'Product',
          slug: item.product?.slug || 'product',
          variants: [],
        } as any;
        const dummyVariant = {
          id: item.variantId,
          name: item.variantName || item.variant?.name || 'Pack',
          price: item.unitPrice,
          sku: item.sku,
        } as any;
        addToCart(dummyProduct, dummyVariant, item.quantity);
      });
      navigate('/cart');
    }
  };

  // Address State
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem('mmg_user_addresses');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          name: user?.name || 'Ramesh Sharma',
          phone: user?.phone || '9820012345',
          street: 'Flat 402, Greenfield Residency, Sector 15',
          city: 'Navi Mumbai',
          state: 'Maharashtra',
          pincode: '400703',
          isDefault: true,
        },
      ];
    } catch {
      return [];
    }
  });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  // Fetch orders when user is authenticated
  useEffect(() => {
    if (user && currentTab === 'orders') {
      setOrdersLoading(true);
      api
        .get('/orders/my-orders')
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data?.data)) {
            setOrders(res.data.data);
          }
        })
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [user, currentTab]);

  const handleTabChange = (tab: TabType) => {
    setSearchParams({ tab });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.pincode) return;

    const item: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    const updated = [...addresses, item];
    setAddresses(updated);
    localStorage.setItem('mmg_user_addresses', JSON.stringify(updated));
    setShowAddAddress(false);
    setNewAddress({
      name: user?.name || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
    });
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('mmg_user_addresses', JSON.stringify(updated));
  };

  const handleMoveToCart = (product: Product) => {
    const variant = product.variants?.[0];
    if (variant) {
      addToCart(product, variant, 1);
      removeFromWishlist(product.id);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#FAF6EC] border border-[#E7E0D0] rounded-full flex items-center justify-center mx-auto mb-4 text-[#2F5D3A]">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
        <p className="text-xs text-gray-500 mb-6">
          Sign in or create an account to view your consignments, saved addresses, and wishlist.
        </p>
        <Link
          to="/login?redirect=/account"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white text-xs font-bold rounded-full shadow-md transition-all"
        >
          <span>Sign In to Account</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const TABS = [
    { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { id: 'addresses', label: 'Addresses', icon: MapPin, count: addresses.length },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 space-y-8">
      {/* Account Profile Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E0D0] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#2F5D3A] text-[#D9A441] flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#2F5D3A]" /> Member
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {user.email} {user.phone && `• ${user.phone}`}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2.5 border border-gray-300 hover:border-red-400 text-gray-700 hover:text-red-600 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 self-end sm:self-auto min-h-[44px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Mobile Horizontal Tabs (<640px) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:hidden">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 min-h-[44px] ${
                active
                  ? 'bg-[#2F5D3A] text-white shadow-sm'
                  : 'bg-white border border-[#E7E0D0] text-gray-700 hover:bg-[#FAF6EC]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (Desktop) */}
        <div className="hidden sm:block lg:col-span-3 bg-white rounded-3xl border border-[#E7E0D0] shadow-soft p-3 space-y-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-left min-h-[44px] ${
                  active
                    ? 'bg-[#2F5D3A] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-[#FAF6EC] hover:text-[#2F5D3A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      active ? 'bg-white/20 text-white' : 'bg-[#FAF6EC] text-gray-600 border border-[#E7E0D0]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-[#E7E0D0] shadow-soft p-6 sm:p-8 min-h-[400px]">
          {/* TAB 1: ORDERS */}
          {currentTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900">Your Orders</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track shipments, download tax invoices, or request reorders
                  </p>
                </div>

                {/* Status Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {['ALL', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                        statusFilter === st
                          ? 'bg-[#2F5D3A] text-white shadow-xs'
                          : 'bg-[#FAF6EC] text-gray-600 hover:bg-[#EFE8D6] border border-[#E7E0D0]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-28 bg-[#FAF6EC]/60 animate-pulse rounded-2xl border border-[#E7E0D0]" />
                  ))}
                </div>
              ) : orders.filter((o) => statusFilter === 'ALL' || o.status === statusFilter).length > 0 ? (
                <div className="space-y-4">
                  {orders
                    .filter((o) => statusFilter === 'ALL' || o.status === statusFilter)
                    .map((ord) => {
                      const canCancel = ord.status === 'PLACED' || ord.status === 'CONFIRMED' || ord.status === 'PENDING';
                      return (
                        <div
                          key={ord.id}
                          className="border border-[#E7E0D0] rounded-2xl p-5 hover:border-gray-400 transition-colors space-y-4 bg-white shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-bold text-sm text-gray-900">
                                  {ord.orderNumber}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    ord.status === 'CANCELLED'
                                      ? 'bg-red-100 text-red-800'
                                      : ord.status === 'DELIVERED'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {ord.status}
                                </span>
                              </div>
                              <span className="text-[11px] text-gray-500">
                                Ordered on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <Link
                                to={`/track-order?token=${ord.trackingToken || ''}&orderNumber=${ord.orderNumber}`}
                                className="px-3.5 py-1.5 bg-[#FAF6EC] text-[#2F5D3A] hover:bg-[#2F5D3A] hover:text-white rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-[#E7E0D0]"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track</span>
                              </Link>

                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1"
                              >
                                <span>Details</span>
                              </button>

                              <button
                                onClick={() => handleReorder(ord)}
                                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1"
                              >
                                <span>Reorder</span>
                              </button>

                              {canCancel && (
                                <button
                                  onClick={() => handleCancelOrder(ord.id, ord.orderNumber)}
                                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full text-xs font-bold transition-colors"
                                >
                                  Cancel
                                </button>
                              )}

                              <a
                                href={`http://localhost:5000/api/orders/${ord.id}/invoice`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                                title="Download GST Invoice"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          {/* Items */}
                          <div className="space-y-2">
                            {ord.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                                <span className="truncate max-w-sm">
                                  {item.quantity}x {item.productName || item.product?.name || 'Product'} (
                                  {item.variantName || item.variant?.name || 'Standard'})
                                </span>
                                <span className="font-semibold text-gray-900">
                                  ₹{(Number(item.unitPrice) || Number(item.price) || 0) * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
                            <span className="text-gray-500">
                              Payment: <strong className="text-gray-800">{ord.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid Online'}</strong>
                            </span>
                            <span className="font-serif text-sm font-bold text-[#2F5D3A]">
                              Total: ₹{Number(ord.totalAmount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    {statusFilter === 'ALL' ? 'No Orders Found Yet' : `No ${statusFilter} Orders`}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    When you place an order for dry fruits, baby nutrition, or mineral clays, it will appear here.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block mt-2 px-6 py-2.5 bg-[#2F5D3A] text-white text-xs font-bold rounded-full shadow-xs hover:bg-[#1F4D2E] transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}

              {/* Order Detail Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E7E0D0]">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#D9A441]">Consignment Details</span>
                        <h3 className="font-serif text-lg font-bold text-gray-900">{selectedOrder.orderNumber}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        aria-label="Close details"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Status:</span>
                        <strong className="text-[#2F5D3A] uppercase">{selectedOrder.status}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Status:</span>
                        <strong className="text-gray-900">{selectedOrder.paymentStatus}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Mode:</span>
                        <strong className="text-gray-900">{selectedOrder.paymentMethod}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Amount:</span>
                        <strong className="text-[#2F5D3A] font-bold text-sm">₹{Number(selectedOrder.totalAmount).toFixed(2)}</strong>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {(selectedOrder.shippingAddressSnapshot || selectedOrder.shippingAddress) && (
                      <div className="p-3.5 bg-[#FAF6EC]/60 rounded-2xl text-xs space-y-1 border border-[#E7E0D0]">
                        <strong className="text-gray-900 block font-bold">Shipping Address:</strong>
                        {(() => {
                          const a = selectedOrder.shippingAddressSnapshot || selectedOrder.shippingAddress;
                          return (
                            <p className="text-gray-600">
                              {a.addressLine}, {a.city}, {a.state} - {a.pincode}
                            </p>
                          );
                        })()}
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2">
                      <strong className="text-xs font-bold text-gray-900 block">Items in Order:</strong>
                      <div className="divide-y divide-gray-100 border border-[#E7E0D0] rounded-2xl overflow-hidden">
                        {selectedOrder.items?.map((item: any, i: number) => (
                          <div key={i} className="p-2.5 flex items-center justify-between text-xs bg-white">
                            <div>
                              <span className="font-semibold text-gray-900 block">{item.productName || item.product?.name}</span>
                              <span className="text-gray-500">{item.variantName} • Qty: {item.quantity}</span>
                            </div>
                            <span className="font-bold text-gray-800">
                              ₹{(Number(item.unitPrice) || Number(item.price) || 0) * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <a
                        href={`http://localhost:5000/api/orders/${selectedOrder.id}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>GST Invoice</span>
                      </a>

                      <Link
                        to={`/track-order?token=${selectedOrder.trackingToken || ''}&orderNumber=${selectedOrder.orderNumber}`}
                        className="px-4 py-2 bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Tracking</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {currentTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900">Saved Wishlist</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
                  </p>
                </div>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[#E7E0D0] rounded-2xl p-4 flex flex-col justify-between hover:shadow-soft transition-all group bg-white"
                    >
                      <div className="relative mb-3">
                        <img
                          src={item.images?.[0]?.url || '/logo.jpg'}
                          alt={item.name}
                          className="w-full h-44 object-cover rounded-xl bg-[#FAF6EC]"
                        />
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-xs transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1 mb-4">
                        <span className="text-[10px] uppercase font-bold text-[#D9A441] block">
                          {item.store?.name || 'Mewa Masala'}
                        </span>
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-serif text-sm font-bold text-gray-900 hover:text-[#2F5D3A] transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs font-semibold text-gray-900">
                          ₹{item.variants?.[0]?.price || 0}
                        </p>
                      </div>

                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="w-full py-2.5 bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-gray-900">Your Wishlist is Empty</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Click the heart icon on any product to save items you'd like to purchase later.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block mt-2 px-6 py-2.5 bg-[#2F5D3A] text-white text-xs font-bold rounded-full shadow-xs"
                  >
                    Discover Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {currentTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900">Saved Addresses</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage default delivery addresses for 1-click checkout
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-4 py-2 bg-[#2F5D3A] text-white text-xs font-bold rounded-full hover:bg-[#1F4D2E] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {/* Add Address Form Modal / Inline */}
              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-5 bg-[#FAF6EC]/60 border border-[#E7E0D0] rounded-2xl space-y-4 text-xs"
                >
                  <h4 className="font-serif text-sm font-bold text-gray-900">New Delivery Address</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">10-Digit Mobile</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Flat, House No., Street Address</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      placeholder="e.g. Flat 301, Sunshine Heights, M.G. Road"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">City / Town</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#2F5D3A] text-white rounded-full font-bold shadow-xs hover:bg-[#1F4D2E] text-xs"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* List of Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border border-[#E7E0D0] rounded-2xl p-4 relative hover:border-gray-400 transition-colors space-y-2 text-xs bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} - <strong className="text-gray-800">{addr.pincode}</strong>
                    </p>
                    <p className="text-gray-500">Phone: {addr.phone}</p>
                    <div className="pt-2 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-500 hover:text-red-700 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {currentTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="font-serif text-xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update your contact email and account profile settings
                </p>
              </div>

              <div className="max-w-md space-y-4 text-xs">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Registered Phone</label>
                  <input
                    type="text"
                    disabled
                    value={user.phone || 'Not provided'}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-serif text-sm font-bold text-gray-900 mb-2">Account Security</h4>
                  <Link
                    to="/forgot-password"
                    className="text-[#2F5D3A] font-semibold hover:underline block"
                  >
                    Request Password Reset Link &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
