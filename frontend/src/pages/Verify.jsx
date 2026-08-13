import React from "react";

const Verify = () => {
  return (
    <div className="relative w-full h-[760px] overflow-hidden">
      <div className="min-h-screen flex items-center justify-center bg-orange-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-serif text-black-500 mb-4">
            Check Your Mail 📧
                  </h2>
                  <p className="text-gray-600 text-sm font-serif">
                      We've Sent You an Email to Verify Your Account. Please Check Your Inbox and Click the Verification Link
                  </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
