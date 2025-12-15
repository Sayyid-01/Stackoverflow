import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PasswordResetSuccess() {
  const router = useRouter();

  // Redirect back to login after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center w-11/12 max-w-md">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">
          ✅ Password Reset Successful
        </h1>
        <p className="text-gray-700 mb-3">
          A new password has been sent to your registered email or phone number.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You’ll be redirected to the login page in a few seconds...
        </p>
        <button
          onClick={() => router.push("/auth")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
        >
          Go to Login Now
        </button>
      </div>
    </div>
  );
}
