
sap.ui.define([
  "com/itc/dealerportal/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast"
], (BaseController, JSONModel, Filter, FilterOperator, MessageToast) => {
  "use strict";

  const PAYMENTS_ENDPOINT = "/getPayments";

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
        paymentTypes: [],
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

    _getUrl() {
      const sBaseUrl = this.getOwnerComponent()
        .getManifestEntry("/sap.app/dataSources/dealerApi/uri");

      return sBaseUrl + PAYMENTS_ENDPOINT;
    },

    _mapPayment(oRow) {
      return {
        id: oRow.refNo,
        submittedOn: oRow.submittedOn,
        paymentType: oRow.paymentType,
        instrumentType: oRow.instrumentType,
        instrumentNo: oRow.instrumentUtrNo,
        paymentDate: oRow.paymentDate,
        amount: Number(oRow.amount),
        docCount: oRow.documentCount,
        status: oRow.status,
        lastUpdated: (oRow.lastUpdated || "").slice(0, 10)
      };
    },

    async _loadData() {
      const oView = this.getView();

      oView.setBusy(true);

      try {
        const oResponse = await fetch(this._getUrl(), {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        });

        if (!oResponse.ok) {
          throw new Error("API Error: " + oResponse.status);
        }

        const oResult = await oResponse.json();

        const aRows = (oResult.value || []).map(this._mapPayment);
        const aTypes = [
          ...new Set(aRows.map((oRow) => oRow.paymentType))
        ];

        oView.getModel("payments").setProperty("/payments", aRows);

        oView.getModel("filter").setProperty(
          "/paymentTypes",
          aTypes.map((sType) => ({
            key: sType,
            name: sType
          }))
        );

        this._applyFilters();

      } catch (oError) {
        console.error("Payment API error:", oError);
        MessageToast.show("Unable to load payments");
      } finally {
        oView.setBusy(false);
      }
    },

    _applyFilters() {
      const oData = this.getView().getModel("filter").getData();
      const aFilters = [];

      if (oData.tab !== "all") {
        aFilters.push(
          new Filter("status", FilterOperator.EQ, oData.tab)
        );
      }

      [
        ["paymentType", oData.paymentType],
        ["submittedOn", oData.submittedDate],
        ["paymentDate", oData.paymentDate],
        ["status", oData.status]
      ].forEach(([sPath, sValue]) => {
        if (sValue) {
          aFilters.push(
            new Filter(sPath, FilterOperator.EQ, sValue)
          );
        }
      });

      if (oData.search) {
        aFilters.push(
          new Filter("id", FilterOperator.Contains, oData.search)
        );
      }

      const oTable = this.byId("idPaymentsTable");
      const oBinding = oTable.getBinding("items");

      if (oBinding) {
        oBinding.filter(aFilters);
      }
    },

    onTabSelect(oEvent) {
      const oModel = this.getView().getModel("filter");

      oModel.setProperty("/tab", oEvent.getParameter("key"));
      oModel.setProperty("/status", "");

      this._applyFilters();
    },

    onSearch(oEvent) {
      this.getView()
        .getModel("filter")
        .setProperty("/search", oEvent.getParameter("newValue"));

      this._applyFilters();
    },

    onApplyFilter() {
      this._applyFilters();
    },

    onResetFilter() {
      const oModel = this.getView().getModel("filter");
      const oDefaults = this._getDefaultFilters();

      [
        "tab",
        "customer",
        "paymentType",
        "submittedDate",
        "paymentDate",
        "status",
        "search"
      ].forEach((sKey) => {
        oModel.setProperty("/" + sKey, oDefaults[sKey]);
      });

      this._applyFilters();
    }
  });
});
