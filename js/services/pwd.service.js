/**
 * pwd
 * author Karl Steltenpohl
 * copyright 2017
 * UNLICENSED do not reuse
 */
function pwd($sce, input) {
    this.current = [];
    this.pwd = function () {
        var output = [];
        output.push({ id: Date.now(), plain: true, text: $sce.trustAsHtml("/" + this.current.join("/")) });
        return output;
    };
}
