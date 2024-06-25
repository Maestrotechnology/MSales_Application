import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React, { useCallback, useEffect } from "react";

export default function AccordionContent({
  children,
  filterStat,
  id,
}: {
  children: JSX.Element;
  filterStat?: boolean;
  id?: string;
}) {
  const fireCollapse = useCallback(() => {}, [filterStat]);

  return (
    <Accordion
      sx={{
        background: "transparent !important",
        boxShadow: "none !important",
        margin: "8px 0 !important",
        "& .MuiAccordionDetails-root": {
          padding: 0,
        },
        "&::before": {
          background: "transparent !important",
        },
      }}
    >
      <AccordionSummary
        style={{
          display: "none",
        }}
        id={id ? id : "accord"}
      />
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
