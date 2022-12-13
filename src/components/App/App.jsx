import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ProfilePage from '../Pages/ProfilePage/ProfilePage';
import LoginPage from '../Pages/LoginPage/LoginPage';
import RegisterPage from '../Pages/RegisterPage/RegisterPage';
import ArticlesPage from '../Pages/ArticlesPage/ArticlesPage';
import ArticlePage from '../Pages/ArticlePage';
import CreateArticle from '../Pages/CreateArticle';
import EditArticle from '../Pages/EditArticle/EditArticle';
import Header from '../Header';

import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Header />
        <Route path="/create-article" render={() => <CreateArticle />} />
        <Route path="/articles/:slug/edit" render={() => <EditArticle />} />
        <Route path="/sign-in" render={() => <LoginPage />} />
        <Route path="/sign-up" render={() => <RegisterPage />} />
        <Route path="/profile" render={() => <ProfilePage />} />
        <Route path="/articles" render={() => <ArticlesPage />} exact />
        <Route path="/" render={() => <ArticlesPage />} exact />
        <Route path="/articles/:id" render={() => <ArticlePage />} exact />
      </Router>
    </div>
  );
}
export default App;
