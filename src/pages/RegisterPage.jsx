import RegisterForm from '../components/auth/RegisterForm';
import './RegisterPage.css'; // style riêng cho RegisterPage

function RegisterPage() {
  return (
    <div className="register-page-container">
      <div className="register-card">
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
