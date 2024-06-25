interface getCatchMsgDetailMsgType {
  msg: string;
}

interface getCatchMsgDetailType {
  detail: getCatchMsgDetailMsgType;
}
interface getCatchMsgDataType {
  data: getCatchMsgDetailType;
  status: number | string;
}

export type getCatchMsgType = {
  response: getCatchMsgDataType;
  request: string;
  message: string;
};

export type ListLeadsContextProps = {
  listLeadApi: (
    page?: number,
    size?: number,
    values?: any,
    search_key?: string
  ) => void;
  LeadsList: any;
  leads_page: number;
  leads_size: number;
  filters: ListLeadsInitialValuesProps;
};

export type ListLeadsInitialValuesProps = {
  lead_name: string;
  lead_code: string;
  phonenumber: string;
  dealer_name: string;
  dealer_id: string;
  employee_id: string;
  state: string;
  state_id: string;
  district_id: string;
  city: string;
  city_id: string;
  from_date: null;
  to_date: null;
  status_filterName: string;
  status_filterId: null;
};
