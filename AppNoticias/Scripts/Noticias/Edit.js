function obterNoticia()
{
    var idNoticia = getQueryStringParameter("idNoticia");

    // the current context is taken by default here  
    var clientContext = new SP.ClientContext.get_current();

    var lstObject = clientContext.get_web().get_lists().getByTitle(listaNoticias);
    this.lstObjectItem = lstObject.getItemById(idNoticia);
    clientContext.load(lstObjectItem, 'Title');
    clientContext.executeQueryAsync(
        Function.createDelegate(this, this.onQuerySucceeded), 
        Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {

    jQuery("#txtTitulo").val(lstObjectItem.get_item('Title'));

}

function onQueryFailed(sender, args) {
    alert('Erro ao recuperar a notícia. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
}


function atualizarNoticia() {

    var idNoticia = getQueryStringParameter("idNoticia");

    // the current context is taken by default here  
    var clientContext = new SP.ClientContext.get_current();

    var lstObject = clientContext.get_web().get_lists().getByTitle(listaNoticias);
    var lstObjectItem = lstObject.getItemById(idNoticia);

    lstObjectItem.set_item('Title', jQuery('#txtTitulo').val());
    lstObjectItem.update();
    clientContext.executeQueryAsync(
        Function.createDelegate(this, onSuccess),
        Function.createDelegate(this, onFailure)
    );
}

function onSuccess() {
    alert("Notícia atualizada com Sucesso!");
    window.location.href = getSiteUrl() + "/Pages/Noticias/Default.aspx";
}

function onFailure(sender, args) {
    alert('Erro ao atualizar a notícia. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
}
