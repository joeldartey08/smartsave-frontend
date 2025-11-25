import React, { useState } from "react";
import { Link } from "react-router-dom";
import Toast from "../Toast";
import { useStepState } from "../../store/useStepState";
import api from "../../services/api";

const GetPassword = ({ next }) => {
  const { updateFields } = useStepState();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      if (!email) {
        setStatus(true);
        setActive(false);

        setMessage("input field cannot be empty");
        setTimeout(() => {
          setStatus(false);
        }, 3000);
        return;
      }
      updateFields("email", email)

      const response = await api.post("/auth/forget-password", { email: email });

      if (response.status === true || response.status === 200) {
        setStatus(true);
        setMessage(response.message);
        setActive(true);

        setTimeout(() => {
          setStatus(false);
        }, 3000);
        next();
      } else {
        setStatus(true);
        setMessage(response.message);
        setActive(false);

        setTimeout(() => {
          setStatus(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setStatus(true);
      setMessage(error.message);

      setActive(false);
      setTimeout(() => {
        setStatus(false);
      }, 3000);
    } finally {
      setLoading(false)

    }
  };
  return (
    <div>
      {status ? <Toast message={message} visible={true} status={active} /> : ""}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Enter a registered email"
          value={email}
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full flex justify-between mt-4">
          <Link to="/">back to login page</Link>
          <button disabled={loading} className="btn bg-white py-2 px-6 shadow-md font-bold capitalize text-main">
            {loading ? "loading..." : "next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetPassword;
