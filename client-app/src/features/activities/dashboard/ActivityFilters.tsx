import React from 'react'
import Calendar from 'react-calendar'
import { Header, Menu } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'

export default function ActivityFilters() {
  const {activityStore:{filterParams,setFilterParams}} = useStore();
    return (
      <>
      
        <Menu vertical size='large'  style={{width:'100%',marginTop:116}} >
            <Header icon='filter' attached color='teal' content='Filters' />
            <Menu.Item
            active={filterParams.has('all')}
            onClick={()=>setFilterParams('all','true')} 
            content='All Activities'
            />
            <Menu.Item content="I'm going"
            active={filterParams.has('isGoing')}
            onClick={()=>setFilterParams('isGoing','true')} 
            />
            <Menu.Item content="I'm hosting"
                  active={filterParams.has('isHost')}
                  onClick={()=>setFilterParams('isHost','true')} 
            />
        </Menu>
        <Header />
        <Calendar 
          onChange={(value)=>setFilterParams('startDate',value as Date )}
          value={filterParams.get('startDate')|| new Date()}
        />
      </>
    )
}
