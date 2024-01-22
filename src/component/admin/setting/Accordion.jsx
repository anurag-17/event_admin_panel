import Image from "next/image";

const Accordion = ({ title, content, index, active, onToggle }) => {
  const handleToggle = () => {
    onToggle(index);
  };

  return (
    <div
      className={`mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex flex-col justify-between 2xl:pt-4 2xl:px-10 ml-10 mr-4 lg:mx-8 text-black rounded-[6px] xl:px-8 lg:px-5 md:px-4 sm:px-4 px-1 border-[#70788575] bg-white ${
        active ? "" : "shadow-2xl"
      }`}
    >
      <div
        className={`flex flex-col px-4 border-b border-[transparent] ${
          active ? "border-[#000000cf] " : ""
        }`}
      >
        <div className="flex justify-between items-center gap-3 my-2 ">
          <p
            className={`capitalize ${
              active
                ? "text-darkBlue text-[20px] font-bold cursor-pointer "
                : "text-DarkGrayishBlue text-[18px] cursor-pointer"
            }`}
            onClick={handleToggle}
          >
            {title}
          </p>

          <Image
            src={`/images/down-arrow-5-.svg`}
            alt="arrow-icon"
            onClick={handleToggle}
            className={active ? "cursor-pointer rotate-180" : "cursor-pointer"}
            height={40}
            width={40}
          />
        </div>
      </div>

      <div
        className={`${
          active ? "text-DarkGrayishBlue" : "hidden"
        } w-full p-0 m-0 overflow-hidden transition-all duration-300`}
      >
        {content}
      </div>
    </div>
  );
};

export default Accordion;
