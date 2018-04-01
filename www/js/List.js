$(document).ready(function() { 
   loadShoppingList();
    console.log("init list");
    $('#createBtn').click(createPrompt);
    $('#deletePBtn').click(removePurchasedItems);
});

// promopt
function createPrompt(){
    navigator.notification.prompt(
    '',  // message
    onPrompt,                  // callback to invoke
    'Add a new item',            // title
    ['Done','Cancel']             // buttonLabels
);
}

// promopt callback
function onPrompt(results) {
        if(results.buttonIndex == '1'){
                createNewItem(results.input1);
            }
        else{
            console.log("input cancel.");
        }
    }
    
//Add a new item 
function createNewItem(userInputTxt)  
{  
    var shoppingList = {};  
    
    let Item = userInputTxt;
    
    if (Item != null)  
    {  
        if (Item == "")  
        {   
            navigator.vibrate(); 
            createAlert("Item cannot be empty!");
            console.log("vibrate");
        }  
        else  
        {  
            shoppingList = { 
                check : 0,
                text : Item
            };  
            addTableRow(shoppingList, false);  
        }  
    }  
   
}

//Add the item to the tilst
var rowID = 0;  
function addTableRow(shoppingList, appIsLoading)  
{  
    rowID +=1;  
    var table = document.getElementById("dataTable");  
    var row = table.insertRow(table.rows.length);  
   
    //checkbox  
    var cell1 = row.insertCell(0);  
    var element1 = document.createElement("input");  
    element1.type = "checkbox";  
    element1.name = "chkbox"; 
    element1.className = "chkbox";
    element1.checked = shoppingList.check;  
    element1.setAttribute("onclick", "checkboxClicked()");  
    cell1.appendChild(element1);  
   
    //text input area
    var cell2 = row.insertCell(1);  
    var element2 = document.createElement("input");  
    element2.type = "text";  
    element2.name = "txtbox";  
    element2.size = 16;  
    element2.id = "text" + rowID;  
    element2.className = "form-control";
    element2.value = shoppingList.text;  
    element2.setAttribute("onchange", "saveShoppingList()");  
    cell2.appendChild(element2);  
   
    //create a "view" button
    var cell3 = row.insertCell(2);  
    var element3 = document.createElement("input");  
    element3.type = "button";  
    element3.id = rowID;  
    element3.value = "View";
    element3.className = "btn btn-info";
    element3.setAttribute("onclick", "viewSelectedRow(document.getElementById('text' + this.id))");  
    cell3.appendChild(element3);  
   
    //create a "delete" button
    var cell4 = row.insertCell(3);  
    var element4 = document.createElement("input");  
    element4.type = "button";
    element4.className = "btn btn-danger";
    element4.value = "Delete";  
    element4.setAttribute("onclick", "deleteSelectedRow(this)");  
    cell4.appendChild(element4);  
   
    checkboxClicked();  
    saveShoppingList();  
   
    if (!appIsLoading) {
        console.log("Item Added Successfully.");
    }
}  


//when the checkbox be clicked
function checkboxClicked()  
{  
    var table = document.getElementById("dataTable");  
    var rowCount = table.rows.length;  
    
    for(let i = 0; i < rowCount; i++)  
    {  
        let row = table.rows[i];  
        let chkbox = row.cells[0].childNodes[0];  
        let textbox = row.cells[1].childNodes[0];  
   
        if(chkbox.checked)  
        {  
            if(textbox != null)  
            {         
                textbox.style.setProperty("text-decoration", "line-through");  
            }  
        }  
        else  
        {  
            textbox.style.setProperty("text-decoration", "none");  
        }  
   
    }  

    saveShoppingList();  
}  


//alert the name of the item
function viewSelectedRow(itemName)  
{  
    createAlert(itemName.value); 
}  

//delete the selected row
function deleteSelectedRow(deleteButton)  
{  
    let p = deleteButton.parentNode.parentNode;  
    p.parentNode.removeChild(p);  
    saveShoppingList();  
}  

//save shopping list  
function saveShoppingList()  
{  
    var listArray = {};  
    var checkBoxState = 0;  
    var textValue = "";  
   
    let table = document.getElementById("dataTable");  
   
    let rowCount = table.rows.length;
    if (rowCount != 0)  
    {  
        for(let i=0; i<rowCount; i++)  
        {  
            let row = table.rows[i];  
            let chkbox = row.cells[0].childNodes[0];  
            if(chkbox.checked)  
            {  
                checkBoxState = 1;  
            }  
            else  
            {  
                checkBoxState= 0;  
            }  
   
            let textbox = row.cells[1].childNodes[0];
            
            if(textbox.value == ""){
                    navigator.vibrate(); 
                    createAlert("Item can't be empty!");
                    console.log("vibrate");
                }
            else{
                textValue = textbox.value;  
                listArray["row" + i] =  
                    {   check : checkBoxState,  
                        text : textValue};  
                
            }
   
            
        }  
    }  
    else  
    {  
        listArray = null;  
    }  
    
    saveAsJSON(listArray);
}  

//using local storage(JSON) to store the list
function saveAsJSON(listArray){
    window.localStorage.setItem("shoppingList", JSON.stringify(listArray)); 
    console.log("Save as JSON successfully.")
}

//load the shopping list
function loadShoppingList()  
{   
    var theList = JSON.parse(window.localStorage.getItem("shoppingList")); 
    console.log("Load JSON successfully");
    
    if (null == theList)  
    {  
        deleteAllRows();
        console.log("NULL JSON DATA");
    }  
    else  
    {  
        console.log("JSON DATA");
        let count = 0;  
        for (let obj in theList)  
        {  
            count++;  
        }  
 
        deleteAllRows();  

        for(let i = 0; i < count; i++)  
        {   
            addTableRow(theList["row" + i], true);  
        }  
    }  
}  

// clear the table
function deleteAllRows()  
{  
    let table = document.getElementById("dataTable");  
    let rowCount = table.rows.length;
    
    for(let i = 0; i < rowCount; i++)  
    {  
        table.deleteRow(i);  
        rowCount--;  
        i--;  
    }  
   
    saveShoppingList();  
}  

// delete all the purchased goods(checkbox been clicked)
function removePurchasedItems()  
{  
    let table = document.getElementById("dataTable");  
    let rowCount = table.rows.length;

    for(let i = 0; i < rowCount; i++)  
    {  
        let row = table.rows[i];  
        let chkbox = row.cells[0].childNodes[0];  
        if(null != chkbox && true == chkbox.checked)  
        {  
            table.deleteRow(i);  
            rowCount--;  
            i--;  
        }  
    }  
     
    saveShoppingList();  
    createAlert("Purchased Items Were Cleared Successfully.");
    navigator.vibrate();
    console.log("vibrate");
}  

//alert
function createAlert(alertTxt) {

	navigator.notification.alert(
    '',  // message
    alertDismissed,         // callback
    alertTxt,            // title
    'Done'                  // buttonName
);

}

//alert callback
function alertDismissed() {
    console.log("dialog shown");
}
