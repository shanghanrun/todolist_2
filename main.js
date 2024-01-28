// shade(음영)효과 부터 만들자.
// 1. shade div를 선택
// 2. 각 tab에 이벤트핸들러를 단다.
// 3. 이벤트핸들러에 알맞은 함수를 전달. - shade를 움직이게 한다.
const shadow = document.querySelector('#shadow')

const tabs = document.querySelectorAll('.tab')
//tab이 될 각 div에 class="tab"을 달고 위와 같이 해서 선택한다.

tabs.forEach( tab => tab.addEventListener('click', (e)=>
    indicator(e) ));

function indicator(e){
    console.log(e.currentTarget);

    shadow.style.left = e.currentTarget.offsetLeft + 'px';
    shadow.style.top = e.currentTarget.offsetTop + 'px';
    shadow.style.width = e.currentTarget.offsetWidth + 'px';

    shadow.style.height = '40px';

    // 탭에 따라 달리 랜더링하기
    if (e.currentTarget.id == 'all'){
        renderList()
    } else if(e.currentTarget.id == 'done'){
        renderSpecificList('done');
    } else if(e.currentTarget.id == 'ongoing'){
        renderSpecificList('ongoing');
    }
}


// input처리
let todoList =[]
let doneList =[]
let ongoingList =[]

const input = document.querySelector('input')
input.addEventListener('keyup', (e)=>{
    if(e.key =='Enter'){
        const inputValue = input.value.trim();
        const item = {value: inputValue, class: 'normal'}
        const i = todoList.findIndex( todo=> todo.value == inputValue)
        if(i == -1){ // 기존에 입력된 값이 없을 경우 
            if(inputValue != ''){
                todoList.push({...item});
                ongoingList.push({...item});
                //이렇게 해서, todoList의 요소와 ongoingList의 요소가 서로 
                // 참조하지 않고, 독립적이 되게 만든다.
                input.value =''; //입력난을 비운다.
            }
        }
    }
    // 값을 입력하자마자 아래에 리스트가 보이도록
    renderList()
})

const addButton = document.querySelector('#add')
addButton.addEventListener('click', getTodo())

function getTodo(){
    const inputValue = input.value.trim();
    const item = {value: inputValue, class: 'normal'}
    const i = todoList.findIndex( todo=> todo.value == inputValue)
    if(i == -1){ // 기존에 입력된 값이 없을 경우 
        if(inputValue != ''){
            todoList.push({...item});
            ongoingList.push({...item});
            //이렇게 해서, todoList의 요소와 ongoingList의 요소가 서로 
            // 참조하지 않고, 독립적이 되게 만든다.
            input.value =''; //입력난을 비운다.
        }
    } 
    renderList()
} 

function renderList(){
    // task class의 div 아래에  ul 태그, li태그( div btn btn) 넣는다.
    // 이 함수는 기존에 리스트가 만들어진 경우에도 재활용되는 함수라서
    // 기존에 task 아래 태그가 있으면 지우고, 이미 만든 ul 태그가 있으면 지운다.
    const task = document.querySelector('.task')
    // task.innerHTML =''
    const oldUlTag = document.querySelector('ul');
    if (oldUlTag){
        oldUlTag.remove();
    }

    const ulTag = document.createElement('ul')
    ulTag.style.paddingLeft = '0px';  // ul은 기본적인 패딩이 있는데 없앤다.
    // 리스트를 바탕으로 여러개의 li 태그를 만든다.
    todoList.forEach( todo => {
        const liTag = document.createElement('li');
        liTag.classList.add('todo'); // css 일괄 작업 위해
        if (todo.class == 'completed'){
            liTag.classList.add('completed');
        }
        liTag.setAttribute('data-key', todo.value); 
        // 'data-key'는 리스트안의 데이터를 찾기위한 장치이다.
        // 그리고 html에서 li 태그들에는 고유의 키값이 필요하다.
        liTag.innerHTML = `
            <div class="item ${todo.class}">${todo.value}</div>
            <div>
                <button class="check">완료</button>
                <button class="delete">삭제</button>
            </div>
        `;

        ulTag.appendChild(liTag);
    });

    // 생성된 ul을 task에 추가
    task.appendChild(ulTag);

    // 버튼들에 이벤트핸들러 달음
    const checkButtons = document.querySelectorAll('.check')
    const deleteButtons = document.querySelectorAll('.delete')

    checkButtons.forEach( checkButton => 
        checkButton.addEventListener('click', onCheckClick));
    deleteButtons.forEach( deleteButton =>
        deleteButton.addEventListener('click', onDeleteClick))
    
    //디버그용
    console.log('todoList :', todoList);
    console.log('doneList :', doneList);
    console.log('ongoingList :', ongoingList);

    // 추가로 입력하면 shadow가 '모두'로 가게 만든다.
    const allTab = document.querySelector('#all')
    allTab.click(); // 해당이벤트리스너를 클릭함.

}

// Check(확인) 버튼 클릭시 처리
function onCheckClick(e){
    const currentButton = e.currentTarget;
    const currentLiTag = currentButton.closest('li'); // 버튼의 부모 
    const key = currentLiTag.dataset.key;
    // const key = currentLiTag.getAttribute('data-key'); 이렇게 해도 된다.
    // 리스트안의 객체를 찾기 위해  반드시 필요하다.
    console.log('key :', key);  // todo.value로 넣어 두었다.

    // todoList에서 해당 key값을 가진 객체를 찾는다.
    const targetItem = todoList.find(todo => todo.value == key);
    const todoIndex = todoList.findIndex(todo => todo.value == key);
    const ongoingIndex = ongoingList.findIndex(todo => todo.value ==key);

    // findIndex 메소드는 해당 값이 없으면 -1을 반환한다.
    if( todoIndex != -1){   // 해당자료가 있을 경우에 check(완료표시)가능
        //
        targetItem.class = 'completed';  //해당 div
        currentLiTag.classList.add('completed');
        // check를 누르면 doneList로 넘어가게 하지만,
        // check를 여러번 누르면 중복되게 들어갈 수 있으니, 이것을 방지
        // done에 동일한 값이 없을 때만 추가하도록 한다.
        if (! doneList.some(todo => todo.value == key)){
            doneList.push({...targetItem});
        }
    }
    // ongoingList안의 해당 item은 삭제해야 된다.
    if( ongoingIndex != -1){  // 해당자료가 있을 경우에 삭제가능
        ongoingList.splice(ongoingIndex, 1);
    }

    // 최종적으로 화면을 랜더링
    renderList();
}

// Delete버튼 클릭시 처리
function onDeleteClick(e){
    const currentButton = e.currentTarget;
    const currentLiTag = currentButton.closest('li');
    const key = currentLiTag.dataset.key;

    // todoList doneList ongoingList에서 해당 값(key)을 가진 아이템을 제거하면 된다.
    // splice를 사용하려면 해당 리스트의 index를 찾아야 된다. 번거롭다.
    //! 주의할점은 filer는 해당 리스트를 변화시키는 것이 아니라, 새로운 리스트 반환이다.
    // 그래서 다시 할당해야 된다.  그러므로 본래리스트는 const가 아닌 let으로 설정해야 된다.
    todoList = todoList.filter( todo => todo.value != key); 
    doneList = doneList.filter( todo => todo.value != key); 
    ongoingList = ongoingList.filter( todo => todo.value != key); 

    // 디버그용
    console.log('삭제 key값: ', key)
    console.log('todoList: ', todoList)
    console.log('doneList: ', doneList)
    console.log('ongoingList: ', ongoingList)

    //화면 랜더
    renderList();
}

// 마지막으로 '모두', '완료', '진행중' 탭을 누를때, 랜더링 되는 화면을
//달리 보여주어야 된다. 위로 올라가서 indicator함수에
// 추가로 각 탭을 누를 때 사용할 랜더함수를 마지막에 덧붙인다.

function renderSpecificList(type){
    let list;

    if(type =='done'){
        list = doneList;  
        // 이렇게 해야 함수가 실행되는 시점의 최신 list값을 받아올 수 있다.
    }
    if (type =='ongoing'){
        list = ongoingList;
    }

    const task = document.querySelector('.task')
    task.innerHTML =''

    const ulTag = document.createElement('ul')
    ulTag.style.paddingLeft = '0px';  
    list.forEach( todo => {
        const liTag = document.createElement('li');
        liTag.classList.add('todo'); // css 일괄 작업 위해
        if (todo.class == 'completed'){
            liTag.classList.add('completed');
        }
        liTag.innerHTML = `
            <div class="item ${todo.class}">${todo.value}</div>
        `;

        ulTag.appendChild(liTag);
    });

    task.appendChild(ulTag);
    
    // 참고로 빈리스에 대해서 forEach를 돌리면 에러가 나는지 여부
    // 에러가 안나다.
    // if(list.length >0){
    //     list.forEach( todo =>{   이런 식 안해도 된다.
    
    //참고로 여기서는 삭제 등의 작업을 하지 않으니 liTag에 key값을 넣을 필요도 없고
    // 버튼도 없으니 이벤트리스너를 달아줄 필요도 없다.
}