/**
 * Created by јлександр on 14.06.2015.
 */
var canvas;
var context;
var xmlDocCity;
var xmlDocZone;
var xmlDocZoneImage;
var boolAnimation = true;
var array = [];
var points = [];
var city = document.getElementsByName("city");

function init()
{
    loadXML();
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.addEventListener('mousemove', moveMouse);
}

function moveMouse(event)
{
    var mousePos = getMousePos(canvas, event);
    definitionOfCity(mousePos.x, mousePos.y);
    definitionOfZone(mousePos.x, mousePos.y);
}


function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function loadXML() {
    if (window.XMLHttpRequest)
    {
        var xmlhttpCity = new XMLHttpRequest;
        var xmlhttpZone = new XMLHttpRequest;
        var xmlhttpZoneImage = new XMLHttpRequest;
    }
    else
    {
        xmlhttpCity = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpZone = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpZoneImage = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttpCity.open("GET", "xml/nameCity.xml", false);
    xmlhttpCity.send();
    xmlhttpZone.open("GET", "xml/zones.xml", false);
    xmlhttpZone.send();
    xmlhttpZoneImage.open("GET", "xml/zoneImage.xml", false);
    xmlhttpZoneImage.send();
    xmlDocCity = xmlhttpCity.responseXML;
    xmlDocZone = xmlhttpZone.responseXML;
    xmlDocZoneImage = xmlhttpZoneImage.responseXML;
}

function definitionOfCity(x, y)
{
    var town = xmlDocCity.getElementsByTagName("town");
    var zone = xmlDocZone.getElementsByTagName("zone");
    var i;
    for (i = 0; i < town.length; i++)
    {
        if (Math.abs(x - town[i].getElementsByTagName("x")[0].childNodes[0].nodeValue) <= 4 && Math.abs(y - town[i].getElementsByTagName("y")[0].childNodes[0].nodeValue) <= 4)
        {
            writeCity(x, y, town[i].getElementsByTagName("name")[0].childNodes[0].nodeValue);
        }
    }
    
}

function definitionOfZone(x, y)
{
    var zone = xmlDocZone.getElementsByTagName("zone");
    var i;
    var temp = true;
    for (i = 0; i < zone.length; i++)
    {
        var leg1 = (Math.abs(x - zone[i].getElementsByTagName("x")[0].childNodes[0].nodeValue));
        var leg2 = (Math.abs(y - zone[i].getElementsByTagName("y")[0].childNodes[0].nodeValue));
        if (Math.sqrt(leg1*leg1 + leg2*leg2) <= zone[i].getElementsByTagName("radius")[0].childNodes[0].nodeValue)
        {
            temp = false;
            points = [{x:zone[i].getElementsByTagName("x")[0].childNodes[0].nodeValue, y: parseInt(zone[i].getElementsByTagName("y")[0].childNodes[0].nodeValue)-135},
                {x:parseInt(zone[i].getElementsByTagName("x")[0].childNodes[0].nodeValue)-65, y: parseInt(zone[i].getElementsByTagName("y")[0].childNodes[0].nodeValue)-130},
                {x:parseInt(zone[i].getElementsByTagName("x")[0].childNodes[0].nodeValue)+65, y: parseInt(zone[i].getElementsByTagName("y")[0].childNodes[0].nodeValue)-130}];
            floatingImages(i);
        }
    }
    if(temp)
    {
        boolAnimation = true;
        array.length = 0;
        context.clearRect(0, 0, screen.width,  screen.height);
    }
}

function floatingImages(j)
{
    var zoneImage = xmlDocZoneImage.getElementsByTagName("zone");
    var checkRandomArray = [];
    while(array.length < 3)
    {
        do{
            var checkRand = true;
            var random = Math.floor(Math.random() * zoneImage[j].getElementsByTagName("image").length);
            var i;
            for(i = 0; i < checkRandomArray.length; i++)
            {
                if(random == checkRandomArray[i])
                {
                    checkRand = false;
                }
            }
        }while(checkRand == false);
        checkRandomArray.push(random);
        var image = new Image();
        image.src = zoneImage[j].getElementsByTagName("image")[random].childNodes[0].nodeValue;
        array.push(image);
    }
    outputImages();
}

function outputImages()
{
    if(boolAnimation)
    {
        boolAnimation = false;
        var i;
        for(i = 0; i < array.length; i++)
        {
            move(array[i], i);
        }
    }
}

function move(image, i)
{
    var property=20;  // начальное значение размера изображени€
    function frame(){ // функци€ дл€ отрисовки одного кадра
        property=property+1;
        context.drawImage(image, points[i].x, points[i].y, property, property);
        if(property==60){
            clearInterval(timer); // завершить анимацию
        }
    }
    var timer=setInterval(frame,5);
}

function writeCity(x, y, name)
{
    /*city.value = name;
    city.x = x;
    city.y = y - 5;
    city.width = 120;
    city.height = 30;*/
    context.clearRect(x - 20, y - 20, x + 120,  y + 20);
    context.font = '12pt Calibri';
    context.fillStyle = 'black';
    context.fillText(name, x + 5, y - 5);
}