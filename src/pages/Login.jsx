import { useState } from "react";
import Toast from "../component/Toast";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../services/auth";
import { useAuthstore } from "../store/useAuthStore";
import Logo from "../component/Logo";

const Login = () => {
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [apiResponse, setApiResponse] = useState({
    message: "",
    status: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuthstore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signin(user);

      if (response.status === true || response.status === 200) {
        setApiResponse({
          status: response.status || true,
          message: response.message || "Your Registration Was Successfull",
        });
        login(response.data.token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 5000);
      } else {
        setApiResponse({
          status: response.status || false,
          message:
            response.message ||
            "Invalid Parameter Or Email Already Existing In Database",
        });
      }
    } catch (error) {
      console.log(error);

      setApiResponse({
        status: false,
        message: error.message || "Registration Failed Check Your Network",
      });
    } finally {
      setUser({
        email: "",
        password: "",
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="w-full min-h-screen bg-alte flex justify-center items-center">
        {showToast ? (
          <Toast
            message={apiResponse.message}
            visible={true}
            status={apiResponse.status}
          />
        ) : null}
        <div className="max-w-xl w-[98%] flex flex-col text-alte items-center justify-center bg-main rounded-md shadow-md px-6 py-8">
          <Logo />
          <h1 className="text-center text-xl font-bold">
            Login into your account
          </h1>
          <form
            onSubmit={handleSubmit}
            className="w-full flex gap-4 mt-4 flex-col "
          >
            <input
              className="input"
              type="email"
              placeholder="Enter Your Email"
              name="email"
              onChange={handleChange}
              value={user.email}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Enter Your Password"
              name="password"
              onChange={handleChange}
              value={user.password}
              required
            />
            <button
              className="btn bg-white text-text capitalize font-semibold"
              disabled={loading}
            >
              {loading ? "loading...." : "submit"}
            </button>
            <div
              className="flex w-full justify-between"
            >
              <p>
                <Link to="/recover-password">forgotten password</Link>
              </p>
              <p>
                <Link to="/signup">create an account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
