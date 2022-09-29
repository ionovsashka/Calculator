import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  //Переменные(в данных переменных не указан тип, так как тут явно прописано чему равна данная переменная)
  input = ''
  expression = ''
  calculation = ''
  operand1 = 0
  operand2 = 0
  operatorRepeat = false
  digit :string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00', '.']
  action :string[] = ['/', 'x', '-', '+']
  specOper: string[] = ['√', '%']
  straples: string[] = ['(', ')']
  //=========================================================================================================================================
  // Метод allClear вызывается при нажатии на кнопку escape и полностью очищает калькулятор и переменные, которые задействуются в программе
  allClear():void{
    this.input = ''
    this.expression = ''
    this.operand1 = 0;
    this.operand2 = 0
    this.operatorRepeat = false
  }
  //=========================================================================================================================================
  // Метод clear убирает последний введенный элемент
  clear(): void{
    this.input = this.input.slice(0, -1)
  }
  //=========================================================================================================================================
  //Метод pressKey вызывается при нажатии на кнопки калькулятора(за исключением С и =) и клавиши клавиатуры
  pressKey(key: string): undefined{
    if(key === 'Enter'){
      this.getAnswer(this.input)
      return undefined
    }
    if(key === 'Escape'){
      this.allClear()
      return undefined
    }
    if (this.action.includes(key) || this.specOper.includes(key)) { // Проверка на то, нажаты(введены) ли клавиши, относящиеся к массиву action или specOper
      //Здесь выполняется проверки для того, чтобы не пропускать, например повторный ввод символов мат.операций
      if ((this.input === '' && this.action.includes(key)) || (this.action.includes(this.input[this.input.length - 1]) && !this.specOper.includes(key)) || (this.specOper.includes(key) && this.input[this.input.length - 1] === key) || (this.input[this.input.length - 1] === '(')) {
        return undefined
      }
    }
    if((this.digit.includes(key) && this.input[this.input.length - 1] === ')')){
      return undefined
    }
    // В данном условии мы обеспечиваем ожидаемое поведении backspace
    if(key === 'Backspace'){
      this.input = this.input.slice(0, -1)
      return undefined
    }
    // Данное условие сделано для соответствия умножения на интрефейсе калькулятора и при вводе с клавиатуры
    if(key === '*'){
      key = 'x'
    }
    // Данное условие предназначено для того, чтобы не пропускать клавиши, которые являются некорректными в процессе работы калькулятора(например буквы)
    if(!this.action.includes(key) && !this.digit.includes(key) && !this.specOper.includes(key) && !this.straples.includes(key)){
      return undefined
    }
    this.input += key // Данной строкой мы наполняем переменную input вводимые данными
    return undefined
  }
  //=========================================================================================================================================
  // Метод getAnswer вызывается при нажатии на интерфейсе калькулятора кнопки = и нажатии клавиши Enter с клавиатуры
  getAnswer(input:string): string{
    let res: number
    this.expression = input // Заносим input в переменную, которая используется для вывода конечного уравнения в тег p с классом calculator__final-expression
    this.calculation = input // Заносим input в переменную, которая будет использоваться в дальнейших расчётах
    let calcArr: string[] = []  // В данный массив будет заноситься элементы полученной строки (calculation)
    // Идея данного участка кода заключается в следующем:
    //1)Происходит разделение строки на элементы
    //2) Если у нас это элементы мат.операций или скобки, то ставится запятая с одной или с 2 сторон от этого элемента
    //3) Далее собираем строку с этими запятыми
    //4) Сплитим данную строку по запятым и получаем элементы нашего мат.выражения
    // Такая логика необходима разделения мат.выражения по элементам для того, чтобы получить флаги по которым разделять строку
    for(let i = 0; i < this.calculation.length; i++){
      let strPlug: string
      if(this.action.includes(this.calculation[i])){
        strPlug = `,${this.calculation[i]},` // Здесь требуется строка затычка, так как при записи this.calculation[i] = `,${this.calculation[i]},` выдается ошибка, что this.calculation[i] доступна только для чтения
        calcArr.push(strPlug)
      } else if(this.specOper.includes(this.calculation[i]) || this.calculation[i] === '('){
        strPlug = `${this.calculation[i]},`
        calcArr.push(strPlug)
      } else if(this.calculation[i] === ')'){
        strPlug = `,${this.calculation[i]}`
        calcArr.push(strPlug)
      }
      else{
        calcArr.push(this.calculation[i])
      }
    }
    this.calculation = calcArr.join('')
    calcArr = this.calculation.split(',')
    let counter = 0 // Данная переменная вводится для циклов for
    //Логика для вычисления в скобках
    if(calcArr.includes('(') && calcArr.includes(')')){ // Проверка на наличие скобок в выражении calculation
      const quantStrap = calcArr.filter(sym => {
        return  sym === '(' || sym === ')'
      }) // Получение данного массива необходимо только для получения количества скобок в первоначальном выражении. Далее мы обращаемся к нему в цикле for ниже
      for(let i = 0; i<quantStrap.length; i+=2){
        const arrPosStaples: number[] = calcArr.reduce(function(arr:number[], e, i) {
          if (e === '(' || e === ')'){
            arr.push(i)
          }
          return arr;
        }, [])// Получаем позиции скобок в массиве элементов при каждом изменении массива calcArr
        if(calcArr[arrPosStaples[0]] === '(' && calcArr[arrPosStaples[1]] === ')'){ // Проверка
          const calcWithStap: string[] = [] // Данный массив предназначен для занесении тех выражений, которые будут в скобках
          for(let c:number = arrPosStaples[0] + 1; c < arrPosStaples[1]; c++){
            calcWithStap.push(calcArr[c])
          } // Наполняем этот массив
          //Логика вычислений
          // Данные блоки расположены в порядке действий, принятых в математике
          // Идея заключатся в том, что мы разбиваем выражения на отдельные математические операции и с помощью метода splice меняем элементы этих операции в массиве на их результат
          //1) Данный блок предназначен для вычисления квадратного корня и процента
          for(counter = 0; counter<calcWithStap.length; counter++){
            if(calcWithStap[counter] === '√'){
              res = Math.sqrt(parseFloat(calcWithStap[counter+1]))
              calcWithStap.splice(counter, 2, res.toString())
              counter = 0
            } else if(calcWithStap[counter] === '%'){
              res = parseFloat(calcWithStap[counter+1]) / 100
              calcWithStap.splice(counter, 2, res.toString())
              counter = 0
            }
          }
          //2) Данный блок предназначен для вычисления умножения и деления
          for(counter = 0; counter<calcWithStap.length; counter++){
            if(calcWithStap[counter] === 'x'){
              res = parseFloat(calcWithStap[counter-1])*parseFloat(calcWithStap[counter+1])
              calcWithStap.splice(counter-1, 3, res.toString())
              counter = 0
            } else if(calcWithStap[counter] === '/'){
              res = parseFloat(calcWithStap[counter-1])/parseFloat(calcWithStap[counter+1])
              calcWithStap.splice(counter-1, 3, res.toString())
              counter = 0
            }
          }
          //3) Данный блок предназначен для вычисления сложения и вычитания
          for(counter = 0; counter<=calcWithStap.length; counter++){
            if(counter===0){
              this.operand1 = parseFloat(calcWithStap[counter])
            }
            if(calcWithStap[counter] === '+'){
              this.operand1 += (parseFloat(calcWithStap[counter+1]))
              calcWithStap.splice(counter-1, 3, this.operand1.toString())
              counter = 0
            }
            if(calcWithStap[counter] === '-'){
              this.operand1 -= parseFloat(calcWithStap[counter+1])
              calcWithStap.splice(counter-1, 3, this.operand1.toString())
              counter = 0
            }
          }
        }
        // Данной строкой мы заменяем выражение, которое находилось в скобках на результат данного выражения
        calcArr.splice(arrPosStaples[0], arrPosStaples[1] - arrPosStaples[0] + 1, this.operand1.toString())
      }
    }
    //=========================================================================================================================================
    //Логика после скобок
    // Здесь реализована такая же логика, которая описана выше
    //1) Данный блок предназначен для вычисления квадратного корня и процента
    for(counter = 0; counter<calcArr.length; counter++){
      if(calcArr[counter] === '√'){
        res = Math.sqrt(parseFloat(calcArr[counter+1]))
        calcArr.splice(counter, 2, res.toString())
        counter = 0
      } else if(calcArr[counter] === '%'){
        res = parseFloat(calcArr[counter+1]) / 100
        calcArr.splice(counter, 2, res.toString())
        counter = 0
      }
    }
    //2) Данный блок предназначен для вычисления умножения и деления
    for(counter = 0; counter<calcArr.length; counter++){
      if(calcArr[counter] === 'x'){
        res = parseFloat(calcArr[counter-1])*parseFloat(calcArr[counter+1])
        calcArr.splice(counter-1, 3, res.toString())
        counter = 0
      } else if(calcArr[counter] === '/'){
        res = parseFloat(calcArr[counter-1])/parseFloat(calcArr[counter+1])
        calcArr.splice(counter-1, 3, res.toString())
        counter = 0
      }
    }
    //3) Данный блок предназначен для вычисления сложения и вычитания
    for(counter = 0; counter<=calcArr.length; counter++){
      if(counter===0){
        this.operand2 = parseFloat(calcArr[counter])
      }
      if(calcArr[counter] === '+'){
        this.operand2 += (parseFloat(calcArr[counter+1]))
        calcArr.splice(counter-1, 3, this.operand1.toString())
        counter = 0
      }
      if(calcArr[counter] === '-'){
        this.operand2 -= parseFloat(calcArr[counter+1])
        calcArr.splice(counter-1, 3, this.operand1.toString())
        counter = 0
      }
    }
    // Данный блок предназначен для корректного отображения ошибок
    if(calcArr.length > 1 || isNaN(this.operand2) || isNaN(this.operand1) || this.input === 'NaN'){
      this.expression = this.input
      this.input = 'Ошибка'
      return this.input
    }
    // Последним действием результат заноситься в input и выводится в input с классом calculator__input
    this.input = this.operand2.toString()
    return this.input
  }

}
