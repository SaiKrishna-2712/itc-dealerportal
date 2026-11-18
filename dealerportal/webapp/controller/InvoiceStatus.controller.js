sap.ui.define([
  "com/itc/dealerportal/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/format/DateFormat",
  "sap/m/MessageToast"
], (BaseController, JSONModel, Filter, FilterOperator, DateFormat, MessageToast) => {
  "use strict";

  return BaseController.extend("com.itc.dealerportal.controller.InvoiceStatus", {

    onInit() {
      this.getView().setModel(new JSONModel({}), "invoice");
      this.getView().setModel(new JSONModel(this._getDefaultFilters()), "filter");

      this.getRouter()
        .getRoute("RouteInvoiceStatus")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched() {
      this._loadData();
    },

    _getDefaultFilters() {
      return {
        customer: "",
        settlement: "",
        submittedDate: null,
        period: "",
        status: "",
        search: ""
      };
    },

    _loadData() {
      const oView = this.getView();

      oView.setBusy(true);
      oView.getModel("invoice")
        .loadData(sap.ui.require.toUrl("com/itc/dealerportal/model/mockData/invoiceStatus.json"))
        .then(() => this._applyFilters())
        .catch(() => MessageToast.show("Unable to load customer ledger"))
        .finally(() => oView.setBusy(false));
    },

    _getPeriodStart(sPeriod) {
      const oDate = new Date();

      if (sPeriod === "LAST_WEEK") {
        oDate.setDate(oDate.getDate() - 7);
      } else {
        oDate.setMonth(oDate.getMonth() - { LAST_MONTH: 1, LAST_3_MONTHS: 3, LAST_6_MONTHS: 6 }[sPeriod]);
      }
      return DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(oDate);
    },

    _applyFilters() {
      const oData = this.getView().getModel("filter").getData();
      const aFilters = [];

      [
        ["customer", oData.customer],
        ["partialSettlement", oData.settlement],
        ["docDate", oData.submittedDate],
        ["status", oData.status]
      ].forEach(([sPath, sValue]) => {
        if (sValue) {
          aFilters.push(new Filter(sPath, FilterOperator.EQ, sValue));
        }
      });

      if (oData.period) {
        aFilters.push(new Filter("docDate", FilterOperator.GE, this._getPeriodStart(oData.period)));
      }

      if (oData.search) {
        aFilters.push(new Filter("invoiceNo", FilterOperator.Contains, oData.search));
      }

      this.byId("idInvoiceTable").getBinding("items").filter(aFilters);
    },

    onSearch(oEvent) {
      this.getView().getModel("filter").setProperty("/search", oEvent.getParameter("newValue"));
      this._applyFilters();
    },

    onApplyFilter() {
      this._applyFilters();
    },

    onResetFilter() {
      this.getView().getModel("filter").setData(this._getDefaultFilters());
      this._applyFilters();
    }
  });
});