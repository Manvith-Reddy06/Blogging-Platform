import React from "react";

export default function Profile({ session }) {
  if (!session) {
    return <p>Please log in to view your profile.</p>;
  }

  const userName =
    session.user.user_metadata?.full_name ||
    session.user.email;

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Profile
        </h1>
        <p className="text-lg text-center text-gray-600">
          <strong>Name:</strong> {userName}
        </p>
      </div>
    </div>
  );
}