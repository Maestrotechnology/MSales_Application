import classes from "./loader.module.css";
export default function Loader() {
  return (
    <div className={classes.content}>
      <div className={classes.loader}></div>
    </div>
  );
}
