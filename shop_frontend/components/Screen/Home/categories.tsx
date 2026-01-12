import React from "react";
import { services } from "../../../constant";

const Category = () => {
  return (
    <div className="px-5 sm:px-16 h-[115vh] sm:h-[64vh] lg:h-[55vh] bg-white dark:bg-slate-900 transition-colors duration-300">
      <h1
        id="title"
        className="mb-10 text-[1.5rem] sm:text-[1.9rem] font-semibold text-black dark:text-white transition-colors duration-300"
      >
        Let's Look at Our Services
      </h1>
      <div className="grid justify-between grid-cols-2 gap-y-4 sm:gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
        {services &&
          services.map((item, i) => (
            <a key={i} href={item.link} className="group">
              <div className="flex cursor-pointer w-full flex-col justify-center items-center transition-transform duration-300 hover:scale-105">
                <div className="w-[150px] h-[150px] bg-[#f4f4f5] dark:bg-slate-700 rounded-md sm:w-[130px] sm:h-[130px] flex items-center justify-center overflow-hidden transition-colors duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h3
                  id="title"
                  className="mt-2 text-center font-semibold text-[1.2rem] text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                >
                  {item.name}
                </h3>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
};

export default Category;
