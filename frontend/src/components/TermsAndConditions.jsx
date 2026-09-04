import React from "react";

export default function TermsAndConditions({ onSign }) {
  return (
    <div className="terms-page">
      <h1>Terms and Conditions</h1>
      <div className="terms-content">
        <p>
          Please read these terms and conditions carefully before signing up.
        </p>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Onevoo. These are the terms and conditions governing
          your access to and use of the Onevoo platform.
        </p>
        <h2>2. Term Options</h2>
        <p>Please select your preferred contract term:</p>
        <form>
          <div className="form-group">
            <label>
              <input type="radio" name="term" value="5" defaultChecked /> 5 Year
              Term
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="radio" name="term" value="7" /> 7 Year Term
            </label>
          </div>
        </form>
        <h2>3. Acceptance of Terms</h2>
        <p>
          By clicking the "Sign Contract" button, you agree to be bound by
          these terms and conditions.
        </p>
      </div>
      <button className="btn btn-solid" onClick={onSign}>
        Sign Contract
      </button>
    </div>
  );
}
