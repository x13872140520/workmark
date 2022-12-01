/**
     * sg is shorthand for sprites group,sgformatter will create a default group for sprite has id is spriteid
     * @type {string}
     * @type {array}
     */
export function sgFormatter(spriteid,sprites){
    var newsprites={}
   	Object.keys(sprites).map( (id)=>{
    if(id===spriteid){
        var groupitem={
         groupName:sprites[id].name+'组',
         groupOpen:true,
         sprites:{id:sprites[id]}
              }	
        newsprites[sprites[id].name+'组']=groupitem									 
    }else{
        newsprites[id]=sprites[id]				
    }
                                    
    })
        
    console.log('newsprites',newsprites) 
    return newsprites
    }
 /**
     * sg is shorthand for sprites group,sgformatter will create a default group for sprite has id is spriteid
     * @type {string}
     * @type {array}
     */
  export function sgFormatterToArray(spriteid,sprites){
    var newsprites=[]
   	Object.keys(sprites).map( (id)=>{
    if(id===spriteid){
        var groupitem={
         groupName:sprites[id].name+'组',
         groupOpen:true,
         sprites:{id:sprites[id]}
              }	
        var obj={}
        obj[sprites[id].name+'组'] =groupitem
        console.log('obj',obj)
        newsprites.push([obj])											 
    }else{
        newsprites.push(sprites[id])				
    }
                                    
    })
        
    console.log('newspritesArray',newsprites) 
    return newsprites
    }

  export function sgFormatterAddField(spriteid,sprites){
    var newsprites=[]
   	Object.keys(sprites).map( (id)=>{
    if(id===spriteid){
        sprites[id].groupName=sprites[id].name+'组'
        sprites[id].groupOpen=true
        sprites[id].groupIndex='0'
        newsprites.push(sprites[id])											 
    }else{
        newsprites.push(sprites[id])				
    }
                                    
    })
        
    console.log('newspritesArray',newsprites) 
    return newsprites
    }