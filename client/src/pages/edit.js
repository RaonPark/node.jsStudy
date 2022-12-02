import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react'; 
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { TextField } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import { CardContent, CardMedia, ButtonGroup, Grid, IconButton } from '@mui/material';
import PanoramaWideAngleIcon from '@mui/icons-material/PanoramaWideAngle';
import PanoramaWideAngleSelectIcon from '@mui/icons-material/PanoramaWideAngleSelect';

const Input = styled('input')({
    display: 'none'
});

function Edit() {
    const [article, setArticle] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();
    const { state } = useLocation();
    const postId = state.id;
    const [toggle, setToggle] = useState(0);

    useEffect(() => {
        state.showImage = 0;
        state.imageArray = state.image.trim().split(";", -1);
        setArticle(state.article);
    }, []);

    const handleUploadedChange = async (event) => {
        if(event.target.files.length > 5 || state.imageArray.length + event.target.files.length - 1 > 5) {
            enqueueSnackbar("5장까지만 허용합니다.", { variant: "error" });
            return;
        } else {
            const formData = new FormData();
            for(let i = 0; i < event.target.files.length; i++) {
                formData.append("images", event.target.files[i]);
            }

            axios.post("post/img.do", formData, { headers: { "Content-Type": "multipart/form-data"} })
            .then(response => {
                state.imageArray = state.imageArray.concat(response.data.url);
                console.log(state.imageArray);
                setToggle(value => value + 1);
            });
        }
    }

    const handleArticleChange = (event) => {
        setArticle(event.target.value);
    }
    
    const handleSubmitClick = (event) => {
        event.preventDefault();

        const formData = new FormData();
        console.log(state.imageArray);
        console.log(state);
        
        formData.append("images", state.imageArray);
        formData.append("article", article);

        axios.post("post/edit.do", {id: postId, images: state.imageArray, article: article})
        .then(response => {
            if(response.data.OK) {
                history("/home");
            } else {
                enqueueSnackbar("에러가 발생했습니다.", {variant: "error"});
            }
        });
        
    }

    const handleDeleteClick = (event) => {
        event.preventDefault();

        axios.post("post/delete.do", {id: postId})
        .then(response => {
            if(response.data.OK) {
                enqueueSnackbar("삭제되었습니다.", {variant: "success"});
                history("/home");
            }
        })
    }

    const handleShowImageIndexClick = (event, imageIndex) => {
        event.preventDefault();

        state.showImage = imageIndex;
        setToggle(value => value + 1);
    }

    return (
        <Box sx={{flexGrow: 1, justifyContent: "center", alignItems: "center", display: 'flex', flexDirection: 'column'}}>
            <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
            >
                <CardMedia component="img" height="280" image={state.imageArray[state.showImage]} />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Grid container spacing={0} rowSpacing={0}>
                        <Grid item xs={12}>
                            <ButtonGroup size="small" aria-label="small button group">
                                {state.imageArray.map((image, imageIndex) => {
                                    if(image) {
                                        return (
                                            <IconButton key={imageIndex} onClick={(event) => handleShowImageIndexClick(event, imageIndex)}>
                                                {imageIndex === state.showImage ? <PanoramaWideAngleSelectIcon/> : <PanoramaWideAngleIcon /> }
                                            </IconButton>
                                        );
                                    }
                                    return <span key={imageIndex}></span>;
                                })}
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', m: 5, justifyContent: "center", alignItems: "center" }}>
                    <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" multiple type="file" name="images" onChange={handleUploadedChange}/>
                        <Button variant="contained" component="span">
                            {`업로드(최대 5장까지)`}
                        </Button>
                    </label>
                </Box>
                <TextField multiline rows={4} label="내용" variant="filled" 
                value={article} onChange={handleArticleChange} defaultValue={state.article}/>
            </Box>
            <Button variant="outlined" onClick={handleSubmitClick} sx={{m: 2}}>
                업로드
            </Button>
            <Button variant="outlined" onClick={handleDeleteClick}>
                삭제
            </Button>
        </Box>
    );
}

export default Edit;