import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import {Cropper} from 'react-cropper';
import PhotoWidgetCropper from './PhotoWidgetCropper';


interface Props{
    loading:boolean;
    uploadPhoto:(file:Blob)=>void;
}

 function PhotoUploadWidget({loading,uploadPhoto}:Props) {

    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();


   const onCrop = () => { //for uploading the cropped photo
       if(cropper){
           cropper.getCroppedCanvas().toBlob(blob=>uploadPhoto(blob!))
       }
   }

   useEffect(()=>{
       return ()=>{
        files.forEach((file:any)=>URL.revokeObjectURL(file.preview));
       };

       //for getting rid of the memory stream regarding the file upload preview
   },[files])

    return (
      <Grid>
        <Grid.Column width="4">
          <Header sub color="teal" content="Step 1 - Add Photo" />
          <PhotoWidgetDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width="4">
          <Header sub color="teal" content="Step 2 - Resize image" />
          {files && files?.length > 0 && (
            <PhotoWidgetCropper
              setCropper={setCropper}
              imagePreview={files[0].preview}
            />
          )}
        </Grid.Column>
        <Grid.Column width={1} />

        <Grid.Column width="4">
          <Header sub color="teal" content="Preview & Upload" />
          {files && files.length > 0 && (
            <>
              <div
                className="img-preview"
                style={{ minHeight: 200, overflow: "hidden" }}
              />
              <Button.Group widths={2} style={{marginBottom:10}}>
                <Button onClick={()=>cropper?.rotate(-90)} positive content='Rotate -90' />
                <Button onClick={()=>cropper?.rotate(90)} positive content='Rotate 90' />
              </Button.Group>
              <Button.Group widths={2}>
                <Button disabled={loading} loading={loading} onClick={onCrop} positive icon="check" />
                <Button onClick={() => setFiles([])} icon="close" />
              </Button.Group>
            </>
          )}
        </Grid.Column>
      </Grid>
    );
}
export default observer(PhotoUploadWidget);