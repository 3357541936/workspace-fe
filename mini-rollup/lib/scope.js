class Scope{
    constructor(options = {}){
        this.parent = options.parent;
        this.names = options.names;
    }

    // 添加变量信息
    add(name){
        if(this.names){
            this.names.push(name);
        }else {
            this.names = [name];
        }
    }

     // 判断当前作用域下变量是否可以被使用
    contains(name){
        return !!this.findDefiningScope(name)
    }

    // 返回某变量所在的作用域
    findDefiningScope(name){
        if (this.names.includes(name)){
            return this;
        }else if (this.parent){
            return this.parent.findDefiningScope(name)
        }
        return null;
    }
}

module.exports =  Scope;