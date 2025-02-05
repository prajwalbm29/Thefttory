import "./allotForm.css";
import authServices from "../Services/apiRouters";
import LoadingScreen from "../Loading/loading";
import { useEffect, useState } from "react";

function AllotComplaints({ policeId, closeModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [complaintData, setComplaintData] = useState([]);
  const [allotedComplaints, setAllotedComplaints] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchPoliceData = async () => {
      setIsLoading(true);
      try {
        const response = await authServices.getComplaints();
        if (response.status === 200) {
          setComplaintData(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching police data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllotedCompaints = async () => {
      setIsLoading(true);
      try {
        const response = await authServices.getComplaints(policeId);
        if (response.status === 200) {
          setAllotedComplaints(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching police data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPoliceData();
    fetchAllotedCompaints();
  }, [policeId]);

  // Function to handle checkbox change
  const handleCheckboxChange = async (complaintId, isChecked) => {
    setIsLoading(true);
    try {
      if (isChecked) {
        await authServices.allotComplaint(policeId, complaintId);
        setAllotedComplaints([...allotedComplaints, complaintId]);
      } else {
        await authServices.removeAllotment(policeId, complaintId);
        setAllotedComplaints(allotedComplaints.filter(id => id !== complaintId));
      }
    } catch (error) {
      console.error("Error updating allotment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return(
      <LoadingScreen />
    )
  }

  return (
    <div className="modal-overlay">
      <div className="close-icon" onClick={closeModal}>✖</div>

      <h3 className="title">Allot Complaints</h3>
      <div className="complaint-table">
        <table>
          <thead>
            <tr>
              <th>Lost Location</th>
              <th>Lost Date</th>
              <th>Complaint Date</th>
              <th>Status</th>
              <th>Allot</th>
            </tr>
          </thead>
          <tbody>
            {complaintData.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.lostLocation}</td>
                <td>{complaint.lostDate.substring(0, 10)}</td>
                <td>{complaint.complaintDate.substring(0, 10)}</td>
                <td>{complaint.status}</td>
                <input
                  type="checkbox"
                  checked={allotedComplaints.includes(complaint._id)}
                  onChange={(e) => handleCheckboxChange(complaint._id, e.target.checked)}
                />
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default AllotComplaints;
