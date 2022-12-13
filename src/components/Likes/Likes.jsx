import { useState } from 'react';

import articlesAPI from '../services/articlesService';

import styles from './Likes.module.scss';

function Likes({ likes, slug, favorited }) {
  const [like, setLike] = useState(likes);
  const [favoriteArticle] = articlesAPI.useFavoriteArticleMutation();

  const handleFavoriteArticle = async (value) => {
    await favoriteArticle({
      value,
      token: localStorage.loginToken,
      slug,
    });
  };

  const id = Math.random(1, 9999999) * 3;

  return (
    <div className={styles.likes}>
      <label htmlFor={id}>
        <input
          defaultChecked={favorited}
          onClick={(e) => {
            setLike(!favorited ? likes + e.target.checked : likes + e.target.checked - 1);
          }}
          onChange={(e) => handleFavoriteArticle(e.target.checked)}
          type="checkbox"
          name="likes"
          className={styles.realCheckbox}
          id={id}
        />
        <span className={styles.fakeCheckbox} />
        <span className={styles.likesCount}>{like}</span>
      </label>
    </div>
  );
}

export default Likes;
