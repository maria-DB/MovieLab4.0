import { Alert, Backdrop, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser, setEmail, setRegister } from '../../redux/userSlice';
import { useState } from 'react';
import GoogleLoginHook from './GoogleLoginHook';

const LoginForm = () => {

    document.title = 'MovieLab.4.0';

    const { isLoading, email, errors } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [error,setError] = useState(null);

    const handleSignIn = (e) => {
        e.preventDefault();

        if(!email.length >= 1) return setError("Email is required")
        if(!/.+@.+\.[A-Za-z]+$/.test(email)) return setError("Not a valid email address")

        dispatch(loginUser({email:email}))
    }

    return (
    <>
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{p:2}}
        >
            { isLoading &&
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop> 
            }

            { error &&
                <Alert severity="error" sx={{m:1}}>{error}</Alert>
            }

            { errors &&
                <Alert severity="error" sx={{m:1}}>{errors.errMessage}</Alert>
            }
        <Grid item>
            <TextField id="email" label="Email" variant="standard" fullWidth value={email} onChange={(e) => { setError(''); dispatch(clearError()); dispatch(setEmail(e.target.value));}} />
            <Button variant="outlined" color="primary" fullWidth sx={{mt:2,mb:2}} onClick={handleSignIn}>Sign in</Button>
        </Grid>
        OR
        <Grid item sx={{mt:2}}>
            {/* <Button variant="outlined"><GoogleIcon/>oogle</Button> */}
            <GoogleLoginHook />
        </Grid>
        </Grid>
        <Button onClick={() => { dispatch(setRegister(true)) }} size="small">
            <Typography variant="subtitle1" sx={{display:'flex', justifyContent:'flex-end', textDecoration:'underline'}}>Sign up?</Typography>
        </Button>
    </>
    );
}
 
export default LoginForm;