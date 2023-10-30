import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess, signInStart } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      dispatch(signInStart());      
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log("result", result);
      // '/api/auth/google'
      const signInApiURL=`https://0ko7jyglbb.execute-api.us-east-1.amazonaws.com/mern-state-auth/mern-state-auth-signip`;
      const res = await fetch(signInApiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'arn'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          queryParam:"google"
        }),
      });
      const data = await res.json();
      // dispatch(signInSuccess(data));
      if(data.success){
        dispatch(signInSuccess(data));
        navigate('/');
    }      

    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}
