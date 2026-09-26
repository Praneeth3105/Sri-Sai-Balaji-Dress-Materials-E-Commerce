import React from "react";

export const Breadcrumb = ({ children, className = "" }) => {
  return (
    <nav aria-label="breadcrumb" className={`w-full ${className}`}>
      {children}
    </nav>
  );
};

export const BreadcrumbList = ({ children, className = "" }) => {
  return (
    <ol className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      {children}
    </ol>
  );
};

export const BreadcrumbItem = ({ children, className = "" }) => {
  return (
    <li className={`inline-flex items-center gap-2 ${className}`}>
      {children}
    </li>
  );
};

export const BreadcrumbLink = ({ children, render, className = "" }) => {
  if (render) {
    return React.cloneElement(render, {
      className: `${render.props?.className || ""} ${className}`.trim(),
      children,
    });
  }

  return (
    <a href="#" className={`hover:underline ${className}`}>
      {children}
    </a>
  );
};

export const BreadcrumbPage = ({ children, className = "" }) => {
  return (
    <span aria-current="page" className={`font-normal ${className}`}>
      {children}
    </span>
  );
};

export const BreadcrumbSeparator = ({ children = "/", className = "" }) => {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={`text-gray-400 ${className}`}
    >
      {children}
    </li>
  );
};
