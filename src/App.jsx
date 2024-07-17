import { useState } from "react";
import axois from "axios";

function App() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [previewData, setPreviewData] = useState({});

  const getPreview = async () => {
    setLoading(true);
    setPreview(false);

    if (input == "") {
      setError(true);
      setPreview(false);
      setLoading(false);
      return;
    }

    console.log(input);

    try {
      const { data } = await axois.get("http://localhost:5000/", {
        params: {
          url: input,
        },
      });

      // console.log("res", data)
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      // console.log(doc);
      const title = doc.querySelector("title")?.textContent || "";
      const description =
        doc
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "";
      const image =
        doc
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content") || "";
      const url =
        doc.querySelector('meta[property="og:url"]')?.getAttribute("content") ||
        "";

      console.log(title);
      console.log(description);
      console.log(image);
      console.log(url);

      setPreview(true);

      setPreviewData({
        title,
        description,
        image,
        url,
      }),
        // setLoading(false);
        setError(false);
    } catch (e) {
      setError(true);
      setPreview(false);
      // setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-blue-400 items-center justify-center space-y-10">
      <p className="text-4xl text-center font-thin">Link Previewer</p>
      <div className="bg-black h-48 w-2/3 md:w-2/5 rounded-2xl flex flex-col items-center justify-around p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-green-800 text-white w-full h-12 outline-none rounded-xl p-4"
          placeholder="Enter a URL"
        />
        {error && (
          <p className="text-red-500 text-center">Please enter a valid URL</p>
        )}
        <button
          onClick={getPreview}
          className="bg-blue-600 px-6 py-2 rounded-full cursor-pointer hover:bg-blue-800"
        >
          Get Preview
        </button>
      </div>

      {preview && previewData!=null ? (
        <div className="bg-green-300 w-3/4 sm:w-2/3 md:w-2/5 h-auto sm:mx-auto mx-4 px-4 sm:px-10 py-4 flex items-center justify-center space-x-2 rounded-xl cursor-pointer hover:bg-green-400 transition-transform duration-400">
          <a
            href={previewData.url}
            target="_blank"
            rel="noreferrer"
            className="flex space-x-2 items-center w-full"
          >
            <img src={previewData.image} alt="no-image" className="h-10 w-10 sm:h-16 sm:w-16 rounded" />
            <div className="flex flex-col max-w-full overflow-hidden space-y-1">
              <p className="text-sm md:text-base font-semibold line-clamp-2">
                {previewData.title}
              </p>
              <p className="text-xs sm:text-sm font-thin line-clamp-2 break-words overflow-hidden">{previewData.description}</p>
              <p className="text-blue-600 text-xs hover:text-blue-800 break-words">
                {previewData.url}
              </p>
            </div>
          </a>
        </div>
      ) : loading ? (
        <div className="bg-white dark:bg-gray-200 w-3/4 sm:w-2/3 md:w-2/5 h-28 p-2 flex items-center justify-center space-x-2 rounded-xl hover:bg-gray-200 transition-transform duration-400 animate-pulse">
          <div
            className="flex space-x-2 w-full h-full items-center"
          >
            <div className="h-20 w-20 bg-gray-300 dark:bg-gray-300 rounded" />
            <div className="flex flex-col w-full items-center justify-evenly h-full">
              <p className="h-6 bg-gray-300 dark:bg-gray-300 rounded-full w-full md:textbase font-bold line-clamp-3"></p>
              <p className="h-6 bg-gray-300 dark:bg-gray-300 rounded-full w-full font-thin"></p>
              <p className="h-4 bg-gray-300 dark:bg-gray-300 rounded-full w-full"></p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
