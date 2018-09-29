function TemporaryStorage(){
    let _values = {};

    this.pull = name => {
        return _values[name];
    };

    this.push = values => {
        _values={..._values, ...values};
    };

    this.getRef = ()=> _values;
}
export default TemporaryStorage;