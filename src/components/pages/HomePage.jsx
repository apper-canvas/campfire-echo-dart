import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { projectService, todoService } from '@/services'; // Services are imported at the page level
import QuickActions from '@/components/QuickActions';

// Organisms
import DashboardHeader from '@/components/organisms/DashboardHeader';
import ProjectsOverview from '@/components/organisms/ProjectsOverview';
import RecentActivityList from '@/components/organisms/RecentActivityList';
import QuickStatsPanel from '@/components/organisms/QuickStatsPanel';
import RecentTasksList from '@/components/organisms/RecentTasksList';
import HomePageLoadingSkeleton from '@/components/organisms/HomePageLoadingSkeleton';
import HomePageErrorState from '@/components/organisms/HomePageErrorState';

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentTodos, setRecentTodos] = useState([]); // From MainFeature
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [projectsData, todosData] = await Promise.all([
          projectService.getAll(),
          todoService.getAll() // Also fetch todos for RecentTasksList
        ]);

        setProjects(projectsData.slice(0, 4)); // Show first 4 projects for Active Projects
        setRecentTodos(todosData.slice(0, 5)); // Show first 5 todos for Recent Tasks
        
        // Mock recent activity (from original Home.jsx)
        setRecentActivity([
          { id: 1, action: 'completed', item: 'Design mockups', project: 'Website Redesign', time: '2 hours ago', user: 'Sarah Chen' },
          { id: 2, action: 'created', item: 'New todo list', project: 'Mobile App', time: '4 hours ago', user: 'Mike Torres' },
          { id: 3, action: 'commented', item: 'Sprint planning notes', project: 'Platform Update', time: '6 hours ago', user: 'Alex Rodriguez' }
        ]);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleToggleTodo = async (todoId) => {
    try {
      const todo = recentTodos.find(t => t.id === todoId);
      const updatedTodo = await todoService.update(todoId, { 
        completed: !todo.completed 
      });
      
      setRecentTodos(prev => prev.map(t => t.id === todoId ? updatedTodo : t));
      toast.success(updatedTodo.completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return <HomePageLoadingSkeleton />;
  }

  if (error) {
    return <HomePageErrorState error={error} />;
  }

  const projectsEmptyStateProps = {
    iconName: "FolderOpen",
    title: "No projects yet",
    description: "Get started by creating your first project",
    actionButtonText: "Create Project",
    actionButtonLink: "/projects"
  };

  return (
    <div className="max-w-full overflow-hidden">
      <DashboardHeader />

      <QuickActions />

      {/* Active Projects section - Combines Home and MainFeature's project lists */}
      <ProjectsOverview 
        projects={projects} // projects already sliced to 4 for Home, or use projects.slice(0, N) if N is different
        title="Active Projects" 
        viewAllLink="/projects" 
        emptyStateProps={projectsEmptyStateProps} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <RecentActivityList recentActivity={recentActivity} />

        {/* Quick Stats & Recent Tasks (from MainFeature.jsx) */}
        <div>
          <QuickStatsPanel 
            activeProjectsCount={projects.length}
            tasksCompletedToday={8} // Hardcoded as per original Home.jsx
            teamMembers={12} // Hardcoded as per original Home.jsx
          />
          {/* MainFeature's Recent Tasks section - moved to its own organism */}
          <div className="mt-8"> {/* Added margin to separate QuickStats and RecentTasks */}
            <RecentTasksList recentTodos={recentTodos} onToggleTodo={handleToggleTodo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;