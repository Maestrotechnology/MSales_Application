import { Switch } from "antd";
interface Props {
  checked?: boolean;
  onChange?: () => void;
}
export default function CommonSwitch({ checked, onChange }: Props) {
  return (
    <Switch
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={checked}
      onChange={onChange}

      // className={classes.switchstyle}
    />
  );
}
