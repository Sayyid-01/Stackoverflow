import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  History,
  Share,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosinstance";




const answersData = [
  {
    id: 1,
    content: `The issue you're experiencing is likely due to the middleware configuration and how NextJS handles redirects. Here are a few things to check:

## 1. Middleware File Location
Make sure your \`middleware.ts\` file is in the correct location - it should be in the root of your project (same level as \`pages\` or \`app\` directory).

## 2. Import Statements
You're missing some important imports in your middleware:

\`\`\`javascript
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
\`\`\`

## 3. Updated Middleware Code

\`\`\`javascript
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get("authToken")?.value;
  
  if (!token) {
    console.log("[middleware] No token found, redirecting to login");
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(token, secret);
    console.log("[middleware] Token verified for user:", payload.sub);
    return NextResponse.next();
  } catch (error) {
    console.log("[middleware] Token verification failed:", error);
    // Clear the invalid token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('authToken');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/add-todo/:path*',
    '/edit-todo/:path*',
    '/settings/:path*'
  ]
}
\`\`\`

## Key Changes:
- Added proper imports <br>
- Redirect to \`/login\` instead of \`/\` <br>
- Clear invalid tokens from cookies <br>
- Simplified matcher patterns <br>
- Better error handling

This should resolve your middleware issues.`,
    votes: 5,
    author: {
      id: 1,
      name: "John Doe",
      reputation: 15420,
      avatar: "JD",
    },
    answeredDate: "2 days ago",
    isAccepted: true,
    userVote: null,
  },
  {
    id: 2,
    content: `Another approach you might consider is using NextAuth.js which handles authentication middleware automatically:

## Installation
\`\`\`bash
npm install next-auth
\`\`\`

## Configuration
Create \`pages/api/auth/[...nextauth].js\`:

\`\`\`javascript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Add your authentication logic here
        const user = await authenticateUser(credentials)
        return user ? user : null
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      return { ...session, user: token }
    }
  }
})
\`\`\`

## Middleware with NextAuth
\`\`\`javascript
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*']
}
\`\`\`

This approach is more robust and handles many edge cases automatically.`,
    votes: 2,
    author: {
      id: 2,
      name: "Felix Rodriguez",
      reputation: 799,
      avatar: "FR",
    },
    answeredDate: "1 day ago",
    isAccepted: false,
    userVote: null,
  },
];

const QuestionDetail = ({questionId}: any) => {
  const router = useRouter();
  const [question, setquestion] = useState<any>(null);
  const [answer, setanswer] = useState<any>()
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false)
  const [loading, setloading] = useState(true);
  const { user } = useAuth();

 useEffect(() => {
  if (!questionId) return; 
    const fetchuser = async () => {
      try {
        const res = await axiosInstance.get("/question/getallquestion");
        const matchedquestion = res.data.data.find(
          (u: any) => u._id === questionId
        );
        setanswer(matchedquestion.answer);
        setquestion(matchedquestion);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };
    fetchuser();
  }, [questionId]);
  if (loading) {
    return (
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    );
  }
  if (!question) {
    return (
      <div className="text-center text-gray-500 mt-4">No question found.</div>
    );
  }

  //  Voting logic
  const handleVote = async (vote: String) => {
    if(!user){
      toast.info("Please login to continue")
      router.push("/auth")
      return
    }
    try {
      const res = await axiosInstance.patch(`/question/vote/${question._id}`, {
        value: vote,
        userid: user?._id,
      });
      if (res.data.data) {
        setquestion(res.data.data);
        toast.success("Vote Updated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Vote question");
    }
  };

  // Bookmark toggle
  const handleBookmark = () => {
    setquestion((prev: any) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
  };

  //Submitting Answer
  const handleSubmitanswer = async () => {
    if(!user){
      toast.info("Please login to continue")
      router.push("/auth")
      return
    }
    if (!newAnswer.trim()) return;
    setisSubmitting(true)
    try {
      const res = await axiosInstance.post(`/answer/postanswer/${question?._id}`, {
        noofanswer: question.noofanswer,
        answerbody: newAnswer,
        useranswered: user.name,
        userid: user._id,
      });
      if (res.data.data) {
        const newObj = {
          answerbody: newAnswer,
          useranswered: user.name,
          userid: user._id,
          answeredon: new Date().toISOString(),
        };
        setquestion((prev: any) => ({
          ...prev,
          noofanswer: prev.noofanswer + 1,
          answer: [...(prev.answer || []), newObj],
        }));
        toast.success("Answer Uploaded");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Upload answer");
    }finally{
      setNewAnswer("")
      setisSubmitting(false)
    }
    
  }



  // Delete question 
  const handleDelete = async () => {
    if (!user) {
      toast.info("Please login to continue")
      router.push("/auth")
      return
    }
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try { 
      const res = await axiosInstance.delete(
        `/question/delete/${question._id}`
      );
      if (res.data.message) {
        toast.success(res.data.message);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };

  
    const handleDeleteanswer = async (id: String) => {
    if(!user){
      toast.info("Please login to continue")
      router.push("/auth")
      return
    }
    if (!window.confirm("Are you sure you want to delete this answer?"))
      return;
    try {
      const res = await axiosInstance.delete(`/answer/delete/${question._id}`, {
        data: {
          noofanswer: question.noofanswer,
          answerid: id,
        },
      });
      if (res.data.data) {
        const updateanswer = question.answer.filter(
          (ans: any) => ans._id !== id
        );
        setquestion((prev: any) => ({
          ...prev,
          noofanswer: updateanswer.length,
          answer: updateanswer,
        }));
        toast.success("deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };

  return (
    <div className="max-w-5xl mx-auto overflow-auto">
      {/* 🧩 Question Header */}
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-900">
          {question.title}
        </h1>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4" />
          <span>Asked {new Date(question.askedon).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 🧱 Question Content */}
      <Card className="mb-8 border border-gray-200">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Voting Section */}
            <div className="flex sm:flex-col items-center p-4 border-b sm:border-b-0 sm:border-r border-gray-200 ">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("upvote")}
                className="p-2 text-gray-600 hover:text-orange-500 "
              >
                <ChevronUp className="w-6 h-6" />
              </Button>
              <span className="text-gray-600 font-bold text-lg">{question.upvote.length - question.downvote.length}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("downvote")}
                className="p-2 text-gray-600 hover:text-orange-500 "
              >
                <ChevronDown className="w-6 h-6" />
              </Button>

              <div className="flex sm:flex-col gap-3 mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 ${question.isBookmarked
                    ? "text-yellow-500"
                    : "text-gray-600 hover:text-yellow-500"
                    }`}
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className="w-5 h-5"
                    fill={question.isBookmarked ? "currentColor" : "none"}
                  />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-gray-600">
                  <History className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Question Body */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="prose max-w-none mb-6">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: question.questionbody
                      .replace(
                        /## (.*)/g,
                        '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900">$1</h3>'
                      )
                      .replace(
                        /```(\w+)?\n([\s\S]*?)```/g,
                        '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$2</code></pre>'
                      )
                      .replace(
                        /`([^`]+)`/g,
                        '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>'
                      )
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^/, '<p class="mb-4">')
                      .replace(/$/, "</p>")
                      .replace(
                        /\n(\d+\. .*)/g,
                        '<ol class="list-decimal list-inside my-4"><li>$1</li></ol>'
                      ),
                  }}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {question.questiontags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer (share, flag, delete) */}
              <div className="flex justify-between items-center mt-8">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4 mr-1" /> Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="w-4 h-4 mr-1" /> Flag
                  </Button>
                  {question.userid === user?._id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-4 h-4 mr-1" /> Delete
                  </Button>
                )}
                </div>

                <Link href={`/users/${question.userid}`} className="flex items-center gap-2">
                  <Avatar className="bg-gray-200 rounded-full">
                    <AvatarFallback>{question.userposted[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-blue-600 font-medium">
                    {question.userposted}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Section */}
      <div>
        <h2>{question.answer.length} Answer{question.answer.length !== 1 ? "s" : ""}</h2>
        <div>{question.answer.map((ans: any) => (
          <Card key={ans.id}>
            <CardContent>
              <div>
                <div>
                  <div>
                    <div
                      className="text-gray-800 leading-relaxed prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: ans.answerbody
                          .replace(/## (.*)/g, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
                          .replace(
                            /```(\w+)?\n([\s\S]*?)```/g,
                            '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$2</code></pre>'
                          )
                          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded">$1</code>')
                          .replace(/\n\n/g, "</p><p>")
                          .replace(/^/, "<p>")
                          .replace(/$/, "</p>"),
                      }}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-10">
                    <div className="flex gap-2 ">
                      <Button
                        variant='ghost'
                        size='sm'
                        className="text-black hover:text-gray-500"
                      >
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className="text-black hover:text-gray-500"
                      >
                        <Flag className="w-4 h-4 mr-1" />
                        Flag
                      </Button>

                      {ans.userid === user?._id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteanswer(ans._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                      )}
                    </div>
                      
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">answered {ans.answeredon}</span>
                      <Link
                        href={`/users/${ans.userid}`}
                        className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                      >
                      </Link>
                      <Avatar className="w-8 h-8 rounded-full bg-gray-200">
                        <AvatarFallback className="text-sm">
                          {ans.useranswered[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-blue-600 font-medium">
                          {ans.useranswered}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Your Answer
          </h3>
          <Textarea
            placeholder="Write your answer here... You can use Markdown formatting."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="min-h-32 mb-4 resize-none focus:ring-blue-200 focus:border-blue-500"
          />
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={handleSubmitanswer}
              disabled={!newAnswer.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Posting..." : "Post Your Answer"}
            </Button>
            <p className="text-sm text-gray-600">
              By posting your answer, you agree to the{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                privacy policy
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                terms of service
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default QuestionDetail;
