import axiosErp from "./AxiosErp";

export const loginAccess = (data: FormData) => {
  return axiosErp.post("/login/access-token", data);
};

export const checkin = (data: FormData) => {
  return axiosErp.post("/checkin", data);
};
export const checkout = (data: FormData) => {
  return axiosErp.post("/checkout", data);
};
export const addTaskservices = (data: FormData) => {
  return axiosErp.post("/task/add_task", data);
};
export const projectListservices = (page: number, size: number) => {
  return axiosErp.post(`/list_project?page=${page}&size=${size}`);
};
export const developersListservices = (page: number, size: number) => {
  return axiosErp.post(`/list_developers?page=${page}&size=${size}`);
};
