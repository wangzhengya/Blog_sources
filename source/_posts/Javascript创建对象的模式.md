---
title: Javascript创建对象的模式
date: 2016-10-05 10:33:49
tags:
- Javascript
- 对象
- 模式
categories:
- 前端
---
ECMA-262将对象定义为：“无需属性的集合，其属性可以包含基本值、对象或者函数。”严格来讲，这就相当于说明对象是一组没有特定顺序的值。
## 一、创建一个Object实例
创建一个自定义对象的最简单的方式就是创建一个Object的实例，然后再添加上属性和方法。
```
var person = new Object();
person.name = "Zhengyaing";
person.age = 24;
person.job = "Avionics Engineer";

person.sayName = function(){
  console.log(this.name);
};
```
早期的开发人员常用这种方法创建新的对象，后来对象字面量成为创建这种对象的首选模式。
```
var person = {
  name:"Zhengyiang",
  age:24,
  job:"Avionics Engineer",

  sayName:function(){
    console.log(this.name);
  }
};
```
**缺点：** 使用同一接口创建很多对象，会产生大量重复代码
## 二、工厂模式
抽象了创建具体对象的过程，用函数来封装以特定接口创建对象的细节
```
function createPerson(name,age,job){
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = fucniton(){
    console.log(this.name);
  };
  return o;
}

var person1 = createPerson("Zhengyaing",24,"Avionics Engineer");
```
**优点：** 解决了创建多个相似对象的问题
**缺点：** 没有解决对象识别问题

## 三、构造函数模式
ECMAScript中的构造函数用来创建特定类型的对象。像Object、Array这样的原生构造函数，在运行时会自动出现在执行环境中。
构造函数与其他函数的唯一区别就是：调用他们的方式不同， **使用new操作符来调用。**
```
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function(){
    console.log(this.name);
  };
}
var person1 = new Person("Zhengyaing",24,"Avionics Engineer");
```
这个对象有一个constructor（构造函数）属性，该属性指向Person：
```
console.log(person1.constructor == Person);//true
```
对象的constructor属性是用来标识对象类型的。检测对象类型使用instaceof比较靠谱一些。
```
console.log(person1 instanceof Object);//true
console.log(person1 instanceof Person);//true
```
创建自定义的构造函数意味着将来可以将它的实例标识为一种特定的类型。
与工厂模式不同之处：
1. 没有显式地创建对象；
1. 直接将属性和方法赋给了this对象
1. 没有retrun语句

**缺点：** 每个方法都要在每个实例上重新创建一遍。可以把函数定义转移到构造函数外部，但却带来过多的全局函数

## 四、原型模式
我们创建的每个函数都有一个prototype属性，指向一个对象，可以包含由特定类型的所有实例共享的属性和方法。
```
function Person(){
}

Person.prototype = {
  constructor:Person,//使得constructor检测有效
  name:"Zhengyaing",
  age:24,
  job:"Avionics Engineer",
  sayName:function(){
    console.log(this.name);
  }
}
```
**缺点：**
1. 省略了为了构造函数传递初始化参数这一环节
1. 共享的属性，对于包含基本值的属性是会隐藏原型中的值，但对于引用类的值的属性，则无法隐藏。

## 五、组合使用构造函数模式和原型模式
创建自定义类型的最常见的方式，就是组合使用构造函数模式与原型模式。构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。
```
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ["Shelby","Court"];
}

Person.prototype = {
  constructor : Person,
  sayName:function(){
    console.log(this.name);
  }
}

var person1 = new Person("Zhengyaing",24,"Avionics Engineer");
```
## 六、动态原型模式
其他OO语言的开发人员在看到独立的构造函数和原型时，很可能会感到困惑。动态原型模式正式致力于解决这个问题的一个方案，它把所有信息都封装在了构造函数中。
```
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;
  if(typeof this.sayName != "function"){
    Person.portotype.sayName = function(){
      console.log(this.name);
    }
  }
}
```
**在使用动态原型模式时，不能使用对象字面量重写原型。**

## 七、寄生构造函数模式
基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象。
```
function Person(name,age,job){
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = fucniton(){
    console.log(this.name);
  };
  return o;
}

var person1 = new Person("Zhengyaing",24,"Avionics Engineer");
```
这个模式与工厂模式相比，除了使用new操作符并把包装函数叫做构造函数外，其他都一样。

## 八、稳妥构造函数模式
稳妥对象：没有公共属性，而且其方法也不引用的对象。适合在一些安全环境中使用。
1. 新创建对象的实例方法不引用this；
2. 不使用new操作符调用构造函数

```
function Person(name,age,job){
  var o = new Object();
  o.sayName = function(){
    console.log(name);
  }
  return o;
}
```
在以这种模式创建的对象中，除了使用sayName()方法外，没有其他办法访问name的值。
