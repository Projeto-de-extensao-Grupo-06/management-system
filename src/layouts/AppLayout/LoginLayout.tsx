import { Outlet } from 'react-router';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/react.svg';
import styles from './LoginLayout.module.css';

export default function LoginLayout() {
  return (
    <div className={`${styles.container} flex items-center justify-center min-h-screen bg-solar relative`}>
      <div className={`${styles.overlay} absolute inset-0`} />

      <div className={`${styles.card} relative z-10`}>
        <p className={styles.title}>FAÇA SEU LOGIN</p>
        <div className={styles.logoContainer}>
          <img
            src={logo}
            alt="Solarize Energia Solar"
            className={styles.logo}
          />
        </div>

        <p className={styles.subtitle}>
          Bem-vindo de volta à sua conta
        </p>

        <Outlet />

      </div>
    </div>
  );
}