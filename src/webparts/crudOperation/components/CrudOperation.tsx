import * as React from 'react';
import type { ICrudOperationProps } from './ICrudOperationProps';
import {spfi,SPFI,SPFx} from "@pnp/sp/presets/all";
import { DefaultButton, DetailsList, Dialog, DialogFooter, DialogType, IconButton, PrimaryButton, SelectionMode, TextField } from '@fluentui/react';
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
  const[currentId,setCurrentId]=React.useState<number|any>();
  const[editHidden,setIsEditHidden]=React.useState<boolean>(true);
   const[editTitle,setEditTitle]=React.useState<string>('');
  const[editEmail,setEditEmail]=React.useState<string>('');

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

console.log("item saved successfully");
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
  EmailAddress:newEmail
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
//opent dialog
const openDialog=(id:number)=>{
  setCurrentId(id);
  //this function willopen the dialog while clicking editicon
  setIsEditHidden(false);
  const items:ICrud|undefined=states.find((each:any)=>each.id===id);
  if(items){
    setEditEmail(items.emailaddress);
    setEditTitle(items.title);
  }
}
const handleEditTitle=(event:React.ChangeEvent<HTMLInputElement>)=>{
 
  setEditTitle(event.target.value);
}
const handleEditEmail=(event:React.ChangeEvent<HTMLInputElement>)=>{
  setEditEmail(event.target.value);
}
const _updateItems=async()=>{
  const list=_sp.web.lists.getByTitle(props.ListName);
  try{
    await list.items.getById(currentId).update({
      Title:editTitle,
      EmailAddress:editEmail
    });
    //close the dialog
    setIsEditHidden(true);
    setReload(!reload);
  }
  catch(err){
    console.log(err);

  }
  finally{
    setIsEditHidden(true);
  }
}
//delete item
const _deleteItems=async(id:number)=>{
  const list=_sp.web.lists.getByTitle(props.ListName);
  try{
    await list.items.getById(id).delete();
    setReload(!reload);
    
  }
  catch(err){
    console.log(err);
  }
}
  return(
    <>
    <DetailsList
    items={states||[]}
    columns={[
      {
        key:"Name",
        name:"Name",
        fieldName:"Title",
        isResizable:true,
        minWidth:200,
        onRender:(item:ICrud)=><div>{item.title}</div>
      },
      {
        key:"Email Address",
        name:"Email Address",
        fieldName:"EmailAddress",
        minWidth:200,
        isResizable:true,
        onRender:(item:ICrud)=><div>{item.emailaddress}</div>
      },
      {
        key:"Action Column",
        name:"Actions",
        fieldName:"actions",
        minWidth:200,
        isResizable:true,
        onRender:(item:ICrud)=>(
          <div>
            <IconButton
            iconProps={{iconName:'edit'}}
            onClick={()=>openDialog(item.id)}
            title='Edit'
            ariaLabel='Edit'
            />
              <IconButton
            iconProps={{iconName:'delete'}}
            onClick={()=>_deleteItems(item.id)}
            title='Delete'
            ariaLabel='Delete'
            />
          </div>
        )
      }
    ]}
    selectionMode={SelectionMode.none}
    />
    <Dialog
    hidden={editHidden}
    onDismiss={()=>setIsEditHidden(true)}
    dialogContentProps={{
      type:DialogType.largeHeader,
      title:'Edit Form'
    }}
    >

<div>
  <TextField
  label='Name'
  value={editTitle}
  onChange={handleEditTitle}
  />
<TextField
  label='Email Address'
  value={editEmail}
  onChange={handleEditEmail}
  />
</div>
<DialogFooter>
  <PrimaryButton
  text='Save'
  iconProps={{iconName:'save'}}
  onClick={()=>_updateItems()}

  />
  <DefaultButton
  text='Cancel'
  iconProps={{iconName:'cancel'}}
  onClick={()=>setIsEditHidden(true)}
  
  />
</DialogFooter>
    </Dialog>


  <div>
    <PrimaryButton text='Add Item'
    iconProps={{iconName:'add'}}
    onClick={()=>setIsAddHidden(false)}
    />
    </div>
    <Dialog
    hidden={isAddHidden}
    onDismiss={()=>setIsAddHidden(true)}
    dialogContentProps={{
      type:DialogType.largeHeader,
      title:'New Form'
    }}
    >
      <div>
  <TextField
  label='Name'
  value={newTitle}
  onChange={handleNewTitle}
  />
<TextField
  label='Email Address'
  value={newEmail}
  onChange={handleNewEmail}
  />
</div>
<DialogFooter>
  <PrimaryButton
  text='Save'
  iconProps={{iconName:'save'}}
  onClick={()=>_createListItems()}

  />
  <DefaultButton
  text='Cancel'
  iconProps={{iconName:'cancel'}}
  onClick={()=>setIsAddHidden(true)}
  
  />
</DialogFooter>
      </Dialog>
    </>
  )
}
export default  CrudOperation;
