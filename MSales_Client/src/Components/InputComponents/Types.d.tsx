export type InputTextbox = {
  label?: string;
  onChangeText: (val: string) => void;
  name?: string;
  errorText?: string;
  TextLength?: number;
  types?: string;
  IconImage?: any;
  insecure_image?: JSX.Element | any;
  showpassword?: any;
  setShowPassword?: (val: any) => void | any;
  focusref?: any;
  onKeyDown?: (val: any) => void | any;
  value?: any;
  isemail?: boolean;
};
