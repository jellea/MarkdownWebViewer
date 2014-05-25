// Init Showdown
var converter = new Showdown.converter();

// Set is_loading for ajax calls
var is_loading = false;

var hashGo = function()
{
  if (window.location.hash === "") {
    for (var firstdoc in docs) break;
    switchPage(firstdoc);
  } else if(window.location.hash.match('#/')) {
    switchPage(window.location.hash.replace("#/",""));
  }
};

var switchPage = function(pagekey)
{
  is_loading = true;

  NProgress.start();

  page = docs[pagekey];
  pagecontent = [];
  for (file in page.files)
  {
    (function (file)
    {
      $.ajax({
        url: page.dir + page.files[file],
        success: function(data) {
          document.title = page.title;
          NProgress.inc(1/page.files.length);
          pagecontent[file] = converter.makeHtml(data);
        }
      });
    })(file);
  }
};

var makeTOC = function()
{
  var titles = ['<li><span class="title">Table of Contents</span>'];

  $("h2,h3").each(function()
  {
    titles.push('<li class="toc-'+this.nodeName+'"><a onclick="$(\'html,body\').animate({scrollTop:$(\'#'+this.id+'\').offset().top}, 500);">'+this.textContent+'</a></li>');
  });

  $('#toc').html(
    $('<ul/>', {
      'class': 'toc-list',
      html: titles.join('')
    })
  );
};

var makeMenu = function()
{
  items=['<li><span class="title">Documents</strong></li>'];

  $.each(docs, function(key, val)
  {
      items.push('<li><a href="#/'+ key +'" id="'+ key +'">' + val.title + '</a></li>');
  });

  $('#menu').html(
    $('<ul/>', {
      'class': 'menu-list',
      html: items.join('')
    })
  );
};

$(document).ready(function()
{
  // Monitor hash changes
  window.onhashchange = hashGo;


  $(document).ajaxStop(function()
  {
    if(is_loading)
    {
      is_loading = false;

      NProgress.done();

      $('#container').html('<h1>' + page.title + '</h1>' + pagecontent.join(''));
      makeTOC();
    }
    else
    {
    }
  });

  hashGo();
  makeMenu();
});
