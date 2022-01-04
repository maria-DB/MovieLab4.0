import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, ImageList, ImageListItem, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { grid } from "@mui/system";
import { setYear } from "date-fns";
import { useState } from "react";
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import { useDispatch, useSelector } from "react-redux";
import { createActor } from "../../redux/actorSlice";
import { yearMonthDateConvert } from '../../helpers/dateHelpers';





const CreateActor = () => {
    const roles = [
        'Actor',
        'Actress',

    ];

    const [imagePreview,setImagePreview] = useState([]);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    // const { actorNamesWithId } = useSelector(state => state.actor);
    // const {producerNamesWithId } = useSelector(state => state.producer)
    const [images, setImages] = useState([]);
    // const [dateReleased, SetDateReleased] = useState(yearMonthDateConvert(new Date().toLocalDateString));
    // const [year, setYear] = useState(new Date());
    const [values, setValues] = useState({
        name: "",
        role: "",
        info: '',
    
    })
    const handleChange = (e) => {
        setValues({...values, [e.target.name] : e.target.value})
    }



    const handleImage = (e) => {
        const files = Array.from(e.target.files)
        // setImagePreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2 ) {
                    setImagePreview ((oldImages) => [...oldImages, reader.result]);
                    setImages((oldImages) => [...oldImages, reader.result]);
                }
            }
            reader.readAsDataURL(file)
        })
    }


    const formHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", values.name);
        formData.set("role", values.role);
        formData.set("info", values.info);
        images.forEach((image) => {
            formData.append("images", image)
        });

        dispatch(createActor(formData))

        setValues({
        name: "",
        role: "",
        info: '',
        })

        setOpen(false);
        setImages([]);
        setImagePreview([]);
        
    }


    console.log(values);
    // console.log(year);
    // console.log(dateReleased);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false); 
    }

 

    return ( 
        <>
        <Button variant="contained" onClick={handleOpen} fullWidth color="primary">
            Create +
        </Button>

        <Dialog fullWidth open={open} onClose={handleClose}>
            <DialogTitle>Add New Actor</DialogTitle>
            <form encType="multipart/form-data" noValidate onSubmit={formHandler}>
                <DialogContent>
                    <Grid container spacing={2} sx={{p:1}}>
                        <Grid item xs={12}>
                            <TextField
                            name="name"
                            required
                            fullWidth
                            label="Name"
                            value={values.name}
                            onChange={handleChange}
                            autoFocus
                            />

                        
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="actor_role_label">Role</InputLabel>
                            <Select
                            labelId="actor_role_label"
                            id="actorRole"
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            label="Role"
                            >
                                { roles &&
                                    roles.map(role => {
                                        return (
                                            <MenuItem value={role} key={role}>{role}</MenuItem>
                                        )
                                    })
                                    }
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs ={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="actor_info_label">Actor Information</InputLabel>
                            <OutlinedInput 
                            id="actor_info_label"
                            name="info"
                            multiline={true}
                            value={values.info}
                            onChange={handleChange}
                            startAdornment={<InputAdornment position="start"><AccessTimeTwoToneIcon></AccessTimeTwoToneIcon></InputAdornment>}
                            label="Info"
                            />

                        </FormControl>

                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" component="label">
                            <input 
                            type="file"
                            name="images"
                            accept="images/*"
                            multiple
                            onChange={handleImage}
                            hidden
                            />
                            Upload Photos

                        </Button>
                    </Grid>
                    <ImageList cols={6} rowHeight={100}>
                        {imagePreview.map((img) => (
                            <ImageListItem key={img}>
                                <img
                                src={img}
                                alt="photo uploaded"
                                loading="lazy"

                            />
                        </ImageListItem>
                        ))
                        }
                    </ImageList>
                    </Grid>
                
                </DialogContent>

                <Button type="submit" variant="contained" sx={{mt:3, mb:2}}>
                    Save
                </Button>
                <Button variant="contained" sx={{mt:3, mb:2}} onClick={handleClose}>
                    Cancel
                </Button>
            </form>
        </Dialog>
        </>
     );
}
 
export default CreateActor;
