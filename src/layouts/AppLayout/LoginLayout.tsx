import VLibras from "@moreiraste/react-vlibras";
import { Outlet } from 'react-router';
import logo from '../../assets/logo-solarize.png';
import styles from './LoginLayout.module.css';

export default function LoginLayout() {
  return (
    <div className={`${styles.container} flex items-center justify-center min-h-screen bg-solar relative`}>
      <VLibras forceOnload={true} />
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

        <Outlet />

      </div>
    </div>
  );
}