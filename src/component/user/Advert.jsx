import { useEffect, useState } from 'react'

const Advert = ({ array }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => (prev + 1) % array.length);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (

        <div className="max-w-3xl relative flex overflow-hidden py-4 gap-1 rounded-xl w-full shadow-sm border border-gray-300 bg-gray-300 ">
            {array.map(({ title, body }, index) => (
                <div
                    key={index}
                    className="flex-shrink-0 space-y-2 mb-2 p-2 md:p-5 w-full ease-in-out duration-custom"
                    style={{
                        transform: `translate(-${count * 100}%)`,
                    }}
                >
                    <h1 className="flex font-bold text-xl gap-2">{title}</h1>
                    <p className="text-base">{body}</p>
                </div>
            ))}

            <div className="w-full h-10  absolute left-0 bottom-0 flex gap-2 items-center justify-center">
                {array.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCount(index)}
                        className={`w-4 h-4 p-2 rounded-[50%] ${count === index ? "bg-main" : "bg-white"
                            }`}
                    ></button>
                ))}
            </div>
        </div>

    )
}

export default Advert