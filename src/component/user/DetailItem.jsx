import React from 'react'

const DetailItem = ({ label, value, valueClass }) => (
    <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            {label}
        </span>
        <span className={`text-base ${valueClass || ""}`}>{value}</span>
    </div>
);


export default DetailItem