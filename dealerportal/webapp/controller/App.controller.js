sap.ui.define([
  "com/itc/dealerportal/controller/BaseController"
], (BaseController) => {
  "use strict";

  return BaseController.extend("com.itc.dealerportal.controller.App", {
      onInit() {
        var mAppViewModel = this.getOwnerComponent().getModel("mAppViewModel");
        mAppViewModel.setProperty("/isMenuExpanded", false);
      }
  });
});