sap.ui.define([
  "com/itc/dealerportal/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast"
], (BaseController, JSONModel, Filter, FilterOperator, MessageToast) => {
  "use strict";

  return BaseController.extend("com.itc.dealerportal.controller.Payments", {

    onInit() {
      this.getView().setModel(new JSONModel({}), "payments");
      this.getView().setModel(new JSONModel(this._getDefaultFilters()), "filter");

      this.getRouter()
        .getRoute("RoutePayments")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched() {
      this._loadData();
    },

    _getDefaultFilters() {
      return {
        tab: "all",
        customer: "",
        customers: [{ key: "CH_JAVA", name: "CH.Java & Company" }],
        paymentType: "",
        paymentTypes: [{ key: "Settlement with Payment", name: "Settlement with Payment" }],
        submittedDate: null,
        paymentDate: null,
        status: "",
        statuses: [
          { key: "Approved", name: "Approved" },
          { key: "Pending", name: "Pending" },
          { key: "Rejected", name: "Rejected" }
        ],
        search: ""
      };
    },

    _loadData() {
      const oView = this.getView();

      oView.setBusy(true);
      oView.getModel("payments")
        .loadData(sap.ui.require.toUrl("com/itc/dealerportal/model/mockData/payments.json"))
        .then(() => this._applyFilters())
        .catch(() => MessageToast.show("Unable to load payments"))
        .finally(() => oView.setBusy(false));
    },

    _applyFilters() {
      const oData = this.getView().getModel("filter").getData();
      const aFilters = [];

      if (oData.tab !== "all") {
        aFilters.push(new Filter("status", FilterOperator.EQ, oData.tab));
      }

      [
        ["customer", oData.customer],
        ["paymentType", oData.paymentType],
        ["submittedOn", oData.submittedDate],
        ["paymentDate", oData.paymentDate],
        ["status", oData.status]
      ].forEach(([sPath, sValue]) => {
        if (sValue) {
          aFilters.push(new Filter(sPath, FilterOperator.EQ, sValue));
        }
      });

      if (oData.search) {
        aFilters.push(new Filter("id", FilterOperator.Contains, oData.search));
      }

      this.byId("idPaymentsTable").getBinding("items").filter(aFilters);
    },

    onTabSelect(oEvent) {
      const oModel = this.getView().getModel("filter");

      oModel.setProperty("/tab", oEvent.getParameter("key"));
      oModel.setProperty("/status", "");
      this._applyFilters();
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