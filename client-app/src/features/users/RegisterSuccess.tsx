import React from 'react'
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import useQuery from '../../app/common/util/hooks'

export default function RegisterSuccess() {
    const email = useQuery().get('email') as string;

    const handleConfirmEmailResend = () => {
        agent.Account.resendEmailConfirmationLink(email)
        .then(()=> toast.success("Email has been successfully sent"))
        .catch(error=>console.log(error));
    }

    return (
        <Segment placeholder textAlign='center'>
            <Header  icon color='green' >
                <Icon name='check' />
                Successfully Registered!
            </Header>
            <p>Please check your email for the verification </p>
            {email &&
            <>
                <p>Did not receive the email?</p>
                <Button primary onClick={handleConfirmEmailResend} content="Resend email" size="huge" />
            </>
            }
        </Segment>
    )
}
