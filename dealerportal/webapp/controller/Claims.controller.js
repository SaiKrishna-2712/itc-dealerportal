sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
    "use strict";

    var CLAIMS_ENDPOINT = "finance/getClaims";
    var MODEL_PATH = "/claims";

    var aSearchFields = [
        "claimYear",
        "claimType",
        "subClaimType",
        "invoiceNumber",
        "businessArea",
        "consignee",
        "status"
    ];

    return Controller.extend("com.itc.dealerportal.controller.Claims", {

        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteClaims")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadClaims();
        },

        _getUrl: function () {
            var sBaseUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/dealerApi/uri");

            return sBaseUrl + CLAIMS_ENDPOINT;
        },

        _mapClaim: function (oRow) {
            return {
                claimNumber: oRow.claimNumber,
                claimYear: String(oRow.claimYear),
                claimType: oRow.claimType,
                subClaimType: oRow.subClaimType,
                invoiceNumber: oRow.invoiceNumber,
                docDate: oRow.docDate,
                businessArea: oRow.businessArea,
                consignee: oRow.consignee,
                claimValue: Number(oRow.claimValue),
                currency: oRow.currency,
                status: oRow.status
            };
        },

        _loadClaims: function () {
            var oView = this.getView();
            var oModel = oView.getModel("claims");

            if (!oModel) {
                oModel = new JSONModel({});
                oView.setModel(oModel, "claims");
            }

            oView.setBusy(true);

            fetch(this._getUrl(), {
                headers: {
                    Accept: "application/json",
                }
            })
                .then(function (oResponse) {
                    if (!oResponse.ok) {
                        throw new Error(oResponse.status);
                    }
                    return oResponse.json();
                })
                .then(function (oResult) {
                    oModel.setProperty(MODEL_PATH, oResult.value.map(this._mapClaim));
                }.bind(this))
                .catch(function () {
                    MessageToast.show("Unable to load claims");
                })
                .finally(function () {
                    oView.setBusy(false);
                });
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];

            if (sQuery) {
                aFilters.push(new Filter({
                    filters: aSearchFields.map(function (sField) {
                        return new Filter(sField, FilterOperator.Contains, sQuery);
                    }),
                    and: false
                }));
            }

            this.byId("claimsTable").getBinding("items").filter(aFilters);
        },

        onNewClaim: function () {
            MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("newClaim"));
        },

        onActionPress: function (oEvent) {
            var oButton = oEvent.getSource();
            this._oActionContext = oButton.getBindingContext("claims");
            this.byId("claimActionMenu").openBy(oButton);
        },

        onActionSelected: function (oEvent) {
            var sAction = oEvent.getParameter("item").getKey();
            var sInvoice = this._oActionContext.getProperty("invoiceNumber");
            MessageToast.show(sAction + ": " + sInvoice);
        }
    });
});
