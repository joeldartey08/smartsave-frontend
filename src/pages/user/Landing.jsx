import { useEffect, useState } from "react";
import SideNav from "../../component/user/SideNav";
import { useAuthstore } from "../../store/useAuthStore";
import { fetchProfile } from "../../services/apiClient";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Activity,
  Banknote,
  Calendar,
  Contact,
  Eye,
  Goal,
  Hand,
  LoaderCircle,
  Mail,
} from "lucide-react";
import { formatCurrency } from "../../utils/useCurrencyFormatter";
import Advert from "../../component/user/Advert";
import Layout from "../../component/user/Layout";

const activePlans = [
  {
    id: 1,
    planName: "Education Fund",
    type: "Target",
    frequency: "Weekly",
    amount: 10000,
    targetAmount: 100000,
    progress: 60,
    startDate: "2025-08-10",
    nextSavingDate: "2025-10-25",
    status: "Active",
  },
  {
    id: 2,
    planName: "Rent Savings",
    type: "Target",
    frequency: "Monthly",
    amount: 20000,
    targetAmount: 200000,
    progress: 20,
    startDate: "2025-09-01",
    nextSavingDate: "2025-11-01",
    status: "Active",
  },
  {
    id: 3,
    planName: "Emergency Fund",
    type: "Flexible",
    frequency: "Daily",
    amount: 2000,
    targetAmount: 50000,
    progress: 75,
    startDate: "2025-07-15",
    nextSavingDate: "2025-10-23",
    status: "Active",
  },
];

const transactions = [
  {
    id: 1,
    date: "2025-10-21",
    description: "Automatic saving (Education Fund)",
    amount: 10000,
    type: "Credit",
  },
  {
    id: 2,
    date: "2025-10-18",
    description: "Withdrawal (Rent Savings)",
    amount: 5000,
    type: "Debit",
  },
  {
    id: 3,
    date: "2025-10-15",
    description: "Automatic saving (Emergency Fund)",
    amount: 2000,
    type: "Credit",
  },
  {
    id: 4,
    date: "2025-10-10",
    description: "Bonus added (SaveSmart reward)",
    amount: 1500,
    type: "Credit",
  },
  {
    id: 5,
    date: "2025-10-01",
    description: "Withdrawal (Education Fund)",
    amount: 7000,
    type: "Debit",
  },
];

// const dashboardSummary = {
//   totalBalance: 250000,
//   activePlans: activePlans.length,
//   nextSavingDate: "2025-10-25",
//   goalProgress: 45,
// };
export const introSlide = [
  {
    title: "Welcome to SaveSmart — Your Personal Saving Companion",
    body: "SaveSmart helps you take control of your finances through consistent, goal-based savings. Whether you’re saving for school, rent, or a rainy day, we help you track progress and stay motivated — one smart step at a time.",
  },
  {
    title: "Consistency Builds Wealth",
    body: "Every little deposit brings you closer to your goals. Keep saving, stay consistent, and watch your balance grow. SaveSmart is here to cheer you on, every step of the journey.",
  },
  {
    title: "Secure Your Account — Verify Your Details",
    body: "To unlock all features like withdrawals, wallet top-ups, and auto-savings, please verify your account information. Your security is our priority — verification ensures your funds and data remain safe",
  },
  {
    title: "Exciting Features Are on the Way",
    body: "We’re constantly improving your saving experience — expect new features like AI-based goal insights, personalized saving reminders, and advanced analytics soon. Stay tuned, and thank you for growing with SaveSmart!",
  },
];

const Landing = () => {
  const { token, profile, setProfile } = useAuthstore();
  const [hashed, setHashed] = useState(true);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/dashboard");
      console.log(response);

      if ((response.status === true || response.status === 200) && response.data) {

        const { user, ...stats } = response.data
        setProfile(user);

        setDashboardSummary(stats)

        console.log("Profile set:", user);
      console.log("Dashboard stats set:", stats);

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

    fetchProfile();
  }, []);

  // useEffect(() => {
  //   console.log("Profile updated:", profile);
  // }, [profile]);


  if (loading || !profile || !dashboardSummary) {


    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="max-w-xs h-64">
          <LoaderCircle className="w-16 h-16 text-main animate-spin" />
        </div>
      </div>
    );
  }

  return (

    <Layout>
      <div className="w-full h-auto overflow-y-auto flex flex-col gap-8">
        <Advert array={introSlide} />
        {/* name and overview */}
        <div>
          <div className="flex justify-between">
            <h1 className="font-bold">Hi {profile.name}</h1>

            <Link to="/contact">
              <p className="bg-gray-300 p-2 rounded-lg flex gap-2 items-center text-xs font-semibold text-main">
                <Contact className="w-4 h-4" />
                customer care
              </p>
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="flex flex-col gap-2 bg-gray-300 p-4 shadow-md rounded-lg">
              <div className="flex gap-3 items-center">
                <span className="bg-main p-1 text-white rounded-full">
                  <Banknote className="w-8 h-8" />
                </span>
                <p>Total Saved</p>
                <Eye
                  onClick={() => setHashed(!hashed)}
                  className={`w-6 h-6 ${hashed ? "" : "text-white"}`}
                />
              </div>
              <h1 className="text-xl font-bold">
                {hashed
                  ? "$ *****"
                  : formatCurrency(dashboardSummary.totalSaved)}
              </h1>
            </div>
            <div className="flex flex-col gap-2 bg-gray-300 p-4 shadow-md rounded-lg">
              <div className="flex gap-3 items-center">
                <span className="bg-main  p-1 text-white rounded-full ">
                  <Calendar className="w-8 h-8" />
                </span>
                <p>Total Paid</p>
              </div>
              <h1 className="text-xl font-bold">
                {dashboardSummary.totalPaid}
              </h1>
            </div>
            <div className="flex flex-col gap-2 bg-gray-300 p-4 shadow-md rounded-lg">
              <div className="flex gap-3 items-center">
                <span className="bg-main p-1 text-white rounded-full">
                  <Activity className="w-8 h-8" />
                </span>
                <p>Active Plans</p>
              </div>
              <h1 className="text-xl font-bold">
                {dashboardSummary.activePlans}
              </h1>
            </div>
            <div className="flex flex-col gap-2 bg-gray-300 p-4 shadow-md rounded-lg">
              <div className="flex gap-3 items-center">
                <span className="bg-main p-1 text-white rounded-full">
                  <Goal className="w-8 h-8" />
                </span>
                <p>Approved Transactions</p>
              </div>
              <h1 className="text-xl font-bold">
                {dashboardSummary.approvedTransactions}
              </h1>
            </div>
            <div className="flex flex-col gap-2 bg-gray-300 p-4 shadow-md rounded-lg">
              <div className="flex gap-3 items-center">
                <span className="bg-main p-1 text-white rounded-full">
                  <Goal className="w-8 h-8" />
                </span>
                <p>Pending Transactions</p>
              </div>
              <h1 className="text-xl font-bold">
                {dashboardSummary.pendingTransaction}
              </h1>
            </div>
          </div>
        </div>

        {/* active plan */}
        <div className="">
          <h1 className="font-bold  mb-2">most recent notifications</h1>
          {/* <div>
            {activePlans.length === 0 ? (
              <div className="w-full p-10 flex flex-col items-center justify-center rounded-md bg-gray-300">
                <h1 className="text-red-600 font-bold text-2xl">
                  No Active Plans
                </h1>
                <Link
                  className="border text-base border-white p-1 px-2 rounded-md"
                  to="/savings-plan"
                >
                  create a plan
                </Link>
              </div>
            ) : (
              <table className="w-full table-auto md:table-fixed border-separate border-spacing-2">
                <thead>
                  <tr className="text-left font-bold">
                    <th>Plan Name</th>
                    <th>Type</th>
                    <th>Frequency</th>
                    <th>Amount</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {activePlans.map(
                    (
                      { planName, type, frequency, amount, progress, status, id },
                      index
                    ) => (
                      <tr className="my-2" key={index}>
                        <td>{planName}</td>
                        <td>{type}</td>
                        <td>{frequency}</td>
                        <td>{amount}</td>
                        <td>{progress}</td>
                        <td>{status}</td>
                        <td className="border rounded-md border-gray-300 p-1 px-2 text-center">
                          <Link to={`/active-pan/${id}`}>view details</Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default Landing;
