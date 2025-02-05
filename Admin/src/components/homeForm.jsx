import { useEffect, useState } from "react";
import './homeForm.css'
import authServices from "../Services/apiRouters";
import AllotComplaints from "./allotForm";
import LoadingScreen from "../Loading/loading";

const PolicePage = () => {
    const [policeData, setPoliceData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allotId, setAllotId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch data from the API
    useEffect(() => {
        const fetchPoliceData = async () => {
            setIsLoading(true);
            try {
                const response = await authServices.getPolice();
                if (response.status === 200) {
                    setPoliceData(response.data);
                }
            } catch (error) {
                console.error("Error fetching police data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPoliceData();
    }, []);

    if (isLoading) {
        return (
            <LoadingScreen />
        )
    }

    // Handle Activate/Deactivate button click
    const handleToggleAccess = async (policeId, currentAccess, id) => {
        setIsLoading(true);
        try {
            const response = currentAccess === "true" ? await authServices.declineAccess(policeId) : await authServices.allowAccess(policeId);

            if (response.status === 200) {
                setPoliceData((prevData) =>
                    prevData.map((item) =>
                        item._id === id ? { ...item, hasAccess: currentAccess === "true" ? "false" : "true" } : item
                    )
                );
            } else {
                alert("Access update failed.");
            }

        } catch (error) {
            console.error("Error toggling access:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAllotId(null);
    }

    const handleAllotClick = (policeId) => {
        console.log("Button clicked : ", policeId);
        setAllotId(policeId);
        setIsModalOpen(true);
        console.log("model open : ", isModalOpen);
    }

    return (
        <div className="police-page">
            <h1>Police Management</h1>
            <div className="police-table">
                <table>
                    <thead>
                        <tr>
                            <th>Police ID</th>
                            <th>Position</th>
                            <th>Station Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policeData.map((police) => (
                            <tr key={police._id}>
                                <td>{police.policeId}</td>
                                <td>{police.position}</td>
                                <td>{police.stationAddress}</td>
                                <td>
                                    <button
                                        className={`action-btn ${police.hasAccess === "true" ? "active" : "inactive"}`}
                                        onClick={() => handleToggleAccess(police.policeId, police.hasAccess, police._id)}
                                    >
                                        {police.hasAccess === "true" ? "Deactivate" : "Activate"}
                                    </button>
                                </td>

                                {police.hasAccess == "true" ?
                                    <td>
                                        <p className="allot" onClick={() => handleAllotClick(police.policeId)} >Allot Complaints</p>
                                    </td>
                                    :
                                    <></>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AllotComplaints
                policeId={allotId}
                closeModal={handleCloseModal}
                />
            )}

        </div>
    );
};

export default PolicePage;
