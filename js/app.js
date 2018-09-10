function BirthdayManager(){
    this.day = new Date();
    this.birthday = new Date(this.day.getFullYear(), this.day.getMonth(), this.day.getDate() + 7);
}

BirthdayManager.prototype.searchContacts = function(argument) {
   var self = this;
   var selection = [];

   BX24.callMethod(
        "crm.contact.list", 
        { 
            filter: { "BIRTHDATE": self.birthday},
            select: [ "ID", "NAME", "LAST_NAME"]
        }, 
        function(result) {
            var contactsList = result.data();

            if(result.error())
                console.error(result.error());
            else
            {
                console.dir(result.data()); 
                
                selection = selection.concat(result.data());
                
                if(result.more()){
                    result.next();
                }
                else
                {
                    self.addTask(selection);
                }                    
            }
        }
    );
};


BirthdayManager.prototype.addTask = function(selection) {
    var self = this;
    
    BX24.callMethod(
        'task.item.add',
        [{
            TITLE: 'Поздравить',
            DESCRIPTION: "нужно поздравить контактиков",
            RESPONSIBLE_ID: 1, 
            DEADLINE: self.birthday
        }],
        function(result)
        {
            console.info(result.data());
            console.log(result);

            self.addCheckList(selection, result.data())
        }
    );
};

BirthdayManager.prototype.addCheckList = function(selection, taskId) {
    
    for(key in selection){
        var title = "<a href='/crm/contact/details/" + selection[key].ID + "/'>" + selection[key].NAME + " " + selection[key].LAST_NAME + "</a>"
        
        BX24.callMethod(
           'task.checklistitem.add',
           [
               taskId, 
               {
                    'TITLE': title, 
                    'IS_COMPLETE': 'N'
                }
           ], 
           function(result){
              console.info(result.data());
              console.log(result);
           }
        ); 
    };    
};

BirthdayManager.prototype.contactsGenerator = function () {
   var date = new Date()

    for(let i = 0; i < 80; i++){
      BX24.init(function(){
            BX24.callMethod(
                "crm.contact.add", 
                {
                    fields:
                    { 
                        "NAME": "John", 
                        "SECOND_NAME": i, 
                        "LAST_NAME": "Doe" + i,
                        "BIRTHDATE": new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7) 
                    },
                    params: { "REGISTER_SONET_EVENT": "Y" } 
                }, 
                function(result) 
                {
                    if(result.error())
                        console.error(result.error());
                    else
                        console.info("Создан контакт с ID " + result.data());
                }
            );
        });  
    }   
};


var app = new BirthdayManager();