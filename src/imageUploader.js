import React, { useState, useEffect } from "react";
import imageIcon from './icon/image.svg';
import storage from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { CircularProgress } from "@mui/material";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

const ImageUploader = () => {
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(100);
  const [itemPath, setItemPath] = useState("")

  const getImage = (e) => {
    const image = e.target.files[0];
    setImage(image);
  }

  const onUpload = (e) => {
    e.preventDefault();
    setError("");

    if(image === "") {
      setError("ファイルが選択されていません");
      return;
    }

    const storageRef = ref(storage, `image/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on('state_changed',
    (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setProgress(progress);
    },
    (error) => {
      setError("ファイルのアップロードに失敗しました。" + error)
      setProgress(100)
    },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
        });
        setImage("")
      }
    );
  }

  const getImageList = (e) => {
    e.preventDefault();
    const listRef = ref(storage, 'image');

    listAll(listRef)
    .then((res) => {
      const urls = res.items.map(ref => (getDownloadURL(ref)))
      console.log(urls)

      res.items.forEach((itemRef) => {
        // All the items under listRef.
        let itemAry = [];
        itemAry.push(itemRef.fullPath);
        console.log(itemAry)
        const getStorageRef = ref(storage, `gs://design-index-neo.appspot.com/${itemRef.fullPath}`)

        getDownloadURL(getStorageRef)
        .then((url) => {
          console.log(url)
          setItemPath(url);
        })
        .catch((error) => {
          console.log(error)
        })
      });
    }).catch((error) => {
      console.log('error')
    })
  }

  return (
    <div className="uploadWrapper">
      <p>画像をアップロード</p>
      <form>
        <input className="uploadSelectInput" onChange={ getImage } type="file" accept=".png, .jpg, .jpeg, .gif"/>
        <button onClick={ onUpload }>アップロード</button>
      </form>
      {error && <DescriptionAlerts/>}
      {progress !== 100 && <CircularProgressWithLabel value={ progress } />}
      {imageURL && <a target="_blank" href={ imageURL } rel="noopener noreferrer">アップロード画像</a>}
      <button onClick={ getImageList }>リストを取得</button>
    </div>
  )

  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  function DescriptionAlerts() {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        {/* <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          This is a warning alert — <strong>check it out!</strong>
        </Alert>
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          This is an info alert — <strong>check it out!</strong>
        </Alert>
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          This is a success alert — <strong>check it out!</strong>
        </Alert> */}
      </Stack>
    );
  }
}

export default ImageUploader