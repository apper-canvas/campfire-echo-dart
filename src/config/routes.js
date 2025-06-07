import Home from '../pages/Home';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import MyAssignments from '../pages/MyAssignments';
import Activity from '../pages/Activity';
import Team from '../pages/Team';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: Home
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'FolderOpen',
    component: Projects
  },
  myAssignments: {
    id: 'myAssignments',
    label: 'My Assignments',
    path: '/my-assignments',
    icon: 'CheckSquare',
    component: MyAssignments
  },
  activity: {
    id: 'activity',
    label: 'Activity',
    path: '/activity',
    icon: 'Activity',
    component: Activity
  },
  team: {
    id: 'team',
    label: 'Team',
    path: '/team',
    icon: 'Users',
    component: Team
  }
};

export const routeArray = Object.values(routes);