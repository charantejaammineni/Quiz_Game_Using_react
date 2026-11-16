
import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  return (
    <div className="breadcrumb">
      {pathParts.map((part, index) => {
        const path =
          "/" + pathParts.slice(0, index + 1).join("/");

        // Skip rendering raw numeric IDs (e.g., quiz IDs) as standalone breadcrumbs
        const isNumericId = /^\d+$/.test(part);
        if (isNumericId) return null;

        const name = part
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());

        const isLast = index === pathParts.length - 1;

        return (
          <span key={path}>
            {" / "}

            {isLast ? (
              <span>{name}</span>
            ) : (
              <Link to={path}>{name}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumb;
