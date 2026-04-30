import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoadingStore } from "../../store/useLoadingStore";

const GlobalLoader = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-xl">
        <FontAwesomeIcon icon={faCircleNotch} spin className="text-4xl text-blue-600 mb-4" />
        <span className="text-gray-700 font-medium">Carregando...</span>
      </div>
    </div>
  );
};

export default GlobalLoader;
