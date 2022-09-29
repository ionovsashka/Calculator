import { AppComponent } from "./app.component";

describe('AppComponent', () => {
  let component: AppComponent
  beforeEach(() => {
    component = new AppComponent()
  })
  // Здесь идёт проверка метода pressKey
  // В данном блоке идёт провека всех условий блоков if, которые отвечают за ввод только допустимых символов с клавиатуры
  it('should return undefined', () => {
    component.input = ''
    component.pressKey('+')
    expect(component.input).toBe('')
  })
  it('should return undefined', () => {
    component.input = '+'
    component.pressKey('+')
    expect(component.input).toBe('+')
  })
  it('should return undefined', () => {
    component.input = '√'
    component.pressKey('√')
    expect(component.input).toBe('√')
  })
  it('should return undefined', () => {
    component.input = '('
    component.pressKey('+')
    expect(component.input).toBe('(')
  })
  it('should return undefined', () => {
    component.input = ')'
    component.pressKey('2')
    expect(component.input).toBe(')')
  })
  it('should return undefined', () => {
    component.input = ')'
    component.pressKey('2')
    expect(component.input).toBe(')')
  })
  it('should return undefined', () => {
    component.input = '123'
    component.pressKey('z')
    expect(component.input).toBe('123')
  })
  it('should delete the last element of the string', () => {
    component.input = '(12345+'
    component.pressKey('Backspace')
    expect(component.input).toBe('(12345')
  })
  it('should replace * with x', () => {
    component.input = '1213'
    component.pressKey('*')
    expect(component.input).toBe('1213x')
  })
  it('should add an element to the string', () => {
    component.input = ''
    component.pressKey('2')
    expect(component.input).toBe('2')
  })
  it('getAnswer should be called when press enter', () => {
    const spy = spyOn(component, 'getAnswer').and.callFake(() => {
      return ''
    })
    component.pressKey('Enter')
    expect(spy).toHaveBeenCalled()
  })
  it('allClear should be called when press escape', () => {
    const spy = spyOn(component, 'allClear').and.callFake(() => {
    })
    component.pressKey('Escape')
    expect(spy).toHaveBeenCalled()
  })
  // Проверка вычислений
  // Тесты простых вычислений
  it('should return the result of addition', () => {
    component.input = '2+2'
    component.getAnswer(component.input)
    expect(component.input).toBe('4')
  })
  it('should be a subtraction result', () => {
    component.input = '2-2'
    component.getAnswer(component.input)
    expect(component.input).toBe('0')
  })
  it('should be a multiplication result', () => {
    component.input = '3x2'
    component.getAnswer(component.input)
    expect(component.input).toBe('6')
  })
  it('should be a result of division', () => {
    component.input = '3/2'
    component.getAnswer(component.input)
    expect(component.input).toBe('1.5')
  })
  // Тест вычисления с математическими операциями разного порядка
  it('should be a correct result', () => {
    component.input = '2+2x2+4/2-1'
    component.getAnswer(component.input)
    expect(component.input).toBe('7')
  })
  // Тест вычисления с математическими операциями разного порядка и скобками
  it('should be a correct result', () => {
    component.input = '(2+2)x(2+4)/(2-1)'
    component.getAnswer(component.input)
    expect(component.input).toBe('24')
  })
});
