function validarNoticia()
{
    var titulo = jQuery("#txtTitulo").val();
    if (titulo === "")
    {
        alert("Digite um título");
        return false;
    }

    var imgVal = jQuery("#fuImagem").val();
    if (imgVal === "") {
        alert("Selecione uma imagem");
        return false;
    }

    return true;
}

function criarNoticia() {

    if (validarNoticia()) {

        criarNovoNomeParaImagem();

        jQuery.when(criar())
           .done(function (data) {

               //faz upload da imagem
               upload();

           })
           .fail(function (sender, args) {
               console.log('Erro ao salvar noticia');
           });
    }
}

function criar() {

    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle(listaNoticias);

    var itemCreateInfo = new SP.ListItemCreationInformation();
    oListItem = oList.addItem(itemCreateInfo);
    oListItem.set_item('Title', jQuery('#txtTitulo').val());
    oListItem.set_item('Imagem', obterNovoNomeParaImagem());
    oListItem.update();

    clientContext.executeQueryAsync(
        Function.createDelegate(this, onQuerySucceededCreate),
        Function.createDelegate(this, onQueryFailedCreate)
    );

    return dfd;
}

function onQuerySucceededCreate(sender, args) {
    console.log("Noticia criada com sucesso!");
    dfd.resolve(sender, args);

}

function onQueryFailedCreate(sender, args) {
    alert('Erro ao criar a notícia. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
    dfd.reject(sender, args);
}
