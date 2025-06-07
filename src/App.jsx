import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import HomePage from '@/components/pages/HomePage';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import MyAssignments from './pages/MyAssignments';
import Activity from './pages/Activity';
import Team from './pages/Team';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-background overflow-hidden">
        <Routes>
          <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
            <Route path="projects" element={<Projects />} />
            <Route path="project/:id" element={<ProjectDetail />} />
            <Route path="my-assignments" element={<MyAssignments />} />
            <Route path="activity" element={<Activity />} />
            <Route path="team" element={<Team />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;