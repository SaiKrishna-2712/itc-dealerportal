sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (Controller) => {
  "use strict";

  return Controller.extend("com.itc.dealerportal.controller.BaseController", {

    getRouter() {
      return this.getOwnerComponent().getRouter();
    },

    getModel(sName) {
      return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
    },

    getText(sKey, aArgs) {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey, aArgs);
    },

    onMenuButtonPress() {
      const oModel = this.getModel("mAppViewModel");
      oModel.setProperty("/isMenuExpanded", !oModel.getProperty("/isMenuExpanded"));
    },

    onItemSelect(oEvent) {
      const sKey = oEvent.getParameter("item").getKey();

      if (!sKey || !this.getRouter().getRoute(sKey)) {
        return;
      }
      this.getRouter().navTo(sKey);
    }
  });
});