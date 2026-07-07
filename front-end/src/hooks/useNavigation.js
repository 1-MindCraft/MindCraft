import { useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  const moveToMain = useCallback(() => {
    navigate({ pathname: '/' }, { replace: true });
  }, [navigate]);

  const moveToPath = useCallback(
    (path) => {
      navigate({ pathname: path }, { replace: true });
    },
    [navigate]
  );

  return { moveToMain, moveToPath };
};
