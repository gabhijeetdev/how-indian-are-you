import React from "react";

/**
 * Reusable button. variant: "primary" | "secondary"
 */
export default function Button({ variant = "primary", icon, children, style, ...props }) {
  return (
    <button className={`btn btn-${variant}`} style={style} {...props}>
      {icon}
      {children}
    </button>
  );
}
