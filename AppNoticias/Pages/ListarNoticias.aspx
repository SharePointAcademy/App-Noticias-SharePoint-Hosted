<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title></title>

    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!--bootstrap-->
    <link rel="Stylesheet" type="text/css" href="../Content/bootstrap.min.css" />
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>

    <script type="text/javascript" src="../Scripts/Util.js"></script>

    <!--bootstrap-->
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>

    <script type="text/javascript">
        // Set the style of the client web part page to be consistent with the host web.
        (function () {
            'use strict';

            var hostUrl = '';
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            if (document.URL.indexOf('?') != -1) {
                var params = document.URL.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var p = decodeURIComponent(params[i]);
                    if (/^SPHostUrl=/i.test(p)) {
                        hostUrl = p.split('=')[1];
                        link.setAttribute('href', hostUrl + '/_layouts/15/defaultcss.ashx');
                        break;
                    }
                }
            }
            if (hostUrl == '') {
                link.setAttribute('href', '/_layouts/15/1033/styles/themable/corev15.css');
            }
            document.head.appendChild(link);
        })();


        function getQueryStringParameter(paramToRetrieve) {
            var params;

            params = document.URL.split("?")[1].split("&");
            strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve)
                    return singleParam[1];
            }
        }

        window.Communica = window.Communica || {};

        jQuery(document).ready(function () {
            Communica.Part.init();
        });

        Communica.Part = {
            senderId: '',      // the App Part provides a Sender Id in the URL parameters,
            // every time the App Part is loaded, a new Id is generated.
            // The Sender Id identifies the rendered App Part.
            previousHeight: 0, // the height
            minHeight: 0,      // the minimal allowed height
            firstResize: true, // On the first call of the resize the App Part might be
            // already too small for the content, so force to resize.

            init: function () {
                // parse the URL parameters and get the Sender Id
                var params = document.URL.split("?")[1].split("&");
                for (var i = 0; i < params.length; i = i + 1) {
                    var param = params[i].split("=");
                    if (param[0].toLowerCase() == "senderid")
                        this.senderId = decodeURIComponent(param[1]);
                }

                // find the height of the app part, uses it as the minimal allowed height
                this.previousHeight = this.minHeight = $('body').height();

                // display the Sender Id
                $('#senderId').text(this.senderId);

                //chama o metodo para listar as noticias
                this.listarNoticias();

                // make an initial resize (good if the content is already bigger than the
                // App Part)
                this.adjustSize();
            },

            adjustSize: function () {
                // Post the request to resize the App Part, but just if has to make a resize

                var step = 30, // the recommended increment step is of 30px. Source:
                    // http://msdn.microsoft.com/en-us/library/jj220046.aspx
                    width = $('body').width(),        // the App Part width
                    height = $('body').height() + 7,  // the App Part height
                    // (now it's 7px more than the body)
                    newHeight,                        // the new App Part height
                    contentHeight = $('#resultarea').height(),
                    resizeMessage =
                        '<message senderId={Sender_ID}>resize({Width}, {Height})</message>';


                // if the content height is smaller than the App Part's height,
                // shrink the app part, but just until the minimal allowed height
                if (contentHeight < height - step && contentHeight >= this.minHeight) {
                    height = contentHeight;
                }

                // if the content is bigger or smaller then the App Part
                // (or is the first resize)
                if (this.previousHeight !== height || this.firstResize === true) {
                    // perform the resizing

                    // define the new height within the given increment
                    newHeight = Math.floor(height / step) * step +
                        step * Math.ceil((height / step) - Math.floor(height / step));

                    // set the parameters
                    resizeMessage = resizeMessage.replace("{Sender_ID}", this.senderId);
                    resizeMessage = resizeMessage.replace("{Height}", newHeight);
                    resizeMessage = resizeMessage.replace("{Width}", width);
                    // we are not changing the width here, but we could

                    // post the message
                    window.parent.postMessage(resizeMessage, "*");

                    // memorize the height
                    this.previousHeight = newHeight;

                    // further resizes are not the first ones
                    this.firstResize = false;
                }
            },

            listarNoticias: function () {

                var listNoticias = "Noticias";
                var pageSize = 3;
                var urlCompleta;
                var appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
                var urlImagem = appWebUrl + "/Lists/Documentos/";

                var query = "/_api/web/Lists/GetByTitle('" + listNoticias + "')/items?$top=" + pageSize + "&$orderby=ID desc&$select=ID,Title,Imagem";
                urlCompleta = appWebUrl + query;

                jQuery.ajax({
                    url: urlCompleta,
                    method: "GET",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose",
                        "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                        "IF-MATCH": "*",
                        "X-HTTP-Method": null
                    },
                    success: function (data) {

                        var results = data.d.results;
                        if (results.length > 0) {

                            var html = "";


                            jQuery.each(results, function (i, result) {

                                var strTitle = result.Title;
                                var strImagem = result.Imagem;

                                html += "<div class='row'>";
                                html += "<div class='col-md-4 listNoticia'><label>" + strTitle + "</label><img src='" + urlImagem + strImagem + "' /></div>";
                                html += "</div>";

                                jQuery('#noticias').append(html);
                                Communica.Part.adjustSize();

                                html = "";
                            });

                        }
                        else
                            jQuery('#noticias').append("<p>Nenhuma notícia cadastrada.</p>");


                    },
                    error: function (data, errorCode, errorMessage) {
                        alert('Erro ao recuperar as notícias. \nError: ' + errorCode + '\nStackTrace: ' + errorMessage);
                    }
                });
            }

        };

    </script>

</head>
<body>

    <div id="resultarea">
        <div id="noticias"></div>
    </div>

</body>
</html>
