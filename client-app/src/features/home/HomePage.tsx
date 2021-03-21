import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import {Container, Header, Segment,Image, Button, Divider } from "semantic-ui-react";
import logo from '../../app/logo/logo.png';
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";


function HomePage() {

  const {userStore, modalStore} = useStore();

  return <Segment inverted textAlign='center' vertical className='masthead'>
      <Container>
          <Header as='h1' inverted>
               <Image size='massive' src={logo} alt='logo' style={{marginBottom:12}} />
               Reactivities
          </Header>
          {
            userStore.user? 
            <> 
             <Header as='h2' inverted content='Welcome to Reactivities' />
             <Button as={Link} to='/activities' size='huge' inverted content='Continue To Activities' />
            </>:
          <>
            <Button onClick={()=>modalStore.openModal(<LoginForm/>)} size='huge' inverted content='Login' />
            <Button onClick={()=>modalStore.openModal(<RegisterForm/>)} size='huge' inverted content='Register' />
            <Divider horizontal inverted content='Or'/>
            <Button
            size='huge'
            inverted
            color='facebook'
            content='Login with Facebook'
            onClick={userStore.facebookLogin}
            loading={userStore.fbLoading}
            />
          </>
          }
      </Container>
  </Segment>;
}

export default observer(HomePage);