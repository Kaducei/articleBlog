/* eslint-disable no-nested-ternary */
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { logOut, logIn } from '../../Redux/slices/loginSlice';
import avatar from '../assets/avatar.png';
import articlesAPI from '../services/articlesService';

import styles from './Header.module.scss';

function Header() {
  const [imgError, setError] = useState(false);
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.loginSlice.isLogin);
  const history = useHistory();

  const { data } = articlesAPI.useGetCurrentUserQuery(localStorage.loginToken);

  useEffect(() => {
    if (localStorage.loginToken) {
      dispatch(logIn());
    }
  }, []);

  return (
    <div className={styles.header}>
      <Link to="/" className={styles.brand}>
        Realworld Blog
      </Link>
      <div className={styles.profile}>
        {isLogin && data ? (
          <>
            <Link disabled={!isLogin} className={styles.createArticleButton} to="/create-article">
              Create article
            </Link>
            <div className={styles.profile}>
              <Link className={styles.profileName} to="/profile">
                {(data && data.user.username) || 'nothing'}
                <img
                  src={imgError ? avatar : data.user.image ? data.user.image : avatar}
                  onError={() => setError(true)}
                  alt="avatar"
                  className={styles.avatar}
                />
              </Link>
            </div>
            <button
              disabled={!isLogin}
              onClick={() => {
                history.push('sign-in');
                localStorage.removeItem('loginToken');
                dispatch(logOut());
              }}
              className={styles.logOutButton}
              type="button"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in" className={styles.signInButton}>
              Sign In
            </Link>
            <Link to="/sign-up" className={styles.signUpButton}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
export default Header;
