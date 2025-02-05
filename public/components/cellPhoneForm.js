const CellPhoneForm = () => {
    return (
      <form>
        <h2>Cell Phone Complaint Form</h2>
        <label>Brand:</label>
        <input type="text" name="brand" required />
        <br />
        <label>Model:</label>
        <input type="text" name="model" required />
        <br />
        <label>IMEI Number:</label>
        <input type="text" name="imei" required />
        <br />
        <label>Color:</label>
        <input type="text" name="color" />
        <br />
        <label>Date of Loss:</label>
        <input type="date" name="dateOfLoss" required />
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  };
  
  export default CellPhoneForm;
  