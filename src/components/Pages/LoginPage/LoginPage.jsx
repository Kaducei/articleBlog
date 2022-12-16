/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { logIn } from '../../../Redux/slices/loginSlice';
import articlesAPI from '../../services/articlesService';

import styles from './LoginPage.module.scss';

function LoginPage() {
  const dispatch = useDispatch();
  const [userLogIn] = articlesAPI.useLogInUserMutation();
  const [red, setRed] = useState();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const handleUserLogIn = async (userData) => {
    if (!userData) return;
    await userLogIn({ user: { email: userData.email, password: userData.password } })
      .unwrap()
      .then((response) => {
        dispatch(logIn());
        setRed(true);
        localStorage.removeItem('loginToken');
        localStorage.setItem('loginToken', response.user.token);
      })
      .catch((error) => {
        setRed(false);
        setError('email', { message: error.data.errors['email or password'] });
        console.log(error);
      });
  };

  const onSubmit = (datum) => {
    console.log(1);
    handleUserLogIn(datum);
  };

  return red ? (
    <Redirect to="/articles" />
  ) : (
    <div className={('container', styles.flexCenter)}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h4 className={styles.title}>Sign In</h4>
        <label className={styles.label}>
          Email address
          <input
            className={errors.email && styles.inputError}
            placeholder="Email address"
            {...register('email', {
              required: { value: true, message: 'Email is required.' },
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address.' },
            })}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </label>
        <label className={styles.label}>
          Password
          <input
            type="password"
            className={errors.password && styles.inputError}
            placeholder="Password"
            {...register('password', {
              required: { value: true, message: 'Password is required.' },
              minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
              maxLength: { value: 40, message: 'Your password must be no more than 20 characters.' },
            })}
          />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
          {errors.notUser && <span className={styles.error}>{errors.notUser.message}</span>}
        </label>
        <div className={styles.submitButton}>
          <Button htmlType="submit" type="primary" block>
            Login
          </Button>
        </div>
        <p className={styles.dontHaveAccount}>
          Dont have an account? <Link to="/sign-up">Sign Up</Link>.
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
