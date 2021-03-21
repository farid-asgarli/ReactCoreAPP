import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import logo from '../logo/logo.png';
import { useStore } from '../stores/store';


const Navbar = () => {

    const {userStore} = useStore();
    const {user,logout,isLoggedIn} = userStore;

    return (
     <Menu inverted fixed='top'>
         <Container>
             <Menu.Item as={NavLink} exact to='/' header>
                 <img src={logo} alt='logo' style={{marginRight:'10px'}} />
                 Reactivities
             </Menu.Item>
           {isLoggedIn &&   <>
             <Menu.Item as={NavLink} to='/activities' name='Activities' />
             <Menu.Item as={NavLink} to='/errorHandling' name='Errors' />
             <Menu.Item>
                 <Button positive content='Create Activity' as={NavLink} to='/createActivity'  />
             </Menu.Item>
             <Menu.Item position='right'>
                <Image src={user?.image|| '/assets/user.png'} avatar spaced ='right' />
                <Dropdown pointing='top left' text={user?.displayName}>
                  <Dropdown.Menu>
                  <Dropdown.Item as={Link}  to={`/profiles/${user?.username}`} text = 'My Profile' icon='user' /> 
                    <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                  </Dropdown.Menu>
                </Dropdown>
             </Menu.Item>
             </> }
         </Container>
     </Menu>
    )
}

export default observer(Navbar);