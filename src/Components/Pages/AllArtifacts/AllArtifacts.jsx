import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { BounceLoader } from "react-spinners";
import { AuthContext } from "../../../Contexts/AuthContext/AuthProvider";
import Artifact from "../../Cards/Artifact";
import useCustomAxios from "../../../Hooks/useCustomAxios";

const AllArtifacts = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const customAxios = useCustomAxios();
  const { Toast } = useContext(AuthContext);
  const [numberOfArtifacts, setNumberOfArtifacts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [artifactsPerPage, setArtifactsPerPage] = useState(6);

  const numberOfPages = Math.ceil(numberOfArtifacts / artifactsPerPage);
  const pages = Array.from({ length: numberOfPages }, (_, i) => i + 1);

  const handleArtifactsPerPage = (e) => {
    const val = parseInt(e.target.value);
    setArtifactsPerPage(val);
    setCurrentPage(1); // Reset page to 1 when artifacts per page change
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fetch artifacts from the server based on current page, size, and search query
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const queryParam = searchQuery ? `&search=${searchQuery}` : "";
    customAxios(
      `/Artifacts?page=${currentPage - 1}&size=${artifactsPerPage}${queryParam}`
    )
      .then((res) => {
        setArtifacts(res.data.artifacts || []);
        setNumberOfArtifacts(res.data.totalCount || 0);
      })
      .catch((error) => Toast(error.message, "error"))
      .finally(() => setLoading(false));
  }, [customAxios, currentPage, artifactsPerPage, searchQuery, Toast]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when a search is performed
  };

  return (
    <div className={`bg-black pt-32 md:pt-40 lg:pt-52`}>
      <Helmet>
        <title>Artifact-Hub | All-Artifacts</title>
      </Helmet>
      <div className="relative pb-[12%]">
        <svg
          className="absolute w-full z-30 bottom-[-1%] lg:bottom-[-2%] xl:bottom-[-3%] text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 170.68 1440 149.32"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,288L80,282.7C160,277,320,267,480,240C640,213,800,171,960,170.7C1120,171,1280,213,1360,234.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-primary">
            Explore Our Collection of Artifacts 🏺📜
          </h1>
          <p className="text-xl text-center text-gray-500 mb-8">
            Dive into our extensive collection of artifacts and discover
            treasures that tell fascinating stories of the past and present.
          </p>
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by artifact name..."
              className="input input-bordered w-full md:w-1/3 py-2 px-4 text-lg font-medium border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>
      <div className="bg-white pt-10 pb-24 px-4 md:pb-32 2xl:pb-[9%]">
        <div className={`container px-4 mx-auto`}>
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <BounceLoader color="#A94A4A" size={110} />
            </div>
          ) : artifacts.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artifacts.map((artifact) => (
                  <Artifact key={artifact._id} artifact={artifact} />
                ))}
              </div>
              <div className="mx-auto flex flex-col items-center mt-14 space-y-4">
                <div className="flex items-center flex-wrap gap-2 justify-center">
                  <button
                    className="font-semibold px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                    onClick={handlePrevPage}
                  >
                    Prev
                  </button>
                  {pages.map((page) => (
                    <button
                      key={page}
                      className={`font-semibold px-4 py-2 rounded-full ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-primary hover:bg-primary hover:text-white"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="font-semibold px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-gray-600 font-medium">Show:</span>
                  <select
                    value={artifactsPerPage}
                    onChange={handleArtifactsPerPage}
                    className="block input input-bordered w-fit p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary focus:border-primary font-semibold"
                  >
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                  </select>
                  <span className="text-gray-600 font-medium">
                    artifacts per page
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-5xl text-center font-bold text-red-500 mt-5">
              No artifacts available.
            </p>
          )}
        </div>
      </div>
      <div className="w-screen relative mx-auto text-center">
        <svg
          className="absolute w-full z-30 bottom-[-210px] text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 170.68 1440 149.32"
        >
          <path
            fill="#000000"
            fillOpacity="1"
            d="M0,288L80,282.7C160,277,320,267,480,240C640,213,800,171,960,170.7C1120,171,1280,213,1360,234.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default AllArtifacts;
