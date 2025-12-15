import { useEffect, useState, useRef } from "react";
import { ThumbsUp, MessageSquare, Share2, Image, Video, X, Send } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PublicSpace() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement|null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API}/post/public`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const createPost = async () => {
    if (!text.trim() && files.length === 0) return;
    
    setLoading(true);
    try {
      const form = new FormData();
      form.append("text", text);
      for (const f of files) form.append("media", f);
      
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/post/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      
      if (res.ok) {
        setText("");
        setFiles([]);
        if (fileRef.current) fileRef.current.value = "";
        fetchPosts();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const like = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/post/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      fetchPosts();
    }
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Community Feed</h1>
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Questions
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Tags
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Users
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Create Post Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Share your thoughts</h2>
          </div>
          
          <div className="p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="What would you like to share with the community?"
              rows={4}
            />
            
            {/* File Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img 
                      src={url} 
                      alt={`Preview ${i + 1}`} 
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileRef} 
              onChange={handleFileChange} 
              multiple 
              accept="image/*,video/*"
              className="hidden"
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Image className="w-4 h-4" />
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Add Video
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setFiles([]);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createPost}
                  disabled={loading || (!text.trim() && files.length === 0)}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((p) => (
              <article key={p._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(p.author?.name || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{p.author?.name || "Unknown User"}</div>
                        <div className="text-xs text-gray-500">{formatTimeAgo(p.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{p.text}</p>

                  {/* Media */}
                  {p.media && p.media.length > 0 && (
                    <div className={`mt-4 grid gap-3 ${p.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {p.media.map((m: any, i: number) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                          {m.type === "video" ? (
                            <video controls className="w-full max-h-96 bg-black">
                              <source src={`${API}${m.url}`} />
                            </video>
                          ) : (
                            <img 
                              src={`${API}${m.url}`} 
                              alt="Post media" 
                              className="w-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-1">
                  <button
                    onClick={() => like(p._id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="font-medium">{p.likes?.length || 0}</span>
                    <span className="hidden sm:inline">Likes</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">{p.comments?.length || 0}</span>
                    <span className="hidden sm:inline">Comments</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="font-medium">{p.shares || 0}</span>
                    <span className="hidden sm:inline">Shares</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}