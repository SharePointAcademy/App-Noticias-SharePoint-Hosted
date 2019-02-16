var context,
    web,
    spItems,
    position,
    nextPagingInfo,
    previousPagingInfo,
    pageIndex = 1, // default page index value
    pageSize = 20, // default page size value
    list,
    camlQuery,
    filtro;

function pesquisar() {
    pageIndex = 1;
    GetListItems(jQuery("#txtTitulo").val());
}

function redirecionarCadastroNoticia() {
    window.location.href = getSiteUrl() + "/Pages/Noticias/Create.aspx";
}

function GetListItems(titulo) {

    context = SP.ClientContext.get_current();
    list = context.get_web().get_lists().getByTitle(listaNoticias);
    camlQuery = new SP.CamlQuery();

    //Set the next or back list items collection position
    //First time the position will be null
    camlQuery.set_listItemCollectionPosition(position);
    
    if (titulo !== "") {
        filtro = "<Query><Where>" +
                    "<Contains>" +
                        "<FieldRef Name='Title'/><Value Type='Text'>" + titulo + "</Value>" +
                    "</Contains>" +
                 "</Where></Query>";
    }
    else
        filtro = "";

    // Create a CAML view that retrieves all contacts items  with assigne RowLimit value to the query
    camlQuery.set_viewXml("<View>" +
                             filtro +
                            
                              "<ViewFields>" +
                                     "<FieldRef Name='ID'/>" +
                                     "<FieldRef Name='Title'/>" +
                                     "<FieldRef Name='Imagem'/>" +
                                "</ViewFields>" +
                             "<RowLimit>" + pageSize + "</RowLimit>"+
                            "</View>");
    
    spItems = list.getItems(camlQuery);

    context.load(spItems);
    context.executeQueryAsync(
            Function.createDelegate(this, onSuccess),
            Function.createDelegate(this, onFail)
        );
}

// This function is executed if the above OM call is successful
// This function render the returns items to html table
function onSuccess() {

    if (spItems.get_count() > 0) {

        var urlSite = getSiteUrl();
        var urlImagem = urlSite + "/Lists/" + listaImagens + "/";
        var urlEdicao = urlSite + "/Pages/Noticias/Edit.aspx?idNoticia=";

        var listEnumerator = spItems.getEnumerator();
        var html = "<table class='table table-striped'><tr><th>Ações</th><th>ID</th><th>Título</th><th>Imagem</th></tr>";
        var item;

        while (listEnumerator.moveNext()) {
            item = listEnumerator.get_current();

            var ID = item.get_item('ID');
            var Title = item.get_item('Title');
            var Imagem = item.get_item('Imagem');

            html = html + "<tr>";
            html = html + "<td valign='top'><a href='" + urlEdicao + ID + "' title='Editar' class='mr10'>Editar</a><a onclick=\"if (confirm('Deseja apagar a Notícia?')) apagarNoticia(" + ID + ",'" + Imagem + "')\" href='#'>Apagar</a></td>";
            html = html + "<td valign='top'>" + ID + "</td>";
            html = html + "<td valign='top'>" + Title + "</td>";
            html = html + "<td class='noticia' valign='top'><img src='" + urlImagem + Imagem + "' /></td>";
            html = html + "</tr>";

        }

        html = html + "</table>";
        jQuery("#content").html(html);
        jQuery(".pager").show();
        managePagerControl();
    }
    else {
        jQuery("#content").html("<p>Nenhuma notícia encontrada!");
        jQuery(".pager").hide();
    }
        
}

function managePagerControl() {

    if (spItems.get_listItemCollectionPosition()) {
        nextPagingInfo = spItems.get_listItemCollectionPosition().get_pagingInfo();
    } else {
        nextPagingInfo = null;
    }

    //The following code line shall add page information between the next and back buttons
    jQuery("#pageInfo").html((((pageIndex - 1) * pageSize) + 1) + " - " + ((pageIndex * pageSize) - (pageSize - spItems.get_count())));

    previousPagingInfo = "PagedPrev=TRUE&Paged=TRUE&p_ID=" + spItems.itemAt(0).get_item('ID');

    if (pageIndex <= 1) {
        jQuery("#btnBack").attr('disabled', 'disabled');
    }
    else {
        jQuery("#btnBack").removeAttr('disabled');
    }

    if (nextPagingInfo) {
        jQuery("#btnNext").removeAttr('disabled');
    }
    else {
        jQuery("#btnNext").attr('disabled', 'disabled');
    }

}

// This function is executed if the above call fails
function onFail(sender, args) {
    alert('Failed to get items. Error:' + args.get_message());
}
