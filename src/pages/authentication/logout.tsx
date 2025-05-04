// src/pages/LogoutPage.tsx
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../hooks/context/AuthContext';

export function LogoutPage() {
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      console.debug('▶ calling auth.logout()');
      await auth.logout();                    
      console.debug(' tokens cleared');
      navigate('/login', { replace: true });  
    })();
  }, [auth, navigate]);

  return <p>Logging out…</p>;
}
