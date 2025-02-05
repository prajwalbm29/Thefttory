import LoginForm from "../components/loginForm";
import { useNavigate } from 'react-router-dom';
import { UseSession } from "../context/sessionContext";

function LoginPage() {
  const { login } = UseSession();
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    if (!userData) {
      console.error("Login failed: No user data received");
      return;
    }

    console.log("User data:", userData);
    login(userData);

    if (userData.isVerified) {
      console.log("User is verified. Redirecting...");
      navigate('/');
    } else {
      console.log("User not verified.");
    }
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}

export default LoginPage;
