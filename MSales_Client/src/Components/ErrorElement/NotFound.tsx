import not_found from "../../Asserts/Images/notfoundpage.gif";
import classes from "./errorpage.module.css";
import CommonButton from "../CommonButton/CommonButton";
import { getCookie } from "../../Store/Storage/Cookies";
import { useNavigate } from "react-router-dom";
import { Col } from "antd";
export default function NotFound() {
  const navigate = useNavigate();
  const handleNavigation = () => {
    if (getCookie("logindata")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  return (
    <div className={classes.errorpageoutLine}>
      <Col xs={20} md={18} xl={10} className={classes.errorImageOutline}>
        <img className={classes.errorImage} src={not_found} alt="error_image" />
        <CommonButton
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleNavigation}
          name={getCookie("logindata") ? "Back To Dashboard" : "Back To Login"}
          color="#CD2027"
        />
      </Col>
    </div>
  );
}
