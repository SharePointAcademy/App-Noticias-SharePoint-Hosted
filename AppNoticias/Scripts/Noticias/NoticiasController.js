'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

var listaNoticias = "Noticias";
var listaImagens = "Documentos";

var pagina = getPageName();
var dfd = jQuery.Deferred();

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
jQuery(document).ready(function () {

    montarMenuTopNavigation();

    if (pagina === "Default.aspx") {                

        jQuery("#btnNext").click(function () {
            pageIndex = pageIndex + 1;
            if (nextPagingInfo) {
                position = new SP.ListItemCollectionPosition();
                position.set_pagingInfo(nextPagingInfo);
            }
            else {
                position = null;
            }

            GetListItems(jQuery("#txtTitulo").val());
        });

        jQuery("#btnBack").click(function () {
            pageIndex = pageIndex - 1;
            position = new SP.ListItemCollectionPosition();
            position.set_pagingInfo(previousPagingInfo);
            GetListItems(jQuery("#txtTitulo").val());
        });

        GetListItems(jQuery("#txtTitulo").val());        
    }
    else if (pagina === "Create.aspx") {
        console.log("criar");
    }
    else if (pagina === "Edit.aspx") {
        obterNoticia();
    }
    else {
        console.log("outra página");
    }

});


