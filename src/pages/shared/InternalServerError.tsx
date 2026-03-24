import { useNavigate } from "react-router";
import { Button } from "../../components/ui/Form";
import styles from "./InternalServerError.module.css";

export default function InternalServerError() {
  const navigate = useNavigate();

  return (
    <div className={styles.content}>
      <h1 className={styles.errorCode}>500</h1>
      <h2 className={styles.title}>Oops! Ocorreu um erro!</h2>
      <p className={styles.description}>
        Fique tranquilo, estamos cientes e trabalhanod na correção deste problema.
      </p>

      <Button text="Voltar para a página anterior" onClick={() => navigate(-1)} />
    </div>
  );
}
