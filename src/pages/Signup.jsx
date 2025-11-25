import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../component/Toast";
import { createUser } from "../services/auth";
import { Wallet } from "lucide-react";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [apiResponse, setApiResponse] = useState({
    message: "",
    status: false,
  });
  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createUser(user);

      if (response.status === true) {
        setApiResponse({
          status: response.status || true,
          message: response.message || "Your Registration Was Successfull",
        });

        setTimeout(() => {
          navigate("/");
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
        message: error.message || "Registration Failed Check Your Network or",
      });
    } finally {
      setUser({
        name: "",
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
    <div className="bg-alte w-full min-h-screen flex justify-center items-center">
      {showToast ? (
        <Toast
          message={apiResponse.message}
          visible={true}
          status={apiResponse.status}
        />
      ) : null}
      <div className="max-w-xl w-[98%] flex flex-col text-alte items-center justify-center bg-main rounded-md shadow-md px-6 py-8">
        <div className="flex gap-2 text-4xl mb-2 items-center text-alte font-bold">
          <Wallet className="w-8 h-8 bg-text text-white" />
          <h1>SmartSave</h1>
        </div>
        <h1 className="text-center text-xl font-bold">
          Create an account with us
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full flex gap-4 mt-4 flex-col"
        >
          <input
            type="text"
            className="input"
            placeholder="Enter Your Name"
            name="name"
            onChange={handleChange}
            value={user.name}
            required
          />
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
            placeholder="Create A Password"
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
          <div>
            <p>
              <Link to="/"> Already have an account?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
