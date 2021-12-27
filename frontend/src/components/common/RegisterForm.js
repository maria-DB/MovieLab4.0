import { Alert, Avatar, Backdrop, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, registerUser, setonRegisterAvatar, setRegister } from "../../redux/userSlice";

const RegisterForm = () => {
    
    document.title = 'MovieLab 4.0 - Register'

    const dispatch = useDispatch();
    const { onRegisterAvatar, errors, isLoading } = useSelector(state => state.user);
    // const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState('assests/temp_avatar.png');
    const [error,setError] = useState(null);
    const [user, setUser] = useState({
        name : "",
        email : "",
        avatar : ""
    })

    const handleOnChange = (e) => {
        setError('');
        dispatch(clearError());

        if(e.target.name === 'avatar') {
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    // setAvatar(reader.result);
                    dispatch(setonRegisterAvatar(reader.result));
                    setUser({...user, avatar:reader.result});
                    console.log(reader.result);
                } 
            }

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({...user, [e.target.name] : e.target.value })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!user.name.length >= 1) return setError("Name is required")
        if(!user.email.length >= 1) return setError("Email is required")
        if(!/.+@.+\.[A-Za-z]+$/.test(user.email)) return setError("Not a valid email address")
        if(!user.avatar.length >= 1) return setError('Please provide profile picture')

        const formData = new FormData();
        formData.set("name",user.name);
        formData.set("email",user.email);
        formData.set("avatar",onRegisterAvatar);
        formData.set("role", "User");
        

        dispatch(registerUser(formData));

        // setUser({
        //     name:'',
        //     email:'',
        //     avatar:''
        // })

        // dispatch(setOnRegisterAvatar(''));
        // setAvatarPreview('assests/temp_avatar.png');
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
            <Avatar src={avatarPreview} sx={{ width: 80, height: 80 }} />
            <Button variant="contained" component="label" size="small" sx={{mt:1}}>
            <input
                type="file"
                name="avatar"
                accept="images/*"
                onChange={handleOnChange}
                hidden
            />
                Upload
            </Button>
            <Box sx={{ mt: 3 }}>
            <form encType="multipart/form-data">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                        name="name"
                        required
                        fullWidth
                        label="Name"
                        value={user.name}
                        onChange={handleOnChange}
                        autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleOnChange}
                        autoComplete="family-name"
                        sx={{
                            borderRadius:'10px'
                        }}
                        />
                    </Grid>
                </Grid>
            </form>
            <Button
            type="submit"
            fullWidth
            size="small"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
            >
            Sign Up
            </Button>
            </Box>
        </Grid>
        <Button onClick={() => { dispatch(setRegister(false)) }} size="small">
            <Typography variant="subtitle1" sx={{display:'flex', justifyContent:'flex-end', textDecoration:'underline'}}>Back To Login</Typography>
        </Button>
        </>
    );
}
 
export default RegisterForm;