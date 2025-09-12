import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      loginWithToken(token);
      navigate("/projects");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-600">Autenticando...</p>
    </div>
  );
}
