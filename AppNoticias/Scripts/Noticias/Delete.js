var imagem;

function apagarNoticia(idNoticia, nomeImagem) {

    this.imagem = nomeImagem;
    //get the current client context  
    var clientContext = SP.ClientContext.get_current();
    var airportList = clientContext.get_web().get_lists().getByTitle(listaNoticias);
    //get the list item to delete  
    var listItem = airportList.getItemById(idNoticia);
    //delete the list item  
    listItem.deleteObject();
    clientContext.executeQueryAsync(DeleteItemSucceeded, DeleteItemFailed);
}

function DeleteItemSucceeded(nomeImagem) {
    console.log(imagem);
    apagarImagem(imagem);
}

function DeleteItemFailed(sender, args) {
    console.log('Erro ao apagar noticia - ' + args.get_message() + ' . Stack Trace - ' + args.get_stackTrace());
}

function apagarImagem(imagem) {
    var urlImagem = _spPageContextInfo.webServerRelativeUrl + "/Lists/" + listaImagens + "/";
    var clientContext = new SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var fileUrl = urlImagem + imagem;
    console.log(fileUrl);
    this.fileToDelete = oWebsite.getFileByServerRelativeUrl(fileUrl);
    this.fileToDelete.deleteObject();
    clientContext.executeQueryAsync(
        Function.createDelegate(this, this.successHandler),
        Function.createDelegate(this, this.errorHandler)
    );
}

function successHandler(sender, args) {
    console.log("Imagem apagada com sucesso!");
    GetListItems(jQuery('#txtTitulo').val());
}

function errorHandler(sender, args) {
    console.log('Erro ao apagar imagem - ' + args.get_message() + ' . Stack Trace - ' + args.get_stackTrace());
}