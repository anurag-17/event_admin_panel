
const ShowSubCategory = ({
  allSubCategory,
  openDrawerO,
  openModal,
  isLoader,
  current_page
}) => {

  return (
    <>
      <div className=" flex mx-5 ml-10 mr-4  lg:mx-8  overflow-x-auto md:overscroll-none ">
        <div className=" mr-4 lg:mx-8 h-[300px] xl:h-[400px] overflow-y-scroll  w-full ">
          <table className="w-[140%] md:w-full sm:w-[100%]  border bg-white rounded-md mt-5 p-10 mb-10">
            <thead className="sticky-header">
              <tr
                className="bg-coolGray-200 text-gray-400 text-start flex w-full 
                custom_table_text"
              >
                <th className="mx-5 w-[30px] sm:w-2/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5   ">
                  S.NO
                </th>
                <th className=" my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 text-start w-3/12">
                  SUB CATEGORY
                </th>
                <th className=" my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 text-start w-3/12 md:ml-3">
                  MAIN CATEGORY
                </th>
                <th className=" my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 text-start w-2/12">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(allSubCategory) &&
                allSubCategory?.length > 0 &&
                allSubCategory?.map((item, index) => (
                  <tr
                    key={index}
                    className="text-start flex w-full custom_table_text"
                  >
                    <td className="mx-5 my-auto w-[30px] sm:w-2/12">
                    {index +
                            1 +
                            20 * (current_page - 1)}
                    </td>

                    <td className=" capitalize my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 text-start w-3/12">
                      {item?.subCategory ? item?.subCategory : "-"}
                    </td>
                    <td className=" capitalize my-auto w-3/12 ml-2  ">
                      {item?.category?.title}
                    </td>
                    <td className="flex gap-3 my-2 lg:w-2/12">
                      <button
                        onClick={() => openDrawerO({ subCateId: item?._id })}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-sky-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button type="button" onClick={() => openModal(item?._id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-red-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>

            {
             Array.isArray(allSubCategory) && allSubCategory?.length === 0 && 
              <div className="py-6 px-4 border-t ">
                <p className="text-[14px] font-medium text-center"> No Data Found </p>
              </div>
            }

          </table>
        </div>
      </div>
    </>
  );
};

export default ShowSubCategory;
