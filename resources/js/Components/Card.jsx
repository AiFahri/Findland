const Card = (props) => {
    return (
        <div className="bg-white shadow sm:rounded-2xl">
            <img src={props.image} alt="Tanah" />
            <div className="flex mt-2">
                {" "}
                <div className="flex items-center justify-center text-sm border w-20 ml-4 bg-lowokwaru text-white rounded-md ">
                    {props.status}
                </div>
                <p className="text-xl font-extrabold text-[#235347] ml-2">
                    {props.price}
                </p>
            </div>
            <p className="text-sm text-[#235347] font-light ml-2 mt-4 pr-4">
                {props.description}
            </p>
            <p className="text-sm text-[#235347] font-light ml-2 mt-4 pb-4">
                {props.place}
            </p>
        </div>
    );
};
export default Card;
