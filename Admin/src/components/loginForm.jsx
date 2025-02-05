import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import authServices from '../Services/apiRouters';
import LoadingScreen from '../Loading/loading';

// eslint-disable-next-line react/prop-types
function LoginForm({ onLoginSuccess }) {
    const [aadhaarNo, setAadhaarNo] = useState(null);
    const [password, setPassword] = useState(null);
    const [isDataCorrect, setIsDataCorrect] = useState(false);
    const [name, setName] = useState(null);
    const [dob, setDob] = useState(null);
    const [isLoged, setIsLoged] = useState(false);
    const [isOtpGenerated, setIsOtpGenerated] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) {
        return (
            <LoadingScreen />
        )
    }

    const handleGetData = async (e) => {
        e.preventDefault();
        if (aadhaarNo.length !== 12) {
            alert("Enter 12 digit aadhaar number");
            return;
        }

        setIsLoading(true);
        try {
            const response = await authServices.getData(aadhaarNo);
            console.log("Response : ", response);
            setName(response.data.name);
            setDob(response.data.dob);
        } catch (error) {
            console.log("Error", error);
            alert("Server Error : Enter valid aadhaar Number.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleCorrectData = () => {
        setIsDataCorrect(true);
    }

    const handleNotCorrect = () => {
        setName(null);
        setDob(null);
    }

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await authServices.login(aadhaarNo, password);
            console.log("Login successful: ", response);

            if (response.status === 200) {
                console.log("Login successful.");
                alert(response.data.message);
                setIsLoged(true);
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error in login function: ", error);
            const errorMessage = error.response?.data?.message || "An error occurred during login.";
            alert(errorMessage); // Provide user-friendly error messages
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authServices.generateOTP(aadhaarNo);
            if (response.status === 200) {
                console.log("OTP Generated successfuly.");
                setIsOtpGenerated(true);
            }
        } catch (error) {
            console.log("Error in Generate otp : ", error);
            alert("Server Error..! Failed to send otp.");
        } finally {
            setIsLoading(false);
        }
    }

    const VerifyOTP = async (e) => {
        e.preventDefault();
        if (otp.length !== 4) {
            alert("Enter 4 digit OTP");
            return;
        }

        setIsLoading(true);

        try {
            const response = await authServices.verifyOTP(aadhaarNo, otp);
            if (response.status === 400) {
                alert("Invalid OTP or OTP has expired.");
                return;
            }

            if (response.status === 200) {
                console.log("OTP Verified successfully.", response.data);
                onLoginSuccess(response.data);
            }
        } catch (error) {
            console.log("Error in OTP Verification : ", error);
            alert("Server Error..! Failed to verify otp.");
        } finally {
            setIsLoading(false);
        }
    }

    return (

        <div className="loginFormContainer">
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Aadhaar Number</Form.Label>
                    <Form.Control type="number" placeholder="Enter Aadhaar Number" value={aadhaarNo} onChange={(e) => setAadhaarNo(e.target.value)} readOnly={name && dob} />
                </Form.Group>

                {name && dob && !isDataCorrect && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={name} readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="text" value={dob} readOnly />
                        </Form.Group>

                        <Button variant="success" className="me-2" onClick={handleCorrectData} >
                            Correct Data
                        </Button>
                        <Button variant="danger" onClick={handleNotCorrect} >
                            Not Correct
                        </Button>
                    </>
                )}

                {!name && !dob && (
                    <Button variant="primary" onClick={handleGetData}>
                        Get Data
                    </Button>
                )}

                {isDataCorrect && !isLoged && (
                    <>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="success" className="me-2" onClick={handleLogin} >
                            Login
                        </Button>
                    </>
                )
                }

                {isLoged && !isOtpGenerated && (
                    <Button variant="success" className="me-2" onClick={handleGenerateOTP} >
                        Generate OTP
                    </Button>
                )
                }

                {isOtpGenerated && (
                    <>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Control type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        </Form.Group>
                        <Button variant="success" className="me-2" onClick={VerifyOTP} >
                            Verify OTP
                        </Button>
                    </>
                )}

            </Form>
        </div>
    )
}

export default LoginForm