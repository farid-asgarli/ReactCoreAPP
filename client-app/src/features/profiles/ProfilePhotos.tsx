import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Tab, Header, Card, Image, Grid, Button } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile | null;
}

function ProfilePhotos({ profile }: Props) {

  const {profileStore:{isCurrentUser, uploadPhoto, uploading,loading,setMainPhoto,deletePhoto}} = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState<boolean>(false);
  const [target,setTarget] = useState('');


  const handlePhotoUpload = (file:Blob) => {
    uploadPhoto(file).then(()=>setAddPhotoMode(false));

  }

  const handlesetMainPhoto=(photo:Photo,e:SyntheticEvent<HTMLButtonElement>)=>{
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  }

  const handelDeletePhoto =(photo:Photo, e:SyntheticEvent<HTMLButtonElement>) => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  }

  return (
    <Tab.Pane>
     <Grid>
       <Grid.Column width={16}>
       <Header icon="image" content="Photos" floated='left' />
      {isCurrentUser && (
        <Button floated='right' basic 
        content={addPhotoMode?'cancel':'Add Photo'}
        onClick={()=>setAddPhotoMode(!addPhotoMode)}
        />
      
      )}
       </Grid.Column>
       <Grid.Column width={16} >
          {addPhotoMode?
          (<PhotoUploadWidget uploadPhoto = {handlePhotoUpload} loading={uploading} />):  
          <Card.Group itemsPerRow={5}>
          {profile?.photos?.map((photo) => (
            <Card key={photo.id} >
              <Image src={photo.url || "/assets/user.png"} />
              {isCurrentUser&&(
                <Button.Group fluid widths={2}>
                  <Button
                   basic
                   icon='check'
                   color='green'
                   name={photo.id}
                   loading={target===photo.id&&loading}
                   onClick={e=> handlesetMainPhoto(photo,e)}
                   disabled={photo.isMain}
                   />
                  
                  <Button basic color='red' icon='trash'
                   name={'delete-'+photo.id}
                   onClick={(e)=>handelDeletePhoto(photo,e)} 
                   loading={loading&&target==='delete-'+photo.id}/>
                </Button.Group>
              )}
            </Card>
          ))}
        </Card.Group>
        }
       </Grid.Column>
     </Grid>
   
    </Tab.Pane>
  );
}
export default observer(ProfilePhotos);
