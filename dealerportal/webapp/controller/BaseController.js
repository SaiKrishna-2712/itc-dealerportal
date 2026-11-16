sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("com.itc.dealerportal.controller.BaseController", {
    onMenuButtonPress: function (oEvent) {
      var mAppViewModel = this.getOwnerComponent().getModel("mAppViewModel");
      var bIsMenuExpanded = mAppViewModel.getProperty("/isMenuExpanded");
      mAppViewModel.setProperty("/isMenuExpanded", !bIsMenuExpanded);
    },
    onItemSelect: function (oEvent) {
      const oItem = oEvent.getParameter("item");
      const sKey = oItem.getKey();

      if (!sKey) {
        return;
      }

      this.getOwnerComponent().getRouter().navTo(sKey);
    }
  });
});