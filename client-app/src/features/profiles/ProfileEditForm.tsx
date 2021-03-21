import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'
import CustomTextArea from '../../app/common/form/CustomTextArea'
import CustomTextInput from '../../app/common/form/CustomTextInput'
import * as Yup from 'yup';
import { ProfileFormValues } from '../../app/models/profile'
import { store, useStore } from '../../app/stores/store'
import { observer } from 'mobx-react-lite'


interface Props{
  setEditForm:(editForm:boolean)=>void;
}

 function ProfileEditForm({setEditForm}:Props) {

    const [profileForm, setProfileForm] = useState<ProfileFormValues>(new ProfileFormValues({displayName:"",bio:undefined}))
    const {profileStore} = useStore();

    useEffect(()=>{
        if(store.profileStore.profile&&store.userStore.user){
            setProfileForm(new ProfileFormValues({
                displayName:store.profileStore.profile.displayName,
                bio:store.profileStore.profile.bio?store.profileStore.profile.bio:undefined,
            }))
        }
    },[])

    const handleFormSubmit =(values:ProfileFormValues) => {
      profileStore.updateProfile(values).then(()=>setEditForm(false));
      
    }
    
    return (
        <Formik
        validationSchema={Yup.object({
            displayName: Yup.string().required("Display Name can not be empty"),
            bio :Yup.string().nullable()
        })}
        enableReinitialize
        initialValues={profileForm}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit,isValid,isSubmitting,dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <CustomTextInput name='displayName' placeholder='Display Name' />
            <CustomTextArea rows={3} placeholder="Bio" name="bio"/>
           
            <Button
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
              disabled={!isValid||isSubmitting|| !dirty}
            />
            <Button
              floated="right"
              onClick={()=>setEditForm(false)}
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    )
}

export default  observer(ProfileEditForm);