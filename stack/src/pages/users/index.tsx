import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Calendar, Search } from "lucide-react";
import Link from "next/link";
import Mainlayout from "../../components/layout/MainLayout";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import Loader from "@/components/Loader/Loader";
import MainLayout from "../../components/layout/MainLayout";

const Index = () => {
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const perPage = 32;
  const [page, setPage] = useState(1);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/user/getalluser");
        setUsers(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered =
    users?.filter((u: { name: string }) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    ) || [];


  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);


  if (loading) {
    return (
      <MainLayout><Loader text="Users" /></MainLayout>
      
    );
  }

  return (
    <Mainlayout >
      <div className="max-w-6xl">
        <h1 className="text-xl lg:text-2xl font-semibold mb-6">Users</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Filter by user"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* If no users exist at all */}
        {!users || users.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No users available.</div>
        ) : (
          <>
            {/* If filtered result is empty */}
            {paginated.length === 0 ? (
              <div className="text-center text-gray-500 mt-4">No users match your search.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((user: any) => (
                  <Link key={user._id} href={`/users/${user._id}`}>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center mb-3">
                        <Avatar className="w-12 h-12 mr-3">
                          <AvatarFallback className="text-lg">
                            {user.name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-blue-600 hover:text-blue-800 truncate">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">@{user.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Joined {new Date(user.joinDate).getFullYear()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
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
                className={`px-3 py-1 text-sm rounded ${page === pageNum
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
    </Mainlayout>
  );
};

export default Index;
