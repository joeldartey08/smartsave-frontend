import React, { useState } from "react";
import Toast from "../Toast";
import { useStepState } from "../../store/useStepState";
import api from "../../services/api";

const SetPassword = ({ next }) => {
  const { email } = useStepState();
  const [data, setData] = useState({
    code: "",
    newPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      if (!data.code || !data.newPassword) {
        setStatus(true);
        setMessage("input field cannot be empty");
        setTimeout(() => {
          setStatus(false);
        }, 3000);
        return
      }
      console.log({ email: email, code: data.code, password: data.newPassword }
      )

      const response = await api.post("/auth/recover-password",
        { email: email, code: data.code, password: data.newPassword }
      );

      if (response.status === true || response.status === 200) {
        setActive(true);
        setMessage(response.message);
        setStatus(true);
        setTimeout(() => {
          setStatus(false);
        }, 3000);
        next();

      } else {
        setActive(false);
        setMessage(response.message);
        setStatus(true);
        setTimeout(() => {
          setStatus(false);
        }, 3000);
      }



    } catch (error) {
      console.log(error);
      setMessage(error.message || "invalid Code");
      setStatus(true);
      setTimeout(() => {
        setStatus(false);
      }, 3000);
    } finally {
      setLoading(false)
    }
  };
  return (
    <div>
      {status ? (
        <Toast message={message} visible={true} status={active} />
      ) : (
        ""
      )}
      <form onSubmit={handleSubmit}>
        <p className="text-center text-base font-normal mb-1">
          enter the verification code sent to your email account
        </p>
        <input
          type="text"
          name="code"
          placeholder="Verification Code"
          value={data.code}
          className="input mb-2"
          maxLength={6}
          onChange={(e) => setData(prev => ({ ...prev, ["code"]: e.target.value }))}
        />
        <input type="password" value={data.newPassword} name="newPssword" placeholder="create a new passsword" className="input"
          onChange={(e) => setData(prev => ({ ...prev, ["newPassword"]: e.target.value }))}

        />
        <div className="w-full flex justify-end mt-4">
          <button disabled={loading} className="btn bg-white py-2 px-6 mt-2 shadow-md font-bold capitalize text-main">
            {loading ? "loading..." : "create new password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetPassword;
