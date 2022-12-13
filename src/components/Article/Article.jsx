import React from 'react';
import { Typography } from 'antd';

import ArticleHeader from '../ArticleHeader/ArticleHeader';

import styles from './Article.module.scss';

const { Paragraph } = Typography;
function Article({ description, slug, created, likes, title, username, image, tagList, favorited }) {
  return (
    <div className={styles.articleCard}>
      <ArticleHeader
        favorited={favorited}
        slug={slug}
        created={created}
        likes={likes}
        title={title}
        description={description}
        username={username}
        image={image}
        tagList={tagList}
      />
      <Paragraph className={styles.paragraph} ellipsis={{ rows: 2 }}>
        {description}
      </Paragraph>
    </div>
  );
}

export default Article;
