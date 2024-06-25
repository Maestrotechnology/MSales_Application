import { Checkbox } from "antd";
import classes from "./inputs.module.css";

interface props {
  name: string;
  onClick: (value: any) => void;
  styles?: any;
  checked: boolean;
  disabled?: boolean;
}
export const CommonCheckBox = ({
  name,
  onClick,
  styles,
  checked,
  disabled = false,
}: props) => {
  return (
    <>
      <Checkbox
        onChange={() => {}}
        onClick={onClick}
        className={classes.checkboxstyles}
        checked={checked}
        disabled={disabled}
      >
        <p className={classes.checklabelstyle}>{name}</p>
      </Checkbox>
    </>
  );
};
