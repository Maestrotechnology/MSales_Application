import React from "react";
import classes from "./modal.module.css";
import dayjs from "dayjs";
interface Props {
  editdata?: any;
}
export default function HistoryViewModal({ editdata }: Props) {
  const RenderText = (key: string, value: string | number | undefined) => {
    return (
      <div className={classes.InsideListChilds}>
        <p>{key}</p>
        <strong>:</strong>
        <span>{value ?? "-"}</span>
      </div>
    );
  };

  return (
    <div>
      {" "}
      <div
        className={classes.ViewInsideListContainer}
        style={{
          borderBottom: "none",
        }}
      >
        {RenderText("Lead Status", editdata?.leadStatus)}
        {RenderText("Changed By", editdata?.changedBy)}
        {RenderText(
          "Updated on",
          editdata?.updated_at
            ? dayjs(editdata?.updated_at).format("YYYY-MM-DD HH:mm:ss")
            : editdata?.updated_at
        )}

        {RenderText("Comment", editdata.comment)}
      </div>
    </div>
  );
}
