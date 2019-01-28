using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.UI;

[System.Serializable]
public class JsonRead
{
    public List<ImageJson> data;
}
[System.Serializable]
public class ImageJson
{
    public string name;
    public float x;
    public float y;
    public float width;
    public float height;
}


public class AutoUgui : EditorWindow {

    [MenuItem("RD.UILayout/PageLayOut")]
	private static void Go2UI()
    {
        //Transform canvas=GameObject.Find("Canvas").transform;
        //GameObject UI = new GameObject("UI");
        //UI.AddComponent<RawImage>();
        //UI.transform.SetParent(canvas, false);
        PopWindow pw=GetWindow(typeof(PopWindow), true, "UI自动布局") as PopWindow;
        pw.minSize = PopWindow.minResolution;
        pw.maxSize = PopWindow.minResolution;
        pw.Init();
        pw.Show();
    }
}

public class PopWindow : EditorWindow
{
    public static PopWindow window;
    public static Vector2 minResolution = new Vector2(500, 200);
    public static Rect middleCenterRect = new Rect(50, 10, 300, 200);
    public GUIStyle labelStyle;
    public GUILayoutOption option;
    public static Transform uiroot;
    private JsonRead uiData;

    public void Init()
    {
        labelStyle = new GUIStyle();
        labelStyle.normal.textColor = Color.white;
        labelStyle.alignment = TextAnchor.UpperLeft;
        labelStyle.fontSize = 14;
        labelStyle.border = new RectOffset(10, 10, 20, 20);
    }
    private void OnGUI()
    {
        GUILayout.BeginArea(middleCenterRect);
        GUILayout.BeginVertical();
        EditorGUILayout.LabelField("根据psd文件自动布局UI", labelStyle, GUILayout.Width(220));
        GUILayout.Space(20);
        uiroot = EditorGUILayout.ObjectField(new GUIContent("UIRoot", "选择UI根节点"), uiroot, typeof(Transform), true) as Transform;
        GUILayout.Space(20);
        EditorGUILayout.LabelField("点击下面的按钮进行自动布局", labelStyle, GUILayout.Width(220));
        GUILayout.Space(20);
        GUILayout.BeginHorizontal();
        if (GUILayout.Button("加载UI信息", GUILayout.Width(80)))
        {
            ReadJson();
        }
        GUILayout.Space(20);
        if (GUILayout.Button("自动布局", GUILayout.Width(80)))
        {
            SetLayout();
        }
        GUILayout.EndHorizontal();
        GUILayout.EndVertical();
        GUILayout.EndArea();
    }
    
    private void ReadJson()
    {
        string jsonTxt= System.IO.File.ReadAllText(Application.dataPath + "/UIAssets/psdInfo/daochu/JsonData.txt");
        uiData=JsonUtility.FromJson<JsonRead>(jsonTxt);
        Debug.Log(uiData.data[0].name);
    }

    private void SetLayout()
    {
        List<ImageJson> uiList = uiData.data;
        if(uiroot!= null)
        {
            for (int i = 0; i < uiList.Count; i++)
            {
                string name = uiList[i].name;
                GameObject UI = new GameObject(name);
                RawImage uiRawImg = UI.AddComponent<RawImage>();
                UI.transform.SetParent(uiroot, false);
                UI.GetComponent<RectTransform>().SetInsetAndSizeFromParentEdge(RectTransform.Edge.Top, 0, 0);
                UI.GetComponent<RectTransform>().SetInsetAndSizeFromParentEdge(RectTransform.Edge.Left, 0, 0);
                UI.GetComponent<RectTransform>().anchoredPosition3D = new Vector3(uiList[i].x,-uiList[i].y, 0);
                UI.GetComponent<RectTransform>().sizeDelta = new Vector2(uiList[i].width, uiList[i].height);
                Texture tex = AssetDatabase.LoadAssetAtPath<Texture>("Assets/UIAssets/psdInfo/daochu/" + name + ".png");
                uiRawImg.texture = tex;
            }
        }
        else
        {
            Debug.LogWarning("请指定UI根节点");
        }
        
    }
}
