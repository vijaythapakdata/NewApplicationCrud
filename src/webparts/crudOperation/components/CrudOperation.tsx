import * as React from 'react';
import type { ICrudOperationProps } from './ICrudOperationProps';
import {spfi,SPFI,SPFx} from "@pnp/sp/presets/all";
interface ICrudOperationState{
  Title:string;
  EmailAddress:string;
  Id:number;
}

interface ICrud{
  title:string;
  emailaddress:string;
  id:number;
}
const  CrudOperation=(props:ICrudOperationProps):React.ReactElement=>{
  const _sp:SPFI=spfi().using(SPFx(props.context));
  const [states,setStates]=React.useState<Array<ICrud>>([]);
  const [reload,setReload]=React.useState<boolean>(false);
  const[newTitle,setNewTitle]=React.useState<string>('');
  const[newEmail,setNewEmail]=React.useState<string>('');
  const[isAddHidden,setIsAddHidden]=React.useState<boolean>(true);

  React.useEffect(()=>{
    _getListItems();
  },[reload]);
  //to fetch data
  const _getListItems=async()=>{
    try{
const _getList=await _sp.web.lists.getByTitle(props.ListName).items();
setStates(_getList.map((each:ICrudOperationState)=>({
  title:each.Title,
  emailaddress:each.EmailAddress,
  id:each.Id
})));

    }
    catch(err){
console.log(err);
    }
    finally{
console.log("Items fetched successfully",states);
    }
  }
//New Title Event
const handleNewTitle=(event:React.ChangeEvent<HTMLInputElement>)=>{
 
  setNewTitle(event.target.value);
}
const handleNewEmail=(event:React.ChangeEvent<HTMLInputElement>)=>{
  setNewEmail(event.target.value);
}
//ccretae itm
const _createListItems=async()=>{
  const _list=_sp.web.lists.getByTitle(props.ListName);
  try{
await _list.items.add({
  Title:newTitle,
  EmailAddress:setNewEmail
});
//close the modal
setIsAddHidden(true);
setReload(!reload)
  }
  catch(err){
console.log(err);
  }
  finally{
setIsAddHidden(true)
  }
}
  return(
    <></>
  )
}
export default  CrudOperation;
