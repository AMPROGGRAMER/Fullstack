import React from "react";

const mockNotifications = [
  {
    id: 1,
    title: "Booking confirmed",
    desc: "Your cleaning service for tomorrow 10 AM is confirmed.",
    time: "2 min ago"
  },
  {
    id: 2,
    title: "New offer",
    desc: "10% off on plumbing services in Bengaluru.",
    time: "1 day ago"
  }
];

const NotificationsPage = () => {
  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Updates about your bookings and offers.</p>
      </div>
      <div className="card">
        {mockNotifications.map((n) => (
          <div key={n.id} className="notif-item">
            <div className="notif-icon">🔔</div>
            <div className="notif-body">
              <div className="notif-title">{n.title}</div>
              <div className="notif-desc">{n.desc}</div>
              <div className="notif-time">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;

