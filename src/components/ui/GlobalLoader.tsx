import loadingGif from "../../assets/loading.gif";
import { useLoadingStore } from "../../store/useLoadingStore";
import "./GlobalLoader.css";

const GlobalLoader = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
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
