
// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    var user = context.get_web().get_currentUser();
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

// This function is executed if the above call is successful
function onGetUserNameSuccess() {
    console.log(user.get_title());
}

// This function is executed if the above call fails
function onGetUserNameFail(sender, args) {
    alert('Erro ao recuperar o usuário. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
}

function getSiteUrl() {
    var siteUrl = _spPageContextInfo.webAbsoluteUrl;//retorna url absoluta do site
    return siteUrl;
}

function getPageName()
{
    var path = window.location.pathname;
    var page = path.split("/").pop();
    return page;
}

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};

function montarMenuTopNavigation() {
    
    var menu = "<a href='{0}/Lists/Noticias/AllItems.aspx' class='link'>Notícias</a>" +
            "<a href='{0}/Lists/Documentos' class='link'>Imagens</a>" +
            "<a href='../Noticias/Default.aspx' class='link'>Listar Noticias</a>" +
            "<a href='../Noticias/Create.aspx' class='link'>Adicionar Noticia</a>";

    menu = String.format(menu, _spPageContextInfo.webAbsoluteUrl);

    jQuery(".mp-breadcrumb-top").append(menu);
}

function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&amp;");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] === paramToRetrieve)
            return singleParam[1];
    }
}

function redirecionarListaNoticias() {
    window.location.href = getSiteUrl() + "/Pages/Noticias/Default.aspx";
}

Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function () {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return this.getFullYear() +
               pad2(this.getMonth() + 1) +
               pad2(this.getDate()) +
               pad2(this.getHours()) +
               pad2(this.getMinutes()) +
               pad2(this.getSeconds());
    }
});