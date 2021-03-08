var gfTabs;
var auxBtn;
var defaultDelay = 2000; // el tiempo de espera entre animaciones
var animationTime = 800; //el tiempo para mostrar los elementos
//var effectName = 'blind';
//var effectName = 'clip';
//var effectName = 'drop';
var effectName = 'puff';
var currentId = null;
var animationCounter = 0;
var components = 0;
var tabsValues = new Array();
var animationObjs = new Array({
    id: '.texto-1',
    f: showText
}, {
    id: '[data-anim="0"]',
    f: showComponents
}, {
    id: '.texto-2',
    f: showText
}, {
    id: '[data-anim="1"]',
    f: showComponents
}
);

function bridgeComponents() {
    components--;

    if (components == 0) {
        playAnimation(defaultDelay);
    }
}
function configAnimBoxes(selector) {
    $(selector).each(function() {
        var e = $(this);
        var json;
        eval('json=' + e.data('inittransform'));
        e.transit(json);
    });
    $(selector).hide();
}
function configElements() {
    $('.contenedor-figura').each(function() {
        var div = $(this);
        var mainContainer = div.parent();
        var figure = $('<div class="figura"></div>');
        var elements = div.data('elements');
        var firstElements = div.data('init');
        var anim;

        $('img', div).hide();

        for (var i = 0; i < elements; i++) {

            i < firstElements ? anim = 0 : anim = 1;

            figure.append('<div class="e-' + i + '" data-anim="' + anim + '"></div>')
        }
        div.append(figure);

        $('[data-anim]', figure).each(function() {
            $(this).attr('data-inittransform', '{transform: "' +
                    $(this).css('transform') + '"}');
        });

        mainContainer.append('<a href="javascript:;" class="btn-repetir" data-id="' +
                mainContainer.attr('id') +
                '">Repetir</a>');
    });
}
function configTextBoxes(selector) {
    $(selector).hide();
    $(selector).css({opacity: 0});
    $(selector).transit({transform: 'scale(0.1,0.1), translate3d(0,0,0)'}, 0);
}
function showElements(parent) {
//    console.log('mostrando todo')
    for (var i in animationObjs) {
        animationObjs[i].f(parent, animationObjs[i].id, 0);
    }
}
function playAnimation(delay) {
    if (animationCounter < animationObjs.length) {
        var obj = animationObjs[animationCounter];
        animationCounter++;

        auxBtn.delay(delay).show(0, function() {
            obj.f(currentId, obj.id, animationTime);
        });
    } else {
//        console.log('terminando')
        $('.btn-repetir', currentId).show();
        currentId = null;
        animationCounter = 0;
        gfTabs.tabs("enable");
    }
}
function prevAnimation(index) {

    gfTabs.tabs("disable");

    if (currentId != null) {
        showElements(currentId);
    }

    animationCounter = 0;
    tabsValues[index] = false;
    currentId = $('#tabs-' + (index + 1));

    $('.btn-repetir', currentId).hide();

    playAnimation(100);
    $('.figura [data-anim]', currentId).fadeIn(700);
}
function showText(parent, child, time) {
    var obj = $(child, parent);

    if (obj.length > 0) {
        obj.css({opacity: 1});
        obj.show();
        obj.transit({transform: 'scale(1, 1), translate3d(0,0,0)'}, time, function() {
            if (time > 0) {
                playAnimation(defaultDelay);
            }
        });
    } else {
        playAnimation(defaultDelay);
    }
}
function showComponents(parent, child, time) {
    var obj = $(child, parent);

    if (obj.length > 0) {
        components = obj.length;

        obj.transit({transform: 'translate(0, 0, 0) rotate(0)'}, time, function() {
            if (time > 0) {
                bridgeComponents();
            }
        });
    } else {
        playAnimation(defaultDelay);
    }
}
$(document).ready(function() {
    //configuracion de la ventana
    $('.ventana').hide();
    $('.ventana').append('<a href="javascript:;" class="btn-cerrar">X</a>');

    configElements();

    $('.tab').each(function() {
        var tab = $(this);

        tab.css({height: tab.outerHeight()});
    });

    auxBtn = $('.btn-siguiente');

    $(".contenedor-tabs > .tab").each(function() {
        tabsValues.push(true);
    });

    $('.btn-cerrar').click(function() {
        $(this).parent().hide('explode');
    });
    $('.btn-repetir').click(function() {
        var idString = '#' + $(this).data('id');
        var indexString = $(this).data('id').split('-')[1];

        configTextBoxes(idString + " .texto");
        configAnimBoxes(idString + " .figura [data-anim]");

        prevAnimation(parseInt(indexString) - 1);
    });
    $('.btn-definicion').click(function() {
        $('.ventana.definicion').show('puff');
    });

    $(".contenedor-slides").slides({
        container: 'slides',
        generateNextPrev: false,
        generatePagination: false,
        next: 'btn-siguiente',
        prev: 'btn-anterior'
    });

    gfTabs = $(".tabs").tabs({
        collapsible: true,
        active: false,
        show: {effect: "blind", duration: 500},
        hide: {effect: "fade", duration: 500},
        activate: function(event, ui) {
            var index = eval(ui.newPanel.data('index'));

            if (tabsValues[index]) {
                prevAnimation(index);
            } else {
                if (currentId != null) {
                    showElements(currentId);
                    currentId = null;
                }
            }
        }
    });

    configAnimBoxes(".contenedor-tabs .figura [data-anim]");
    configTextBoxes(".contenedor-tabs .texto");
});
