import loadingGif from "../../assets/loading.gif";
import { useLoadingStore } from "../../store/useLoadingStore";
import "./GlobalLoader.css";

const GlobalLoader = () => {
  const isLoading = useLoadingStore((state) => state.activeRequests > 0);

  if (!isLoading) return null;

  return (
    <div 
      className="global-loader-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="global-loader-content">
        <img 
          src={loadingGif} 
          alt="Carregando..." 
          className="global-loader-image" 
        />
        
        <span className="global-loader-text">
          Carregando...
        </span>
      </div>
    </div>
  );
};

export default GlobalLoader;
