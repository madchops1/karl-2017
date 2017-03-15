function pwd($sce, input) {

    this.current = []; // ex ['Projects','Robot and Puppy',]

    this.pwd = function () {
        var output = [];
        output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("/" + this.current.join("/")) });
        return output;
    };
}
