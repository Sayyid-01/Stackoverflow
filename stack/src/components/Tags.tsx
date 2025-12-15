import axiosInstance from "@/lib/axiosinstance";
import React, { useState,useEffect, useMemo } from "react";
import Loader from "./Loader/Loader";



export default function TagsComponent() {
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Popular");
  const [page, setPage] = useState(1);
  const [TAGS, setTags] = useState<any>([]);
  const perPage = 16;
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTags = async () => {
    try {
      const res = await axiosInstance.get("/tags");
      setTags(res.data); // Or res.data.data depending on backend
    } catch (error) {
      console.error(error);
    }finally {
        setLoading(false);
      }
  };

  fetchTags();
}, []);

  // Filters + Sorting
  const filtered = useMemo(() => {
    let result = TAGS.filter((tag: { name: string; }) =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "Name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === "New") {
      result = [...result].sort((a, b) => b.askedToday - a.askedToday);
    } else {
      result = [...result].sort((a, b) => b.questions - a.questions); // Popular
    }

    return result;
  }, [search, filter, TAGS]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <Loader text="Tags" />
      
    );
  }

 return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-300 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-normal mb-3 text-gray-900">Tags</h1>
          <p className="text-gray-700 mb-1">
            A tag is a keyword or label that categorizes your question with other, similar questions.
          </p>
          <p className="text-gray-700 mb-3">
            Using the right tags makes it easier for others to find and answer your question.
          </p>
          <a href="#" className="text-blue-600 text-sm hover:text-blue-700">
            Show all tag synonyms
          </a>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Filter by tag name"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setFilter("Popular")}
              className={`px-3 py-2 text-sm ${
                filter === "Popular"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setFilter("Name")}
              className={`px-3 py-2 text-sm border-l border-gray-300 ${
                filter === "Name"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setFilter("New")}
              className={`px-3 py-2 text-sm border-l border-gray-300 ${
                filter === "New"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              New
            </button>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-4 gap-3">
          {paginated.map((tag) => (
            <div
              key={tag.name}
              className="relative border border-gray-300 rounded p-4 hover:border-gray-400 transition-colors bg-white"
            >
              <div className="mb-3">
                <span 
                  className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm cursor-pointer"
                  onMouseEnter={() => setHovered(tag.name)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {tag.name}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {tag.description}
              </p>

              <div className="text-xs text-gray-600 space-y-0.5">
                <div>
                  <span className="font-semibold text-gray-900">
                    {tag.questions.toLocaleString()}
                  </span>{" "}
                  questions
                </div>
                <div>
                  <span className="font-semibold">{tag.askedToday}</span> asked today,{" "}
                  <span className="font-semibold">{tag.askedWeek}</span> this week
                </div>
              </div>

              {/* Hover Popup */}
              {hovered === tag.name && (
                <div className="absolute z-50 bg-white border border-gray-400 rounded shadow-2xl p-5 w-80 -left-2 -top-2">
                  <div className="mb-3">
                    <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-base font-medium">
                      {tag.name}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{tag.description}</p>

                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <div>
                      <span className="font-bold text-gray-900">
                        {tag.questions.toLocaleString()}
                      </span>{" "}
                      questions
                    </div>
                    <div className="text-gray-600">
                      {tag.askedToday} asked today
                    </div>
                    <div className="text-gray-600">{tag.askedWeek} this week</div>
                  </div>

                  <button className="w-full bg-white border border-gray-400 text-gray-700 text-sm py-1.5 rounded hover:bg-gray-50 transition-colors">
                    Watch tag
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex gap-1 mt-8 justify-end items-center">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded ${
                    page === pageNum
                      ? "bg-orange-500 text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}