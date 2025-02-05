const CarForm = () => {
    return (
      <form>
        <h2>Car Complaint Form</h2>
        <label>Make:</label>
        <input type="text" name="make" required />
        <br />
        <label>Model:</label>
        <input type="text" name="model" required />
        <br />
        <label>Registration Number:</label>
        <input type="text" name="registrationNumber" required />
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
  
  export default CarForm;
  