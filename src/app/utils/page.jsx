// import React from "react";

// const page = () => {
//   return <div>page</div>;
// };

// export default page;
export default async (req, res) => {
  try {
    const url = decodeURIComponent(req?.query?.url);
    const result = await fetch(url);
    const body = await result.body;

    console.log(result.status); // Log the HTTP status code
    console.log(result.headers); // Log the HTTP headers

    // Pipe the body to the response
    body.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Internal Server Error");
  }
};