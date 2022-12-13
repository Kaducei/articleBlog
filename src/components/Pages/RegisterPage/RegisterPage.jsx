/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { logIn } from '../../../Redux/slices/loginSlice';
import articlesAPI from '../../services/articlesService';

import styles from './RegisterPage.module.scss';

function RegisterPage() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [red, setRed] = useState();
  const [userRegister] = articlesAPI.useRegisterUserMutation();
  const [userLogIn] = articlesAPI.useLogInUserMutation();
  localStorage.removeItem('loginToken');

  const handleUserLogIn = async () => {
    await userLogIn({ user: { email: userData.email, password: userData.password } })
      .unwrap()
      .then((response) => {
        dispatch(logIn());
        localStorage.removeItem('loginToken');
        localStorage.setItem('loginToken', response.user.token);
      });
  };

  const handleUserRegister = async () => {
    if (userData) {
      if (userData.password !== userData.repeatPassword) {
        setError('repeatPassword', { type: 'repeatPassword', message: 'Passwords must match.' });
        return;
      }
      await userRegister({ user: { username: userData.username, email: userData.email, password: userData.password } })
        .unwrap()
        .then((response) => {
          handleUserLogIn();
          setRed(true);
          localStorage.removeItem('loginToken');
          localStorage.setItem('loginToken', response.user.token);
        })
        .catch((error) => {
          setRed(false);
          console.log(error);
        });
    }
  };

  const onSubmit = (datum) => {
    setUserData(datum);
  };

  useEffect(() => {
    handleUserRegister();
  }, [userData]);

  return red ? (
    <Redirect to="/" />
  ) : (
    <div className={('container', styles.flexCenter)}>
      <form onSubmit={handleSubmit(onSubmit)} action="" className={styles.form}>
        <h4 className={styles.title}>Create new account</h4>
        <label className={styles.label}>
          Username
          <input
            className={errors.username && styles.inputError}
            placeholder="Username"
            {...register('username', {
              required: { value: true, message: 'Username is required.' },
              minLength: { value: 3, message: 'Your username needs to be at least 3 characters.' },
              maxLength: { value: 20, message: 'Your username must be no more than 20 characters.' },
            })}
          />
          {errors.username && <span className={styles.error}>{errors.username.message}</span>}
        </label>
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
            className={errors.password && styles.inputError}
            placeholder="Password"
            type="password"
            {...register('password', {
              required: { value: true, message: 'Password is required.' },
              minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
              maxLength: { value: 40, message: 'Your password must be no more than 20 characters.' },
            })}
          />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </label>
        <label className={styles.label}>
          Repeat Password
          <input
            className={errors.repeatPassword && styles.inputError}
            placeholder="Repeat Password"
            type="password"
            {...register('repeatPassword', {
              required: { value: true, message: 'Repeat password is required.' },
              minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
              maxLength: { value: 40, message: 'Your password must be no more than 20 characters.' },
            })}
          />
          {errors.repeatPassword && <span className={styles.error}>{errors.repeatPassword.message}</span>}
        </label>
        <div className={styles.agrement}>
          <input type="checkbox" name="agrement" className={styles.checkbox} id="agrement-checkbox" />
          <label htmlFor="agrement-checkbox">I agree to the processing of my personal information</label>
        </div>
        <Button htmlType="submit" type="primary" block>
          Create
        </Button>
        <p className={styles.alreadyHaveAccount}>
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
