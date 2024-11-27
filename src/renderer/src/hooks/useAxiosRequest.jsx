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
    let defaultHeaders = {
      Authorization: `Bearer ${token}`,
    };

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
            title: "Success",
            text: successMessage || res?.data?.message || "Submitted Successfully",
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
            title: "Error",
            text:
              errorMessage ||
              error?.response?.data?.message ||
              error?.response?.data?.Message ||
              "Failed, try again",
          });
        }
      });
  };

  const { error, resData, isLoading, success } = reqResponse;

  return { apiAction, resData, isLoading, error, success, resetData };
};


// ======== Example Usage =============
// const loginApi = useAxiosRequest({});
// loginApi.apiAction({
//   url: 'www.login.com',
//   method: 'POST',
//   payload: {
//     password: '1234',
//     userId: 'demo@gmail.com',
//   },
//   isToast: true,
//   cb: (data) => {
//     data.email = 'Taufiqur Rahman';
//   },
// });
