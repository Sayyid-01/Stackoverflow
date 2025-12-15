import React, { useState } from "react";

const Projects: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Real-time Chat Integration",
      description: "Add WebSocket-based real-time messaging for instant notifications and collaborative problem-solving.",
      status: "In Progress",
      category: "feature",
      tags: ["WebSocket", "Socket.io", "Real-time"],
      progress: 65,
      votes: 24,
      comments: 8
    },
    {
      id: 2,
      title: "Advanced Code Editor",
      description: "Integrate Monaco Editor for syntax highlighting and code formatting in questions and answers.",
      status: "Completed",
      category: "enhancement",
      tags: ["Monaco", "Code Editor", "UI"],
      progress: 100,
      votes: 42,
      comments: 15
    },
    {
      id: 3,
      title: "Reputation System",
      description: "Implement a comprehensive reputation and badge system to gamify user contributions.",
      status: "Planning",
      category: "feature",
      tags: ["Gamification", "Badges", "Points"],
      progress: 10,
      votes: 38,
      comments: 12
    },
    {
      id: 4,
      title: "API Rate Limiting",
      description: "Add intelligent rate limiting to prevent abuse and ensure fair resource usage.",
      status: "Completed",
      category: "infrastructure",
      tags: ["Security", "API", "Backend"],
      progress: 100,
      votes: 19,
      comments: 5
    },
    {
      id: 5,
      title: "Mobile App Development",
      description: "Build native mobile applications for iOS and Android using React Native.",
      status: "Planning",
      category: "feature",
      tags: ["React Native", "Mobile", "Cross-platform"],
      progress: 5,
      votes: 56,
      comments: 23
    },
    {
      id: 6,
      title: "AI-Powered Search",
      description: "Integrate machine learning for semantic search and intelligent question recommendations.",
      status: "In Progress",
      category: "feature",
      tags: ["AI", "ML", "Search"],
      progress: 35,
      votes: 67,
      comments: 31
    }
  ];

  const filters = [
    { id: "all", label: "All Projects", count: projects.length },
    { id: "feature", label: "Features", count: projects.filter(p => p.category === "feature").length },
    { id: "enhancement", label: "Enhancements", count: projects.filter(p => p.category === "enhancement").length },
    { id: "infrastructure", label: "Infrastructure", count: projects.filter(p => p.category === "infrastructure").length }
  ];

  const filteredProjects = selectedFilter === "all" 
    ? projects 
    : projects.filter(p => p.category === selectedFilter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-300";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Planning": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Project Roadmap
          </h1>
          <p className="text-lg text-gray-600">
            Track ongoing development and upcoming features
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-300 rounded-md p-4 shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              <div className="space-y-2">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedFilter === filter.id
                        ? "bg-orange-100 text-orange-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{filter.label}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {filter.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Progress Overview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">
                      {projects.filter(p => p.status === "Completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In Progress</span>
                    <span className="font-semibold text-blue-600">
                      {projects.filter(p => p.status === "In Progress").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planning</span>
                    <span className="font-semibold text-yellow-600">
                      {projects.filter(p => p.status === "Planning").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredProjects.length} {selectedFilter === "all" ? "Projects" : filters.find(f => f.id === selectedFilter)?.label}
              </h2>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700">
                <option>Sort by: Most Votes</option>
                <option>Sort by: Recent</option>
                <option>Sort by: Progress</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredProjects.map(project => (
                <div key={project.id} className="bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                            {project.title}
                          </h3>
                          <span className={`text-xs px-3 py-1 rounded border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-300 cursor-pointer"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-600">Progress</span>
                        <span className="text-xs font-semibold text-gray-600">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span className="font-semibold">{project.votes}</span>
                        <span>votes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-semibold">{project.comments}</span>
                        <span>comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;