import React from "react";

const Toast = ({ toast }) => {
  if (!toast) return null;

  const cls =
    toast.type === "success"
      ? "toast success"
      : toast.type === "error"
        ? "toast error"
        : "toast info";

  return (
    <div className="toast-container">
      <div className={cls}>{toast.message}</div>
    </div>
  );
};

export default Toast;

