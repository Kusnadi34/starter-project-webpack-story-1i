import HomePage from '../pages/home-page.js';
import AboutPage from '../pages/about/about-page.js';
import LoginPage from '../pages/login-page.js';
import RegisterPage from '../pages/register-page.js';
import AddStoryPage from '../pages/add-story-page.js';
import SavedPage from '../pages/saved-page.js';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
  '/saved': new SavedPage(),
};

export default routes;