import { Check, MailWarning } from "lucide-react";

const Toast = ({ message, visible, status }) => {
  if (!visible) {
    return;
  }

  return (
    <div className={`fixed max-w-xl w-[95%] flex gap-4 items-center justify-start p-4 px-8 bottom-0 text-white right-0 bg-main rounded-md ${!status ? "bg-red-500" : "bg-main"}`}>
      {status ? (
        <Check className="w-6 h-6 bg-green-600 rounded-md text-white" />
      ) : (
        <MailWarning className="bg-red-600 text-white rounded-md w-6 h-6" />
      )}
      <p>{message}</p>
    </div>
  );
};

export default Toast;
