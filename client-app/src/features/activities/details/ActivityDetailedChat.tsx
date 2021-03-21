import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Segment, Header, Comment, Loader} from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import {Field, FieldProps, Form, Formik} from 'formik';
import * as Yup from 'yup'
import { formatDistanceToNow } from 'date-fns/esm'


interface Props{
    activityId : string
}


export default observer(function ActivityDetailedChat({activityId}:Props) {

    const {commentStore}=  useStore();

    useEffect(()=>{
        if(activityId){
            commentStore.createHubConnection(activityId);

        }
        return ()=>commentStore.clearComments();
    }, [commentStore,activityId])

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
                className="commentSectionHeader tealHeader"
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing className="commentSectionContent">
                <Comment.Group>
                   
                    {commentStore.comments.map(comment=>
                         <Comment key={comment.id}>
                         <Comment.Avatar as={Link} to={`/profiles/${comment.username}`} src={comment.image||'/assets/user.png'}/>
                         <Comment.Content>
                             <Comment.Author as='a'>{comment.displayName}</Comment.Author>
                             <Comment.Metadata>
                                 <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                             </Comment.Metadata>
                             <Comment.Text style={{whiteSpace:'pre-wrap'}} >{comment.body}</Comment.Text>
                             {/* <Comment.Actions>
                                 <Comment.Action>Reply</Comment.Action>
                             </Comment.Actions> */}
                         </Comment.Content>
                     </Comment>)}

                    <Formik 
                    onSubmit={(values:any,{resetForm})=>commentStore.addComment(values).then(()=>resetForm())} 
                    initialValues={{body:''}}
                    validationSchema={Yup.object({
                        body:Yup.string().required("Comment can not be posted empty")
                    })}
                    >
                   {({ isSubmitting, isValid,handleSubmit }) => (
                <Form className="ui form">
                  <Field name='body'>
                    {(props:FieldProps)=>(
                         <div style={{position:'relative'}} >
                         <Loader active={isSubmitting} />
                         <textarea placeholder='Enter your comment (Enter to submit, SHIFT+enter for new line)'
                             rows={2}
                             {...props.field} // anything related to onblur and such
                             onKeyPress={
                                 e=>{
                                     if(e.key === 'Enter'  && e.shiftKey){
                                         return;
                                     }
                                     if(e.key==='Enter' && !e.shiftKey){
                                         e.preventDefault();
                                         isValid&&handleSubmit();
                                     }
                                 }
                             }
                         />

                     </div>
                    )}
                  </Field>
                </Form>
              )}            
                    </Formik>
                </Comment.Group>
            </Segment>
        </>

    )
})
    