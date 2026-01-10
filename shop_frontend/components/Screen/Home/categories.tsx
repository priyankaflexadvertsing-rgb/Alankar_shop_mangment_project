import { services } from "../../../constant";


const Category = () => {
  return (
    <div className="px-5 sm:px-16 h-[115vh] sm:h-[64vh] lg:h-[55vh]">
      <h1
        id="title"
        className="mb-10 text-[1.5rem] sm:text-[1.9rem] font-[600] text-black"
      >
        Let Look Our Services
      </h1>
      <div className="grid justify-between grid-cols-2 gap-y-4 sm:gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
        {services &&
          services.map((_item: any, i: number) => (
            <a href={_item.link}>
              <div
                key={i}
                className="flex cursor-pointer w-full flex-col justify-center items-center"
              >
                <div className=" w-[150px] h-[150px] bg-contain mx-auto my-auto bg-[#f4f4f5] rounded-md  sm:w-[130px] sm:h-[130px] ">
                  <img src={_item.image} alt="logo" className="w-full h-full" />
                </div>
                <h3
                  id="title"
                  className=" lg:mt-2 text-center font-[600] text-[1.2rem] text-gray-800"
                >
                  {_item.name}
                </h3>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
};

export default Category;
