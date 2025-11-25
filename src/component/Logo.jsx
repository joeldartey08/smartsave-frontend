import { Wallet } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex gap-1 flex-col mb-2 items-center text-alte font-bold">
      <div className="text-4xl flex gap-2">
        <Wallet className="w-8 h-8 bg-text text-white" />
      <h1>SmartSave</h1>
      </div>
      <p className="text-base">Your Smart Savings Dashboard</p>
    </div>
  );
};

export default Logo;
