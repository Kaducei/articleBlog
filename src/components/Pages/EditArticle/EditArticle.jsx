/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import { Redirect, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { logIn } from '../../../Redux/slices/loginSlice';
import articlesAPI from '../../services/articlesService';

import styles from './EditArticle.module.scss';

function EditArticle() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const [editArticle] = articlesAPI.useEditArticleMutation();
  const { slug } = useParams();

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
    await editArticle({
      slug,
      body: { article: { ...userData, tagList: userData.tag.map((item) => item.firstName) } },
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
        <h4 className={styles.title}>Edit article</h4>
        <label className={styles.label}>
          Title
          <input
            className={errors.email && styles.inputError}
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
            className={errors.password && styles.inputError}
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
            className={(errors.password && styles.inputError) || styles.areaInput}
            placeholder="Text"
            {...register('body', {
              required: { value: true, message: 'Short description is required.' },
            })}
          />
          {errors.body && <span className={styles.error}>{errors.body.message}</span>}
        </label>
        <label className={styles.label}>
          Tags
          <div className={styles.tagsWrapper}>
            <ul className={styles.tagContainer}>
              {fields.map((item, index) => (
                <li key={item.id}>
                  <input className={styles.tagInput} {...register(`tag.${index}.firstName`)} />
                  <button className={styles.deleteButton} type="button" onClick={() => remove(index)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.appendWrapper}>
              <button
                className={styles.appendButton}
                type="button"
                onClick={() => append({ firstName: 'bill', lastName: 'luo' })}
              >
                Add tag
              </button>
            </div>
          </div>
        </label>
        <div className={styles.submitButton}>
          <Button htmlType="submit" type="primary" block>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditArticle;
