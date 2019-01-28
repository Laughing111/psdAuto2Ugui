var  doc = app.activeDocument;

var layers = doc.layers;

var len = layers.length;

var aEyes = [];

//记录原始每个图层的眼睛状态;

function recordAllEyesStatus(){

        aEyes.length = 0;

        for(var i=0; i < len; i++){

                aEyes.push(layers[i].visible);
        }

}

//把每个图层的状态设置成最初的样子;

function setOldEyeStatus(){

    for(var i=0; i < len; i++){

        layers[i].visible = aEyes[i];

    }

}

//将所有图层隐藏;

function hideAllLayer(){

    for(var i=0; i < len; i++){

        layers[i].visible = false;

    }

}

recordAllEyesStatus();

hideAllLayer();

var outputFolder = Folder.selectDialog("选择输出的文件夹");

var exportOpts = new ExportOptionsSaveForWeb();

exportOpts.transparency=true;

exportOpts.colors = 256;

exportOpts.format = SaveDocumentType.PNG;

//exportOpts.PNG8=false;

var jsonData="{\"data\":[";

for(var i=0;i<len;i++)
{
    if(aEyes[i])
    {
        layers[i].visible=true;

        var bounds=layers[i].bounds;
        
        var layerName=layers[i].name;
        var width=(bounds[2]-bounds[0]).toString().replace("px","");
        var height=(bounds[3]-bounds[1]).toString().replace("px","");
        var x=(bounds[0]+0.5*width).toString().replace("px","");
        var y=(bounds[1]+0.5*height).toString().replace("px","");

        //输出Json
        jsonData+="{\"name\":"+"\""+layerName+"\","+"\"x\":"+x+","+"\"y\":"+y+","+"\"width\":"+width+","+"\"height\":"+height+"},";
        
        doc.crop(bounds,0);
        
        var fileOut = new File(outputFolder + "/" +layerName + ".png");

        doc.exportDocument(fileOut, ExportType.SAVEFORWEB, exportOpts);

        var lastHistoryNum = doc.historyStates.length - 2;

        doc.activeHistoryState = doc.historyStates[lastHistoryNum];
    }
}

jsonData=jsonData.substring(0, jsonData.length - 1);
jsonData+="]}";

var jsonFileOut=new File(outputFolder+"/JsonData.txt");
jsonFileOut.open("w","TEXT","????");
jsonFileOut.write(jsonData);
setOldEyeStatus();
