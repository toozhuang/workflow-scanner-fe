import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthState } from '../context/context';
import _ from 'lodash';

function RequireAuth({ children }: { children: JSX.Element }) {
  // 通过 context 中是否有 user 来看是否用户能够登录
  // 这里涉及到的问题就是， 我们不需要在这里进行强判断
  // 只有在 token 过期来以后， 才需要确定是否要重新登录
  // 而我们的 token 过期就由 API 触发就好
  // 不需要每一个地方都进行判断
  const auth = useAuthState();
  const location = useLocation();

  if (_.isEmpty(auth.user)) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they're logging, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
    // return children
  }

  return children;
}

export default RequireAuth;
