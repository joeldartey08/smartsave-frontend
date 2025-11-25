import { X } from 'lucide-react'
import React, { useState } from 'react'
import { formatCurrency } from '../utils/useCurrencyFormatter';
import DetailItem from './user/DetailItem';

const PlanItem = ({ plan, action }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (id) => {
        try {
            await navigator.clipboard.writeText(id);
            setCopied(true);

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <>
            <div className="fixed overflow-y-auto inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div className="bg-main max-w-5xl w-full rounded-2xl shadow-2xl overflow-hidden">
                    {/* Close Button */}
                    <div className="flex justify-end p-4">
                        <button
                            onClick={() => action({ status: false, plan: {} })}
                            className="p-2 bg-white rounded-full hover:bg-red-100 transition"
                        >
                            <X className="w-5 h-5 text-red-600" />
                        </button>
                    </div>

                    {/* Plan Header */}
                    <div className="px-8 pb-4 text-white">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h2 className="text-2xl font-bold text-alte">Plan ID:</h2>
                            <span className="font-mono text-sm bg-black/20 px-3 py-1 rounded-lg">
                                {plan._id}
                            </span>
                            <button
                                onClick={() => handleCopy(plan._id)}
                                className="text-sm bg-blue-700 px-4 py-1.5 rounded-md font-semibold hover:bg-blue-800 transition"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    {/* Plan Details Section */}
                    <div className="bg-white rounded-t-2xl p-6 shadow-inner">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Plan Details
                        </h3>

                        {/* Responsive Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
                            <DetailItem label="Plan Name" value={plan.planName} />
                            <DetailItem label="Type" value={plan.planType} />
                            <DetailItem
                                label="Amount"
                                value={formatCurrency(plan.amount)}
                                valueClass="text-green-600 font-medium"
                            />
                            <DetailItem
                                label="Target"
                                value={formatCurrency(plan.target)}
                                valueClass="text-green-600 font-medium"
                            />
                            <DetailItem
                                label="Status"
                                value={
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-medium ${plan.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : plan.status === "paused"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {plan.status}
                                    </span>
                                }
                            />
                            <DetailItem label="Start Date" value={formatDate(plan.startDate)} />
                            <DetailItem
                                label="Next Reminder"
                                value={formatDate(plan.nextReminder)}
                            />
                            <DetailItem label="Created" value={formatDate(plan.createdAt)} />
                            <DetailItem label="Updated" value={formatDate(plan.updatedAt)} />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default PlanItem;

const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
