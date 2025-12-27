

const PrintingRateList = ({ user }) => {
    console.log(user);

    return (
        <>
            {/* Rates */}

            <div className="grid md:grid-cols-6 gap-4">
                <div className="shadow-md border-gray-500 shadow-red-800  rounded p-4">
                    <h3 className="font-semibold text-red-800 mb-3">Flex Rates</h3>
                    {Object.entries(user.rate.flex).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                            <span className="capitalize">{k}</span>
                            <span>₹ {v}</span>
                        </div>
                    ))}
                </div>

                <div className="shadow-md border-gray-500 shadow-red-800  rounded p-4">
                    <h3 className="font-semibold text-red-800 mb-3">Visiting Card</h3>
                    {Object.entries(user.rate.visiting_card).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                            <span>{k.replace("_", " ")}</span>
                            <span>₹ {v}</span>
                        </div>
                    ))}
                </div>

                <div className="shadow-md border-gray-500 shadow-red-800  rounded p-4">
                    <h3 className="font-semibold text-red-800 mb-3">Flex Board</h3>
                    {Object.entries(user.rate.flex_board).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                            <span>{k.replace("_", " ")}</span>
                            <span>₹ {v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default PrintingRateList
