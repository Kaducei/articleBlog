/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Redirect, Link } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArticleHeader from '../../ArticleHeader/ArticleHeader';
import articlesAPI from '../../services/articlesService';

import styles from './ArticlePage.module.scss';

const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

function ArticlePage() {
  const [confirm, setConfirm] = useState(false);
  const [red, setRed] = useState();
  const { id } = useParams();
  const { data, isLoading } = articlesAPI.useGetArticleQuery({ Token: localStorage.loginToken, slug: id });
  const { data: loginData } = articlesAPI.useGetCurrentUserQuery(localStorage.loginToken);
  const [deleteArticle] = articlesAPI.useDeleteArticleMutation();

  const handleDeleteArticle = async () => {
    if (!data) return;
    await deleteArticle({ slug: data.article.slug, loginToken: localStorage.loginToken })
      .unwrap()
      .then((response) => {
        setRed(true);
        return response;
      })
      .catch((err) => err);
  };

  return red ? (
    <Redirect to="/" />
  ) : (
    (isLoading && <Spin indicator={antIcon} />) || (
      <div className="container">
        <div className={styles.article}>
          <ArticleHeader
            favorited={data.article.favorited}
            slug={id}
            created={data.article.createdAt}
            likes={data.article.favoritesCount}
            title={data.article.title}
            description={data.article.description}
            username={data.article.author.username}
            image={data.article.author.image}
            tagList={data.article.tagList}
          />
          <div className={styles.descWrapper}>
            <p className={styles.shortDescription}>{data.article.description}</p>
            {data.article.author.username === loginData.user.username && !confirm ? (
              <div className={styles.edits}>
                <div>
                  <button
                    onClick={() => {
                      setConfirm(true);
                    }}
                    className={styles.deleteButton}
                    type="button"
                  >
                    Delete
                  </button>

                  <Link to={`/articles/${id}/edit`} className={styles.editButton} type="button">
                    Edit
                  </Link>
                </div>
              </div>
            ) : confirm ? (
              <div className={styles.confirm}>
                <h4>U really wanna delete?</h4>
                <div className={styles.confirmWrapper}>
                  <button
                    onClick={() => {
                      handleDeleteArticle();
                    }}
                    className={styles.confirmButton}
                    type="button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setConfirm(false);
                    }}
                    className={styles.editButton}
                    type="button"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <div className={styles.fullDescriptionBody}>
            <ReactMarkdown>{data.article.body}</ReactMarkdown>
          </div>
        </div>
      </div>
    )
  );
}
export default ArticlePage;
