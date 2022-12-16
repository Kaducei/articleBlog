/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';

import Likes from '../Likes';
import avatar from '../assets/avatar.png';

import styles from './ArticleHeader.module.scss';

function ArticleHeader({ title, created, likes, username, image, tagList, slug, favorited }) {
  const [imgError, setError] = useState(false);
  return (
    <header className={styles.header}>
      <div>
        <div className={styles.flexRow}>
          <Link className={styles.title} to={`/articles/${slug}`}>
            {title ? (title.length < 30 ? title : title.slice(0, 50)) : ''}
          </Link>
          <Likes likes={likes} slug={slug} favorited={favorited} />
        </div>
        <div className={styles.tagsArea}>
          {tagList &&
            tagList
              .filter((elem) => elem !== ' ' && elem !== '')
              .map((item) => (
                <span className={styles.tag} key={Math.random(1, 9999)}>
                  {item ? (item.length < 30 ? item : item.slice(0, 10)) : ''}
                </span>
              ))}
        </div>
      </div>
      <div className={styles.userInfo}>
        <div>
          <div className={styles.username}>{username}</div>
          <div className={styles.date}>{format(new Date(created), 'PP')}</div>
        </div>

        <img
          src={imgError ? avatar : image}
          onError={() => setError(true)}
          alt="avatar"
          className={styles.userAvatar}
        />
      </div>
    </header>
  );
}
export default ArticleHeader;
