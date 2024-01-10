// import React from "react";

// const page = () => {
//   return <div>page</div>;
// };

// export default page;
export default async (req, res) => {
  const url = decodeURIComponent(req?.query?.url);
  console.log(url);
  const result = await fetch(url);
  const body = await result.body;
  body.pipe(res);
};
  