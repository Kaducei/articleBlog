import React from 'react';
import { Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import Article from '../../Article/Article';
import articlesAPI from '../../services/articlesService';
import { pagUp } from '../../../Redux/slices/loginSlice';

const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

function ArticlesPage() {
  const dispatch = useDispatch();

  dispatch(pagUp(localStorage.page || 1));

  const pagCounter = useSelector((state) => state.loginSlice.pagCounter);

  const { data, isLoading } = articlesAPI.useFetchAllArticlesQuery({
    offset: pagCounter,
    loginToken: localStorage.loginToken,
  });

  const elements =
    !isLoading &&
    data.articles.map((item) => {
      const { image, username } = item.author;
      return (
        <Article
          favorited={item.favorited}
          key={`${item.slug}${item.createdAt}${item.username}`}
          slug={item.slug}
          created={item.createdAt}
          likes={item.favoritesCount}
          title={item.title}
          description={item.description}
          tagList={item.tagList}
          username={username}
          image={image}
        />
      );
    });

  return (
    <>
      <ul style={{ margin: 'auto' }}>{elements || <Spin indicator={antIcon} />}</ul>
      <Pagination
        defaultCurrent={localStorage.page}
        style={{ margin: 'auto', padding: '10px' }}
        total={(data?.articlesCount && data.articlesCount - 5) || 10000}
        defaultPageSize={5}
        size="small"
        showSizeChanger={false}
        onChange={(value) => {
          localStorage.setItem('page', value);
          dispatch(pagUp(value));
        }}
      />
    </>
  );
}
export default ArticlesPage;
