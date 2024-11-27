import React from "react";

export default function Loading(props) {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-30">
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-4 relative">
          {/* Modal Content */}
          <div className="flex justify-center text-base w-auto py-4">
            <div>
              <h1 className="text-white flex justify-center pb-4 text-base font-semibold">
                {props?.loaderMessage ? props?.loaderMessage : "Please wait..."}
              </h1>
              <div className="loader w-[450px] h-8 flex flex-wrap items-end justify-center my-0 mx-auto">
                <div className="loader1"></div>&nbsp;&nbsp;
                <div className="loader2"></div>&nbsp;&nbsp;
                <div className="loader3"></div>&nbsp;&nbsp;
                <div className="loader4"></div>&nbsp;&nbsp;
                <div className="loader5"></div>&nbsp;&nbsp;
                <div className="loader6"></div>&nbsp;&nbsp;
                <div className="loader7"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
