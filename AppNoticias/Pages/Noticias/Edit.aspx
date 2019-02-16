<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    
     <!--jquery-->
    <script type="text/javascript" src="../../Scripts/jquery-1.9.1.js"></script>

    <!--sharepoint scripts-->
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>

    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../../Content/App.css" />

    <!--bootstrap-->
    <link rel="Stylesheet" type="text/css" href="../../Content/bootstrap.min.css" />

    <!-- Add your JavaScript to the following file -->

    <script type="text/javascript" src="../../Scripts/Util.js"></script>
    <script type="text/javascript" src="../../Scripts/Noticias/Edit.js"></script>    
    <script type="text/javascript" src="../../Scripts/Noticias/NoticiasController.js"></script>

    <!--bootstrap-->
    <script type="text/javascript" src="../../Scripts/bootstrap.min.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Editar Notícia
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div class="row">
        
        <div class="col-5">
            <br /><br />
            <div class="form-group">
                <label>Titulo</label>
                <input type="text" id="txtTitulo" class="form-control" />                
            </div>
            <button type="button" id="btnSalvar" class="btn btn-primary mr5" onclick="atualizarNoticia()">Salvar</button>
            <button type="button" id="btnVoltar" class="btn btn-primary" onclick="redirecionarListaNoticias()">Voltar</button>
        </div>

    </div>
    <input type="hidden" id="hdfIdNoticia" />
</asp:Content>