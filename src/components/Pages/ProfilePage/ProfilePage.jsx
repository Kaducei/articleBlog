/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useForm } from 'react-hook-form';

import articlesAPI from '../../services/articlesService';

import styles from './ProfilePage.module.scss';

function ProfilePage() {
  const [userData, setUserData] = useState();
  const [updateUser] = articlesAPI.useUpdateUserMutation();

  const handleUpdateUser = async () => {
    if (!userData) return;
    await updateUser({ loginToken: localStorage.loginToken, body: { user: { ...userData, bio: 'somebio' } } })
      .unwrap()
      .then((response) => response)
      .catch((err) => err);
  };
  const { data } = articlesAPI.useGetCurrentUserQuery(localStorage.loginToken);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (datum) => {
    setUserData(datum);
  };

  useEffect(() => {
    handleUpdateUser();
  }, [userData]);

  return (
    <div className={('container', styles.flexCenter)}>
      <form onSubmit={handleSubmit(onSubmit)} action="" className={styles.form}>
        <h4 className={styles.title}>Edit</h4>
        <label className={styles.label}>
          Username
          <input
            defaultValue={data?.user.username || ''}
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
            defaultValue={data?.user.email || ''}
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
          New password
          <input
            className={errors.password && styles.inputError}
            placeholder="Password"
            type="password"
            {...register('password', {
              minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
              maxLength: { value: 40, message: 'Your password must be no more than 20 characters.' },
            })}
          />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </label>
        <label className={styles.label}>
          Avatar image (url)
          <input
            defaultValue={data?.user.image || ''}
            className={errors.password && styles.inputError}
            placeholder="Avatar"
            {...register('image')}
          />
          {errors.image && <span className={styles.error}>{errors.image.message}</span>}
        </label>
        <div className={styles.submitButton}>
          <Button htmlType="submit" type="primary" block size="large">
            Edit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
