sap.ui.define([], () => {
  "use strict";

  const fnAmount = (vValue) => {
    if (vValue === null || vValue === undefined || vValue === "") {
      return "";
    }
    return Number(vValue).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  return {
    amount: fnAmount,

    rupee(vValue) {
      const sValue = fnAmount(vValue);
      return sValue ? "₹ " + sValue : "";
    },

    overdueState(vValue) {
      return Number(vValue) !== 0 ? "Error" : "None";
    },

    amountIN(vValue) {
      if (vValue === null || vValue === undefined || vValue === "") {
        return "";
      }
      return Number(vValue).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    },

    statusState(sStatus) {
      return {
        Approved: "Success",
        Paid: "Success",
        Pending: "Warning",
        Open: "Warning",
        Rejected: "Error",
        Overdue: "Error"
      }[sStatus] || "None";
    },

    invoiceStatusIcon(sStatus) {
      return {
        Paid: "sap-icon://sys-enter-2",
        Open: "sap-icon://pending",
        Overdue: "sap-icon://error"
      }[sStatus] || "";
    }
  };
});