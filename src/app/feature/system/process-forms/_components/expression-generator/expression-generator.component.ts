
import { Component, OnInit,Input,Output,EventEmitter, AfterViewInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { ExpModel, OperationsModel, SubexpressionModel } from '../../_models';


@Component({
  selector: 'app-expression-generator',
  templateUrl: './expression-generator.component.html',
  styleUrls: ['./expression-generator.component.scss']
})

export class ExpressionGeneratorComponent implements OnInit, AfterViewInit {
  @ViewChild('tree',{static:false}) tree;
  @Output()ruleEmitter=new EventEmitter;
  @Input()expression:SubexpressionModel;
  @Input()variables;
  @Input()variableName : string ;
  existingExpressions:SubexpressionModel[];
  availableOperands:string[]=[];
  stringExpression:string;
  expandedExpression:string;
  operationCount:number=1;
  nodeCount:number=1;
  exp:ExpModel[];
  operators=[
  {label:'EQUALS' , value:'==='}, 
  {label:'DOES NOT EQUALS', value:'!=='}, 
  {label:'PLUS', value:'+'},
  {label:'MINUS', value:'-'},
  {label:'MULTIPLY', value:'*'},
  {label:'DIVIDE', value:'/'},
  {label:'PERCENTAGE', value:'%'}]
  expressionModel= {name: '', operator: null, value: null}
  constructor() { }
 

  ngOnInit() {
    if(!this.expression) {
      this.expression = {} as SubexpressionModel ;
      this.exp= this.variables ;
      // this.variableName=this.expression.variableName ? this.expression.variableName : '' ;
    }
    // this.existingExpressions=this.rule.subExpressions;
    this.createOperandSet();
    this.stringExpression="";
    this.expandedExpression="";
    this.iterate(this.exp);
  }

  ngAfterViewInit(){
    this.tree.treeModel.expandAll();
  }
  createOperandSet(){
    // if(this.existingExpressions) {
      this.variables.map(exp=>{
        // if(exp.variableName!=this.variableName ){
         this.availableOperands.push(exp.name);
        // }
      })
    // }
   
 }

 setExpressionString() {
   this.stringExpression = 'model.' + this.expressionModel.name + this.expressionModel.operator + this.expressionModel.value 
 }
    operatorSelected(tree,node,event){
    }
    showAddOperand(node){
    let operations=node.data.operations;
    if(operations[operations.length -1].type == "operator" && !node.data.children){
      return true;
      } else{
        return false;
      }
    }
    showAddOperator(node){
      let operations=node.data.operations;
      if(operations[operations.length -1].type == "operand" || operations[operations.length -1].type == "value" && !node.data.children){
        return true;
      }
      else{
        return false;
      }
    }
    disableBtn(node){
      let operations=node.data.operations;
      if(operations[operations.length -1].value && operations[operations.length -1].value.length>0){
        return false;
      }
      else{
        return true;
      }
    }
    addOperator(tree,node,newNode?){
      let newOperator=new OperationsModel;
      newOperator.id= Math.random();
      newOperator.type="operator";
      newOperator.value='';

      if(newNode){
        node.data["operations"]=[];
      }
      node.data.operations.push(newOperator);
      tree.treeModel.update();

    }
    addOperand(tree,node,newNode?){
      let newOperand=new OperationsModel;
      newOperand.id= Math.random();
      newOperand.type="operand";
      newOperand.value='';

      if(newNode){
        node.data["operations"]=[];
      }
      node.data.operations.push(newOperand);
      tree.treeModel.update();
    }
    addValue(tree,node,newNode?){
      let newOperand=new OperationsModel;
      newOperand.id= Math.random();
      newOperand.type="value";
      newOperand.value='';

      if(newNode){
        node.data["operations"]=[];
      }
      node.data.operations.push(newOperand);
      tree.treeModel.update();
    }
    addGroup(tree,node){
      let newChild=new ExpModel;
        newChild.id= Math.random();

      if(node.data.children){
        node.data.children.push(newChild);
      }
      else{
        node.data["children"]=[];
        node.data.children.push(newChild);
      }

      let newNode=new ExpModel;
      newNode.id= Math.random();

      node.parent.data.children.push(newNode);
      tree.treeModel.update();
      tree.treeModel.expandAll();
    }

    operandChosed(tree){

      this.stringExpression="";
      this.expandedExpression="";
      this.iterate(tree.treeModel.nodes);

      let newExpression=new SubexpressionModel;
      newExpression.variableName=this.variableName;
      newExpression.expressionArray=tree.treeModel.nodes;
      newExpression.expressionString=this.expandedExpression;
      // this.variables.subExpressions.map(x=>{
      //   if(x.variableName == this.variableName){
      //     x.expressionString=this.expandedExpression;
      //     x=newExpression;
      //   }
      // })
      this.ruleEmitter.emit(this.stringExpression);
    }

    iterate(nodes){
      nodes.map(node=>{
        if(node.operations){
          node.operations.map(op=>{
            let str =  op.type === "operand" && !op.value.substring(0,6).includes('model') ? 
                                       `model.${op.value}` : op.type === "value" ? `'${op.value}'`:  op.value ;
           
            this.stringExpression=this.stringExpression+" "+ str;
            this.stringExpression = this.stringExpression.trim() ;
            let flag=0;
            // this.variables.subExpressions.forEach(x=>{
            //   if(x.variableName == op.value){
            //     this.expandedExpression=this.expandedExpression+"("+x.expressionString+")";
            //     flag=1;
            //   }
            // })
            if(!flag){
              this.expandedExpression=this.expandedExpression+" "+ str;
            }
          })
        }
          if(node.children){
            this.stringExpression=this.stringExpression+"(";
            this.expandedExpression=this.expandedExpression+"(";
            // this.rule.expression=this.rule.expression+" "+"(";
            this.iterate(node.children);
            this.stringExpression=this.stringExpression+")";
            this.expandedExpression=this.expandedExpression+")";
            // this.rule.expression=this.rule.expression+" "+")";
          }
      })
      this.ruleEmitter.emit(this.stringExpression)  ;
    }

    deleteExpression(){
      for(let i=0; i<this.variables.length; i++){
        if(this.variables.name == this.expression.variableName){
          this.variables.splice(i, 1);
        }
      }
      this.ruleEmitter.emit(this.variables);
    }


    deleteOperation(tree,node,i){
      node.data.operations.splice(i,1);
      if(node.data.operations.length<1){
        node.data.operations=undefined;
      }
      tree.treeModel.update();
      this.operandChosed(tree);
    }

    deleteGroup(tree,node,i){
     
      let parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
      parentNode.data.children = parentNode.data.children.filter(c => c !== node.data);
      
      //tree.treeModel.update();
      if(parentNode.data.children.length === 0){
        delete parentNode.data.children;
        parentNode.data.hasChildren = false;
      }
      tree.treeModel.update();
    }
    
    
    disableOperator(node){
      
      if(node.findPreviousSibling()){
        let prevGrp = node.findPreviousSibling().data;
      if(prevGrp && !prevGrp.operations && !prevGrp.children){
          return true;
        }
      return false;
      
    } 
    return false;
  }
}
