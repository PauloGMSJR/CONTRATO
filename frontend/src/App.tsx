import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TipoContrato from './pages/TipoContrato';
import DadosPartes from './pages/DadosPartes';
import Clausulas from './pages/Clausulas';
import PreviewDownload from './pages/PreviewDownload';
import AuthArea from './pages/AuthArea';
import { Layout } from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/selecionar" element={<TipoContrato />} />
        <Route path="/partes" element={<DadosPartes />} />
        <Route path="/clausulas" element={<Clausulas />} />
        <Route path="/preview" element={<PreviewDownload />} />
        <Route path="/auth" element={<AuthArea />} />
      </Routes>
    </Layout>
  );
}

export default App;
