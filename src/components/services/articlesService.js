import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const articlesAPI = createApi({
  reducerPath: 'articlesAPi',
  tagTypes: ['Articles', 'User', 'Article'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog.kata.academy/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (build) => ({
    fetchAllArticles: build.query({
      query: ({ offset = 0, loginToken }) => ({
        url: '/articles',
        params: {
          limit: 5,
          offset,
        },
        headers: {
          Authorization: `Token ${loginToken}`,
        },
      }),
      providesTags: ({ result }) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Articles', id })), { type: 'Articles', id: 'LIST' }]
          : [{ type: 'Articles', id: 'LIST' }],
    }),
    getArticle: build.query({
      query: ({ Token, slug }) => ({
        url: `articles/${slug}`,
        headers: {
          Authorization: `Token ${Token}`,
        },
      }),
      providesTags: ({ result }) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Article', id })), { type: 'Article', id: 'ONE' }]
          : [{ type: 'Article', id: 'ONE' }],
    }),
    getCurrentUser: build.query({
      query: (Token) => ({
        url: 'user',
        headers: {
          Authorization: `Token ${Token}`,
        },
      }),
      providesTags: ({ result }) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User', id })), { type: 'User', id: 'PERSON' }]
          : [{ type: 'User', id: 'PERSON' }],
    }),
    logInUser: build.mutation({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'PERSON' }],
    }),
    registerUser: build.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'PERSON' }],
    }),
    updateUser: build.mutation({
      query: ({ loginToken, body }) => ({
        url: '/user',
        headers: {
          Authorization: `Token ${loginToken}`,
        },
        body,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'User', id: 'PERSON' }],
    }),
    setArticle: build.mutation({
      query: ({ body, loginToken }) => ({
        url: '/articles',
        method: 'POST',
        body,
        headers: {
          Authorization: `Token ${loginToken}`,
        },
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    deleteArticle: build.mutation({
      query: ({ slug, loginToken }) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${loginToken}`,
        },
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    editArticle: build.mutation({
      query: ({ slug, body, loginToken }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body,
        headers: {
          Authorization: `Token ${loginToken}`,
        },
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    favoriteArticle: build.mutation({
      query: ({ token, slug, value }) => ({
        url: `articles/${slug}/favorite`,
        headers: { Authorization: `Token ${token}` },
        method: value === true ? 'POST' : 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Article', id: 'ONE' },
        { type: 'Articles', id: 'LIST' },
      ],
    }),
  }),
});

export default articlesAPI;
