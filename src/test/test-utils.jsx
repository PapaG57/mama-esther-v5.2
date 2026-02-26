import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

export const renderWithProviders = (ui) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{ui}</BrowserRouter>
    </I18nextProvider>
  );
};
