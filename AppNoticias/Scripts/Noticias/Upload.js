function upload() {    

    //Read File contents using file reader  
    var reader = new FileReader();
    reader.onload = function (e) {
        uploadFile(e.target.result, obterNovoNomeParaImagem());
    };
    reader.onerror = function (e) {
        console(e.target.error);
    };

    var file = getFile();
    reader.readAsArrayBuffer(file);

    return dfd;
}


function uploadFile(arrayBuffer, nomeImagem) {

    //Get Client Context,Web and List object.  
    var clientContext = new SP.ClientContext();
    var oWeb = clientContext.get_web();
    var oList = oWeb.get_lists().getByTitle(listaImagens);

    //Convert the file contents into base64 data  
    var bytes = new Uint8Array(arrayBuffer);
    var i, length, out = '';
    for (i = 0, length = bytes.length; i < length; i += 1) {
        out += String.fromCharCode(bytes[i]);
    }
    var base64 = btoa(out);

    //Create FileCreationInformation object using the read file data  
    var createInfo = new SP.FileCreationInformation();
    createInfo.set_content(base64);
    createInfo.set_url(nomeImagem);

    //Add the file to the library  
    var uploadedDocument = oList.get_rootFolder().get_files().add(createInfo)

    //Load client context and execcute the batch  
    clientContext.load(uploadedDocument);
    clientContext.executeQueryAsync(
            Function.createDelegate(this, QuerySuccess),
            Function.createDelegate(this, QueryFailure)
        );

    return dfd;
}

function QuerySuccess(sender, args) {
    alert("Notícia cadastrada com sucesso");
    window.location.href = getSiteUrl() + "/Pages/Noticias/Default.aspx";
}

function QueryFailure(sender, args) {
    console.log('Erro ao fazer upload da imagem - ' + args.get_message() + ' . Stack Trace - ' + args.get_stackTrace());
}



function getFileName() {
    //Get File Input Control and read th file name  
    var element = document.getElementById("fuImagem");
    var file = element.files[0];
    var parts = element.value.split("\\");
    var fileName = parts[parts.length - 1];

    return fileName;
}

function getFile() {
    //Get File Input Control and read th file name  
    var element = document.getElementById("fuImagem");
    var file = element.files[0];

    return file;
}


function criarNovoNomeParaImagem() {
    //cria string com data completa para mudar o nome da imagem quando for subir na biblioteca
    var dataCompleta = new Date().YYYYMMDDHHMMSS();
    var novoNomeImagem = dataCompleta + "-" + getFileName();
    jQuery("#hdfNomeImagem").val(novoNomeImagem);
}

function obterNovoNomeParaImagem() {
    return jQuery("#hdfNomeImagem").val();
}