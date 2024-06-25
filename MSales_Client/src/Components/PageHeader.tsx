import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import classes from "./Common.module.css";
import { Pageheaderprops } from "./Types.d";
import search_icon from "../Asserts/Icons/search.png";
import close_icon from "../Asserts/Icons/close.svg";
import warning_icon from "../Asserts/Icons/warning.png";
import { Badge, Row, Tooltip } from "antd";
import downloadbtn from "../Asserts/Icons/download.png";
import { LoginUserData, useToken } from "../Shared/Constants";
import { Commoninput } from "./InputComponents/CommonInput";
import informationIcon from "../Asserts/Icons/info.png";

const PageHeader = forwardRef(function (
  {
    heading,
    onBtnPress,
    btntitle,
    onFilterbutton,
    showfilter = true,
    onWarningIcon,
    LeadDataList,
    page,
    importBtn,
    importBtnPress,
    downloadBtn,
    downloadBtnPress,
    onMultitransfer,
    transfertitle,
    hasCommonSearch,
    onSearch,
    btntitle2,
    onPressBtn2,
    showmultitransferdata = false,
    customFilter,
    filters = true,
    Remainderlist,
    remaindertittle,
    deleteLeads,
    deletedListlead
  }: Pageheaderprops,
  ref
) {
  const token = useToken();
  const loginUserData = LoginUserData();
  const [search, setSearch] = useState("");
  useImperativeHandle(
    ref,
    () => {
      return {
        clearSearchText: () => {
          if (search) {
            setSearch("");
            if (onSearch) onSearch("");
          }
        },
      };
    },
    [search]
  );

  return (
    <div className={classes.pageheaderdisplay}>
      <h3 className={classes.headingtext}>{heading}</h3>
      {hasCommonSearch && <div className={classes.commsearchObjA} />}

      {hasCommonSearch && (
        <Row className="mb-2 mb-sm-0" style={{ flexGrow: 0.5 }}>
          <Commoninput
            value={search}
            onChange={(e) => {
              setSearch(e);
              if (onSearch) {
                onSearch(e);
              }
            }}
            placeholder="Search here"
            align="center"
            fullWidth
            allowClear
          />
        </Row>
      )}
      {hasCommonSearch && <div className={classes.commsearchObjB} />}
      <div className={classes.btndisplay}>
        {customFilter ? (
          <>
            <div className={classes.infotextheading}>
              <h5>Followup Status</h5>
              <Tooltip
                placement="bottom"
                title="Making it inactive will disable the followup alert on the leads section"
              >
                <img src={informationIcon} className={classes.infoIcon} />
              </Tooltip>
            </div>
            {customFilter}
          </>
        ) : null}
        {/* {customFilter ? customFilter : null} */}
        {LeadDataList?.attentionCount && loginUserData?.userType !== 4 ? (
          <Tooltip title="Over Due">
            <Badge
              count={LeadDataList?.attentionCount}
              overflowCount={999}
              color="#727187"
              style={{ marginRight: "6px", marginTop: "2px" }}
            >
              <img
                onClick={onWarningIcon}
                className={classes.warning_icon}
                src={warning_icon}
                alt="search"
              />
            </Badge>
          </Tooltip>
        ) : null}
      
        {filters && (
          <Tooltip title={showfilter ? "Close" : "Search"}>
            <img
              onClick={onFilterbutton}
              className={
                page === "report" ? classes.filtermargin : classes.search_icon
              }
              style={showfilter ? { height: 19 } : {}}
              src={!showfilter ? search_icon : close_icon}
              alt="search"
            />
          </Tooltip>
        )}

      

        {/* {importBtn ? (
          <button onClick={importBtnPress} className={classes.importbutton}>
            {importBtn}
          </button>
        ) : null} 
      */}
        {/* {downloadBtn ? (
          <button onClick={downloadBtnPress} className={classes.importbutton}>
            <img
              src={downloadbtn}
              alt="iconbtn"
              className={classes.downloadicon}
            />
            {downloadBtn}
          </button>
        ) : null} */}
        {onMultitransfer &&
        loginUserData?.userType !== 4 &&
        showmultitransferdata ? (
          <button
            onClick={onMultitransfer}
            style={{
              background:
                transfertitle === "Close Transfer" ? "gray" : "#057e05e0",
            }}
            className={classes.addbutton}
          >
            {transfertitle}
          </button>
        ) : null}
        {btntitle2 ? (
          <button onClick={onPressBtn2} className={classes.followupbtn}>
            {btntitle2}
          </button>
        ) : null}
        {btntitle ? (
          <button onClick={onBtnPress} className={classes.addbutton}>
            {btntitle}
          </button>
        ) : null}
         {
       deleteLeads&& loginUserData?.userType !== 4 ? <button onClick={deletedListlead} className={classes.deletedlistbtn}>
        {deleteLeads}
      </button>:null
       }
        {/* {remaindertittle ? (
          <button onClick={Remainderlist} className={classes.remainderlistbtn}>
            {remaindertittle}
          </button>
        ) : null} */}
      </div>
    </div>
  );
});
export default PageHeader;
