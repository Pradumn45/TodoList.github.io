// select element from html 

const forms =document.querySelector("#itemform");
const inputItem = document.querySelector("#itemInput");
const filters  = document.querySelectorAll(".nav-item");
const itemList =  document.querySelector("#itemsList");

// empty array for list element
let todoitems = [];
// filters items
const getitemsfilter  =function(type) {
    let filteritems =[];
    switch(type){
        case "todo":
            filteritems = todoitems.filter((item) => !item.isDone);
            break;
        case "done":
            filteritems = todoitems.filter((item) => item.isDone);
            break;
        default:
            filteritems = todoitems;
            break;
    }
    getList(filteritems);
};

// delete item
const removeitem = function(item)
{
    const removeindex = todoitems.indexOf(item);
    todoitems.splice(removeindex ,1);
}


//   update item
const updateItem = function(currentitemindex ,values){
    const newItem = todoitems[currentitemindex];
    newItem.name = values;
    todoitems.splice(currentitemindex , 1, newItem);
    setlocalstorage(todoitems);
}


// handle events on action buttons
// here item is array of objects
const handleEvent = function(item){
    
    const items = document.querySelectorAll(".list-group-item"); // jo list hai usko select krna hai  ,and sab list ki class same hai to sari list select hogi jinhe hume itrate krna hoga
    items.forEach((itm) => {
        if(itm.querySelector(".title").getAttribute("data-time") == item.dateat)
        {
            // done
            
            itm.querySelector('[data-done]').addEventListener("click" ,function(e){
                e.preventDefault();
                console.log(item);
                const itmIndex = todoitems.indexOf(item);
                const currItem = todoitems[itmIndex];
                console.log(currItem);
                // console.log(itmIndex);
                const currentclass = currItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                // isdone true hai to false kr do or false hai to true kr do
                currItem.isDone = currItem.isDone ? false : true;
                // ab humne current item ko replace krege naye item se bcs isdone update hua hai 
                todoitems.splice(itmIndex ,1,currItem);
                setlocalstorage(todoitems);
                const iconclass = currItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                this.firstElementChild.classList.replace(currentclass,iconclass);
                const filterType =document.querySelector("#tabValue").value;
                getitemsfilter(filterType);

            }) ;

            // edit
            itm.querySelector('[data-edit]').addEventListener("click" ,function(e){
                e.preventDefault();
                inputItem.value= item.name;
                document.querySelector("#objIndex").value = todoitems.indexOf(item);
                 
            });

            // delete
            itm.querySelector('[data-delete]').addEventListener("click" ,function(e){
                e.preventDefault();
                itemList.removeChild(itm);
                removeitem(itm);
                setlocalstorage(todoitems);
                return todoitems.filter((itm) => itm != item);
            });
        }
    });
};


// data ko ab table mai lana screen pr
const getList = function(todoitems){
    itemList.innerHTML = "" ;
    if(todoitems.length > 0)
    {
        // jitne bhi item hai array mai sabke liye call krna hai bcz sabko print krna hai
        todoitems.forEach((item) => {
            const iconclass = item.isDone ? "bi-check-circle-fill" : "bi-check-circle";
            itemList.insertAdjacentHTML("beforeend" ,
            `<li class="list-group-item d-flex justify-content-between align-items-center" style="background-color: black; color : yellow">
            <span class ="title" data-time ="${item.dateat}" >${item.name}</span>
            <span>
                <a href = "#" data-done><i class="bi ${iconclass}" style="color: rgb(6, 245, 6);"></i></a>
                <a href = "#" data-edit><i class="bi bi-pencil-square" style="color: rgb(50, 50, 184);"></i></a>
                <a href = "#" data-delete><i class="bi bi-x-circle" style="color:rgb(220, 15, 15);"></i></a>
            </span>
        </li>`
            );
            handleEvent(item);
        });

    };
};

// get data from local storage
const getlocalstorage = function(){
    const data = localStorage.getItem("todoitems"); // key deni padti hai
    if(data === undefined || data === null)
        todoitems =[];
    else{
        todoitems = JSON.parse(data);
          // vaps json ko obj banane k liye parse ka use krte hai
        console.log(todoitems);
        
    }
    getList(todoitems);
}

// set data in local storage
const setlocalstorage = function(todoitems){
    localStorage.setItem("todoitems" ,JSON.stringify(todoitems)); // key and value , array of object yani 0 index pr ye obj a jayega

};


document.addEventListener("DOMContentLoaded" ,() =>{
    forms.addEventListener("submit" ,(e) =>{
        e.preventDefault();
        const inputvalue = inputItem.value.trim();
        if(inputvalue.length === 0)
        {
            alert("please enter valid value");
        }
        else{
        // is inputvalue ko ek object mai save kr lenge
        const currentitemindex = document.querySelector("#objIndex").value;
        if(currentitemindex)
        {
            // update 
            updateItem(currentitemindex ,inputvalue);
            document.querySelector("#objIndex").value = "";
        }
        else{
            const itemobj = {
               name : inputvalue ,
               isDone : false ,
               dateat : new Date().getTime() ,
            };
    
            todoitems.push(itemobj);
        // is array k data ko localstorage mai key , value k form mai store krte hai
           setlocalstorage(todoitems);
        }
        getList(todoitems);
    }
        inputItem.value ="";
    });

    // filter tags
    filters.forEach((tab) => {
        tab.addEventListener("click" ,function(e){
            e.preventDefault();
            const tabtype = this.getAttribute("data-type");
            document.querySelectorAll(".nav-link").forEach( (nav) =>{
                nav.classList.remove("active");
            });
            this.firstElementChild.classList.add("active");
            getitemsfilter(tabtype);
            document.querySelector("#tabValue").value = tabtype;
        });
    });

    // when form is done then after dom content loaded
    
    getlocalstorage();
});