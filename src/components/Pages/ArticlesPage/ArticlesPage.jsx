import React from 'react';
import { Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Article from '../../Article/Article';
import articlesAPI from '../../services/articlesService';
import { pagUp } from '../../../Redux/slices/loginSlice';

const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

function ArticlesPage() {
  const isLogin = useSelector((state) => state.loginSlice.isLogin);
  const dispatch = useDispatch();
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

  return isLogin ? (
    <>
      <ul style={{ margin: 'auto' }}>{elements || <Spin indicator={antIcon} />}</ul>
      <Pagination
        style={{ margin: 'auto', padding: '10px' }}
        total={isLoading || data.articlesCount}
        defaultPageSize={5}
        size="small"
        showSizeChanger={false}
        onChange={(value) => dispatch(pagUp(value))}
      />
    </>
  ) : (
    <Redirect to="/sign-in" />
  );
}
export default ArticlesPage;
