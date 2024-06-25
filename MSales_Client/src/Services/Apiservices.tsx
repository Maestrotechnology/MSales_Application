import axios from "./Axios";

export const Loginservice = (data: FormData) => {
  return axios.post("login", data);
};
export const forgotpassword = (data: FormData) => {
  return axios.post("forgotPassword", data);
};
export const verifyotp = (data: FormData) => {
  return axios.post("verify_otp", data);
};
export const resetotp = (data: FormData) => {
  return axios.post("resend_otp", data);
};
export const resetPassword = (data: FormData) => {
  return axios.post("reset_password", data);
};
export const changePasswordservice = (data: FormData) => {
  return axios.post("changePassword", data);
};
//dashboard Data
export const DashboardData = (data: FormData) => {
  return axios.post("dashboard/all_data_count", data);
};

//Dropdown
export const stateDropdown = (data: FormData) => {
  return axios.post("dropdown/stateDropDown", data);
};
export const DistrictDropdown = (data: FormData) => {
  return axios.post("dropdown/districtDropDown", data);
};
export const cityDropdown = (data: FormData) => {
  return axios.post("dropdown/cityDropDown", data);
};
export const userTypedropdown = (data: FormData) => {
  return axios.post("dropdown/userDropdown", data);
};
export const customerDetailsDropdown = (data: FormData) => {
  return axios.post("dropdown/dropdown_customer", data);
};
export const requirementDropdown = (data: FormData) => {
  return axios.post("dropdown/dropdownRequirements", data);
};
export const enquiryDropdown = (data: FormData) => {
  return axios.post("dropdown/dropdownEnquiry", data);
};
export const leadDropdown = (data: FormData) => {
  return axios.post("dropdown/dropdownLead", data);
};
export const CompetitorDropdown = (data: FormData) => {
  return axios.post("dropdown/dropdownCompetitor", data);
};

export const EmployeeDropdown = (data: FormData) => {
  return axios.post("dropdown/employeeDropDown", data);
};
export const customerCategoryDropdown = (data: FormData) => {
  return axios.post("/dropdown/dropdownCustomerCategory", data);
};
export const statusFilterOption = (data: FormData) => {
  return axios.post("/dropdown/dropdownLead", data);
};
//userManagement
export const createuser = (data: FormData) => {
  return axios.post("user/create_user", data);
};
export const userListservices = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`user/list_users?page=${page}&size=${size}`, data);
};
export const updateuser = (data: FormData) => {
  return axios.post("user/update_user", data);
};
export const viewuser = (data: FormData) => {
  return axios.post("user/view_user", data);
};
export const deleteuser = (data: FormData) => {
  return axios.post("user/delete_user", data);
};
export const activeInactiveStatus = (data: FormData, signal: any) => {
  return axios.post("useractive_inactive_user", data);
};
export const changePassword = (data: FormData) => {
  return axios.post("changePassword", data);
};

export const getcutomerDetails = (data: FormData) => {
  return axios.post("user/get_customer_details", data);
};
//Leades
export const LeadsListservices = (
  page: number,
  size: number,
  data: FormData,
  signal: AbortSignal
) => {
  return axios.post(`lead/list_lead?page=${page}&size=${size}`, data, {
    signal,
  });
};
export const createLeads = (data: FormData) => {
  return axios.post("lead/create_lead", data);
};
export const deleteLeads = (data: FormData) => {
  return axios.post("lead/delete_lead", data);
};
export const viewLeads = (data: FormData) => {
  return axios.post("lead/view_lead", data);
};
export const updateLeads = (data: FormData) => {
  return axios.post("lead/lead_update", data);
};
export const leadsHistory = (page: number, size: number, data: FormData) => {
  return axios.post(`lead/listLeadHistory?page=${page}&size=${size}`, data);
};
export const leadsReassign = (data: FormData) => {
  return axios.post("lead/lead_reassign", data);
};
export const attentionReportServices = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`lead/attention_lead?page=${page}&size=${size}`, data);
};

export const addMessageContentServices = (data: FormData) => {
  return axios.post("/lead/add_content", data);
};
export const readMessageContentServices = (data: FormData) => {
  return axios.post("/lead/view_content", data);
};
// masters

export const ListCatecory = (page: number, size: number, data: FormData) => {
  return axios.post(`masters/list_category?page=${page}&size=${size}`, data);
};

export const deletecategory = (data: FormData) => {
  return axios.post("masters/delete_customer_category", data);
};
export const createcategory = (data: FormData) => {
  return axios.post("masters/create_category", data);
};
export const updatecategory = (data: FormData) => {
  return axios.post("masters/update_category", data);
};

// Enquiry

export const Listenquiry = (page: number, size: number, data: FormData) => {
  return axios.post(
    `masters/list_enquiry_type?page=${page}&size=${size}`,
    data
  );
};

export const deleteenquiry = (data: FormData) => {
  return axios.post("masters/delete_enquire_type", data);
};
export const createenquiry = (data: FormData) => {
  return axios.post("masters/create_enquiry", data);
};
export const updateenquiry = (data: FormData) => {
  return axios.post("masters/update_Enquiry", data);
};

// Requiremtnts

export const Listrequirement = (page: number, size: number, data: FormData) => {
  return axios.post(
    `masters/list_requirements?page=${page}&size=${size}`,
    data
  );
};
export const deleterequirement = (data: FormData) => {
  return axios.post("masters/delete_requirements", data);
};
export const createrequirement = (data: FormData) => {
  return axios.post("masters/create_requirement", data);
};
export const updaterequirement = (data: FormData) => {
  return axios.post("masters/update_requirements", data);
};

// Lead Status

export const ListleadStatus = (page: number, size: number, data: FormData) => {
  return axios.post(`masters/list_lead_status?page=${page}&size=${size}`, data);
};
export const deleteleadStatus = (data: FormData) => {
  return axios.post("masters/delete_lead_status", data);
};
export const createleadStatus = (data: FormData) => {
  return axios.post("masters/create_lead_status", data);
};
export const updateleadStatus = (data: FormData) => {
  return axios.post("masters/update_lead_status", data);
};

// Lead Status

export const Listcompetitor = (page: number, size: number, data: FormData) => {
  return axios.post(`masters/list_competitors?page=${page}&size=${size}`, data);
};
export const deletecompetitor = (data: FormData) => {
  return axios.post("masters/delete_Competitors", data);
};
export const createcompetitor = (data: FormData) => {
  return axios.post("masters/create_competitor", data);
};
export const updatecompetitor = (data: FormData) => {
  return axios.post("masters/update_competitor", data);
};
export const leadchartreport = (data: FormData) => {
  return axios.post("reports/leadReport", data);
};
export const dropdownLead = (data: FormData) => {
  return axios.post("dropdown/dropdownLead", data);
};
export const competitorDropdown = (data: FormData) => {
  return axios.post("dropdown/dropdownCompetitor", data);
};
export const changeStatus = (data: FormData) => {
  return axios.post("lead/changeLeadStatus", data);
};
//CustomerManagement
export const customerListServices = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/user/list_customer?page=${page}&size=${size}`, data);
};
export const deleteCustomerServices = (data: FormData) => {
  return axios.post("/user/delete_customer", data);
};
export const createCustomerServices = (data: FormData) => {
  return axios.post("/user/create_customer", data);
};
export const updateCustomerServices = (data: FormData) => {
  return axios.post("/user/update_customer", data);
};
export const pieChartdataservices = (data: FormData) => {
  return axios.post("/reports/pie_chart", data);
};

export const DealerwisereportService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(
    `/dashboard/dealer_wise_report?page=${page}&size=${size}`,
    data
  );
};

export const changeStatusAttentionService = (data: FormData) => {
  return axios.post("lead/changeStatusAttention", data);
};

//performance report
export const performanceReport = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(
    `/reports/dealerWisePerformance?page=${page}&size=${size}`,
    data
  );
};

//media
export const uploadmediaFile = (data: FormData) => {
  return axios.post("media/uploadFile", data);
};
export const listmediaFile = (page: number, size: number, data: FormData) => {
  return axios.post(`/media/listMedia?page=${page}&size=${size}`, data);
};
export const deletemediafile = (data: FormData) => {
  return axios.post("/media/deleteAttachments", data);
};
export const hotLeadsServices = (data: FormData) => {
  return axios.post("/lead/hot_lead", data);
};
export const listMediaLeads = (page: number, size: number, data: FormData) => {
  return axios.post(`/list_leadmedia?page=${page}&size=${size}`, data);
};
export const deleteMediaLeads = (data: FormData) => {
  return axios.post("/delete_lead_media", data);
};
export const importListLead = (data: FormData) => {
  return axios.post("/importLead", data);
};
export const countryCodeDropdown = (data: FormData) => {
  return axios.post("/dropdown/dropdown_country", data);
};

//Followup

export const ListFollowUpService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`list_followup?page=${page}&size=${size}`, data);
};

export const ChangeInAciveStatusService = (data: FormData) => {
  return axios.post("active_inactive_followup", data);
};

export const CreateFollowUpService = (data: FormData) => {
  return axios.post("add_followup", data);
};

export const EditFollowUpService = (data: FormData) => {
  return axios.post("edit_followup", data);
};

export const DeleteFollowUpService = (data: FormData) => {
  return axios.post("delete_followup", data);
};

export const FollowUpChangeStatusService = (data: FormData) => {
  return axios.post("update_followup", data);
};
export const logoutapiService = (data: FormData) => {
  return axios.post("/logout", data);
};
export const dailyPieChartreportService = (data: FormData) => {
  return axios.post("/reports/employee_pie_chart", data);
};
export const dailyBarchartReport = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(
    `/reports/employee_lead_report?page=${page}&size=${size}`,
    data
  );
};
