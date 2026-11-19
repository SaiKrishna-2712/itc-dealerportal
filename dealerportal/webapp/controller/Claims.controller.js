sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, MessageToast) {
    "use strict";

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