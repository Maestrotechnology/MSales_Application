import classes from "./commonbtn.module.css";
interface Props {
  onClick?: () => void;
  name?: any;
  style?: any;
  color?: string;
  Disabled?: boolean;
}
export default function CommonButton({
  onClick,
  style,
  name,
  color,
  Disabled,
}: Props) {
  return (
    <button
      type="button"
      disabled={Disabled}
      className={classes.commonbutton}
      onClick={onClick}
      style={{ backgroundColor: color, ...style, opacity: Disabled ? 0.5 : 1 }}
    >
      {name}
    </button>
  );
}
