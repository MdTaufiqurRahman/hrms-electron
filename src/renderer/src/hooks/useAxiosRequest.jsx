import axios from "axios";
import { useState } from "react";
import { useAlert } from "./useAlert";

export const useAxiosRequest = (initData) => {
  const [reqResponse, setReqResponse] = useState({
    error: "",
    resData: initData || "",
    isLoading: false,
    success: "",
  });

  const { showAlert } = useAlert();

  const resetData = () => {
    setReqResponse({
      error: "",
      resData: initData || "",
      isLoading: false,
      success: "",
    });
  };

  const apiAction = ({
    method,
    url = "",
    params,
    payload,
    headers = {},
    cb,
    isToast,
    successMessage,
    errorMessage,
    successHtml,
    errorHtml,
  }) => {
    const requestUrl = url;

    const token = sessionStorage.getItem("token");

    setReqResponse({
      error: "",
      resData: initData || "",
      isLoading: true,
      success: "",
    });

    // Initialize default headers
    let defaultHeaders = {};

    // Add Authorization header if token is available
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Set 'Content-Type' based on the payload type
    if (payload instanceof FormData) {
      defaultHeaders["Content-Type"] = "multipart/form-data";
    } else {
      defaultHeaders["Content-Type"] = "application/json";
    }

    axios({
      method: method || "get",
      url: requestUrl,
      data: payload,
      params: params,
      headers: { ...defaultHeaders, ...headers }, // Merge default headers with custom headers
    })
      .then((res) => {
        setReqResponse((prev) => ({
          ...prev,
          error: "",
          resData: res?.data || initData,
          isLoading: false,
          success: res?.data?.message,
        }));

        cb && cb(res?.data);

        if (isToast) {
          showAlert({
            type: "success",
            html:
              successHtml ||
              `<p>${
                successMessage || res?.data?.message || "Submitted Successfully"
              }</p>`,
          });
        }
      })
      .catch((error) => {
        setReqResponse((prev) => ({
          ...prev,
          error: error,
          resData: initData || "",
          isLoading: false,
          success: "",
        }));

        if (isToast) {
          showAlert({
            type: "error",
            html:
              errorHtml ||
              `<p>${
                errorMessage ||
                error?.response?.data?.message ||
                error?.response?.data?.Message ||
                "Failed, try again"
              }</p>`,
          });
        }
      });
  };

  const { error, resData, isLoading, success } = reqResponse;

  return { apiAction, resData, isLoading, error, success, resetData };
};

// Api call using the custom hook

// const  nameAnyAction  = useAxiosRequest({});  // Initialize the custom hook
// nameAnyAction.apiAction({
//   method: "get",
//   url: "https://backend.testsprint360.com/subscription/plan/public/all",
//   isToast: true,
//   successMessage: "API call successful", // Optional
//   errorMessage: "API call failed", // Optional
//   cb: (data) => {
//     console.log(data);
//   },
