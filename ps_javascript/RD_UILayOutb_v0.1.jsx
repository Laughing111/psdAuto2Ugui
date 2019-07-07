//获取当前文档
var doc=app.activeDocument;
//获取当前文档的组集合( 文档中所有组的集合 layer[])
var groups=doc.layers;
//一个组就是一个Panel面板

//指定导出路径
var outputFolder = Folder.selectDialog("选择保存的文件夹");
    
var exportOpts = new ExportOptionsSaveForWeb();

exportOpts.transparency=true;

exportOpts.colors = 256;

exportOpts.format = SaveDocumentType.PNG;

exportOpts.quality=100;
    
exportOpts.PNG8=false;

var jsonData="{\"data\":[";

//为每个面板进行切图
for(var i=0;i<groups.length;i++)
{
    // panelLayers 一个组中所有层级的集合layer[]
    var panelLayers=groups[i].layers;
     var elementsLength=panelLayers.length;
     //alert ("面板"+(i+1)+"有"+elementsLength+"个子项");
     var panelBGBounds=panelLayers[elementsLength-1].bounds;
     //alert("找到背景面板："+panelLayers[elementsLength-1].name);
     SearchForSingleLayer(panelLayers,panelBGBounds);
}

jsonData=jsonData.substring(0, jsonData.length - 1);

jsonData+="]}";

var jsonFileOut=new File(outputFolder+"/JsonData.txt");

jsonFileOut.open("w","TEXT","????");

jsonFileOut.write(jsonData);

alert("导出成功！");


//递归方法，如果为组，则继续遍历，如果为整体或单个层级，则直接导出
function SearchForSingleLayer(group,panelBGBounds)
{
    //开始为该组进行遍历
    //alert("开始为"+group.parent.name+"组遍历！");
    HideCurrentGroups (group);
    for(var i=0;i<group.length;i++)
    {
           //默认为组：判断这个组的名字里是不是#开头
            if(group[i].name[0]=='#')
            {
                //该组为整体切图导出
               // alert("整体:"+group[i].name)
                
                CropAndSave(group[i],panelBGBounds);
            }
            else{
                //如果不为整体导出，则判断该层是否为组
                if(group[i].layers!=null)
                {
                    
                    //如果是组
                   var childSets=group[i].layers;
                  //alert(group[i].name+"层为组，组下还有"+childSets.length+"个元素"); 
                  group[i].visible=true;
                  SearchForSingleLayer(childSets,panelBGBounds);
                  group[i].visible=false;
                }
            else
            {
              //该层级为单个层级
              //alert("单个层级："+group[i].name);
               
              CropAndSave(group[i],panelBGBounds);
             
              }
            }
     }
 }

//为该组内的层级进行隐藏
function HideCurrentGroups(panelLayers)
{
    for(var i=0;i<panelLayers.length;i++)
    {
        panelLayers[i].visible=false;
    }
}

function CropAndSave(layer,bgBounds)
{
        
       layer.visible=true;
        
       var bounds=layer.bounds;

       //输出Json信息
       var layerName=layer.name;
        var width=(bounds[2]-bounds[0]).toString().replace("px","");
        var height=(bounds[3]-bounds[1]).toString().replace("px","");
        var x=((bounds[0]+0.5*width)
                    -(bgBounds[0]+0.5*(bgBounds[2]-bgBounds[0]))).toString().replace("px","");
        var y=((bounds[1]+0.5*height)-(bgBounds[1]+0.5*(bgBounds[3]-bgBounds[1]))).toString().replace("px","");
       
        if(layer.parent.parent.parent.toString().indexOf(".psd")==-1)
        {
			jsonData+="{\"name\":"+"\""+layerName+"\","+"\"x\":"+x+","+"\"y\":"+y+","+"\"width\":"+width+","+"\"height\":"+height+","+"\"father\":"+"\""+layer.parent.name+":"+layer.parent.parent.name+":"+layer.parent.parent.parent.name+"\"},";
        }
       else if(layer.parent.parent.toString().indexOf(".psd")==-1)
       {
            jsonData+="{\"name\":"+"\""+layerName+"\","+"\"x\":"+x+","+"\"y\":"+y+","+"\"width\":"+width+","+"\"height\":"+height+","+"\"father\":"+"\""+layer.parent.name+":"+layer.parent.parent.name+"\"},";
        }
       else{
            jsonData+="{\"name\":"+"\""+layerName+"\","+"\"x\":"+x+","+"\"y\":"+y+","+"\"width\":"+width+","+"\"height\":"+height+","+"\"father\":"+"\""+layer.parent.name+"\"},";
        }
       
      
       
       doc.crop(bounds,0);
           
       var fileOut = new File(outputFolder + "/" +layer.name + ".png");

      doc.exportDocument(fileOut, ExportType.SAVEFORWEB, exportOpts);

       var lastHistoryNum = doc.historyStates.length - 2;

      doc.activeHistoryState = doc.historyStates[lastHistoryNum];  
      
      layer.visible=true;
      
}


