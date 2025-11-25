import { useEffect, useState } from "react";
import SideNav from "../../component/user/SideNav";
import { useAuthstore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import api from "../../services/api";
import {
  LoaderCircle,
  Target,
  Edit3,
  Wallet,
  Repeat,
  Calendar,
  Coins,

} from "lucide-react";
import Toast from "../../component/Toast";
import { usePlan } from "../../store/usePlans";
import PlanItem from "../../component/PlanItem";
import { formatCurrency } from "../../utils/useCurrencyFormatter";
import Layout from "../../component/user/Layout";
import Advert from "../../component/user/Advert";
import { introSlide } from "./Landing";

const savingPlanSchema = z.object({
  planName: z
    .string()
    .min(3, "Plan name must be at least 3 characters long.")
    .max(50, "Plan name cannot exceed 50 characters."),

  target: z
    .coerce.number()
    .positive("Amount per cycle must be greater than zero."),

  planType: z.enum(["daily", "weekly", "monthly", "yearly"], {
    required_error: "Please select a saving frequency.",
  }),

  startDate: z
    .string()
    .nonempty("Start date is required.")
    .refine(
      (date) => new Date(date) >= new Date(),
      "Start date cannot be in the past."
    ),

  amount: z
    .coerce.number()
    .positive("Amount per cycle must be greater than zero."),

  // reminderPreference: z
  //   .array(z.enum(["email", "sms"]))
  //   .optional()
  //   .default([]),

  // planVisibility: z.enum(["Private", "Shared"]).optional().default("Private"),
})


const SavingPlan = () => {
  const { token } = useAuthstore();
  const [showToast, setShowToast] = useState(false);
  const [apiResponse, setApiResponse] = useState({
    message: "",
    status: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { plans, setPlans } = usePlan();
  const [currentPlans, setcurrentplan] = useState({
    status: false,
    plan: {}
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(savingPlanSchema),
  });

 const fetchPlans = async () => {
    setLoading(true)
    try {
      const response = await api.get("/user/get-all-plans");
      if (response.status === true || response.status === 200) {
        setApiResponse({
          status: response.status || true,
          message: response.message || "",
        });
        setPlans(response.data);


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
      setLoading(false)

    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    fetchPlans()
  }, []);

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/user/create-savings", data);

      if (response.status === true || response.status === 200) {
        setApiResponse({
          status: response.status || true,
          message: response.message || "",
        });
        fetchPlans();
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
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);

      setLoading(false);

    }
  }

  const getCurrentplan = (item) => {
    setcurrentplan({
      status: true,
      plan: item
    });
  }


  if (loading) {
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
      <Layout>

        <div className="w-full h-auto flex flex-col gap-4">
          <div>
            <h1 className="flex font-bold items-center gap-3 text-3xl">
              Start Your Next Saving Journey <Target className="w-8 h-8" />
            </h1>
            <p className="text-main text-base">create a plan that fits your lifestyle and goal</p>
          </div>
          <div className="w-full md:flex-row">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl md:w-[95%] mx-auto md:mx-0">
              {/* text input */}
              <div className="w-full bg-gray-300 rounded-md p-4">

                {savingPlanFields.map((field) => (
                  <div key={field.id} className="w-full flex flex-col gap-2 mb-2">
                    <label className="font-semibold mb-2 flex gap-1 items-center">{field.icon ? <field.icon className="w-4 h-4" /> : ""} {field.label} </label>

                    {/* Dynamic input type rendering */}
                    {field.type === "select" ? (
                      <select {...register(field.name)} className="p-2 border rounded">
                        {field.options.map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <div className="flex gap-4">
                        {field.options.map((option, i) => (
                          <label key={i} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={option.value}
                              {...register(field.name)}
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        {...register(field.name)}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="p-2 border rounded"
                      />
                    )}

                    <small className="text-gray-500 mt-1">{field.description}</small>

                    {errors[field.name] && (
                      <span className="text-red-500 text-sm">{errors[field.name]?.message}</span>
                    )}
                  </div>
                ))}

              </div>
              <button disabled={loading} className="btn bg-submain hover:bg-main mt-2 text-white w-full py-3">
                {loading ? "loading..." : "create plan"}
              </button>

            </form>
            <div className="w-full mt-14">
              <h1 className="font-bold text-2xl">
                Plan history
              </h1>

              <div className="w-full mt-8 overflow-x-scroll">
                {!plans ? (
                  <div className="w-full p-10 flex flex-col items-center justify-center rounded-md bg-gray-300">
                    <h1 className="text-red-600 font-bold text-2xl">
                      No Active Plans or reload Network
                    </h1>
                  </div>
                ) : (
                  <table className="w-full border-collapse rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                        <th className="py-3 px-4 text-left">Plan ID</th>
                        <th className="py-3 px-4 text-left">Plan Name</th>
                        <th className="py-3 px-4 text-left">Type</th>
                        <th className="py-3 px-4 text-left">Amount (₦)</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Next Payment Day</th>
                      </tr>
                    </thead>

                    <tbody className="text-sm text-gray-600">
                      {plans.map((item, index) => {
                        const date = new Date(item.nextReminder);
                        const longDate = date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });

                        const statusColor =
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : item.status === "paused"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600";

                        return (
                          <tr
                            key={index}
                            onClick={() => getCurrentplan(item)}
                            className="hover:bg-gray-50 cursor-pointer border-b last:border-none transition-all"
                          >
                            <td className="py-3 px-4 font-mono text-xs text-gray-500">{item._id}</td>
                            <td className="py-3 px-4 font-medium text-gray-800">{item.planName}</td>
                            <td className="py-3 px-4 capitalize">{item.planType}</td>
                            <td className="py-3 px-4 font-semibold text-green-600">{
                              formatCurrency(item.amount)
                            }
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{longDate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                )}
              </div>
            </div>

          </div>
        </div>
        {
          showToast ? (<Toast
            message={apiResponse.message}
            visible={true}
            status={apiResponse.status} />) : null
        }

        {
          currentPlans.status ? <PlanItem plan={currentPlans.plan} action={setcurrentplan} /> : null
        }
      </Layout>
    </>
  );
};

export default SavingPlan;

const savingPlanFields = [
  {
    id: "planName",
    label: "Plan Name",
    name: "planName",
    type: "text",
    placeholder: "e.g. Vacation Savings or Emergency Fund",
    icon: Edit3,
    required: true,
    description: "Give your plan a clear and meaningful name.",
  },
  {
    id: "goalAmount",
    label: "Goal Amount ($)",
    name: "target",
    type: "number",
    placeholder: "Enter your target amount",
    icon: Wallet,
    required: true,
    description: "Total amount you want to save towards your goal.",
  },
  {
    id: "frequency",
    label: "Saving Frequency",
    name: "planType",
    type: "select",
    options: ["daily", "weekly", "monthly", "yearly"],
    icon: Repeat,
    required: true,
    description: "How often would you like to save?",
  },
  {
    id: "startDate",
    label: "Start Date",
    name: "startDate",
    type: "date",
    icon: Calendar,
    required: true,
    description: "Select when this plan should begin.",
  },
  {
    id: "amountPerCycle",
    label: "Amount per Saving Cycle ($)",
    name: "amount",
    type: "number",
    placeholder: "e.g. 5000",
    icon: Coins,
    required: true,
    description: "The fixed amount you’ll deposit each saving period.",
  },

  // {
  //   id: "reminderPreference",
  //   label: "Reminder Preference",
  //   name: "reminderPreference",
  //   type: "checkbox",
  //   options: [
  //     { label: "Email Reminder", value: "email" },
  //     // { label: "SMS Reminder", value: "sms" },
  //   ],
  //   icon: Bell,
  //   required: false,
  //   description: "Choose how you want to be reminded of your savings.",
  // },
  // {
  //   id: "planVisibility",
  //   label: "Plan Visibility",
  //   name: "planVisibility",
  //   type: "select",
  //   options: ["Private", "Shared"],
  //   icon: "Eye",
  //   required: false,
  //   description: "Keep it private or share progress with friends (future feature).",
  // },
];
