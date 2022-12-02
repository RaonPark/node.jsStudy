import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useState } from 'react'; 
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Input = styled('input')({
    display: 'none'
});

function New() {
    const [files, setFiles] = useState([]);
    const [article, setArticle] = useState('');
    const [urls, setUrls] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();

    const handleUploadedChange = async (event) => {
        console.log(event.target.files[3]);
        
        if(event.target.files.length > 5) {
            enqueueSnackbar("5장까지만 허용합니다.", { variant: "error" });
            return;
        } else {
            const formData = new FormData();
            for(let i = 0; i < event.target.files.length; i++) {
                formData.append("images", event.target.files[i]);
            }

            setFiles(event.target.files);

            axios.post("post/img.do", formData, { headers: { "Content-Type": "multipart/form-data"} })
            .then(response => {
                setUrls(response.data.url);
            });
        }
    }

    const handleArticleChange = (event) => {
        setArticle(event.target.value);
    }
    
    const handleSubmitClick = (event) => {
        event.preventDefault();

        const formData = new FormData();
        console.log(urls);
        formData.append("images", urls);
        formData.append("article", article);

        axios.post("post/upload.do", {images: urls, article: article})
        .then(response => {
            if(response.data.OK) {
                history("/home");
            } else {
                enqueueSnackbar("에러가 발생했습니다.", {variant: "error"});
            }
        });
    }

    return (
        <Box sx={{flexGrow: 1, justifyContent: "center", alignItems: "center", display: 'flex', flexDirection: 'column'}}>
            <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', m: 5, justifyContent: "center", alignItems: "center" }}>
                    <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" multiple type="file" name="images" onChange={handleUploadedChange}/>
                        <Button variant="contained" component="span">
                            {`업로드(최대 5장까지)`}
                        </Button>
                    </label>
                </Box>
                <TextField multiline rows={4} placeholder="내용 입력..." label="내용" variant="filled" value={article} onChange={handleArticleChange}/>
            </Box>
            <Button variant="outlined" onClick={handleSubmitClick}>
                업로드
            </Button>
        </Box>
    );
}

export default New;