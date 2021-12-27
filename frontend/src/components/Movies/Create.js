import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, ImageList, ImageListItem, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { grid } from "@mui/system";
import { setYear } from "date-fns";
import { useState } from "react";
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import { useDispatch, useSelector } from "react-redux";
import { createMovie } from "../../redux/movieSlice";
import { yearMonthDateConvert } from '../../helpers/dateHelpers';





const Create = () => {
    const genres = [
        'Horror',
                'Sci-Fi',
                'Drama',
                'Comedy',
                'War',
                'Sports',
                'Crime',
                'Action',
                'Musicals',
                'Romance',

    ];

    const [imagePreview,setImagePreview] = useState([]);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { actorNamesWithId } = useSelector(state => state.actor);
    const {producerNamesWithId } = useSelector(state => state.producer)
    const [images, setImages] = useState([]);
    const [dateReleased, SetDateReleased] = useState(yearMonthDateConvert(new Date().toLocalDateString));
    const [year, setYear] = useState(new Date());
    const [values, setValues] = useState({
        title: "",
        genre: "",
        movieType: '',
        runtime: 0,
        year: new Date().getFullYear(),
        date_released: '',
        plot: '',
        actors:[],
        producers:[],
        members:[],
        gross:0,
    })
    const handleChange = (e) => {
        setValues({...values, [e.target.name] : e.target.value})
    }

    const handleProducers = (event, value, reason) => {
        event.preventDefault();

        let prod = [];
        for (let i = 0; i < value.length; i++) {
            prod.push({
                user : value[i]._id,
                name : value[i].name,
                role : 'Producer'
                
            })
        }
        setValues({...values, producers : prod})
    }

    const handleActors = (event, value, reason) => {
        event.preventDefault();

        let act = [];
        for (let i = 0; i < value.length; i++) {
            act.push({
                user : value[i]._id,
                name : value[i].name,
                role : value[i].role
                
            })
        }
        setValues({...values, actors : act})
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
        formData.set("title", values.title);
        formData.set("genre", values.genre);
        formData.set("movieType", values.movieType);
        formData.set("runtime", values.runtime);
        formData.set("year", year.getFullYear());
        formData.set("date_released", yearMonthDateConvert(dateReleased));
        formData.set("plot", values.plot);
        formData.set("members", JSON.stringify(values.actors.concat(values.producers)));
        images.forEach((image) => {
            formData.append("images", image)
        });

        dispatch(createMovie(formData))

        setValues({
        title: "",
        genre: "",
        movieType: '',
        runtime: 0,
        year: new Date().getFullYear(),
        date_released: '',
        plot: '',
        actors:[],
        producers:[],
        members:[],
        gross:0,
        })

        setOpen(false);
        setImages([]);
        setImagePreview([]);
        
    }


    console.log(values);
    console.log(year);
    console.log(dateReleased);

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
            <DialogTitle>Add New Movie</DialogTitle>
            <form encType="multipart/form-data" noValidate onSubmit={formHandler}>
                <DialogContent>
                    <Grid container spacing={2} sx={{p:1}}>
                        <Grid item xs={12}>
                            <TextField
                            name="title"
                            required
                            fullWidth
                            label="Title"
                            value={values.title}
                            onChange={handleChange}
                            autoFocus
                            />

                        
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="movie_type_label">Type</InputLabel>
                            <Select
                            labelId="movie_type_label"
                            id="movietype"
                            name="movieType"
                            value={values.movieType}
                            onChange={handleChange}
                            label="Movie Type"
                            >
                                <MenuItem value="TV Show">TV Show</MenuItem>
                                <MenuItem value="Film">Film</MenuItem>
                                <MenuItem value="Movie">Movie</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="movie_genre_label">Genres</InputLabel>
                            <Select
                            labelId="movie_genre_label"
                            id="moviegenre"
                            name="genre"
                            value={values.genre}
                            onChange={handleChange}
                            label="Movie Genres"
                            >
                                { genres &&
                                    genres.map(genre => {
                                        return (
                                            <MenuItem value={genre} key={genre}>{genre}</MenuItem>
                                        )
                                    })
                                    }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker 
                                views={['year']}
                                label="Year"
                                value={year}
                                onChange={(newValue) => {
                                    setYear(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker 
                                views={['year', 'month', 'day']}
                                label="Date Released"
                                value={dateReleased}
                                onChange={(newValue) => {
                                    SetDateReleased(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs ={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="runtime-label">Runtime</InputLabel>
                            <OutlinedInput 
                            id="runtime-label"
                            value={values.runtime}
                            name="runtime"
                            onChange={handleChange}
                            startAdornment={<InputAdornment position="start"><AccessTimeTwoToneIcon></AccessTimeTwoToneIcon></InputAdornment>}
                            label="Runtime"
                            />

                        </FormControl>

                    </Grid>
                    <Grid item xs ={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="plot_label">Plot</InputLabel>
                            <OutlinedInput 
                            id="plot-label"
                            name="plot"
                            multiline={true}
                            value={values.plot}
                            onChange={handleChange}
                            startAdornment={<InputAdornment position="start"><AccessTimeTwoToneIcon></AccessTimeTwoToneIcon></InputAdornment>}
                            label="Plot"
                            />

                        </FormControl>

                    </Grid>
                    <Grid item xs ={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="gross_label">Gross</InputLabel>
                            <OutlinedInput 
                            id="gross-label"
                            name="gross"
                            value={values.gross}
                            onChange={handleChange}
                            startAdornment={<InputAdornment position="start"><AccessTimeTwoToneIcon></AccessTimeTwoToneIcon></InputAdornment>}
                            label="Gross"
                            />

                        </FormControl>

                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete 
                        multiple={true}
                        id="producers-list"
                        name="producers"
                        options={producerNamesWithId}
                        getOptionLabel={((option) => option.title)}
                        renderInput={(params) => (
                            <TextField 
                            {...params}
                            variant="standard"
                            label="Producers"
                            placeholder="Producer"
                            />
                        )}
                        onChange={handleProducers}

                        />

                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete 
                        multiple={true}
                        id="actor-list"
                        name="actors"
                        options={actorNamesWithId}
                        getOptionLabel={((option) => option.title)}
                        renderInput={(params) => (
                            <TextField 
                            {...params}
                            variant="standard"
                            label="Actors"
                            placeholder="Actors/Actress"
                            />
                        )}
                        onChange={handleActors}

                        />

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
 
export default Create;
