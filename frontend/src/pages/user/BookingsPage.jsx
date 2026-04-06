import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, Loader2, FileText, AlertCircle, CreditCard } from "lucide-react";
import { fetchMyBookings, payBookingWithWallet } from "../../services/bookingService.js";
import { useApp } from "../../context/AppContext.jsx";

const StatusBadge = ({ status }) => {
  const variants = {
    pending: { variant: "warning", label: "Pending" },
    confirmed: { variant: "info", label: "Confirmed" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "error", label: "Cancelled" },
    accepted: { variant: "info", label: "Accepted" },
    inprogress: { variant: "inprogress", label: "In Progress" }
  };

  const config = variants[status?.toLowerCase()] || { variant: "default", label: status };
  
  return <span className={`badge badge-${config.variant}`}>{config.label}</span>;
};

const BookingsPage = () => {
  const { user, showToast } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
    else setLoading(false);
  }, [user]);

  const handlePay = async (bookingId) => {
    try {
      setPayingId(bookingId);
      await payBookingWithWallet(bookingId);
      showToast("success", "Payment successful!");
      // Refresh bookings
      const data = await fetchMyBookings();
      setBookings(data);
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">
            <User size={40} />
          </div>
          <h3>Please login</h3>
          <p>Login to see your bookings.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Track your service appointments and their status.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Calendar size={40} />
          </div>
          <h3>No bookings yet</h3>
          <p>Book a professional service to see it here.</p>
          <Link to="/services" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Provider</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '10px', 
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px'
                      }}>
                        🔧
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Booking #{b._id?.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="avatar avatar-sm">
                        {(b.provider?.name || "P")[0].toUpperCase()}
                      </div>
                      <span>{b.provider?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
                        {b.date ? new Date(b.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        }) : "-"}
                      </div>
                      {b.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                          {b.time}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td>
                    <span className={`badge badge-${b.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                      {b.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ₹{b.amount}
                  </td>
                  <td>
                    {b.paymentStatus !== 'paid' && (b.status === 'pending' || b.status === 'accepted') && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePay(b._id)}
                        disabled={payingId === b._id}
                      >
                        <CreditCard size={14} style={{ marginRight: '4px' }} />
                        {payingId === b._id ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                    {b.paymentStatus === 'paid' && (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

