sap.ui.define([
  "com/itc/dealerportal/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/m/MessageToast"
], (BaseController, JSONModel, Filter, FilterOperator, Sorter, MessageToast) => {
  "use strict";

  return BaseController.extend("com.itc.dealerportal.controller.ClaimsOverview", {

    onInit() {
      this._bDescending = true;

      this.getView().setModel(new JSONModel({}), "claims");
      this.getView().setModel(new JSONModel(this._getDefaultFilters()), "filter");

      this.getRouter()
        .getRoute("RouteClaimsOverview")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched() {
      this._loadData();
    },

    _getDefaultFilters() {
      return {
        tab: "overview",
        customer: "CH_JAVA",
        claimFrom: null,
        claimTo: null,
        dnFrom: null,
        dnTo: null
      };
    },

    _loadData() {
      const oView = this.getView();

      oView.setBusy(true);
      oView.getModel("claims")
        .loadData(sap.ui.require.toUrl("com/itc/dealerportal/model/mockData/claimsOverview.json"))
        .then(() => this._applyTab())
        .catch(() => MessageToast.show("Unable to load claims overview"))
        .finally(() => oView.setBusy(false));
    },

    _applyTab() {
      const sTab = this.getView().getModel("filter").getProperty("/tab");
      const aFilters = sTab === "overview" ? [] : [new Filter("group", FilterOperator.EQ, sTab)];

      this.byId("idClaimsOverviewTable").getBinding("items").filter(aFilters);
    },

    onTabSelect(oEvent) {
      this.getView().getModel("filter").setProperty("/tab", oEvent.getParameter("key"));
      this._applyTab();
    },

    onSort() {
      this._bDescending = !this._bDescending;
      this.byId("idClaimsOverviewTable").getBinding("items").sort(new Sorter("description", this._bDescending));
    },

    onRefresh() {
      this._loadData();
    },

    onApplyFilter() {
      this._loadData();
    },

    onResetFilter() {
      this.getView().getModel("filter").setData(this._getDefaultFilters());
      this._loadData();
    }
  });
});