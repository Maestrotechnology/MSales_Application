export type GlobalModalProps = {
  isVisible?: boolean;
  children: JSX.Element | JSX.Element;
  size?: "lg" | "sm" | "xl" | "md" | any;
  setIsVisible?: (val: boolean) => void;
  centered?: boolean;
  customStyle?: React.CSSProperties;
  ModalStyle?: string;
  title?: string;
  OnClose?: (val: any) => void;
  closeIcon?: boolean;
};
export type Pageheaderprops = {
  heading?: string;
  btntitle?: string;
  onBtnPress?: (val: any) => void;
  onFilterbutton?: () => void;
  showfilter?: boolean;
  onWarningIcon?: (val: any) => void;
  LeadDataList?: any;
  page?: string;
  importBtn?: string;
  importBtnPress?: (val: any) => void;
  downloadBtn?: string;
  downloadBtnPress?: (val: any) => void;
  onMultitransfer?: (val: any) => void;
  transfertitle?: string;
  hasCommonSearch?: boolean;
  onSearch?: (value: string) => void;
  btntitle2?: string;
  showmultitransferdata?: boolean;
  onPressBtn2?: () => void;
  customFilter?: React.ReactNode;
  filters?: boolean;
  Remainderlist?: (val: any) => void;
  remaindertittle?: string;
  deleteLeads?:string
  deletedListlead?:any
};
