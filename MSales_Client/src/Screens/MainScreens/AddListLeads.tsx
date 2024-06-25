import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  Inputlengths,
  LoginUserData,
  REGEX,
  useToken,
} from "../../Shared/Constants";
import {
  Button,
  Col,
  GetProp,
  Image,
  Modal,
  Radio,
  Row,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { Commoninput } from "../../Components/InputComponents/CommonInput";
import {
  Addressvalidation,
  Number_Validation,
  getCatchMsg,
  getTableSNO,
  isImage,
  isNumericString,
  isValidNumber,
  removeNonNumericCharacters,
  replaceText,
} from "../../Shared/Methods";
import { CommonSelect } from "../../Components/InputComponents/CommonSelect";
import {
  EmployeeDropdown,
  cityDropdown,
  countryCodeDropdown,
  createLeads,
  customerCategoryDropdown,
  customerDetailsDropdown,
  deleteMediaLeads,
  enquiryDropdown,
  getcutomerDetails,
  listMediaLeads,
  requirementDropdown,
  stateDropdown,
  updateLeads,
  userTypedropdown,
} from "../../Services/Apiservices";
import classes from "./mainscreen.module.css";
import CommonButton from "../../Components/CommonButton/CommonButton";
import { toast } from "react-toastify";
import PageHeader from "../../Components/PageHeader";
import { CommonDate } from "../../Components/InputComponents/CommonDate";
import { CommonTextArea } from "../../Components/InputComponents/CommonTextarea";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { CommonCheckBox } from "../../Components/InputComponents/Commoncheckbox";
import {
  handleLeadsFilters,
  handleNotificationFilters,
} from "../../Store/Redux/Reducers/DashboardReducers";
import { useDispatch } from "react-redux";
import GlobalModal from "../../Components/GlobalModal";
import Confirmation from "../../Modals/Confirmation";
import files from "../../Asserts/Icons/folders.svg";
import uploadicon from "../../Asserts/Icons/download.png";
import deleteicon from "../../Asserts/Icons/delete.png.png";
import trash from "../../Asserts/Icons/trash.png";
import CommonPagination from "../../Components/CommonPagination";
import Loader from "../../SharedComponents/Loader/Loader";
import Deleteconfirmation from "../../Modals/Deleteconfirmation";
import parsePhoneNumber, {
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { CountryDropdownDataProps } from "../../types/dropdown";
// s
interface FileItem {
  uid?: string;
  name?: string;
  status?: string;
  url?: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export default function AddListLeads() {
  const token = useToken();
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const { state } = useLocation();
  const [category, setcategory] = useState([]);
  const [whatsapp_no, setwhatsapp_no] = useState(false);
  const [contactPersonName, setContactPersonName] = useState(false);
  const [stateDropdownList, setStateDropdownList] = useState([]);
  const [cityDropdownList, setCityDropdownList] = useState([]);
  const [requirementsList, setRequirementList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [DealerList, setDealerList] = useState<any>([]);
  const [AssignedtoList, setAssignedtoList] = useState([]);
  const [cityalert, setcityalert] = useState(false);
  const [customerType, setCustomertype] = useState(1);
  const [enquiryDropdownList, setEnquiryDropdownList] = useState([]);
  const [confirmationModal, setconfirmationModal] = useState({
    status: false,
    data: "",
  });
  const [countryDropdownlist, setCountryDropdownlist] = useState<
    CountryDropdownDataProps[]
  >([]);
  const loginUserData = LoginUserData();
  const [phoneNumberString, setPhoneNumberString] = useState("");
  const [parsedPhoneNumber, setParsedPhoneNumber] = useState<any>(null);
  const [MediaList, setMediaList] = useState({
    items: [],
    page: 1,
    size: 10,
    total_count: 0,
  });
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [uploadFileListm, setUploadFileList] = useState<any>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState({
    status: false,
    data: null,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .required("Name is required"),
    company_name: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true),
    contact_person: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true),
    phone: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .required("* Phone Number Required")
      .strict(true)
      .test("phone", "Please enter valid phone number", function (value) {
        const { phone_code } = this.parent;
        if (
          phone_code === "+91" &&
          value &&
          !value?.match(REGEX.MOBILE_REGEX)
        ) {
          return false;
        } else if (!isValidNumber(value, getPhoneNumberLength(phone_code))) {
          return false;
        }
        return true;
      }),
    country_code: Yup.string().required("Country code is required"),
    email: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .email("Please enter valid email")
      .matches(REGEX.EMAIL, "Please enter valid email"),
    // .required("Email is required"),
    // .optional(),
    // state_id: Yup.string().required("State is required"),
    // city_id: Yup.string().required("City is required"),
    requirements_id: Yup.array()
      .min(1, "Please select atleast one requirement")
      .required("Requirement is required"),
    address: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .required("Address is required"),
    // area: Yup.string()
    //   .trim("Please remove leading and trailing spaces")
    //   .strict(true)
    //   .required("Area is required"),
    remark: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true),

    pincode: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .length(6, "Please enter valid pincode"),
    // .required("Pincode is required"),
    approxmateAmount: Yup.string().trim(
      "Please remove leading and trailing spaces"
    ),
    // .required("Approximate Amount is required"),
    enquiry_type_id: Yup.string().required("Lead source is required"),
    alternative_no: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .test("phone", "Please enter valid phone number", function (value) {
        const { alternative_code } = this.parent;
        if (
          alternative_code === "+91" &&
          value &&
          !value?.match(REGEX.MOBILE_REGEX)
        ) {
          return false;
        } else if (
          !isValidNumber(value, getPhoneNumberLength(alternative_code))
        ) {
          return false;
        }
        return true;
      }),
    whatsapp_no: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .test("phone", "Please enter valid phone number", function (value) {
        const { whatsappCountry_code } = this.parent;
        if (
          whatsappCountry_code === "+91" &&
          value &&
          !value?.match(REGEX.MOBILE_REGEX)
        ) {
          return false;
        } else if (
          !isValidNumber(value, getPhoneNumberLength(whatsappCountry_code))
        ) {
          return false;
        }
        return true;
      }),
    referencePhoneNumber: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .test("phone", "Please enter valid phone number", function (value) {
        const { referrer_phone_code } = this.parent;
        if (
          referrer_phone_code === "+91" &&
          value &&
          !value?.match(REGEX.MOBILE_REGEX)
        ) {
          return false;
        } else if (
          !isValidNumber(value, getPhoneNumberLength(referrer_phone_code))
        ) {
          return false;
        }
        return true;
      }),
  });
  // const PhoneNumberVAlidation = Yup.object({
  //   search_number:  Yup.string()
  //     .when("isType", {
  //       is: false,
  //       then: () =>
  //         Yup.string()
  //           .matches(REGEX.MOBILE_REGEX, "Please enter valid phone number")
  //           .required("* Phone Number Required"),
  //     })
  //     .trim("Please remove leading and trailing spaces")
  //     .strict(true)
  //     .matches(REGEX.MOBILE_REGEX, "Please enter valid phone number"),
  //   // .required("* Phone Number Required"),
  // });
  const PhoneNumberVAlidation = Yup.object({
    landline: Yup.string().min(6, "Please enter valid landline number").max(15),
    search_number: Yup.string().when("landline", {
      is: (val: string) => (!val && val?.trim() !== "" ? true : false),
      then: () =>
        Yup.string()
          .required("Phone number is required")
          .test(
            "search_number",
            "Please enter valid phone number",
            function (value) {
              const { country_code } = this.parent;
              if (
                country_code === "+91" &&
                value &&
                !value?.match(REGEX.MOBILE_REGEX)
              ) {
                return false;
              } else if (
                !isValidNumber(value, getPhoneNumberLength(country_code))
              ) {
                return false;
              }
              return true;
            }
          ),
      otherwise: () =>
        Yup.string().test(
          "search_number",
          "Please enter valid phone number",
          function (value) {
            const { country_code } = this.parent;
            if (
              country_code === "+91" &&
              value &&
              !value?.match(REGEX.MOBILE_REGEX)
            ) {
              return false;
            } else if (
              !isValidNumber(value, getPhoneNumberLength(country_code))
            ) {
              return false;
            }
            return true;
          }
        ),
    }),
  });
  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setValues,
    setFieldValue,
    resetForm,
    setFieldTouched,
    setFieldError,
    setTouched,
  } = useFormik({
    initialValues: {
      name: "",
      company_name: "",
      contact_person: "",
      address: "",
      area: "",
      phone: "",
      email: "",
      alternative_no: "",
      whatsapp_no: "",
      state: "",
      state_id: "",
      city: "",
      city_id: "",
      pincode: "",
      referenceName: "",
      referencePhoneNumber: "",
      requirements_name: "",
      requirements_id: [],
      enquiry_type_id: "",
      enquiry_type_name: "",
      customer_category_name: "",
      customer_category_id: "",
      receivedDate: dayjs(new Date()).format("YYYY-MM-DD"),
      scheduleDate: dayjs(new Date()).format("YYYY-MM-DD  HH:mm:ss"),
      exist_customer_name: "",
      exist_customer_id: "",
      dealer_id: null,
      dealerName: null,
      assignedTo: null,
      assignedUserName: null,
      lead_status: "",
      approxmateAmount: "",
      uploadFile: [],
      search_number: "",
      isType: state?.type === "edit" ? true : false,

      country_name: "India",
      country_code: "+91",
      whatsappCountry_code: "+91",
      alternative_code: "+91",
      phone_code: "+91",
      referrer_phone_code: "",
      remark: "",
      landline: "",
      customer_landline: "",
    },
    validationSchema:
      showDetails || state?.type === "edit"
        ? validationSchema
        : PhoneNumberVAlidation,
    onSubmit: () => {
      if (showDetails || state?.type === "edit") {
        if (state?.data) {
          handleUpdateLeads();
        } else {
          handleCreateUser();
        }
      } else {
        handleGetCustomerDetails();
        setValues({
          ...values,
          phone: values.search_number,
          landline: values.landline,
        });
        if (!errors.search_number) {
          setTouched({});
        }
      }
    },
  });

  const getPhoneNumberLength = (code?: string) => {
    if (code && countryDropdownlist?.length > 0) {
      const fndObj = [...countryDropdownlist]?.find(
        (ele) => ele?.value === code
      );

      return (fndObj?.number_length || "20")
        ?.split(",")
        ?.map((ele) => parseInt(ele));
    }
    return [20];
  };

  const handleChangeNumber = (event: any, name: string) => {
    if (Number_Validation(event)) {
      setFieldValue(name, event);
      if (name === "phone" && whatsapp_no) {
        setFieldValue("whatsapp_no", event);
      }
    }
  };
  const handlewhatsappClick = (whatsappnumber: string) => {
    // const whatsappURL = `https://wa.me/${whatsappnumber}?text=${encodeURIComponent(
    //   "Hello! I have a question"
    // )}`;
    // window.open(whatsappURL);
  };
  const handleCreateUser = () => {
    setLoader(true);
    let formData: any = new FormData();
    formData.append("country_code", values?.phone_code);
    formData.append("token", token);
    formData.append("name", values.name);
    if (values?.company_name) {
      formData.append("company_name", values.company_name);
    }
    if (values?.contact_person) {
      formData.append("contact_person", values.contact_person);
    }
    if (values.referenceName) {
      formData.append("referedBy", values.referenceName);
    }
    if (values.referencePhoneNumber) {
      formData.append("referedPhone", values.referencePhoneNumber);
    }
    formData.append("address", values.address);
    formData.append("area", values.area);
    formData.append("phone", values.phone);
    if (values?.email) {
      formData.append("email", values.email);
    }
    if (values?.customer_category_id) {
      formData.append("customer_category_id", values?.customer_category_id);
    }
    if (values?.alternative_no) {
      formData.append("alternative_no", values.alternative_no);
    }
    if (values?.whatsapp_no) {
      formData.append("whatsapp_no", values.whatsapp_no);
    }
    // if (values?.customer_category_id) {
    //   formData.append("customer_category_id", values.customer_category_id);
    // }
    if (values?.enquiry_type_id) {
      formData.append("enquiry_type_id", values.enquiry_type_id);
    }
    if (values?.receivedDate) {
      formData.append(
        "receivedDate",
        dayjs(values.receivedDate).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    if (values?.scheduleDate) {
      formData.append(
        "schedule_date",
        dayjs(values.scheduleDate).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    formData.append(
      "requirements_id",
      values.requirements_id?.length > 0
        ? values.requirements_id?.map((ele: any) => ele)
        : null
    );
    formData.append("state", values.state_id);
    formData.append("city", values.city_id);
    formData.append("Pincode", values.pincode);
    formData.append("approximate_amount", values.approxmateAmount);
    if (values?.dealer_id) {
      formData.append("dealer_id", values.dealer_id);
    }
    if (values?.assignedTo) {
      formData.append("assignedTo", values.assignedTo);
    }
    if (!values.exist_customer_id) {
      formData.append("isNew", "1");
    }
    if (fileList) {
      fileList.map((ele: any) =>
        formData.append("upload_file", ele.originFileObj)
      );
      // formData.append("upload_file", values.uploadFile);
    }
    if (values.country_code) {
      formData.append("phone_country_code", values.phone_code);
    }
    if (values.alternative_code) {
      formData.append("alter_country_code", values.alternative_code);
    }
    if (values.whatsappCountry_code) {
      formData.append("whatsapp_country_code", values.whatsappCountry_code);
    }
    if (values?.referrer_phone_code) {
      formData.append("refer_country_code", values.referrer_phone_code);
    }
    if (values.remark) {
      formData.append("remarks", values.remark);
    }
    if (values.customer_landline) {
      formData.append("landline_number", values.customer_landline);
    }
    createLeads(formData)
      .then((res) => {
        if (res.data?.status === 1) {
          toast.success(res.data.msg);
          // navigate("/leads");
          setconfirmationModal({
            status: true,
            data: values.whatsapp_no,
          });
          // handleWhatsappClick(values.whatsapp_no);

          resetForm();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      })
      .finally(() => {
        setLoader(false);
      });
  };

  //updateLeads
  const handleUpdateLeads = () => {
    setLoader(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("leadId", state?.data?.leadId);
    formData.append("name", values.name);
    if (values?.company_name) {
      formData.append("company_name", values.company_name);
    }
    if (values?.contact_person) {
      formData.append("contact_person", values.contact_person);
    }
    formData.append("address", values.address);
    formData.append("area", values.area);
    formData.append("phone", values.phone);
    if (values?.customer_category_id) {
      formData.append("customer_category_id", values?.customer_category_id);
    }
    if (values?.email) {
      formData.append("email", values.email);
    }
    if (values?.alternative_no) {
      formData.append("alternative_no", values.alternative_no);
    }
    if (values?.whatsapp_no) {
      formData.append("whatsapp_no", values.whatsapp_no);
    }
    // if (values?.customer_category_id) {
    //   formData.append("customer_category_id", values.customer_category_id);
    // }
    if (values?.enquiry_type_id) {
      formData.append("enquiry_type_id", values.enquiry_type_id);
    }
    if (values?.receivedDate) {
      formData.append(
        "receivedDate",
        dayjs(values.receivedDate).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    if (values?.scheduleDate) {
      formData.append(
        "schedule_date",
        dayjs(values.scheduleDate).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    formData.append("approximate_amount", values.approxmateAmount);
    if (values.uploadFile) {
      values.uploadFile.map((ele) => formData.append("upload_file", ele));
      // formData.append("upload_file", values.uploadFile);
    }
    formData.append(
      "requirements_id",
      values.requirements_id?.length > 0
        ? values.requirements_id?.map((ele: any) => ele)
        : null
    );
    formData.append("state", values.state_id);
    formData.append("city", values.city_id);
    formData.append("Pincode", values.pincode);
    if (values?.dealer_id) {
      formData.append("dealer_id", values.dealer_id);
    }
    if (values?.assignedTo) {
      formData.append("assignedTo", values.assignedTo);
    }
    if (values?.enquiry_type_id == "2") {
      if (values?.referenceName) {
        formData.append("referedBy", values.referenceName);
      }
      if (values?.referencePhoneNumber) {
        formData.append("referedPhone", values.referencePhoneNumber);
      }
    }
    if (fileList) {
      fileList.map((ele: any) => {
        if (ele.originFileObj) {
          formData.append("upload_file", ele.originFileObj);
        }
      });
      // formData.append("upload_file", values.uploadFile);
    }
    if (values.country_code) {
      formData.append("phone_country_code", values.phone_code);
    }
    if (values.alternative_code) {
      formData.append("alter_country_code", values.alternative_code);
    }
    if (values.whatsappCountry_code) {
      formData.append("whatsapp_country_code", values.whatsappCountry_code);
    }
    if (values?.referrer_phone_code) {
      formData.append("refer_country_code", values.referrer_phone_code);
    }
    if (values.remark) {
      formData.append("remarks", values.remark);
    }
    if (values.customer_landline) {
      formData.append("landline_number", values.customer_landline);
    }
    updateLeads(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          if (state?.status) {
            navigate("/leads/notificationlist");
          } else {
            navigate("/leads");
          }
          resetForm();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(getCatchMsg(err));
      })
      .finally(() => {
        setLoader(false);
      });
  };
  //StateDropdown
  const handleStateDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    stateDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.stateName,
              value: ele.stateId,
            };
          });
          setStateDropdownList(options);
        }
      })
      .catch((err) => {});
  };
  const handleCityDropdown = (ID: number) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("stateId", ID);
    cityDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.cityName,
              value: ele.cityId,
            };
          });
          setCityDropdownList(options);
        }
      })
      .catch((err) => {});
  };
  const handleRequirementDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    requirementDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.RequirementsName,
              value: ele.RequirementsId,
            };
          });
          setRequirementList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleEnquiryDropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    enquiryDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.enquiryName,
              value: ele.enquiryId,
            };
          });
          setEnquiryDropdownList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const handleCustomersDetailsdropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    customerDetailsDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              title: ele?.userName,
              label: ele.userName,
              value: ele.userId,
            };
          });
          setCustomerDetails(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const handleDealardropdown = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("isDealer", 1);
    userTypedropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.userName,
              value: ele.userId,
            };
          });
          // setValues({
          //   ...values,
          //   dealer_id: options[0]?.value,
          //   dealerName: options[0]?.label,
          // });
          if (state?.type === "edit") {
            setValues((pre: any) => {
              return {
                ...pre,
                dealer_id: state?.data?.dealerId
                  ? state?.data?.dealerId
                  : options[0]?.value,
                dealerName: state?.data?.dealerName
                  ? state?.data?.dealerName
                  : options[0]?.label,
              };
            });
          } else {
            setValues((pre: any) => {
              return {
                ...pre,
                dealer_id: options[0]?.value,
                dealerName: options[0]?.label,
              };
            });
          }

          setDealerList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handelAssignedTodropdown = (ID: any) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("dealerId", ID);

    EmployeeDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.userName,
              value: ele.userId,
            };
          });
          setAssignedtoList(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleGetCustomerDetails = () => {
    let formData = new FormData();
    formData.append("token", token);
    if (values.search_number && values.country_code) {
      formData.append("phoneNo", values.search_number);
      formData.append("country_code", values.country_code);
    }
    if (values.landline) {
      formData.append("landline_number", values.landline);
    }

    // formData.append("customerId", Id);
    getcutomerDetails(formData)
      .then((res) => {
        setShowDetails(true);
        if (res.data.status === 1) {
          handleSetvalues(res.data.data);
          if (
            res.data?.data?.phoneNumber &&
            res.data?.data?.whatsapp_no &&
            res.data?.data?.phoneNumber === res.data?.data?.whatsapp_no
          ) {
            setwhatsapp_no(true);
          } else {
            setwhatsapp_no(false);
          }
        } else {
          handleSetvalues(res.data.data);
          setwhatsapp_no(false);
        }
        if (
          res?.data?.data?.name &&
          res?.data?.data?.userName &&
          res?.data?.data?.name === res?.data?.data?.userName
        ) {
          setContactPersonName(true);
        } else {
          setContactPersonName(false);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const handleCustomerdropdown = () => {
    let formData = new FormData();
    formData.append("token", token);
    customerCategoryDropdown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          let options = res.data.data.map((ele: any) => {
            return {
              label: ele.categoryName,
              value: ele.categoryId,
            };
          });
          setcategory(options);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleCountrycodeDropdown = () => {
    setLoader(true);
    let formData = new FormData();
    formData.append("token", token);
    countryCodeDropdown(formData)
      .then((res) => {
        if (res.data.status) {
          let options = res.data.data.map((ele: any) => {
            return {
              ...ele,
              label: `${ele?.country_name} (${ele?.country_code})`,
              value: ele?.country_code,
            };
          });
          setCountryDropdownlist(options);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const getLeadstatusName = () => {
    let isdata = values?.requirements_id?.find((ele: any) => ele === 20);

    if (state?.data) {
      return values?.lead_status;
    } else if (isdata === 20) {
      return "Not Valid";
    } else if (values?.lead_status) {
      return values?.lead_status;
    } else {
      return "Unassigned";
    }
    // if()
  };
  // useEffect(() => {
  //   if (token && customerType === 2 && values.exist_customer_id) {
  //     handleGetCustomerDetails();
  //   }
  // }, [token, customerType, values.exist_customer_id]);
  useEffect(() => {
    if (token) {
      if (state?.type === "edit") {
        handleSetvalues(state?.data);

        if (
          state?.data?.phoneNumber &&
          state?.data?.whatsapp_no &&
          state?.data?.phoneNumber === state?.data?.whatsapp_no
        ) {
          setwhatsapp_no(true);
        } else {
          setwhatsapp_no(false);
        }
        if (
          state?.data?.name &&
          state?.data?.userName &&
          state?.data?.name === state?.data?.userName
        ) {
          setContactPersonName(true);
        } else {
          setContactPersonName(false);
        }
      }
      if (state?.name === "lead") {
        dispatch(
          handleLeadsFilters({
            page: state?.page,
            size: state?.size,
            filters: state?.filters,
          })
        );
      } else if (state?.name === "notification") {
        dispatch(
          handleNotificationFilters({
            page: state?.page,
            size: state?.size,
            filters: state?.filters,
          })
        );
      }
      // handleStateDropdown();
      // handleCityDropdown();
      handleRequirementDropdown();
      handleEnquiryDropdown();
      handleCustomersDetailsdropdown();
      handleDealardropdown();
      handleCustomerdropdown();
      handleCountrycodeDropdown();
      // handelAssignedTodropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const handleListMediaFiles = (page: number, size: number) => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("lead_id", state?.data?.leadId);
    listMediaLeads(page, size, formData)
      .then((res) => {
        if (res.data.status === 1) {
          let setkeyData = res.data?.data?.items?.map(
            (ele: any, ind: number) => {
              return { ...ele, Sno: getTableSNO(page, size, ind), key: ind };
            }
          );
          setMediaList({ ...res?.data, items: setkeyData });
          const urls = res.data.data.map((ele: any) => ({
            uid: ele.file_id,
            name: "file",
            status: "done", // set status to 'done' since the file already exists
            url: ele.url,
          }));
          // setFileList(urls);
          setUploadFileList(urls);
        }
      })
      .catch((err) => {});
  };
  const handleDeleteMediaFiles = () => {
    let formData = new FormData();
    formData.append("token", token);
    formData.append("lead_id", state?.data?.leadId);
    // @ts-ignore
    formData.append("file_id", isShowDeleteModal?.data?.uid);
    deleteMediaLeads(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          setIsShowDeleteModal({
            status: false,
            data: null,
          });
          handleListMediaFiles(page, 10);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const handleSetvalues = (getexistcustomer: any) => {
    // if (getexistcustomer?.dealerId) {
    //   handelAssignedTodropdown(getexistcustomer?.dealerId);
    // }
    if (getexistcustomer?.stateId) {
      handleCityDropdown(getexistcustomer?.stateId);
    }

    setValues((pre) => {
      return {
        ...pre,
        enquiry_type_id: getexistcustomer?.enquiryTypeId
          ? getexistcustomer?.enquiryTypeId
          : null,
        enquiry_type_name: getexistcustomer?.enquiryTypeName
          ? getexistcustomer?.enquiryTypeName
          : null,
        name: getexistcustomer?.name ? getexistcustomer?.name : "",
        company_name: getexistcustomer?.company_name
          ? getexistcustomer?.company_name
          : "",
        approxmateAmount: getexistcustomer?.approximate_amount
          ? getexistcustomer?.approximate_amount
          : "",
        contact_person: getexistcustomer?.userName
          ? getexistcustomer?.userName
          : "",
        referenceName: getexistcustomer?.referedBy
          ? getexistcustomer?.referedBy
          : "",
        referencePhoneNumber: getexistcustomer?.referNumber
          ? getexistcustomer?.referNumber
          : "",
        referrer_phone_code: getexistcustomer?.refer_country_code
          ? getexistcustomer?.refer_country_code
          : "",
        address: getexistcustomer?.address ? getexistcustomer?.address : "",
        area: getexistcustomer?.area ? getexistcustomer?.area : "",
        phone: getexistcustomer?.phoneNumber
          ? getexistcustomer?.phoneNumber
          : values.search_number,
        email: getexistcustomer?.email ? getexistcustomer?.email : "",
        alternative_no: getexistcustomer?.alternativeNumber
          ? getexistcustomer?.alternativeNumber
          : "",
        whatsapp_no: getexistcustomer?.whatsapp_no
          ? getexistcustomer?.whatsapp_no
          : "",
        phone_code: getexistcustomer?.phone_country_code
          ? getexistcustomer?.phone_country_code
          : values.country_code,
        alternative_code: getexistcustomer?.alter_country_code
          ? getexistcustomer?.alter_country_code
          : "+91",
        whatsappCountry_code: getexistcustomer?.whatsapp_country_code
          ? getexistcustomer?.whatsapp_country_code
          : "+91",
        customer_landline: getexistcustomer?.landline_number
          ? getexistcustomer?.landline_number
          : values.landline,
        receivedDate:
          customerType === 2
            ? dayjs(new Date()).format("YYYY-MM-DD")
            : getexistcustomer?.receivedAt
            ? getexistcustomer?.receivedAt
            : dayjs(new Date()).format("YYYY-MM-DD"),
        scheduleDate:
          customerType === 2
            ? dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
            : getexistcustomer?.schedule_date
            ? getexistcustomer?.schedule_date
            : "",
        state_id: getexistcustomer?.stateName
          ? getexistcustomer?.stateName
          : "",
        // state_id: getexistcustomer?.stateId ? getexistcustomer?.stateId : "",
        city_id: getexistcustomer?.cityName ? getexistcustomer?.cityName : "",
        // city_id: getexistcustomer?.cityId ? getexistcustomer?.cityId : "",
        pincode: getexistcustomer?.pincode ? getexistcustomer?.pincode : "",
        exist_customer_name: getexistcustomer?.userName
          ? getexistcustomer.userName
          : "",
        exist_customer_id: getexistcustomer?.customerId
          ? getexistcustomer?.customerId
          : null,
        dealer_id: getexistcustomer?.dealerId
          ? getexistcustomer?.dealerId
          : DealerList[0]?.value,
        dealerName: getexistcustomer?.dealerName
          ? getexistcustomer?.dealerName
          : DealerList[0]?.label,
        assignedTo: getexistcustomer?.assigned_to
          ? getexistcustomer?.assigned_to
          : null,
        assignedUserName: getexistcustomer?.assignedUserName
          ? getexistcustomer?.assignedUserName
          : null,
        requirements_id:
          getexistcustomer?.requirementsId?.length > 0
            ? getexistcustomer?.requirementsId?.map((ele: any) => ele?.reqId)
            : [],
        customer_category_id: getexistcustomer?.customerCategoryId
          ? getexistcustomer?.customerCategoryId
          : null,
        customer_category_name: getexistcustomer?.categoryName
          ? getexistcustomer?.categoryName
          : null,
        lead_status: getexistcustomer?.leadStatusName
          ? getexistcustomer?.leadStatusName
          : "open",
        remark: getexistcustomer?.remarks ? getexistcustomer?.remarks : "",
      };
    });
  };

  const handleclearValues = () => {
    setwhatsapp_no(false);
    setContactPersonName(false);
    resetForm();
  };

  useEffect(() => {
    if (token && loginUserData?.userType === 3) {
      handelAssignedTodropdown(loginUserData?.userId);
      // setValues({
      //   ...values,
      //   dealer_id: loginUserData?.userId,
      //   dealerName: loginUserData?.userName,
      // });
      setFieldValue("dealer_id", loginUserData?.userId);
      setFieldValue("dealerName", loginUserData?.userName);
      // setFieldValue("dealer_id", loginUserData?.userId);
    }
  }, [token, values.dealer_id]);
  const handleUpload = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess();
      // toast.success(`${file.name} uploaded successfully`);
    }, 1000);
  };
  const handleDelete = (file: FileItem) => {
    Modal.confirm({
      title: "Are you sure you want to delete this file?",
      onOk: () => {
        setFileList((prevList: any) =>
          prevList.filter((item: any) => item?.uid !== file?.uid)
        );
        toast.success(`${file.name} deleted successfully`);
      },
    });
  };

  useEffect(() => {
    if (token && state?.data?.leadId) {
      handleListMediaFiles(1, 10);
    }
  }, [token]);
  const setfieldsDisable = () => {
    if (state?.view) {
      return true;
    } else return false;
  };

  const handleRemove = (file: any) => {
    // @ts-ignore
    const updatedFileList = fileList.filter((item) => item?.uid !== file?.uid);
    toast.success("Remove Sucessfuly");
    setFileList(updatedFileList);
  };
  const handleValues = (val: any) => {
    return val === "" ? null : val;
  };
  const beforeUpload = (file: any) => {
    // Check if the file already exists in the fileList

    const fileExists = fileList.some(
      (existingFile: any) => existingFile.name === file.name
    );
    if (fileExists) {
      const updatedFileList = fileList.filter(
        (item: any) => item.name !== file.name
      );

      setFileList(updatedFileList);
      toast.error("Duplicate file detected. Please select a unique file.");
      return Promise.reject(new Error("Duplicate file detected"));
    }

    // If file doesn't exist, allow upload
    return Promise.resolve();
  };
  const getRequirement = () => {
    if (
      values?.requirements_id?.length !== state?.data?.requirementsId?.length
    ) {
      return true;
    } else {
      let reqState = state?.data?.requirementsId.reduce(
        (acc: any, val: any) => {
          // @ts-ignore
          if (values.requirements_id.includes(val.reqId)) {
            acc = acc === false ? false : true;
          } else {
            acc = false;
          }
          return acc;
        },
        true
      );
      return !reqState;
    }
  };
  const handleDisableBtn = () => {
    if (
      handleValues(values.name) !== state?.data?.name ||
      handleValues(values.company_name) !== state?.data?.company_name ||
      handleValues(values.contact_person) !== state?.data?.customer_name ||
      handleValues(values.phone) !== state?.data?.phoneNumber ||
      handleValues(values.alternative_no) !== state?.data?.alternativeNumber ||
      handleValues(values.whatsapp_no) !== state?.data?.whatsapp_no ||
      handleValues(values.email) !== state?.data?.email ||
      handleValues(values.approxmateAmount) !==
        state?.data?.approximate_amount ||
      handleValues(values.state) !== state?.data?.stateName ||
      handleValues(values.city) !== state?.data?.cityName ||
      handleValues(values.address) !== state?.data?.address ||
      handleValues(values.area) !== state?.data?.area ||
      handleValues(values.pincode) !== state?.data?.pincode ||
      values.receivedDate !== state?.data?.receivedAt ||
      handleValues(values.customer_category_id) !== state?.data?.categoryName ||
      handleValues(values.enquiry_type_name) !== state?.data?.enquiryTypeName ||
      getRequirement() ||
      handleValues(values.dealer_id) !== state?.data?.dealerId
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handlePhoneNumberChange = (event: any, name: any, code: any) => {
    const value = event;
    setPhoneNumberString(value);

    if (value && value?.includes("+")) {
      const phoneNumber = parsePhoneNumber(value);
      // @ts-ignore
      setParsedPhoneNumber(phoneNumber);
      if (phoneNumber) {
        const countryCode = `+${phoneNumber?.countryCallingCode}`; // Extract the country code
        const nationalNumber = phoneNumber?.nationalNumber; // Extract the national number
        setFieldValue(name, nationalNumber);
        setFieldValue(code, countryCode);
      }
    } else {
      setFieldValue(name, removeNonNumericCharacters(value));
    }

    // else {
    //   toast.error("Invalid phone number");
    // }
  };
  // useEffect(() => {
  //   if (parsedPhoneNumber) {
  //     setFieldValue("country_code", parsedPhoneNumber?.countryCallingCode);
  //     setFieldValue("search_number", parsedPhoneNumber?.nationalNumber);
  //   }
  // }, [parsedPhoneNumber]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  useEffect(() => {
    if (whatsapp_no) {
      setFieldValue("whatsapp_no", values?.phone);
      setFieldValue("whatsappCountry_code", values?.phone_code);
    }
  }, [values.phone_code]);

  return (
    <>
      {loader ? <Loader /> : null}
      <div className={classes.background}>
        <PageHeader
          heading={state?.type === "edit" ? "Update Leads" : "Add Leads"}
          btntitle={"Back to Leads"}
          filters={false}
          downloadBtn={"Download"}
          downloadBtnPress={() => {}}
          // onFilterbutton={() => {
          //   setShowFilterOption((pre) => !pre);
          // }}
          onBtnPress={() => {
            if (state?.status) {
              navigate("/leads/notificationlist");
            } else {
              navigate("/leads");
            }
          }}
        />
        <GlobalModal
          size={500}
          title="Delete File"
          OnClose={() => {
            setIsShowDeleteModal((prev: any) => {
              return {
                ...prev,
                status: false,
              };
            });
          }}
          isVisible={isShowDeleteModal.status}
          setIsVisible={() => {
            setIsShowDeleteModal((prev: any) => {
              return {
                ...prev,
                status: true,
              };
            });
          }}
        >
          <Deleteconfirmation
            msg={"Are You Sure Delete This File ?"}
            close={() => {
              setIsShowDeleteModal({
                status: false,
                data: null,
              });
            }}
            // @ts-ignore
            handlefunction={handleDeleteMediaFiles}
          />
        </GlobalModal>
        <GlobalModal
          size={500}
          isVisible={confirmationModal.status}
          closeIcon={false}
          setIsVisible={() => {
            setconfirmationModal((prev: any) => {
              return {
                ...prev,
                status: true,
              };
            });
          }}
        >
          <Confirmation
            close={() => {
              setconfirmationModal({
                status: false,
                data: "",
              });
              navigate("/leads");
            }}
            handlefunction={() => {
              handlewhatsappClick(values.whatsapp_no);
            }}
            whatsappData={confirmationModal.data}
          />
        </GlobalModal>
        <div className={classes.contentbackground}>
          {state?.type !== "edit" && (
            <div className=" mb-4">
              {/* <Col
                xxl={8}
                xl={24}
                md={24}
                sm={24}
                xs={24}
                className="d-flex align-items-center gap-3 mb-3 flex-wrap"
              >
                <p className={classes.label}>Please Select User Type :</p>
                <Radio.Group
                  name="radiogroup"
                  defaultValue={1}
                  className={classes.usertypecheckbox}
                  onChange={(e) => {
                    setCustomertype(e.target.value);
                    if (e.target?.value === 1) {
                      handleclearValues();
                      setCityDropdownList([]);
                      setcityalert(false);
                      handleDealardropdown();
                    } else {
                      setcityalert(false);
                      setFieldValue(
                        "receivedDate",
                        dayjs(new Date()).format("YYYY-MM-DD")
                      );
                    }
                  }}
                >
                  <Radio value={1} className={classes.label}>
                    New Customer
                  </Radio>
                  <Radio value={2} className={classes.label}>
                    Existing Customer
                  </Radio>
                </Radio.Group>
              </Col> */}
              <div>
                <Row className="rowend">
                  <Col xxl={5} xl={6} md={8} sm={12} xs={24}>
                    <Commoninput
                      onchangeCountryCode={(event: any) => {
                        setShowDetails(false);
                        setFieldValue("country_code", event);
                      }}
                      disabled={values.landline ? true : false}
                      countryDropdownlist={countryDropdownlist}
                      onChange={(e) => {
                        handleChangeNumber(e, "search_number");
                        // resetForm();
                        handlePhoneNumberChange(
                          e,
                          "search_number",
                          "country_code"
                        );
                        // setFieldValue("search_number", e);

                        setShowDetails(false);
                      }}
                      disableCountryCode={values.landline ? true : false}
                      countrycodevalue={values.country_code}
                      isCountryCode={true}
                      value={values.search_number}
                      required={true}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                      name="Phone Number"
                      maxLength={20}
                      placeholder="Phone Number"
                      errormsg={
                        errors.search_number && touched.search_number
                          ? errors.search_number
                          : // : parsedPhoneNumber && !parsedPhoneNumber?.isValid()
                            //   ? "Enter valid number"
                            ""
                      }
                    />
                  </Col>
                  <Col xxl={5} xl={6} md={8} sm={12} xs={24}>
                    <Commoninput
                      onChange={(e) => {
                        handleChangeNumber(e, "landline");
                        // resetForm();
                        handlePhoneNumberChange(e, "landline", "country_code");
                        // setFieldValue("search_number", e);

                        setShowDetails(false);
                      }}
                      // isCountryCode={true}
                      value={values.landline}
                      disabled={values.search_number ? true : false}
                      // required={true}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                      name="Landline Number"
                      maxLength={15}
                      placeholder="Landline Number"
                      errormsg={
                        errors.landline && touched.landline
                          ? errors.landline
                          : // : parsedPhoneNumber && !parsedPhoneNumber?.isValid()
                            //   ? "Enter valid number"
                            ""
                      }
                    />
                  </Col>
                  {!showDetails ? (
                    <div className={classes.MobileNumberBtn}>
                      <CommonButton
                        onClick={() => {
                          handleSubmit();
                        }}
                        name="Submit"
                        color="#004c97"
                      />
                    </div>
                  ) : null}
                </Row>
              </div>
              {/* {customerType === 2 ? (
                <Col xxl={3} xl={6} md={8} sm={12} xs={24} className="colwidth">
                  <CommonSelect
                    options={customerDetails}
                    // name="Select State"
                    name="Customer Name"
                    value={
                      values.exist_customer_id ? values.exist_customer_id : null
                    }
                    styles={{ width: "100%" }}
                    placeholder="Select Customer Name"
                    // errormsg={
                    //   errors.exist_customer_name && touched.exist_customer_name
                    //     ? errors.exist_customer_name
                    //     : ""
                    // }
                    onChange={(e, data) => {
                      handleGetCustomerDetails(data.value);
                    }}
                  />
                </Col>
              ) : null} */}
            </div>
          )}
          {showDetails || state?.type === "edit" ? (
            <Row className="rowend">
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  value={values.name}
                  required={true}
                  disabled={setfieldsDisable()}
                  onChange={(e) => {
                    if (e) {
                      setFieldValue("name", replaceText(e));
                      setValues({
                        ...values,
                        name: replaceText(e),
                        contact_person: contactPersonName
                          ? replaceText(e)
                          : values?.contact_person,
                      });
                    } else {
                      setValues({
                        ...values,
                        name: "",
                        contact_person: "",
                      });

                      setContactPersonName(false);
                    }
                  }}
                  onBlur={() => {
                    try {
                      validationSchema.validateSyncAt("name", values.name);
                    } catch (error) {
                      if (error instanceof Error) {
                        setFieldTouched("name", true);
                        setFieldError("name", error.message);
                      }
                    }
                  }}
                  name="Name"
                  // preventspace={true}
                  maxLength={Inputlengths.common}
                  placeholder="Name"
                  errormsg={errors.name && touched.name ? errors.name : ""}
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  disabled={setfieldsDisable()}
                  name="Company Name"
                  value={values.company_name}
                  maxLength={Inputlengths.Companyname}
                  onChange={(e) => setFieldValue("company_name", e)}
                  placeholder="Company Name"
                  errormsg={
                    errors.company_name && touched.company_name
                      ? errors.company_name
                      : ""
                  }
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  value={values.contact_person}
                  onChange={(e) =>
                    setFieldValue("contact_person", replaceText(e))
                  }
                  name="Contact Person"
                  disabled={contactPersonName || setfieldsDisable()}
                  maxLength={Inputlengths.common}
                  placeholder="Contact Person"
                  errormsg={
                    errors.contact_person && touched.contact_person
                      ? errors.contact_person
                      : ""
                  }
                />
                <CommonCheckBox
                  name="Same as Name"
                  checked={contactPersonName}
                  disabled={setfieldsDisable()}
                  onClick={() => {
                    if (contactPersonName) {
                      setFieldValue("contact_person", "");
                    } else {
                      setFieldValue("contact_person", values?.name);
                    }
                    setContactPersonName(!contactPersonName);
                  }}
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  onchangeCountryCode={(event: any) => {
                    setFieldValue("phone_code", event);
                  }}
                  countryDropdownlist={countryDropdownlist}
                  onChange={(e) => {
                    if (e) {
                      handleChangeNumber(e, "phone");
                      handlePhoneNumberChange(e, "phone", "phone_code");
                    } else {
                      handleChangeNumber(e, "phone");
                      setwhatsapp_no(false);
                    }
                  }}
                  onBlur={() => {
                    try {
                      validationSchema.validateSyncAt("phone", values.phone);
                    } catch (error) {
                      if (error instanceof Error) {
                        setFieldTouched("phone", true);
                        setFieldError("phone", error.message);
                      }
                    }
                  }}
                  countrycodevalue={values.phone_code}
                  isCountryCode={true}
                  disabled={setfieldsDisable()}
                  value={values.phone}
                  required={true}
                  name="Phone Number"
                  maxLength={Inputlengths.phonenumber}
                  placeholder="Phone Number"
                  errormsg={errors.phone && touched.phone ? errors.phone : ""}
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  onchangeCountryCode={(event: any) => {
                    setFieldValue("alternative_code", event);
                  }}
                  onChange={(e) => {
                    handleChangeNumber(e, "alternative_no");
                    handlePhoneNumberChange(
                      e,
                      "alternative_no",
                      "alternative_code"
                    );
                  }}
                  countryDropdownlist={countryDropdownlist}
                  value={values.alternative_no}
                  countrycodevalue={values.alternative_code}
                  isCountryCode={true}
                  maxLength={20}
                  // disabled={setfieldsDisable()}
                  name="Alternative Number"
                  placeholder="Alternative Number"
                  errormsg={
                    errors.alternative_no && touched.alternative_no
                      ? errors.alternative_no
                      : ""
                  }
                  onBlur={() => {
                    setFieldTouched("alternative_no", true);
                    // try {
                    //   validationSchema.validateSyncAt(
                    //     "alternative_no",
                    //     values.alternative_no
                    //   );
                    // } catch (error) {
                    //   if (error instanceof Error) {
                    //     setFieldTouched("alternative_no", true);
                    //     setFieldError("alternative_no", error.message);
                    //   }
                    // }
                  }}
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  onchangeCountryCode={(event: any) => {
                    setFieldValue("whatsappCountry_code", event);
                  }}
                  onChange={(e) => {
                    handleChangeNumber(e, "whatsapp_no");
                    handlePhoneNumberChange(
                      e,
                      "whatsapp_no",
                      "whatsappCountry_code"
                    );
                  }}
                  value={values.whatsapp_no}
                  countryDropdownlist={countryDropdownlist}
                  countrycodevalue={values.whatsappCountry_code}
                  isCountryCode={true}
                  name="Whatsapp Number"
                  maxLength={20}
                  disabled={whatsapp_no || setfieldsDisable()}
                  disableCountryCode={whatsapp_no || setfieldsDisable()}
                  placeholder="Whatsapp Number"
                  errormsg={
                    errors.whatsapp_no && touched.whatsapp_no
                      ? errors.whatsapp_no
                      : ""
                  }
                  onBlur={() => {
                    setFieldTouched("whatsapp_no", true);
                    // try {
                    //   validationSchema.validateSyncAt(
                    //     "whatsapp_no",
                    //     values.whatsapp_no
                    //   );
                    // } catch (error) {
                    //   if (error instanceof Error) {
                    //     setFieldTouched("whatsapp_no", true);
                    //     setFieldError("whatsapp_no", error.message);
                    //   }
                    // }
                  }}
                />
                <CommonCheckBox
                  disabled={setfieldsDisable()}
                  name="Same as Phone Number"
                  checked={whatsapp_no}
                  onClick={() => {
                    if (!whatsapp_no) {
                      setFieldValue("whatsapp_no", values?.phone);
                      setFieldValue("whatsappCountry_code", values?.phone_code);
                    } else {
                      setFieldValue("whatsapp_no", "");
                      setFieldValue("whatsappCountry_code", "+91");
                    }
                    setwhatsapp_no(!whatsapp_no);
                  }}
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  onChange={(e) => {
                    handleChangeNumber(e, "customer_landline");
                    // resetForm();
                    handlePhoneNumberChange(
                      e,
                      "customer_landline",
                      "country_code"
                    );
                    // setFieldValue("search_number", e);

                    // setShowDetails(false);
                  }}
                  // isCountryCode={true}
                  value={values.customer_landline}
                  // disabled={values.search_number ? true : false}
                  // required={true}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  name="Landline Number"
                  maxLength={15}
                  placeholder="Landline Number"
                  errormsg={
                    errors.customer_landline && touched.customer_landline
                      ? errors.customer_landline
                      : // : parsedPhoneNumber && !parsedPhoneNumber?.isValid()
                        //   ? "Enter valid number"
                        ""
                  }
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  disabled={setfieldsDisable()}
                  value={values.email}
                  onChange={handleChange("email")}
                  onBlur={() => {
                    try {
                      validationSchema.validateSyncAt("email", values.email);
                    } catch (error) {
                      if (error instanceof Error) {
                        setFieldTouched("email", true);
                        setFieldError("email", error.message);
                      }
                    }
                  }}
                  name="Email"
                  // required={true}
                  preventspace={true}
                  maxLength={Inputlengths.email}
                  placeholder="Email"
                  errormsg={errors.email && touched.email ? errors.email : ""}
                />
              </Col>

              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <CommonSelect
                  disabled={setfieldsDisable()}
                  allowClear={true}
                  options={requirementsList}
                  mode={"multiple"}
                  name="Requirement"
                  required={true}
                  placeholder="Select Requirement"
                  value={values.requirements_id ? values.requirements_id : null}
                  errormsg={
                    errors.requirements_id && touched.requirements_id
                      ? errors.requirements_id
                      : ""
                  }
                  onBlur={() => {
                    try {
                      validationSchema.validateSyncAt(
                        "requirements_id",
                        values.requirements_id
                      );
                    } catch (error) {
                      if (error instanceof Error) {
                        setFieldTouched("requirements_id", true);
                        setFieldError("requirements_id", error.message);
                      }
                    }
                  }}
                  onChange={(e, data) => {
                    if (e) {
                      setFieldValue("requirements_id", e);
                      // setFieldValue("requirements_name", e);
                    } else {
                      setValues({
                        ...values,
                        requirements_id: [],
                        requirements_name: "",
                      });
                    }
                  }}
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  name="Lead Status"
                  value={getLeadstatusName()}
                  placeholder="Lead Status"
                  disabled={true}
                />
              </Col>

              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <CommonSelect
                  disabled={setfieldsDisable()}
                  allowClear={true}
                  options={enquiryDropdownList}
                  value={
                    values.enquiry_type_name ? values.enquiry_type_name : null
                  }
                  name="Lead Source"
                  onBlur={() => {
                    try {
                      validationSchema.validateSyncAt(
                        "enquiry_type_id",
                        values.enquiry_type_id
                      );
                    } catch (error) {
                      if (error instanceof Error) {
                        setFieldTouched("enquiry_type_id", true);
                        setFieldError("enquiry_type_id", error.message);
                      }
                    }
                  }}
                  required={true}
                  placeholder="Select Lead Source"
                  errormsg={
                    errors.enquiry_type_id && touched.enquiry_type_id
                      ? errors.enquiry_type_id
                      : ""
                  }
                  onChange={(e, data) => {
                    if (e) {
                      setValues({
                        ...values,
                        enquiry_type_id: data.value,
                        enquiry_type_name: data.label,
                      });
                      // setFieldValue("enquiry_type_id", data.value);
                      // setFieldValue("enquiry_type_name", data.label);
                    } else {
                      setValues({
                        ...values,
                        enquiry_type_id: "",
                        enquiry_type_name: "",
                      });
                    }
                  }}
                />
              </Col>
              {values.enquiry_type_name === "Reference" ? (
                <>
                  <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                    <Commoninput
                      disabled={setfieldsDisable()}
                      value={values.referenceName}
                      required={false}
                      onChange={(e) => {
                        if (e) {
                          setFieldValue("referenceName", replaceText(e));
                        } else {
                          setFieldValue("referenceName", replaceText(e));
                          setContactPersonName(false);
                        }
                      }}
                      name="Referrer Name"
                      // preventspace={true}
                      maxLength={Inputlengths.name}
                      placeholder="Referrer Name"
                      // errormsg={errors.name && touched.name ? errors.name : ""}
                    />
                  </Col>
                  <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                    <Commoninput
                      onchangeCountryCode={(event: any) => {
                        setFieldValue("referrer_phone_code", event);
                      }}
                      onChange={(e) => {
                        handleChangeNumber(e, "referencePhoneNumber");
                        handlePhoneNumberChange(
                          e,
                          "referencePhoneNumber",
                          "referrer_phone_code"
                        );
                      }}
                      value={values.referencePhoneNumber}
                      countryDropdownlist={countryDropdownlist}
                      countrycodevalue={values.referrer_phone_code}
                      isCountryCode={true}
                      name="Referrer Phone Number"
                      placeholder="Referrer Phone Number"
                      maxLength={20}
                      disabled={setfieldsDisable()}
                      disableCountryCode={setfieldsDisable()}
                      errormsg={
                        errors.referencePhoneNumber &&
                        touched.referencePhoneNumber
                          ? errors.referencePhoneNumber
                          : ""
                      }
                      onBlur={() => {
                        try {
                          validationSchema.validateSyncAt(
                            "referencePhoneNumber",
                            values.referencePhoneNumber
                          );
                        } catch (error) {
                          if (error instanceof Error) {
                            setFieldTouched("referencePhoneNumber", true);
                            setFieldError(
                              "referencePhoneNumber",
                              error.message
                            );
                          }
                        }
                      }}
                    />
                  </Col>
                </>
              ) : null}
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <CommonSelect
                  disabled={setfieldsDisable()}
                  allowClear={true}
                  options={category}
                  name="Category"
                  placeholder="Select Category"
                  value={
                    values.customer_category_name
                      ? values.customer_category_name
                      : null
                  }
                  errormsg={
                    errors.customer_category_id && touched.customer_category_id
                      ? errors.customer_category_id
                      : ""
                  }
                  onChange={(e, data) => {
                    if (e) {
                      setValues({
                        ...values,
                        customer_category_id: data.value,
                        customer_category_name: data.label,
                      });
                      // setFieldValue("customer_category_id", data.value);
                    } else {
                      setValues({
                        ...values,
                        customer_category_id: "",
                        customer_category_name: "",
                      });
                    }
                  }}
                />
              </Col>
              {loginUserData?.userType !== 3 &&
                loginUserData?.userType !== 4 && (
                  <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                    <CommonSelect
                      disabled={setfieldsDisable()}
                      allowClear={true}
                      options={DealerList}
                      name="Dealer"
                      value={values.dealerName ? values.dealerName : null}
                      placeholder="Select Dealer"
                      errormsg={
                        errors.dealer_id && touched.dealer_id
                          ? errors.dealer_id
                          : ""
                      }
                      onChange={(e, data) => {
                        if (e) {
                          handelAssignedTodropdown(e);
                          setValues({
                            ...values,
                            assignedTo: null,
                            assignedUserName: null,
                            dealerName: data?.label,
                            dealer_id: e,
                          });
                        } else {
                          setValues({
                            ...values,
                            assignedTo: null,
                            assignedUserName: null,
                            dealer_id: null,
                            dealerName: null,
                          });
                        }
                      }}
                    />
                  </Col>
                )}
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  disabled={setfieldsDisable()}
                  name="Approximate Amount"
                  // required={true}
                  value={values.approxmateAmount}
                  maxLength={10}
                  onChange={(e) => handleChangeNumber(e, "approxmateAmount")}
                  placeholder="Approximate Amount"
                  errormsg={
                    errors.approxmateAmount && touched.approxmateAmount
                      ? errors.approxmateAmount
                      : ""
                  }
                  onBlur={() => {
                    try {
                      validationSchema.validateSyncAt(
                        "approxmateAmount",
                        values.approxmateAmount
                      );
                    } catch (error) {
                      if (error instanceof Error) {
                        setFieldTouched("approxmateAmount", true);
                        setFieldError("approxmateAmount", error.message);
                      }
                    }
                  }}
                />
              </Col>
              {/* {values?.dealer_id && ( */}
              {loginUserData?.userType === 3 && (
                <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                  <CommonSelect
                    allowClear={false}
                    options={AssignedtoList}
                    name="Assigned To"
                    value={
                      values.assignedUserName ? values.assignedUserName : null
                    }
                    placeholder="Select Assigned To"
                    disabled={
                      values?.dealer_id ? false : true || setfieldsDisable()
                    }
                    errormsg={
                      errors.assignedTo && touched.assignedTo
                        ? errors.assignedTo
                        : ""
                    }
                    onChange={(e, data) => {
                      if (e) {
                        setValues({
                          ...values,
                          assignedTo: e,
                          assignedUserName: data?.label,
                        });
                        setFieldValue("assignedTo", e);
                      } else {
                        setValues({
                          ...values,
                          assignedTo: null,
                          assignedUserName: null,
                        });
                        handelAssignedTodropdown(null);
                        setFieldValue("assignedTo", null);
                      }
                    }}
                  />
                </Col>
              )}
              {/* )} */}

              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <CommonDate
                  name="Received Date"
                  disabled={setfieldsDisable()}
                  isFuture={true}
                  disableDate={true}
                  formate="YYYY-MM-DD HH:mm:ss"
                  // showTime={true}
                  placeholder="Received Date"
                  onChange={(e) =>
                    setFieldValue(
                      "receivedDate",
                      e ? dayjs(e).format("YYYY-MM-DD HH:mm:ss") : null
                    )
                  }
                  value={values.receivedDate}
                  disablePastTime
                />
              </Col>

              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <CommonDate
                  disabled={setfieldsDisable()}
                  name="Followup Date"
                  // isFuture={true}
                  isPast={true}
                  disableDate={true}
                  formate="YYYY-MM-DD HH:mm"
                  // showTime={true}
                  placeholder="Followup Date"
                  onChange={(e) =>
                    setFieldValue(
                      "scheduleDate",
                      e ? dayjs(e).format("YYYY-MM-DD HH:mm:ss") : null
                    )
                  }
                  disablePastTime
                  value={values.scheduleDate}
                />
              </Col>

              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  disabled={setfieldsDisable()}
                  // allowClear={true}
                  // options={stateDropdownList}
                  name="State"
                  // required={true}
                  value={values.state_id ? values.state_id : null}
                  placeholder="Enter State"
                  maxLength={Inputlengths.name}
                  errormsg={
                    errors.state_id && touched.state_id ? errors.state_id : ""
                  }
                  onChange={(e) => {
                    setFieldValue("state_id", e ? e : null);
                    setFieldValue("state", e ? e : null);
                    // if (e) {
                    //   setcityalert(false);
                    //   setValues({
                    //     ...values,
                    //     state_id: data.value,
                    //     city_id: "",
                    //     pincode: "",
                    //     address: "",
                    //     area: "",
                    //   });
                    //   // setFieldValue("state", data.label);
                    //   handleCityDropdown(e);
                    // } else {
                    //   setCityDropdownList([]);
                    //   // setcityalert(true);
                    //   setValues({
                    //     ...values,
                    //     state_id: "",
                    //     state: "",
                    //     city_id: "",
                    //     pincode: "",
                    //     address: "",
                    //     area: "",
                    //   });
                    // }
                  }}
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  disabled={setfieldsDisable()}
                  // allowClear={true}
                  // options={cityDropdownList}
                  name="City"
                  maxLength={Inputlengths.name}
                  // required={true}
                  placeholder="Enter City"
                  value={values.city_id ? values.city_id : null}
                  errormsg={
                    // cityalert
                    //   ? "Please select state before selecting city"
                    //   :
                    errors.city_id && touched.city_id ? errors.city_id : ""
                  }
                  // onkeydown={(e) => {
                  //   if (!values?.state_id) {
                  //     setcityalert(true);
                  //   } else {
                  //     setcityalert(false);
                  //   }
                  // }}
                  onChange={(e) => {
                    setFieldValue("city_id", e ? e : null);
                    setFieldValue("city", e ? e : null);
                    // if (e) {
                    //   setValues({
                    //     ...values,
                    //     city_id: data.value,
                    //     city: "",
                    //     pincode: "",
                    //     address: "",
                    //     area: "",
                    //   });
                    // } else {
                    //   setValues({
                    //     ...values,
                    //     city_id: "",
                    //     city: "",
                    //     pincode: "",
                    //     address: "",
                    //     area: "",
                    //   });
                    // }
                  }}
                />
              </Col>
              {/* <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  disabled={setfieldsDisable()}
                  name="Area"
                  // required={true}
                  value={values.area}
                  maxLength={Inputlengths?.Area}
                  onChange={(e) => setFieldValue("area", replaceText(e))}
                  placeholder="Area"
                  errormsg={errors.area && touched.area ? errors.area : ""}
                />
              </Col> */}
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <Commoninput
                  disabled={setfieldsDisable()}
                  name="Pincode"
                  // required={true}
                  value={values.pincode}
                  maxLength={6}
                  onChange={(e) => handleChangeNumber(e, "pincode")}
                  placeholder="Pincode"
                  errormsg={
                    errors.pincode && touched.pincode ? errors.pincode : ""
                  }
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <CommonTextArea
                  disabled={setfieldsDisable()}
                  required={true}
                  name="Address"
                  value={values.address}
                  maxLength={Inputlengths.address}
                  // maxLength={20}
                  onKeyDown={(e) => {
                    Addressvalidation(e);
                  }}
                  onChange={(e) => setFieldValue("address", e)}
                  placeholder="Address"
                  errormsg={
                    errors.address && touched.address ? errors.address : ""
                  }
                  onBlur={() => {
                    try {
                      validationSchema.validateSyncAt(
                        "address",
                        values.address
                      );
                    } catch (error) {
                      if (error instanceof Error) {
                        setFieldTouched("address", true);
                        setFieldError("address", error.message);
                      }
                    }
                  }}
                />
              </Col>
              <Col xxl={4} xl={6} md={8} sm={12} xs={24}>
                <CommonTextArea
                  disabled={setfieldsDisable()}
                  // required={true}
                  name="Remarks"
                  value={values.remark}
                  maxLength={Inputlengths.remark}
                  // maxLength={20}
                  // onKeyDown={(e) => {
                  //   Addressvalidation(e);
                  // }}
                  onChange={(e) => setFieldValue("remark", e)}
                  placeholder="Remarks"
                  onBlur={() => {
                    try {
                      validationSchema.validateSyncAt("remark", values.address);
                    } catch (error) {
                      if (error instanceof Error) {
                        setFieldTouched("remark", true);
                        setFieldError("remark", error.message);
                      }
                    }
                  }}
                  errormsg={
                    errors.remark && touched.remark ? errors.remark : ""
                  }
                />
              </Col>
            </Row>
          ) : null}
        </div>
        {showDetails || state?.type === "edit" ? (
          <div
            className={classes.contentbackground}
            style={{ marginTop: "10px" }}
          >
            <div className={classes.fileupload}>
              <div>
                <h3 className="subheading">File Upload</h3>
                <p className={classes.uploadText}>File Upload</p>
                <Upload
                  // @ts-ignore
                  accept={"image/*,.pdf, .png, .svg, .xls, .xlsx, .txt"}
                  multiple
                  fileList={fileList}
                  customRequest={handleUpload}
                  onRemove={(file) => {
                    // @ts-ignore
                    handleRemove(file);
                  }}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture"
                  onChange={(info) => {
                    let fileList = [...info.fileList];
                    setFileList(fileList);
                  }}
                  onPreview={handlePreview}
                  beforeUpload={beforeUpload}
                  // defaultFileList={[...fileList]}
                >
                  <Button>Upload</Button>
                </Upload>
              </div>

              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
              {uploadFileListm.length > 0 && state?.type === "edit" ? (
                <div>
                  <h3 className="subheading">Uploaded Files</h3>
                  <Row>
                    {uploadFileListm?.map((ele: any, index: number) => {
                      return (
                        <Col
                          // onClick={() => handlePreview(ele)}
                          xs={24}
                          sm={12}
                          md={8}
                          lg={8}
                          xl={6}
                          xxl={4}
                        >
                          <div className={classes.filebox}>
                            <div className={classes.fileactionblock}>
                              <button
                                onClick={() => {
                                  window.open(ele.url);
                                }}
                                type="button"
                                className={classes.uploadbtn}
                              >
                                <img
                                  src={uploadicon}
                                  alt="upload"
                                  className={classes.uploadicon}
                                />
                              </button>
                              <button
                                onClick={() => {
                                  setIsShowDeleteModal({
                                    status: true,
                                    data: ele,
                                  });
                                  // handleDeleteMediaFiles(ele);
                                }}
                                type="button"
                                className={classes.deletebtn}
                              >
                                <img
                                  src={trash}
                                  alt="upload"
                                  className={classes.deleteicon}
                                />
                              </button>
                            </div>

                            <div className={classes.fileviewblock}>
                              <img
                                src={isImage(ele?.url) ? ele.url : files}
                                alt="files"
                                className={classes.fileicon}
                              />
                              <Tooltip title={ele?.url?.split("/").pop()}>
                                <p className={classes.filename}>
                                  {ele?.url?.split("/").pop()}
                                </p>
                              </Tooltip>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                  <CommonPagination
                    dataList={MediaList}
                    // filters={filterdata}
                    handleListapi={(page: number, size: number, data: any) => {
                      setPage(page);
                      handleListMediaFiles(page, size);
                    }}
                  />
                </div>
              ) : null}
              {((customerType === 2 && values?.exist_customer_id) ||
                customerType === 1) && (
                <div className={classes.btnactionblock}>
                  <CommonButton
                    name={state?.data?.leadId ? "Update" : "Submit"}
                    color="#004c97"
                    // Disabled={handleDisableBtn()}
                    style={{ margin: "10px 0px" }}
                    onClick={handleSubmit}
                  />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
