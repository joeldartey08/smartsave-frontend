import { useState } from "react";
import Logo from "../component/Logo";
import GetPassword from "../component/forget-password/GetPassword";
import SetPassword from "../component/forget-password/SetPassword";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ForgottenPassword = () => {
  const [step, setStep] = useState(1);

  const next = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <div className="w-full min-h-screen bg-alte flex justify-center items-center">
      <div className="max-w-xl w-[98%] flex flex-col text-alte items-center justify-center bg-main rounded-md shadow-md px-6 py-8">
        <Logo />
        <h1 className="text-center text-xl font-bold mb-1">
          Recover Your Account
        </h1>

        <div className="w-full">
          <div>
            {step == 1 && <GetPassword next={next} />}
            {step == 2 && <SetPassword next={next} />}
            {step == 3 && (
              <div className="flex flex-col mt-3 gap-3 items-center justify-center">
                <div className="flex mt-3 gap-3 items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h1>password updated succecessfully</h1>
                </div>
                <Link className="text-blue-600" to="/">
                  go back to login page
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgottenPassword;
