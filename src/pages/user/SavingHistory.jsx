import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthstore } from "../../store/useAuthStore";
import { LoaderCircle } from "lucide-react";
import Layout from "../../component/user/Layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Toast from "../../component/Toast";
import api from "../../services/api";
import { useTransactions } from "../../store/useTransactions";
import { formatCurrency } from "../../utils/useCurrencyFormatter";

const transactionSchema = z.object({
  amount: z
    .coerce.number().positive("Amount must be greater than zero")
    .max(1000000, "Amount is too large"),

  planId: z
    .string({
      required_error: "Please select a plan",
    })
    .min(1, "Plan selection is required"),

  proofImage: z
    .instanceof(File, { message: "Proof image is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "File must be less than 2MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: "Only JPG or PNG images are allowed" }
    ),
});


const SavingHistory = () => {
  const { token } = useAuthstore();
  const { transactions, setTransactions } = useTransactions();
  const [showToast, setShowToast] = useState(false);
  const [apiResponse, setApiResponse] = useState({
    message: "",
    status: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(transactionSchema)
  })

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/get-all-transactions");

      if (response.status === true || response.status === 200) {
        setTransactions(response.data);

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

    fetchTransactions();

    console.log(transactions);

  }, []);


  const onSubmit = async (data, event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", data.proofImage)
      formData.append("upload_preset", "smartSave");

      const pictureUpload = await axios.post("https://api.cloudinary.com/v1_1/dowbtynlq/image/upload", formData);

      if (pictureUpload.status === 200 || pictureUpload.status === 201) {

        console.log(pictureUpload.data.secure_url);
        const response = await api.post("/user/create-transaction", {
          planId: data.planId,
          amount: data.amount,
          proofUrl: pictureUpload.data.secure_url
        });

        if (response.status === true || response.status === 200) {
          setApiResponse({
            status: response.status || true,
            message: response.message || "Transaction sent sucessfully ",
          });
        } else {
          setApiResponse({
            status: response.status || false,
            message: response.message || "Transaction was not sucessfully ",
          });
        }

      } else {
        setApiResponse({
          status: false,
          message: "error uploading image",
        });

      }
    } catch (error) {
      consolelog(error)
    } finally {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);

      fetchTransactions();
      reset()
      setLoading(false);

    }
  }

  if (loading || !transactions) {
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
        <section className="w-full">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-3xl font-bold">Transaction</h1>
            <p className="text-xl ">OverView</p>
          </div>

          <div className="w-full bg-gray-300 rounded-md p-4 mt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className="text-2xl font-bold mb-8">Record A transaction</h1>

              <div className=" gap-4 grid md:grid-cols-2">
                <div className="p-1 flex flex-col gap-2">
                  <div >
                    <label htmlFor="proofUrl" className="font-normal text-base">
                      Upload Image:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="proofUrl"
                      onChange={(e) => setValue("proofImage", e.target.files?.[0])}
                      className="input w-full border border-gray-300 rounded-lg p-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.proofImage && (
                      <p className="text-red-500 text-sm mb-2">{errors.proofImage.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="planId" className="font-normal text-base">
                      Plan Id:
                    </label>
                    <input id="planId" name="planId" {...register("planId")} type="text" className="input border rounded-md" />
                    {errors.planId && (
                      <p className="text-red-500 text-sm mb-2">{errors.planId.message}</p>
                    )}

                  </div>
                </div>
                <div className="p-1 flex flex-col justify-end gap-2">
                  <div>
                    <label htmlFor="planId" className="font-normal text-base">
                      Amount:
                    </label>
                    <input id="planId" name="amount" {...register("amount")} type="number" className="input border rounded-md" />

                    {errors.amount && (
                      <p className="text-red-500 text-sm mb-2">{errors.amount.message}</p>
                    )}

                  </div>
                  <button className="btn mt-2 rounded-md font-bold text-white bg-submain hover:bg-main">
                    {loading ? "loading..." : "Record a transaction"}
                  </button>

                </div>
              </div>
            </form>
          </div>

          <div className="bg-white mt-14 shadow-md rounded-lg p-4 w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Transaction History</h2>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold text-sm">#</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold text-sm">Transaction ID</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold text-sm">Plan ID</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold text-sm">Amount</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold text-sm">Proof Image</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold text-sm">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((txn, index) => (
                    <tr key={txn.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{txn._id}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{txn.planId}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(txn.amount)}</td>

                      <td className="py-3 px-4">
                        <a href={txn.proofUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={txn.proofUrl}
                            alt="Proof"
                            className="w-12 h-12 rounded-md object-cover border border-gray-300 hover:scale-105 transition-transform"
                          />
                        </a>
                      </td>

                      {/* Status badge */}
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${txn.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : txn.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </section>
        {
          showToast ? (<Toast
            message={apiResponse.message}
            visible={true}
            status={apiResponse.status} />) : null
        }

        {
          // currentPlans.status ? <PlanItem plan={} action={setcurrentplan} /> : null
        }
      </Layout>
    </>
  );
};

export default SavingHistory;
