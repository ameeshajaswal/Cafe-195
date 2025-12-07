// src/LandingPage.test.jsx
import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";

// Mock the Navbar component completely to avoid its dependencies
jest.mock('./Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="mock-navbar">Mock Navigation</nav>;
  };
});

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ 
    pathname: '/',
    hash: '',
    state: null,
    search: ''
  }),
  useNavigate: () => jest.fn(),
}));

import LandingPage from "./LandingPage";

describe("LandingPage Component", () => {
  test("renders main heading '195°F'", () => {
    render(<LandingPage />);
    const headingElement = screen.getByText("195°F");
    expect(headingElement).toBeInTheDocument();
  });

  test("renders tagline 'Perfect Shot'", () => {
    render(<LandingPage />);
    const taglineElement = screen.getByText("Perfect Shot");
    expect(taglineElement).toBeInTheDocument();
  });

  test("renders 'Start Ordering' button", () => {
    render(<LandingPage />);
    const buttonElement = screen.getByText("Start Ordering");
    expect(buttonElement).toBeInTheDocument();
  });

  test("renders mocked Navbar", () => {
    render(<LandingPage />);
    const navbarElement = screen.getByTestId("mock-navbar");
    expect(navbarElement).toBeInTheDocument();
  });
});