import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpendInputPage from './pages/SpendInputPage';
import AuditResultsPage from './pages/AuditResultsPage';
import EmailCapturePage from './pages/EmailCapturePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpendInputPage />} />
        <Route path="/audit-results" element={<AuditResultsPage />} />
        <Route path="/email-capture" element={<EmailCapturePage />} />
      </Routes>
    </Router>
  );
}

export default App;
