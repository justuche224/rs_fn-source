import axios from "axios";

export const checkKYCStatus = async () => {
  let status = null;
  await axios
    .get("https://server.resonantfinance.org/api/kyc/status", {
      withCredentials: true,
    })
    .then((res) => {
      status = res.data.status;
    })
    .catch((err) => {
      console.log(err);
    });
  return status;
};
