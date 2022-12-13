import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { logOut, logIn } from '../../Redux/slices/loginSlice';
import avatar from '../Images/avatar.png';
import articlesAPI from '../services/articlesService';

import styles from './Header.module.scss';

function Header() {
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
      <Link to={isLogin ? '/' : '/sign-in'} className={styles.brand}>
        Realworld Blog
      </Link>
      <div className={styles.profile}>
        {isLogin && data ? (
          <>
            <Link className={styles.createArticleButton} to="/create-article">
              Create article
            </Link>
            <div className={styles.profile}>
              <Link className={styles.profileName} to="/profile">
                {(data && data.user.username) || 'nothing'}
                <img src={data.user.image || avatar} alt="avatar" className={styles.avatar} />
              </Link>
            </div>
            <button
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
