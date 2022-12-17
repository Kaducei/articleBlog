/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import { Redirect } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { logIn } from '../../../Redux/slices/loginSlice';
import articlesAPI from '../../services/articlesService';

import styles from './CreateArticle.module.scss';

function CreateArticle() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const [setArticle] = articlesAPI.useSetArticleMutation();

  const [red, setRed] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  });

  const handleSetArticle = async () => {
    if (!userData) return;
    await setArticle({
      body: { article: { ...userData, tagList: userData.tag?.map((item) => item.firstName) || [] } },
      loginToken: localStorage.loginToken,
    })
      .unwrap()
      .then((response) => {
        dispatch(logIn());
        setRed(true);
        return response;
      })
      .catch((error) => {
        setRed(false);
        return error;
      });
  };

  const onSubmit = (datum) => {
    setUserData(datum);
  };

  useEffect(() => {
    handleSetArticle();
  }, [userData]);

  return red ? (
    <Redirect to="/" />
  ) : (
    <div className={('container', styles.flexCenter)}>
      <form onSubmit={handleSubmit(onSubmit)} action="" className={styles.form}>
        <h4 className={styles.title}>Create new article</h4>
        <label className={styles.label}>
          Title
          <input
            className={errors.title && styles.inputError}
            placeholder="Title"
            {...register('title', {
              required: { value: true, message: 'Title is required.' },
            })}
          />
          {errors.title && <span className={styles.error}>{errors.title.message}</span>}
        </label>
        <label className={styles.label}>
          Short description
          <input
            className={errors.description && styles.inputError}
            placeholder="Short description"
            {...register('description', {
              required: { value: true, message: 'Short description is required.' },
            })}
          />
          {errors.description && <span className={styles.error}>{errors.description.message}</span>}
        </label>
        <label className={styles.label}>
          Text
          <textarea
            rows={10}
            className={`${errors.body && styles.inputError} ${styles.areaInput}`}
            placeholder="Text"
            {...register('body', {
              required: { value: true, message: 'Short description is required.' },
            })}
          />
          {errors.body && <span className={styles.error}>{errors.body.message}</span>}
        </label>
        <div className={styles.tagwrapper}>
          <label>Tags</label>
          <ul className={styles.taglist}>
            {fields.map((item, index) => (
              <li key={item.id} className={styles.tagwrapper__item}>
                <input
                  className={errors.tag && styles.inputError}
                  {...register(`tag.${index}.firstName`, {
                    required: { value: true, message: 'Tag is required.' },
                  })}
                />
                <div className={styles.buttonwrapper}>
                  <Button className={styles.button} ghost danger onClick={() => remove(index)}>
                    Delete
                  </Button>
                  {fields.length - 1 === index && (
                    <Button className={styles.button} ghost type="primary" onClick={() => append({})}>
                      Add tag
                    </Button>
                  )}
                </div>
              </li>
            ))}
            {errors.tag?.length && <span className={styles.error}>Each tag must be</span>}
          </ul>
          {!fields.length && (
            <div className={styles.buttonwrapper}>
              <Button className={styles.button} ghost type="primary" onClick={() => append({})}>
                Add tag
              </Button>
            </div>
          )}
          <div className={styles.submitButton}>
            <Button style={{ width: '33%' }} htmlType="submit" type="primary" block>
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateArticle;
