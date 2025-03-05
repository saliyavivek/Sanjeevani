import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
      // console.log(token);
      // console.log(role);

      if (token.isDeactivated) {
        return navigate("/deactivated");
      }

      if (role === "farmer") {
        navigate("/warehouses/search");
      } else if (role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/select-role");
      }
    }
  }, []);

  return <div>Redirecting...</div>;
};

export default GoogleRedirect;
