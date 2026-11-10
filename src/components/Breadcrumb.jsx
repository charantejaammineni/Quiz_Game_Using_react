
import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="breadcrumb">
      {/* {isAdminPage ? (
        <span className="disabled-breadcrumb">Home</span>
      ) : (
        <Link to="/">Home</Link>
      )} */}

      {pathParts.map((part, index) => {
        const path =
          "/" + pathParts.slice(0, index + 1).join("/");

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
