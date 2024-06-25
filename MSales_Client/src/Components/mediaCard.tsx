import { Card } from "antd";
import classes from "./media.module.css";
import { deletemediafile } from "../Services/Apiservices";
import { useToken } from "../Shared/Constants";
import { useState } from "react";
import { toast } from "react-toastify";
import { getCatchMsg } from "../Shared/Methods";

export default function MediaCard({
  data,
  onEDit,
  onClick,
  isimage = true,
  onDelete,
}: {
  data: any;
  onEDit?: any;
  onClick?: () => void;
  isimage?: boolean;
  onDelete?: any;
}) {
  const token = useToken();

  return (
    <div className={classes.carddata}>
      <Card
        hoverable
        onClick={onClick}
        style={{
          width: "90%",
          overflow: "hidden",
          height: "235px",
          //   border: "1px solid rgb(218 218 218)",
          boxShadow: "1px 1px 10px 1px rgba(0,0,0,0.1)",
          //   background: "aliceblue",
          borderRadius: "6px",
        }}
        cover={
          <div>
            {isimage ? (
              <img
                alt="example"
                src={data?.MediaPath}
                className={classes?.cardbanner}
              />
            ) : (
              <video
                className={classes?.cardbanner}
                //   width={500}
                controls
                onClick={() => window.open(data.MediaPath)}
              >
                <source src={data.MediaPath} type="video/mp4" />
              </video>
            )}
            <div className={classes.cartactions}>
              <i
                onClick={() => onDelete(data)}
                className={`fa fa-trash-o ${classes.wishlist}`}
                aria-hidden="true"
              ></i>
              {isimage ? (
                <>
                  <i
                    onClick={() => window.open(data.MediaPath)}
                    className={`fa fa-eye ${classes.view}`}
                    aria-hidden="true"
                  ></i>

                  {/* <i
                    className={`fa fa-download ${classes.reset}`}
                    aria-hidden="true"
                    onClick={() => window.open(data?.MediaPath)}
                  ></i> */}
                </>
              ) : null}
            </div>
          </div>
        }
      >
        <div>
          <p className={classes.title}>{data?.MediaName}</p>
          {/* <p className={classes.discription}>{data.description}</p> */}
        </div>
      </Card>
    </div>
  );
}
