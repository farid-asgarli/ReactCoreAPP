import React, { useEffect } from "react";
import { useState } from "react";
import { Segment,Button, Header,} from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import {observer} from 'mobx-react-lite'
import { Link, useHistory, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/loadingComponent/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Form, Formik } from "formik";
import * as Yup from 'yup'
import CustomTextInput from "../../../app/common/form/CustomTextInput";
import CustomTextArea from "../../../app/common/form/CustomTextArea";
import CustomSelectInput from "../../../app/common/form/CustomSelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import CustomDateInput from "../../../app/common/form/CustomDateInput";


 function ActivityForm() {

  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  const {activityStore} = useStore();

  const {createActivity,updateActivity,loadActivity,loadingInitial,setLoadingInitial} = activityStore;

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());
  
 
  useEffect(() => {
    setLoadingInitial(false);
    if (id) {
     loadActivity(id).then(activity=>setActivity(new ActivityFormValues(activity)));
    }

    const initialState = new ActivityFormValues();

    return setActivity(initialState);
  }, [id,loadActivity,setLoadingInitial]);

  
  const validationRequired = () => {
    const keys = Object.keys(new ActivityFormValues());
    const updatedKeys = keys.filter((c) => c !== "id");

    return updatedKeys.reduce((keys, key) => {
      keys[key] = key ==='date'?Yup.date().nullable().required(`The ${key} is required`):Yup.string().required(`The ${key} is required`);
      return keys;
    }, {} as any);
  };



  const validationSchema = Yup.object(validationRequired());




  const handleFormSubmit = (activity:ActivityFormValues) => {
    if(!activity.id){
      let newActivity:ActivityFormValues = {...activity,id: uuid()} //We create the uuid here, so we can redirect to the id, because otherwise we cannot access that id.
      createActivity(newActivity).then(()=>history.push(`/activities/${newActivity.id}`))
    }else{
      updateActivity(activity).then(()=>history.push(`/activities/${activity.id}`))

    }
  }

  if(loadingInitial) return <LoadingComponent/>

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal'/>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit,isValid,isSubmitting,dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <CustomTextInput name='title' placeholder='Title' />
            <CustomTextArea rows={3} placeholder="Description" name="description"/>
            <CustomSelectInput options={categoryOptions} placeholder="Category" name="category"/>
            <CustomDateInput  name="date" placeholderText='Date' showTimeSelect
            timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa' />
      <Header content='Location Details' sub color='teal'/>

            <CustomTextInput placeholder="City" name="city"/>
            <CustomTextInput placeholder="Venue" name="venue"/>
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
              as={Link}
              to={"/activities"}
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}


export default observer(ActivityForm);

//<FormField>
//<Field placeholder="Title" name="title" />
//<ErrorMessage name='title' render={
//  error=><Label basic color='red' style={{marginTop:5}} content={error} />
//} />
//</FormField>

  // const handleInputChange = (event:React.FormEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
  //    const {name,value} = event.currentTarget;
  //   setActivity({
  //     ...activity,
  //     [name]:value
  //   })
  // }