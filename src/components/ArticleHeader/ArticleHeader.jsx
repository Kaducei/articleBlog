/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';

import Likes from '../Likes';

import styles from './ArticleHeader.module.scss';

function ArticleHeader({ title, created, likes, username, image, tagList, slug, favorited }) {
  return (
    <header className={styles.header}>
      <div>
        <div className={styles.flexRow}>
          <Link className={styles.title} to={`/articles/${slug}`}>
            {title ? (title.length < 30 ? title : title.slice(0, 50)) : 'none'}
          </Link>
          <Likes likes={likes} slug={slug} favorited={favorited} />
        </div>
        <div className={styles.tagsArea}>
          {tagList &&
            tagList.map((item) => (
              <span className={styles.tag} key={Math.random(1, 9999)}>
                {item ? (item.length < 30 ? item : item.slice(0, 10)) : 'none'}
              </span>
            ))}
        </div>
      </div>
      <div className={styles.userInfo}>
        <div>
          <div className={styles.username}>{username}</div>
          <div className={styles.date}>{format(new Date(created), 'PP')}</div>
        </div>

        <img src={image} alt="avatar" className={styles.userAvatar} />
      </div>
    </header>
  );
}
export default ArticleHeader;