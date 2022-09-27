let menuIsOpend = false
let fileIsChanged = false
function getByCls(name){
  return document.getElementsByClassName(name)
}
function getById(id){
  return document.getElementById(id)
}
function getNameOfLastFileOpened(){
  return getItemInLocalStorageAndParseToJSON('lastFileOpened')
}
function setNameOfLastFileOpened(value){
  localStorage.setItem('lastFileOpened', JSON.stringify({name: value}))
}
function getNameOfFileFromLocalStorage(fileId){
  return String(localStorage.key(fileId))
}
function removeItemFromLocaStorageByName(filename){
  localStorage.removeItem(filename)
}
function removeItemFromLocaStorageById(itemId){
  localStorage.removeItem(getNameOfFileFromLocalStorage(itemId))
}
function getItemInLocalStorageAndParseToJSON(itemName){
  return JSON.parse(localStorage.getItem(String(itemName)))
}
function SetFileOpenedName(name){
  //String(name).slice(0, 5)
  getById('fileOpenedName').innerText = name ?`File: ${String(name).slice(0, 10)+'...'}` : 'File Name: Empty' 
}
function fileHasBeenChanged(){
  if(getNameOfLastFileOpened()){
    if(!fileIsChanged){
      fileIsChanged = true
      getById('saveAgain').style = 'color: red'
    }
    return fileIsChanged;
  }
}
function saveChanges(){
  if(fileIsChanged){
    let fileData = []
    let data = {fileData};
    //getById('AllInputData')
    for (let i = 0; i < getChildren(getById('AllInputData')).length; i++) {
      fileData.push(getVAlueOFinputsInSection(i))
      // console.log(getNameOfLastFileOpened())
    }
    setAnythingInLocalStorage(getNameOfLastFileOpened().name, data)
    // setNameOfLastFileOpened(filename)
    getById('saveAgain').style = 'color: white'
    fileIsChanged = false
  }
}
function openMenuFiles(){
  for (let i = 0; i < localStorage.length; i++) {
    if(localStorage.key(i) === 'lastFileOpened') continue
    const fileName = String(localStorage.key(i))
    const fileNameShort = String(localStorage.key(i)).slice(0, 13)
    const html = `<li class="file" id="filename-${getNameOfFileFromLocalStorage(i)}" onclick="openFile('${getNameOfFileFromLocalStorage(i)}')"> ${fileNameShort}</list>`
    const html2 = `<button class="btn-delete" id="btn-deleteBy-name-${getNameOfFileFromLocalStorage(i)}" onclick="deleteFile('${getNameOfFileFromLocalStorage(i)}')">X</button>`
    getById('AllFiles').insertAdjacentHTML('beforeend', html)
    getById('contentBtnDelete').insertAdjacentHTML('beforeend', html2)
  }
  if(menuIsOpend){
    getById('contentOpenFiles').style = 'right: -190px;'
    menuIsOpend = false
    getById('AllFiles').innerHTML = ''
    getById('contentBtnDelete').innerHTML = ''
  }else{
    getById('contentOpenFiles').style = 'right: 0;'
    menuIsOpend = true
  }
}
function openFile(filename){
  SetFileOpenedName(filename)
  setNameOfLastFileOpened(filename)
  initAppWithData(
    getItemInLocalStorageAndParseToJSON(
      filename
    )['fileData']
  )
}
function deleteFile(filename){
  if(getNameOfLastFileOpened()){
    if( getNameOfFileFromLocalStorage(filename) === getNameOfLastFileOpened().name){
      removeItemFromLocaStorageByName('lastFileOpened')
      removeItemFromLocaStorageById(filename)
      newFile()
      getById('btn-deleteBy-name-'+filename).remove()
      getById('filename-'+filename).remove()
    }else{
      removeItemFromLocaStorageById(filename)
      getById('btn-deleteBy-name-'+filename).remove()
      getById('filename-'+filename).remove()
    }
  }else{
    removeItemFromLocaStorageById(filename)
    getById('btn-deleteBy-name-'+filename).remove()
    getById('filename-'+filename).remove()
  }
}
function clearAllfiles(){
  localStorage.clear()
  newFile()
}
function newFile(){
  removeItemFromLocaStorageByName('lastFileOpened')
  window.location = 'file:///F:/calculator/index%20copy.html'
}
function saveAs(){
  getById('contentSaveFile').style = "display:flex"
}
function catchFileNameInInputAndRemoveWhiteSpaces(){
  let s = String(getById('filename').value).trim()
  return s
}
function cleanFileName(){
  const filename = catchFileNameInInputAndRemoveWhiteSpaces()
  return filename.replace('/', '').replace(':', '')
  .replace('*', '').replace('?', '').replace('>', '')
  .replace('<', '').replace('|', '').replace('\\', '')
}
function isLengthfilenameOk(filename){
  if(filename.length > 0 && filename.length < 200) return  true 
  return false
}
function getChildren(item){
  return item.children
}
function getOneSectionInAllInputDataAndReturnAChildren(sectionIndex){
  return getChildren(getById('AllInputData')).item(sectionIndex).children
}
function getOneInputInSection(sectionIndex, inputIndex){
  return getOneSectionInAllInputDataAndReturnAChildren(sectionIndex).item(inputIndex)
}
function getVAlueOFinputsInSection(sectionIndex){
  return {
    name: getOneInputInSection(sectionIndex, 0).value,
    price: getOneInputInSection(sectionIndex, 1).value,
    amount: getOneInputInSection(sectionIndex, 2).value,
    timeOfUse: getOneInputInSection(sectionIndex, 3).value,
    unitNumber: getOneInputInSection(sectionIndex, 4).value,
    percent: getOneInputInSection(sectionIndex, 5).value,
  }
}
function cleanInputFilename(){
  getById('filename').value = ''
}
function closeWindowSaveFile(){
  cleanInputFilename()
  getById('contentSaveFile').style = "display:none"
}
function setAnythingInLocalStorage(name, data){
  localStorage.setItem(String(name), JSON.stringify(data))
}
function saveFileAs(){
  const filename = cleanFileName()
  SetFileOpenedName(filename)
  if(isLengthfilenameOk(filename)){ 
    let fileData = []
    let data = {fileData};
    getById('AllInputData')
    for (let i = 0; i < getChildren(getById('AllInputData')).length; i++) {
      fileData.push(getVAlueOFinputsInSection(i))
    }
    setAnythingInLocalStorage(filename, data)
    setNameOfLastFileOpened(filename)
    alert(`file ${filename} have been saved`)
    closeWindowSaveFile()
  }
  
}
function removeAllInputDAta(){
  const length = getById('AllInputData').children.length
  for (let i = 0; i < length; i++) {
    if(i === 0) continue
    deleteFild(i+1)
  }
}
function initAppWithData(fileData){
  const data = fileData //
  removeAllInputDAta()
  SetFileOpenedName(getNameOfLastFileOpened().name)
  for (let i = 0; i < data.length; i++) {
    if(i !== 0)addFilds() 
    loadDataInInputs(`contentInputsOfData${i+1}`, 0, data[i].name)
    loadDataInInputs(`contentInputsOfData${i+1}`, 1, data[i].price)
    loadDataInInputs(`contentInputsOfData${i+1}`, 2, data[i].amount)
    loadDataInInputs(`contentInputsOfData${i+1}`, 3, data[i].timeOfUse)
    loadDataInInputs(`contentInputsOfData${i+1}`, 4, data[i].unitNumber)
    loadDataInInputs(`contentInputsOfData${i+1}`, 5, data[i].percent)
  }
  calculate()
}
function deleteFild(elementId){
  getById('contentInputsOfData'+elementId).remove()
  calculate()
  fileHasBeenChanged()
} 
function FactoryId(){
  let id = (getById('AllInputData').children.length + 1) 
  return id
}
function addFilds(){
  let html = `<div id="${'contentInputsOfData'+FactoryId()}" class="contentInputsOfData">
    <input oninput="calculate(); fileHasBeenChanged()" type="text" placeholder="Name product" id=${'name'+FactoryId()}">
    <input oninput="calculate(); fileHasBeenChanged()" type="number" placeholder="Price" id=${'price'+FactoryId()}">
    <input oninput="calculate(); fileHasBeenChanged()" type="number" placeholder="Amount" id=${'amount'+FactoryId()}">
    <input oninput="calculate(); fileHasBeenChanged()" type="number" placeholder="Time of use" id=${'timeOfUse'+FactoryId()}">
    <input oninput="calculate(); fileHasBeenChanged()" type="number" placeholder="Unit number" readOnly id=${'unitNumber'+FactoryId()}>
    <input oninput="calculate(); fileHasBeenChanged()" type="number" step="0.5" placeholder="Return percentage" readOnly>
    <button class="btn-add"  id="addFilds" onclick="addFilds(); fileHasBeenChanged()">+</button>
    <button class="btn-delete"  id="deleteFild" onclick="deleteFild(${FactoryId()})">X</button>
  </div>`
  getById('AllInputData').insertAdjacentHTML('beforeend', html)
}
function loadDataInInputs(itsContentTagId, indexInput, ivalue){
  getById(itsContentTagId).children.item(indexInput).value = ivalue
}
function loadResultonDetail(data){
  loadDataInInputs('details', 0, data.total)
  loadDataInInputs('details', 1, data.totalCostProduction)
  loadDataInInputs('details', 2, data.totalCostPerUnit)
  loadDataInInputs('details', 3, data.profit)
  loadDataInInputs('details', 4, data.profitPerUnit)
  loadDataInInputs('details', 5, data.sale)
}
function calculate(){ 
  
  const data = {
    price: 0, 
    amount: 0,  
    timeOfUse:0, 
    unitNumber:0, 
    percentage: 0,
    total: 0,
    totalCostProduction: 0,
    totalCostPerUnit: 0,
    profit: 0,
    profitPerUnit: 0,
    sale: 0,

  }
  
    
  const length = getById('AllInputData').children.length
  for(let i = 0; i < length; i++ ){
    const element1 = getById('AllInputData').children.item(i)
    data.price = Number(element1.children.item(1).value)
    data.amount = Number(element1.children.item(2).value)
    data.timeOfUse = Number(element1.children.item(3).value)
    if(i === 0){
      data.unitNumber = Number(element1.children.item(4).value)
      data.percentage = Number(element1.children.item(5).value)
    }
    data.total += data.price * data.amount
    data.totalCostProduction += Math.ceil(data.price * data.amount / data.timeOfUse)
    data.totalCostPerUnit = Math.ceil(data.totalCostProduction / data.unitNumber)
    data.profit = Math.ceil(data.totalCostProduction * data.percentage /100)
    data.profitPerUnit = Math.ceil(data.profit / data.unitNumber)
    data.sale = Math.ceil(data.totalCostPerUnit + data.profitPerUnit)
  }
  const {
    total, 
    totalCostProduction,
    totalCostPerUnit,
    profit,
    profitPerUnit,
    sale,} = data
  const result = {
    total, 
    totalCostProduction,
    totalCostPerUnit,
    profit,
    profitPerUnit,
    sale
  }
  loadResultonDetail(result)
}
if(getNameOfLastFileOpened()){
  initAppWithData(getItemInLocalStorageAndParseToJSON(getNameOfLastFileOpened().name)['fileData'])
}else{
  SetFileOpenedName()
}