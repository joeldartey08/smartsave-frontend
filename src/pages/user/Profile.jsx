import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthstore } from "../../store/useAuthStore";
import { Edit, LoaderCircle, X } from "lucide-react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import Toast from "../../component/Toast";
import { email } from "zod";

const Profile = () => {
  const { token, user, setUser } = useAuthstore();
  const [data, setData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [apiResponse, setApiResponse] = useState({
    message: "",
    status: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false)
  const [copied, setCopied] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    email: ""
  })

  const handleCopy = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const fetctUser = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/profile");
      console.log(response);

      if (response.status === true || response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    fetctUser();
  }, []);

  useEffect(() => {
    setUser(data);
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.put("/user/edit-profile", {
        name: details.name,
        email: details.email
      });

      if (response.status === true || response.status === 200) {
        setApiResponse({
          status: response.status || true,
          message: response.message || "profile updated successfully",
        });
        fetctUser();

        setEdit(false)
      } else {
        setApiResponse({
          status: response.status || false,
          message:
            response.message ||
            "Error why updating profile",
        });
      }
    } catch (error) {
      console.log(error);

      setApiResponse({
        status: false,
        message: error.message || "Registration Failed Check Your Network",
      });
    } finally {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);

      setLoading(false);

    }
  }


  if (loading || !user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="max-w-xs h-64">
          <LoaderCircle className="w-16 h-16 text-main animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-full bg-black/40 h-full fixed z-50 p-8 px-8">
        <div className="flex justify-between items-center">
          <button onClick={() => setEdit(!edit)} className="btn py-2 bg-white flex gap-2 items-center text-text rounded-md">
            <Edit className="w-4 h-4" /> {edit ? "cancel edit" : "edit profile"}
          </button>
          <button onClick={() => navigate(-1)} className="btn py-2 bg-white rounded-full text-red-600">
            <X className="w-4 h-4 font-bold" />
          </button>
        </div>
        <div className="max-w-3xl relative w-full h-full px-8 py-5 bg-main mt-28 mx-auto shadow-2xl rounded-lg">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
                {
                  edit === false ? (
                    <p className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {user.name}
                    </p>
                  ) : (<input
                    type="text"
                    id="name"
                    name="name"
                    value={details.name}
                    onChange={(e) => setDetails(p => ({ ...p, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />)
                }
              </div>

              {/* Email Address */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                {
                  edit === false ? (
                    <p className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {user.email}
                    </p>
                  ) : (<input
                    type="email"
                    id="email"
                    value={details.email}
                    onChange={(e) => setDetails(p => ({ ...p, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />)
                }
              </div>

              {/*special id */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2  justify-between">
                  <label htmlFor="userId" className="text-sm font-semibold text-gray-700">Special Id:</label>
                  <button type="button" className="btn py-1 text-white borde bg-blue-700 hover:bg-blue-500" onClick={() => handleCopy(user._id)}>
                    {copied ? "copied" : "copy"}
                  </button>
                </div>
                <p
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {user._id}
                </p>
              </div>

              {/* Account Verification */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-700">Account Status</p>
                <p className={`border rounded-md px-3 py-2 text-sm ${user.isVerified
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-yellow-50 text-yellow-700 border-yellow-300"
                  }`}
                >{user.isVerified ? "Verified" : "Not Verified"}</p>
              </div>

              {/* Wallet Balance (Read Only) */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-700">Wallet Balance</p>
                <p
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-600"
                >{user.balance || 0}</p>
              </div>

              {/* Save Changes Button */}
              <div className="col-span-full flex justify-end">
                {
                  edit ? (<button
                    type="submit"
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>) : null
                }
              </div>
            </form>
          </div>

          {
            showToast ? (<Toast
              message={apiResponse.message}
              visible={true}
              status={apiResponse.status} />) : null
          }
        </div>
      </div>


    </>
  );
};

export default Profile;
