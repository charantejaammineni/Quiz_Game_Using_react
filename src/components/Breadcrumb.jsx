import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>

      {pathParts.map((part, index) => {
        const path = "/" + pathParts
          .slice(0, index + 1)
          .join("/");

        const name = part
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());

        return (
          <span key={path}>
            {" / "}
            <Link to={path}>{name}</Link>
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumb;