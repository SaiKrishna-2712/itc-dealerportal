sap.ui.define([
  "com/itc/dealerportal/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], (BaseController, JSONModel, MessageToast) => {
  "use strict";

  return BaseController.extend("com.itc.dealerportal.controller.PaymentOverview", {

    onInit() {
      this.getView().setModel(new JSONModel({}), "payment");
      this.getView().setModel(new JSONModel(this._getDefaultFilters()), "filter");

      this.getRouter()
        .getRoute("RoutePaymentOverview")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched() {
      this._loadData();
    },

    _getDefaultFilters() {
      return {
        distributor: "CH_JAVA",
        distributors: [{ key: "CH_JAVA", name: "CH.Java & Company" }],
        fromDate: null,
        toDate: null
      };
    },

    _loadData() {
      const oView = this.getView();
      const oModel = oView.getModel("payment");

      oView.setBusy(true);
      oModel
        .loadData(sap.ui.require.toUrl("com/itc/dealerportal/model/mockData/paymentOverview.json"))
        .catch(() => MessageToast.show("Unable to load payment overview"))
        .finally(() => oView.setBusy(false));
    },

    onRefresh() {
      this._loadData();
    },

    onDocTableUpdate(oEvent) {
      oEvent.getSource().getItems().forEach((oItem) => {
        const bTotal = !!oItem.getBindingContext("payment").getProperty("isTotal");
        oItem.toggleStyleClass("dpTotalRow", bTotal);
      });
    },

    onApplyFilter() {
      this._loadData();
    },

    onResetFilter() {
      this.getView().getModel("filter").setData(this._getDefaultFilters());
      this._loadData();
    },
  });
});